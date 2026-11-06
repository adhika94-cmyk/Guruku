<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      class="layout-overlay"
      :class="{ show: store.sidebarMobileOpen }"
      @click="store.closeSidebarMobile"
    ></div>

    <!-- Sneat Sidebar -->
    <aside
      class="layout-menu"
      :class="{ show: store.sidebarMobileOpen }"
    >
      <!-- Brand Logo -->
      <div class="app-brand demo">
        <router-link to="/" class="app-brand-link" @click="store.closeSidebarMobile">
          <span class="app-brand-logo">
            <i class="bx bxs-graduation"></i>
          </span>
          <span class="app-brand-text ms-1">
            <span class="text-primary fw-bold">Guru</span><span class="text-dark fw-bolder">Ku</span>
          </span>
        </router-link>
        <button
          type="button"
          class="btn btn-sm btn-icon btn-outline-secondary d-xl-none"
          @click="store.closeSidebarMobile"
          aria-label="Tutup Menu"
        >
          <i class="bx bx-x"></i>
        </button>
      </div>

      <div class="menu-inner-shadow"></div>

      <!-- Menu Items -->
      <ul class="menu-inner py-1">
        <!-- Dashboard -->
        <li class="menu-item" :class="{ active: currentPath === '/' }">
          <router-link to="/" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-home-circle"></i>
            <div>Dashboard</div>
          </router-link>
        </li>

        <!-- DATA MASTER -->
        <li class="menu-header">Data Master</li>
        
        <li class="menu-item" :class="{ active: currentPath === '/master/mata-pelajaran' }">
          <router-link to="/master/mata-pelajaran" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-book-bookmark"></i>
            <div>Mata Pelajaran</div>
            <div class="badge bg-label-primary rounded-pill ms-auto">{{ store.totalSubjects }}</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/master/kelas' }">
          <router-link to="/master/kelas" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-buildings"></i>
            <div>Kelas</div>
            <div class="badge bg-label-info rounded-pill ms-auto">{{ store.totalClasses }}</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/master/siswa' }">
          <router-link to="/master/siswa" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-user-pin"></i>
            <div>Siswa</div>
            <div class="badge bg-label-success rounded-pill ms-auto">{{ store.totalStudents }}</div>
          </router-link>
        </li>

        <!-- AKADEMIK -->
        <li class="menu-header">Akademik</li>

        <li class="menu-item" :class="{ active: currentPath === '/akademik/nilai' }">
          <router-link to="/akademik/nilai" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-award"></i>
            <div>Nilai Siswa</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/akademik/absensi' }">
          <router-link to="/akademik/absensi" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-calendar-check"></i>
            <div>Absensi Siswa</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/akademik/jurnal' }">
          <router-link to="/akademik/jurnal" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-edit-alt"></i>
            <div>Jurnal Mengajar</div>
            <div class="badge bg-label-warning rounded-pill ms-auto">{{ store.totalJournals }}</div>
          </router-link>
        </li>

        <!-- LAPORAN -->
        <li class="menu-header">Laporan</li>

        <li class="menu-item" :class="{ active: currentPath === '/laporan/nilai' }">
          <router-link to="/laporan/nilai" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-file"></i>
            <div>Laporan Nilai</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/laporan/absensi' }">
          <router-link to="/laporan/absensi" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-spreadsheet"></i>
            <div>Laporan Absensi</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/laporan/jurnal' }">
          <router-link to="/laporan/jurnal" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-receipt"></i>
            <div>Laporan Jurnal</div>
          </router-link>
        </li>

        <!-- PENGATURAN -->
        <li class="menu-header">Pengaturan</li>

        <li class="menu-item" :class="{ active: currentPath === '/pengaturan/profil' }">
          <router-link to="/pengaturan/profil" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-user"></i>
            <div>Profil Guru</div>
          </router-link>
        </li>

        <li class="menu-item" :class="{ active: currentPath === '/pengaturan/supabase' }">
          <router-link to="/pengaturan/supabase" class="menu-link" @click="store.closeSidebarMobile">
            <i class="menu-icon bx bx-data"></i>
            <div>Supabase & SQL</div>
          </router-link>
        </li>

        <li class="menu-item">
          <a class="menu-link text-danger" href="javascript:void(0);" @click="handleLogout">
            <i class="menu-icon bx bx-power-off text-danger"></i>
            <div>Logout</div>
          </a>
        </li>
      </ul>

      <!-- Teacher Mini Card Footer in Sidebar -->
      <div class="p-3 border-top d-flex align-items-center gap-2">
        <img
          :src="store.profile.avatar_url"
          class="rounded-circle"
          width="36"
          height="36"
          alt="Avatar"
          style="object-fit: cover;"
        />
        <div class="overflow-hidden flex-grow-1" style="line-height: 1.2;">
          <small class="d-block fw-bold text-truncate text-heading">{{ store.profile.full_name }}</small>
          <small class="text-muted" style="font-size: 0.75rem;">Guru Aktif</small>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const route = useRoute();
const router = useRouter();

const currentPath = computed(() => route.path);

const handleLogout = async () => {
  store.closeSidebarMobile();
  const confirmed = await showAlert.confirm('Keluar dari GuruKu?', 'Sesi Anda saat ini akan diakhiri.');
  if (confirmed) {
    store.logout();
    router.push('/login');
    showAlert.toast('Anda telah berhasil logout', 'info');
  }
};
</script>
