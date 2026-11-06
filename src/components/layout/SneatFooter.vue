<template>
  <footer class="footer bg-footer-theme">
    <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
      <div class="mb-2 mb-md-0">
        © {{ currentYear }}
        <span class="fw-semibold text-primary">GuruKu</span> — Sistem Informasi Manajemen Guru Modern
      </div>
      <div class="d-flex gap-3">
        <span class="text-muted"><i class="bx bxs-school me-1"></i>{{ store.profile.school_name }}</span>
        <span class="text-muted d-none d-sm-inline">|</span>
        <a href="javascript:void(0);" @click="showInfo" class="footer-link text-muted d-none d-sm-inline">Tentang Aplikasi</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const currentYear = computed(() => new Date().getFullYear());

const showInfo = () => {
  showAlert.success(
    'GuruKu Portal v2.0',
    'Aplikasi manajemen akademik guru dengan Sneat Bootstrap 5 Dashboard, Vue.js 3, dan Supabase backend.'
  );
};
</script>
