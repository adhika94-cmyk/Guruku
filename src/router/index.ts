import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useGuruStore } from '../stores/guruStore';

// Views
import DashboardView from '../views/DashboardView.vue';
import MataPelajaranView from '../views/master/MataPelajaranView.vue';
import KelasView from '../views/master/KelasView.vue';
import SiswaView from '../views/master/SiswaView.vue';

import NilaiSiswaView from '../views/akademik/NilaiSiswaView.vue';
import AbsensiSiswaView from '../views/akademik/AbsensiSiswaView.vue';
import JurnalMengajarView from '../views/akademik/JurnalMengajarView.vue';

import LaporanNilaiView from '../views/laporan/LaporanNilaiView.vue';
import LaporanAbsensiView from '../views/laporan/LaporanAbsensiView.vue';
import LaporanJurnalView from '../views/laporan/LaporanJurnalView.vue';

import ProfilGuruView from '../views/pengaturan/ProfilGuruView.vue';
import SupabaseConfigView from '../views/pengaturan/SupabaseConfigView.vue';
import LoginView from '../views/auth/LoginView.vue';
import ResetPasswordView from '../views/auth/ResetPasswordView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard Guru' }
  },
  // Data Master
  {
    path: '/master/mata-pelajaran',
    name: 'MataPelajaran',
    component: MataPelajaranView,
    meta: { requiresAuth: true, title: 'Mata Pelajaran' }
  },
  {
    path: '/master/kelas',
    name: 'Kelas',
    component: KelasView,
    meta: { requiresAuth: true, title: 'Data Kelas' }
  },
  {
    path: '/master/siswa',
    name: 'Siswa',
    component: SiswaView,
    meta: { requiresAuth: true, title: 'Data Siswa' }
  },
  // Akademik
  {
    path: '/akademik/nilai',
    name: 'NilaiSiswa',
    component: NilaiSiswaView,
    meta: { requiresAuth: true, title: 'Nilai Siswa' }
  },
  {
    path: '/akademik/absensi',
    name: 'AbsensiSiswa',
    component: AbsensiSiswaView,
    meta: { requiresAuth: true, title: 'Absensi Siswa' }
  },
  {
    path: '/akademik/jurnal',
    name: 'JurnalMengajar',
    component: JurnalMengajarView,
    meta: { requiresAuth: true, title: 'Jurnal Mengajar' }
  },
  // Laporan
  {
    path: '/laporan/nilai',
    name: 'LaporanNilai',
    component: LaporanNilaiView,
    meta: { requiresAuth: true, title: 'Laporan Nilai' }
  },
  {
    path: '/laporan/absensi',
    name: 'LaporanAbsensi',
    component: LaporanAbsensiView,
    meta: { requiresAuth: true, title: 'Laporan Absensi' }
  },
  {
    path: '/laporan/jurnal',
    name: 'LaporanJurnal',
    component: LaporanJurnalView,
    meta: { requiresAuth: true, title: 'Laporan Jurnal Mengajar' }
  },
  // Pengaturan
  {
    path: '/pengaturan/profil',
    name: 'ProfilGuru',
    component: ProfilGuruView,
    meta: { requiresAuth: true, title: 'Profil Guru' }
  },
  {
    path: '/pengaturan/supabase',
    name: 'SupabaseConfig',
    component: SupabaseConfigView,
    meta: { requiresAuth: true, title: 'Supabase & SQL' }
  },
  // Auth
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true, title: 'Login Guru' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
    meta: { guestOnly: true, title: 'Reset Password' }
  },
  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, _from, next) => {
  const store = useGuruStore();
  
  if (to.meta.title) {
    document.title = `${to.meta.title} - GuruKu`;
  }

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next('/login');
  } else if (to.meta.guestOnly && store.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
