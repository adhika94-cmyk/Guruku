<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y d-flex align-items-center justify-content-center min-vh-100">
      <div class="authentication-inner" style="max-width: 440px; width: 100%;">
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

            <h4 class="mb-2 fw-bold text-center">Lupa Kata Sandi? 🔒</h4>
            <p class="mb-4 text-muted small text-center">
              Masukkan alamat email terdaftar Anda dan kami akan mengirimkan tautan reset kata sandi melalui Supabase Auth.
            </p>

            <form @submit.prevent="handleReset" class="mb-3">
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

              <button class="btn btn-primary d-grid w-100 py-2 fw-semibold" type="submit" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                <span v-else><i class="bx bx-send me-1"></i> Kirim Tautan Reset</span>
              </button>
            </form>

            <div class="text-center mt-4">
              <router-link to="/login" class="d-flex align-items-center justify-content-center text-primary text-decoration-none small">
                <i class="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                Kembali ke Halaman Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const email = ref(store.profile.email || '');
const loading = ref(false);

const handleReset = async () => {
  if (!email.value.trim()) return;
  loading.value = true;
  try {
    const res = await store.resetPassword(email.value.trim());
    showAlert.success('Tautan Terkirim', res.message);
  } finally {
    loading.value = false;
  }
};
</script>
