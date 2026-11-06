<template>
  <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center">
    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <a class="nav-item nav-link px-0 me-xl-4 cursor-pointer" @click="store.toggleSidebarMobile">
        <i class="bx bx-menu bx-sm"></i>
      </a>
    </div>

    <!-- Search Input -->
    <div class="navbar-nav-right d-flex align-items-center justify-content-between w-100" id="navbar-collapse">
      <div class="navbar-nav align-items-center">
        <div class="nav-item d-flex align-items-center">
          <i class="bx bx-search fs-4 lh-0 text-muted me-2"></i>
          <input
            type="text"
            v-model="store.searchQuery"
            class="form-control border-0 shadow-none ps-1 ps-sm-2"
            placeholder="Pencarian cepat siswa, kelas, mapel..."
            style="background: transparent; width: 220px; max-width: 100%;"
          />
        </div>
      </div>

      <!-- Right Actions -->
      <ul class="navbar-nav flex-row align-items-center ms-auto gap-2">
        <!-- Supabase Status Badge -->
        <li class="nav-item">
          <router-link
            to="/pengaturan/supabase"
            class="badge text-decoration-none px-2 py-1 d-flex align-items-center gap-1"
            :class="hasSupabase ? 'bg-label-success' : 'bg-label-primary'"
            title="Klik untuk konfigurasi Supabase"
          >
            <i class="bx" :class="hasSupabase ? 'bx-check-shield' : 'bx-server'"></i>
            <span class="d-none d-md-inline">{{ hasSupabase ? 'Supabase Aktif' : 'Mode Offline/Lokal' }}</span>
          </router-link>
        </li>

        <!-- Theme Toggle (Dark / Light) -->
        <li class="nav-item">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-outline-secondary rounded-circle"
            @click="store.toggleDarkMode"
            :title="store.darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
          >
            <i class="bx" :class="store.darkMode ? 'bx-sun text-warning' : 'bx-moon text-primary'"></i>
          </button>
        </li>

        <!-- User Dropdown -->
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle hide-arrow d-flex align-items-center p-0 cursor-pointer"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click="dropdownOpen = !dropdownOpen"
          >
            <div class="avatar avatar-online position-relative">
              <img
                :src="store.profile.avatar_url"
                alt="Avatar"
                class="w-px-40 h-auto rounded-circle border"
                width="38"
                height="38"
                style="object-fit: cover;"
              />
              <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
            </div>
            <div class="d-none d-sm-flex flex-column ms-2 text-start">
              <span class="fw-semibold text-truncate" style="max-width: 130px;">{{ store.profile.full_name }}</span>
              <small class="text-muted" style="font-size: 0.75rem;">NIP: {{ store.profile.nip }}</small>
            </div>
          </a>

          <!-- Dropdown Menu -->
          <ul
            class="dropdown-menu dropdown-menu-end shadow"
            :class="{ show: dropdownOpen }"
            style="position: absolute; right: 0; min-width: 220px;"
          >
            <li class="p-2 border-bottom">
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="store.profile.avatar_url"
                  class="rounded-circle"
                  width="40"
                  height="40"
                  style="object-fit: cover;"
                />
                <div class="overflow-hidden">
                  <div class="fw-bold text-truncate">{{ store.profile.full_name }}</div>
                  <small class="text-muted d-block text-truncate">{{ store.profile.email }}</small>
                </div>
              </div>
            </li>
            <li>
              <router-link
                to="/pengaturan/profil"
                class="dropdown-item py-2 d-flex align-items-center gap-2"
                @click="dropdownOpen = false"
              >
                <i class="bx bx-user me-1 text-primary"></i>
                <span>Profil Saya</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/pengaturan/supabase"
                class="dropdown-item py-2 d-flex align-items-center gap-2"
                @click="dropdownOpen = false"
              >
                <i class="bx bx-data me-1 text-info"></i>
                <span>Supabase & SQL</span>
              </router-link>
            </li>
            <li>
              <hr class="dropdown-divider my-1" />
            </li>
            <li>
              <a
                class="dropdown-item py-2 d-flex align-items-center gap-2 text-danger cursor-pointer"
                @click="onLogout"
              >
                <i class="bx bx-power-off me-1"></i>
                <span>Keluar</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGuruStore } from '../../stores/guruStore';
import { getSupabaseConfig } from '../../services/supabase';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const router = useRouter();
const dropdownOpen = ref(false);

const hasSupabase = computed(() => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && !cfg.url.includes('your-project.supabase.co'));
});

const onLogout = async () => {
  dropdownOpen.value = false;
  const confirmed = await showAlert.confirm('Keluar dari GuruKu?', 'Sesi login Anda akan berakhir.');
  if (confirmed) {
    store.logout();
    router.push('/login');
    showAlert.toast('Anda telah berhasil keluar', 'info');
  }
};

const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('#userDropdown') && !target.closest('.dropdown-menu')) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
