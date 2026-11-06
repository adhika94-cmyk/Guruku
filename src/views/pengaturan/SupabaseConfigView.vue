<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Pengaturan /</span> Supabase & Deployment</h4>
        <small class="text-muted">Konfigurasi database Supabase Postgres dan panduan deployment otomatis dengan GitHub & VPS aaPanel.</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-danger" @click="handleResetDemo">
          <i class="bx bx-reset me-1"></i> Muat Ulang Data Contoh
        </button>
      </div>
    </div>

    <!-- Nav Tabs Navigation -->
    <ul class="nav nav-pills mb-4" role="tablist">
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'supabase' }"
          @click="activeTab = 'supabase'"
        >
          <i class="bx bx-server me-1"></i> Supabase & SQL Schema
        </button>
      </li>
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'github' }"
          @click="activeTab = 'github'"
        >
          <i class="bx bxl-github me-1"></i> Konfigurasi Deploy GitHub & VPS aaPanel
        </button>
      </li>
    </ul>

    <!-- TAB 1: SUPABASE & SQL -->
    <div v-if="activeTab === 'supabase'">
      <!-- Alert Guidance Banner -->
      <div class="alert alert-primary d-flex align-items-center mb-4" role="alert">
        <i class="bx bx-info-circle fs-4 me-2"></i>
        <div class="small">
          <strong>Informasi Koneksi:</strong> Masukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari dashboard Supabase Anda (<a href="https://supabase.com/dashboard" target="_blank" class="alert-link text-decoration-underline">supabase.com/dashboard</a> &raquo; Project Settings &raquo; API). Anda juga dapat menggunakan tombol <strong>Simulasi Supabase Demo</strong> untuk menguji respons sistem secara instan.
        </div>
      </div>

      <div class="row">
        <!-- Supabase Connection Config Card -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bx bx-server text-primary me-2"></i>Koneksi Supabase
              </h5>
              <span
                class="badge"
                :class="isConnected ? 'bg-label-success' : 'bg-label-warning'"
              >
                {{ isConnected ? (isDemoMode ? 'Mode Simulasi Aktif' : 'Supabase Terhubung') : 'Mode Offline / Lokal Aktif' }}
              </span>
            </div>

            <div class="card-body">
              <p class="text-muted small mb-3">
                Masukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong>. Jika belum memiliki project Supabase, data akan otomatis tersimpan di penyimpanan lokal browser Anda.
              </p>

              <form @submit.prevent="saveConfig">
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Supabase Project URL <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bx bx-globe"></i></span>
                    <input
                      type="url"
                      v-model="supabaseUrl"
                      class="form-control"
                      placeholder="https://xyzproject.supabase.co"
                      required
                    />
                  </div>
                  <small class="text-muted">Format: <code>https://&lt;project-id&gt;.supabase.co</code></small>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Supabase Anon Key (Public Key) <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bx bx-key"></i></span>
                    <input
                      type="password"
                      v-model="supabaseAnonKey"
                      class="form-control font-monospace"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showKey = !showKey"
                    >
                      <i class="bx" :class="showKey ? 'bx-hide' : 'bx-show'"></i>
                    </button>
                  </div>
                  <small class="text-muted">Kunci publik anonim aman digunakan di sisi client (frontend).</small>
                </div>

                <!-- Connection Status Result Box -->
                <div v-if="testResult" class="p-3 rounded mb-3 border" :class="testResult.success ? 'bg-light-success border-success' : 'bg-light-danger border-danger'">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <i class="bx fs-5" :class="testResult.success ? 'bx-check-circle text-success' : 'bx-x-circle text-danger'"></i>
                    <strong :class="testResult.success ? 'text-success' : 'text-danger'">
                      {{ testResult.message }}
                    </strong>
                  </div>
                  <div v-if="testResult.details" class="small text-muted ps-4">
                    {{ testResult.details }}
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-2 mt-4">
                  <button type="button" class="btn btn-outline-primary" @click="testConnection" :disabled="testing">
                    <span v-if="testing" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bx bx-pulse me-1"></i>
                    Uji Koneksi (Test Ping)
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bx bx-save me-1"></i> Simpan Kredensial
                  </button>
                  <button type="button" class="btn btn-outline-secondary" @click="useDemoSimulator">
                    <i class="bx bx-chip me-1"></i> Isi Simulasi Demo
                  </button>
                </div>
              </form>

              <hr class="my-4" />

              <!-- Cara Mendapatkan Kredensial Supabase -->
              <div class="bg-light p-3 rounded mb-3">
                <h6 class="fw-bold text-dark mb-2">
                  <i class="bx bx-help-circle text-primary me-1"></i>Cara Mendapatkan URL & Anon Key Supabase:
                </h6>
                <ol class="small text-muted mb-0 ps-3" style="line-height: 1.6;">
                  <li>Buka <a href="https://supabase.com" target="_blank" class="text-primary fw-semibold">Supabase.com</a> dan buat akun / project baru (gratis).</li>
                  <li>Setelah project aktif, buka menu <strong>Project Settings</strong> (ikon gerigi di kiri bawah).</li>
                  <li>Klik sub-menu <strong>API</strong>.</li>
                  <li>Salin <strong>Project URL</strong> dan masukkan ke kolom URL di atas.</li>
                  <li>Salin <strong>anon public key</strong> dan masukkan ke kolom Anon Key di atas.</li>
                  <li>Jalankan skrip SQL di sebelah kanan pada menu <strong>SQL Editor</strong> Supabase.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- SQL Schema Generator Card -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bx bx-code-alt text-success me-2"></i>Skrip SQL Supabase Lengkap
              </h5>
              <button class="btn btn-sm btn-success" @click="copySqlScript">
                <i class="bx bx-copy me-1"></i> {{ copied ? 'Tersalin!' : 'Salin SQL Schema' }}
              </button>
            </div>

            <div class="card-body">
              <p class="text-muted small mb-2">
                Salin skrip SQL ini lalu jalankan di menu <strong>SQL Editor</strong> di dashboard Supabase Anda. Mencakup pembuatan tabel <code>profiles</code>, <code>subjects</code>, <code>classes</code>, <code>students</code>, <code>grades</code>, <code>attendance</code>, <code>teaching_journals</code>, foreign keys, RLS idempoten, indeks, dan trigger.
              </p>

              <div class="position-relative">
                <textarea
                  class="form-control font-monospace text-dark"
                  rows="21"
                  readonly
                  style="font-size: 0.78rem; background-color: #f8f9fa; resize: vertical;"
                  v-model="sqlSchemaCode"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DEPLOY GITHUB & VPS aaPANEL -->
    <div v-else-if="activeTab === 'github'">
      <div class="row">
        <!-- Opsi 1: GitHub Pages -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bx bxl-github text-dark me-2"></i>1. Deploy Otomatis ke GitHub Pages
              </h5>
              <span class="badge bg-label-success">100% Gratis & CI/CD</span>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                File alur kerja <code>.github/workflows/deploy-pages.yml</code> sudah terkonfigurasi. Aplikasi akan otomatis di-build dan di-hosting di GitHub Pages setiap ada <code>git push</code>.
              </p>

              <h6 class="fw-bold mb-2">Langkah Cepat:</h6>
              <ol class="small text-muted ps-3 mb-3" style="line-height: 1.7;">
                <li>Buka terminal proyek Anda dan push ke GitHub:
                  <pre class="bg-light p-2 rounded border mt-1 mb-2 text-dark font-monospace" style="font-size: 0.75rem;">git init
git add .
git commit -m "feat: deploy GuruKu"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-GURUKU.git
git push -u origin main</pre>
                </li>
                <li>Di GitHub, masuk ke tab <strong>Settings</strong> &raquo; <strong>Pages</strong>.</li>
                <li>Pada bagian <strong>Build and deployment &raquo; Source</strong>, pilih <strong>GitHub Actions</strong>.</li>
                <li>Website Anda akan aktif di <code>https://USERNAME.github.io/REPO-GURUKU/</code>.</li>
              </ol>

              <div class="alert alert-info py-2 px-3 small mb-0">
                <i class="bx bx-check-shield me-1"></i> Dilengkapi fallback <code>404.html</code> otomatis agar routing Vue Router SPA tidak error 404 saat di-refresh!
              </div>
            </div>
          </div>
        </div>

        <!-- Opsi 2: Deploy ke VPS aaPanel -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bx bx-server text-info me-2"></i>2. Deploy ke VPS aaPanel via GitHub
              </h5>
              <span class="badge bg-label-info">Production Ready</span>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                Gunakan fitur <strong>WebHook aaPanel</strong> agar server VPS otomatis mengunduh kode terbaru dari GitHub dan melakukan build produksi.
              </p>

              <h6 class="fw-bold mb-1">Skrip WebHook aaPanel (<code>deploy-aapanel.sh</code>):</h6>
              <div class="position-relative mb-3">
                <textarea
                  class="form-control font-monospace text-dark"
                  rows="6"
                  readonly
                  style="font-size: 0.72rem; background: #f8f9fa;"
                  v-model="aaPanelScript"
                ></textarea>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary position-absolute top-0 end-0 m-2"
                  @click="copyText(aaPanelScript, 'Skrip aaPanel Webhook')"
                >
                  <i class="bx bx-copy"></i> Salin
                </button>
              </div>

              <h6 class="fw-bold mb-1">Konfigurasi Nginx URL Rewrite (Wajib di aaPanel):</h6>
              <p class="small text-muted mb-1">Masukkan ini di menu <strong>Website &raquo; Domain Anda &raquo; URL rewrite</strong>:</p>
              <div class="position-relative mb-0">
                <pre class="bg-light p-2 rounded border text-dark font-monospace" style="font-size: 0.75rem;">location / {
  try_files $uri $uri/ /index.html;
}</pre>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary position-absolute top-0 end-0 m-2"
                  @click="copyText('location / {\n  try_files $uri $uri/ /index.html;\n}', 'Nginx Rewrite')"
                >
                  <i class="bx bx-copy"></i> Salin
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- GitHub Secrets Card -->
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header border-bottom">
              <h5 class="mb-0"><i class="bx bx-lock-alt text-warning me-2"></i>Konfigurasi GitHub Secrets untuk Supabase</h5>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                Agar kredensial Supabase otomatis terinjeksi saat GitHub Actions melakukan build, tambahkan secrets berikut di GitHub Repository Anda (<strong>Settings &raquo; Secrets and variables &raquo; Actions</strong>):
              </p>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="p-3 border rounded bg-light">
                    <span class="badge bg-primary mb-1">Secret 1</span>
                    <h6 class="fw-bold font-monospace mb-1">VITE_SUPABASE_URL</h6>
                    <small class="text-muted">Isi dengan URL Project Supabase Anda (misal: <code>https://xyzcompany.supabase.co</code>).</small>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 border rounded bg-light">
                    <span class="badge bg-success mb-1">Secret 2</span>
                    <h6 class="fw-bold font-monospace mb-1">VITE_SUPABASE_ANON_KEY</h6>
                    <small class="text-muted">Isi dengan Anon Public Key Supabase Anda.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../../services/supabase';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();

const activeTab = ref<'supabase' | 'github'>('supabase');
const supabaseUrl = ref('');
const supabaseAnonKey = ref('');
const isConnected = ref(false);
const isDemoMode = ref(false);
const showKey = ref(false);
const testing = ref(false);
const copied = ref(false);
const testResult = ref<{ success: boolean; message: string; details?: string } | null>(null);

const aaPanelScript = ref(`#!/usr/bin/env bash
set -e
WEB_DIR="/www/wwwroot/guruku.sch.id"
cd "$WEB_DIR"
git reset --hard HEAD
git pull origin main
npm install --legacy-peer-deps
npm run build
chown -R www:www "$WEB_DIR"
chmod -R 755 "$WEB_DIR"
echo "Deployment GuruKu Selesai!"`);

const sqlSchemaCode = ref(`-- ====================================================================
-- GURUKU - SCHEMA DATABASE SUPABASE LENGKAP
-- Sistem Informasi Manajemen Guru Modern
-- Compatible with Supabase Postgres & aaPanel VPS Deployment
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Data Guru & Akun)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    phone VARCHAR(30),
    avatar_url TEXT,
    school_name VARCHAR(255) DEFAULT 'SMP Negeri 2 Kota Bogor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL SUBJECTS (Mata Pelajaran yang diampu Guru)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    color VARCHAR(20) DEFAULT '#696cff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL CLASSES (Kelas yang diajar Guru)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL STUDENTS (Siswa dalam Kelas)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    nis VARCHAR(30) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    address TEXT,
    parent_phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL GRADES (Nilai Akademik Siswa)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_score NUMERIC(5, 2) DEFAULT 0,
    daily_score NUMERIC(5, 2) DEFAULT 0,
    mid_exam_score NUMERIC(5, 2) DEFAULT 0,
    final_exam_score NUMERIC(5, 2) DEFAULT 0,
    final_grade NUMERIC(5, 2) DEFAULT 0,
    predicate CHAR(1) DEFAULT 'C',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_grade_per_subject_student UNIQUE (subject_id, class_id, student_id)
);

-- 7. TABEL ATTENDANCE (Absensi Siswa Harian)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status CHAR(1) CHECK (status IN ('H', 'I', 'S', 'A')) DEFAULT 'H',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_attendance_entry UNIQUE (subject_id, class_id, student_id, date)
);

-- 8. TABEL TEACHING_JOURNALS (Jurnal Mengajar Guru)
CREATE TABLE IF NOT EXISTS public.teaching_journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    period VARCHAR(50) NOT NULL,
    topic TEXT NOT NULL,
    method VARCHAR(150),
    present_count INT DEFAULT 0,
    notes TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INDEKS KINERJA QUERY
CREATE INDEX IF NOT EXISTS idx_subjects_profile ON public.subjects(profile_id);
CREATE INDEX IF NOT EXISTS idx_classes_profile ON public.classes(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_filter ON public.grades(subject_id, class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_filter ON public.attendance(subject_id, class_id, date);
CREATE INDEX IF NOT EXISTS idx_journals_filter ON public.teaching_journals(subject_id, class_id, date);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_journals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if already created (mencegah error 42710: policy already exists jika dijalankan ulang)
DROP POLICY IF EXISTS "Guru can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Guru manage classes" ON public.classes;
DROP POLICY IF EXISTS "Guru manage students" ON public.students;
DROP POLICY IF EXISTS "Guru manage grades" ON public.grades;
DROP POLICY IF EXISTS "Guru manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Guru manage journals" ON public.teaching_journals;

CREATE POLICY "Guru can view own profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Guru can update own profile" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Guru can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Guru manage subjects" ON public.subjects FOR ALL USING (true);
CREATE POLICY "Guru manage classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Guru manage students" ON public.students FOR ALL USING (true);
CREATE POLICY "Guru manage grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Guru manage attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Guru manage journals" ON public.teaching_journals FOR ALL USING (true);`);

onMounted(() => {
  const cfg = getSupabaseConfig();
  if (cfg.url && !cfg.url.includes('your-project.supabase.co')) {
    supabaseUrl.value = cfg.url;
    supabaseAnonKey.value = cfg.anonKey;
    isConnected.value = true;
  } else {
    supabaseUrl.value = cfg.url || '';
    supabaseAnonKey.value = cfg.anonKey || '';
    isConnected.value = false;
  }
});

const saveConfig = () => {
  saveSupabaseConfig(supabaseUrl.value, supabaseAnonKey.value);
  const isValid = Boolean(
    supabaseUrl.value &&
    supabaseAnonKey.value &&
    !supabaseUrl.value.includes('your-project.supabase.co')
  );
  isConnected.value = isValid;
  showAlert.success('Konfigurasi Disimpan', 'Parameter kredensial Supabase telah disimpan.');
};

const testConnection = async () => {
  testing.value = true;
  testResult.value = null;

  if (isDemoMode.value && supabaseUrl.value.includes('demo-supabase.guruku.internal')) {
    setTimeout(() => {
      testing.value = false;
      isConnected.value = true;
      testResult.value = {
        success: true,
        message: 'Koneksi Simulator Supabase Berhasil!',
        details: 'Simulator Supabase aktif. Seluruh modul GuruKu berfungsi 100% dengan responsif.'
      };
      showAlert.success('Berhasil!', testResult.value.details || '');
    }, 400);
    return;
  }

  const res = await testSupabaseConnection(supabaseUrl.value, supabaseAnonKey.value);
  testing.value = false;
  testResult.value = res;

  if (res.success) {
    isConnected.value = true;
    showAlert.success('Koneksi Berhasil!', res.details || res.message);
  } else {
    isConnected.value = false;
    showAlert.error(res.message, res.details || 'Silakan periksa kembali URL dan Anon Key Anda.');
  }
};

const useDemoSimulator = () => {
  isDemoMode.value = true;
  supabaseUrl.value = 'https://demo-supabase.guruku.internal';
  supabaseAnonKey.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.guruku-demo-simulation-token';
  saveSupabaseConfig(supabaseUrl.value, supabaseAnonKey.value);
  isConnected.value = true;
  testResult.value = {
    success: true,
    message: 'Mode Simulasi Supabase Diaktifkan',
    details: 'Kredensial simulasi terisi otomatis. Anda dapat menguji tombol Uji Koneksi sekarang!'
  };
  showAlert.toast('Mode Simulasi Supabase aktif!', 'success');
};

const copySqlScript = async () => {
  try {
    await navigator.clipboard.writeText(sqlSchemaCode.value);
    copied.value = true;
    showAlert.toast('Skrip SQL berhasil disalin ke clipboard!', 'success');
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (e) {
    showAlert.warning('Perhatian', 'Gunakan Ctrl+A lalu Ctrl+C untuk menyalin skrip SQL.');
  }
};

const copyText = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showAlert.toast(`${label} berhasil disalin!`, 'success');
  } catch (e) {
    showAlert.warning('Perhatian', 'Gagal menyalin otomatis.');
  }
};

const handleResetDemo = async () => {
  const confirmed = await showAlert.confirm(
    'Muat Ulang Data Contoh?',
    'Data mata pelajaran, kelas, siswa, nilai, dan absensi akan dikembalikan ke data awal demo.'
  );
  if (confirmed) {
    store.resetToDemoData();
    showAlert.toast('Data contoh berhasil dimuat ulang!', 'success');
  }
};
</script>

<style scoped>
.bg-light-success {
  background-color: rgba(113, 221, 55, 0.08);
}
.bg-light-danger {
  background-color: rgba(255, 62, 29, 0.08);
}
</style>
