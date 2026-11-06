<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y d-flex align-items-center justify-content-center min-vh-100">
      <div class="authentication-inner" style="max-width: 440px; width: 100%;">
        <!-- Login Card -->
        <div class="card shadow-lg border-0">
          <div class="card-body p-4 p-sm-5">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-4">
              <a href="javascript:void(0);" class="app-brand-link gap-2 text-decoration-none">
                <span class="app-brand-logo">
                  <i class="bx bxs-graduation fs-3 text-white"></i>
                </span>
                <span class="app-brand-text demo text-body fw-bolder fs-3">
                  <span class="text-primary">Guru</span><span class="text-dark">Ku</span>
                </span>
              </a>
            </div>

            <h4 class="mb-2 fw-bold text-center">Selamat Datang di GuruKu! 👋</h4>
            <p class="mb-4 text-muted small text-center">
              Portal Modern Administrasi & Akademik Guru Berbasis Sneat & Supabase
            </p>

            <form @submit.prevent="handleLogin" class="mb-3">
              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">Email Guru</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bx bx-envelope"></i></span>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    placeholder="nama.guru@sekolah.sch.id"
                    required
                  />
                </div>
              </div>

              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label fw-semibold" for="password">Kata Sandi</label>
                  <router-link to="/reset-password" class="text-primary small text-decoration-none">
                    Lupa Password?
                  </router-link>
                </div>
                <div class="input-group">
                  <span class="input-group-text"><i class="bx bx-lock-alt"></i></span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control"
                    v-model="password"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i class="bx" :class="showPassword ? 'bx-show' : 'bx-hide'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-me" v-model="rememberMe" />
                  <label class="form-check-label small" for="remember-me"> Ingat Sesi Login Saya </label>
                </div>
              </div>

              <div class="mb-3">
                <button class="btn btn-primary d-grid w-100 py-2 fw-semibold" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  <span v-else><i class="bx bx-log-in-circle me-1"></i> Masuk ke Portal Guru</span>
                </button>
              </div>
            </form>

            <div class="text-center mt-3">
              <div class="divider my-3 d-flex align-items-center">
                <div class="border-top flex-grow-1"></div>
                <span class="px-2 text-muted small">ATAU AKUN UJI COBA</span>
                <div class="border-top flex-grow-1"></div>
              </div>

              <button
                type="button"
                class="btn btn-outline-secondary btn-sm w-100 py-2"
                @click="fillDemoAccount"
              >
                <i class="bx bx-user-check me-1 text-primary"></i> Gunakan Akun Guru Demo
              </button>
            </div>
          </div>
        </div>

        <p class="text-center text-muted small mt-4">
          © {{ new Date().getFullYear() }} GuruKu • Sistem Khusus Peran Guru
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const router = useRouter();
const store = useGuruStore();

const email = ref(store.profile.email || 'guru@guruku.sch.id');
const password = ref('password123');
const rememberMe = ref(true);
const showPassword = ref(false);
const loading = ref(false);

const fillDemoAccount = () => {
  email.value = store.profile.email || 'guru@guruku.sch.id';
  password.value = 'guruku2026';
  showAlert.toast('Akun guru demo terisi otomatis. Klik tombol Masuk!', 'info');
};

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await store.login(email.value.trim(), password.value, rememberMe.value);
    if (res.success) {
      showAlert.toast(res.message, 'success');
      router.push('/');
    } else {
      showAlert.error('Gagal Masuk', 'Periksa kembali alamat email dan password Anda.');
    }
  } catch (err: any) {
    showAlert.error('Kesalahan', err.message || 'Terjadi kesalahan saat masuk.');
  } finally {
    loading.value = false;
  }
};
</script>
