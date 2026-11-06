import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'guruku_supabase_url';
const STORAGE_KEY_KEY = 'guruku_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const customUrl = localStorage.getItem(STORAGE_KEY_URL);
  const customKey = localStorage.getItem(STORAGE_KEY_KEY);
  
  if (customUrl && customKey) {
    return {
      url: customUrl,
      anonKey: customKey,
      isCustom: true
    };
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    isCustom: false
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (!url || !anonKey) {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  
  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    }
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  url: string,
  key: string
): Promise<{ success: boolean; message: string; details?: string; tablesCreated?: boolean }> {
  try {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (key || '').trim();

    if (!cleanUrl || !cleanKey) {
      return {
        success: false,
        message: 'URL atau Anon Key Supabase masih kosong.',
        details: 'Silakan isi Supabase Project URL dan Anon Key dari dashboard Supabase Anda (Project Settings > API).'
      };
    }

    if (cleanUrl.includes('your-project.supabase.co') || cleanKey.includes('your-anon-key')) {
      return {
        success: false,
        message: 'Kredensial masih berupa placeholder contoh.',
        details: 'Ganti "https://your-project.supabase.co" dengan URL asli project Supabase Anda (misal: https://xyzcompany.supabase.co).'
      };
    }

    if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://')) {
      return {
        success: false,
        message: 'Format URL tidak valid.',
        details: 'URL project harus diawali dengan https:// (contoh: https://abcdefghijk.supabase.co).'
      };
    }

    // 1. First test: Ping Supabase Auth health endpoint
    let isServerReachable = false;
    try {
      const healthRes = await fetch(`${cleanUrl}/auth/v1/health`, {
        method: 'GET',
        headers: {
          apikey: cleanKey
        }
      });
      if (healthRes.ok || healthRes.status === 200) {
        isServerReachable = true;
      }
    } catch (netErr) {
      // Continue to client test in case fetch was restricted by CORS
    }

    // 2. Second test: Test client PostgREST access
    const testClient = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false }
    });

    const { data: _data, error } = await testClient.from('profiles').select('id').limit(1);

    if (!error) {
      return {
        success: true,
        message: 'Koneksi ke Supabase berhasil terhubung!',
        details: 'Server Supabase aktif dan tabel database "profiles" siap digunakan.',
        tablesCreated: true
      };
    }

    // Table doesn't exist yet, BUT the connection to Supabase database succeeded!
    const errMsg = (error.message || '').toLowerCase();
    const isTableMissing =
      error.code === '42P01' ||
      errMsg.includes('does not exist') ||
      errMsg.includes('relation') ||
      error.code === 'PGRST204' ||
      error.code === 'PGRST200' ||
      error.code === 'PGRST116';

    if (isTableMissing) {
      return {
        success: true,
        message: 'Server Supabase Berhasil Terhubung!',
        details: 'Koneksi ke Supabase sukses. Tabel database belum dibuat. Silakan salin skrip SQL di sebelah kanan dan jalankan di SQL Editor Supabase untuk melengkapi tabel.',
        tablesCreated: false
      };
    }

    // Invalid API Key / Auth failed
    if (error.code === 'PGRST301' || errMsg.includes('jwt') || errMsg.includes('api key') || errMsg.includes('unauthorized')) {
      return {
        success: false,
        message: 'Anon Key Tidak Valid.',
        details: 'URL project terjangkau, namun Anon Key salah atau kedaluwarsa. Periksa kembali di Supabase Project Settings > API.'
      };
    }

    // General query error but server is reached
    if (isServerReachable) {
      return {
        success: true,
        message: 'Server Supabase Terhubung!',
        details: `Server aktif. Respon database: ${error.message}`,
        tablesCreated: false
      };
    }

    return {
      success: false,
      message: `Gagal terhubung ke Supabase (${error.code || 'Network Error'}).`,
      details: error.message || 'Pastikan URL Supabase aktif dan koneksi internet stabil.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Gagal menghubungi server Supabase.',
      details: err.message || 'Periksa kembali URL dan koneksi internet Anda.'
    };
  }
}
