<template>
  <div>
    <!-- Welcome Hero Banner (Sneat Style) -->
    <div class="row">
      <div class="col-lg-8 mb-4 order-0">
        <div class="card h-100 position-relative overflow-hidden" style="background: linear-gradient(135deg, rgba(105, 108, 255, 0.08) 0%, rgba(105, 108, 255, 0.02) 100%);">
          <div class="d-flex align-items-end row">
            <div class="col-sm-7">
              <div class="card-body">
                <span class="badge bg-label-primary mb-2">Portal Akademik Guru</span>
                <h4 class="card-title text-primary mb-2">Selamat Datang, {{ store.profile.full_name }}! 🎉</h4>
                <p class="mb-4 text-muted">
                  Kelola mata pelajaran, absensi kelas, penilaian kompetensi, dan jurnal mengajar harian dengan rapi dan terstruktur.
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <router-link to="/akademik/absensi" class="btn btn-sm btn-primary">
                    <i class="bx bx-calendar-check me-1"></i> Absensi Hari Ini
                  </router-link>
                  <router-link to="/akademik/jurnal" class="btn btn-sm btn-outline-primary">
                    <i class="bx bx-edit-alt me-1"></i> Tulis Jurnal
                  </router-link>
                  <router-link to="/akademik/nilai" class="btn btn-sm btn-outline-primary">
                    <i class="bx bx-award me-1"></i> Input Nilai
                  </router-link>
                </div>
              </div>
            </div>
            <div class="col-sm-5 text-center text-sm-left">
              <div class="card-body pb-0 px-0 px-md-4">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80"
                  height="145"
                  class="rounded-top shadow-sm d-none d-sm-inline-block"
                  style="object-fit: cover; width: 100%; max-width: 220px;"
                  alt="Teacher Illustration"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick School Info Card -->
      <div class="col-lg-4 col-md-4 order-1 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">Informasi Sekolah</h5>
              <span class="badge bg-label-success">Tahun 2024/2025</span>
            </div>
            <div class="d-flex align-items-center gap-3 mb-3 p-2 rounded bg-light">
              <div class="avatar-icon-box bg-label-primary">
                <i class="bx bxs-school"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">{{ store.profile.school_name }}</h6>
                <small class="text-muted">NIP/NUPTK: {{ store.profile.nip }}</small>
              </div>
            </div>
            <ul class="list-unstyled mb-0">
              <li class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted"><i class="bx bx-envelope me-1"></i> Email:</span>
                <span class="fw-semibold">{{ store.profile.email }}</span>
              </li>
              <li class="d-flex justify-content-between py-1">
                <span class="text-muted"><i class="bx bx-phone me-1"></i> No. HP:</span>
                <span class="fw-semibold">{{ store.profile.phone }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Sneat Metric KPI Cards -->
    <div class="row">
      <!-- Mata Pelajaran -->
      <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card card-hover h-100">
          <div class="card-body">
            <div class="card-title d-flex align-items-start justify-content-between mb-2">
              <div class="avatar-icon-box bg-label-primary">
                <i class="bx bx-book-bookmark"></i>
              </div>
              <router-link to="/master/mata-pelajaran" class="btn btn-sm btn-icon btn-light" title="Buka Detail">
                <i class="bx bx-chevron-right"></i>
              </router-link>
            </div>
            <span class="fw-semibold d-block mb-1 text-muted">Mata Pelajaran</span>
            <h3 class="card-title mb-1 text-primary">{{ store.totalSubjects }}</h3>
            <small class="text-success fw-semibold"><i class="bx bx-check-circle"></i> Diajar Aktif</small>
          </div>
        </div>
      </div>

      <!-- Kelas -->
      <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card card-hover h-100">
          <div class="card-body">
            <div class="card-title d-flex align-items-start justify-content-between mb-2">
              <div class="avatar-icon-box bg-label-info">
                <i class="bx bx-buildings"></i>
              </div>
              <router-link to="/master/kelas" class="btn btn-sm btn-icon btn-light" title="Buka Detail">
                <i class="bx bx-chevron-right"></i>
              </router-link>
            </div>
            <span class="fw-semibold d-block mb-1 text-muted">Kelas Binaan</span>
            <h3 class="card-title mb-1 text-info">{{ store.totalClasses }}</h3>
            <small class="text-muted fw-semibold"><i class="bx bx-layer"></i> Kelas 7 & 8</small>
          </div>
        </div>
      </div>

      <!-- Siswa -->
      <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card card-hover h-100">
          <div class="card-body">
            <div class="card-title d-flex align-items-start justify-content-between mb-2">
              <div class="avatar-icon-box bg-label-success">
                <i class="bx bx-user-pin"></i>
              </div>
              <router-link to="/master/siswa" class="btn btn-sm btn-icon btn-light" title="Buka Detail">
                <i class="bx bx-chevron-right"></i>
              </router-link>
            </div>
            <span class="fw-semibold d-block mb-1 text-muted">Total Siswa</span>
            <h3 class="card-title mb-1 text-success">{{ store.totalStudents }}</h3>
            <small class="text-success fw-semibold"><i class="bx bx-group"></i> Terdaftar</small>
          </div>
        </div>
      </div>

      <!-- Jurnal Mengajar -->
      <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card card-hover h-100">
          <div class="card-body">
            <div class="card-title d-flex align-items-start justify-content-between mb-2">
              <div class="avatar-icon-box bg-label-warning">
                <i class="bx bx-receipt"></i>
              </div>
              <router-link to="/akademik/jurnal" class="btn btn-sm btn-icon btn-light" title="Buka Detail">
                <i class="bx bx-chevron-right"></i>
              </router-link>
            </div>
            <span class="fw-semibold d-block mb-1 text-muted">Jurnal Mengajar</span>
            <h3 class="card-title mb-1 text-warning">{{ store.totalJournals }}</h3>
            <small class="text-warning fw-semibold"><i class="bx bx-edit"></i> Terisi</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row: Grafik Kehadiran & Grafik Nilai Siswa -->
    <div class="row">
      <!-- Grafik Kehadiran Siswa -->
      <div class="col-12 col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bx bx-pie-chart-alt-2 text-primary me-2"></i>Grafik Kehadiran Siswa
            </h5>
            <span class="badge bg-label-primary">Rekap Akumulasi</span>
          </div>
          <div class="card-body">
            <div style="height: 250px;" class="position-relative d-flex align-items-center justify-content-center">
              <canvas ref="attendanceChartRef"></canvas>
            </div>
            <div class="d-flex justify-content-around text-center pt-3 mt-2 border-top">
              <div>
                <span class="badge bg-label-success px-2 py-1">Hadir (H)</span>
                <h5 class="mt-1 mb-0">{{ attendanceStats.hadir }}</h5>
              </div>
              <div>
                <span class="badge bg-label-info px-2 py-1">Izin (I)</span>
                <h5 class="mt-1 mb-0">{{ attendanceStats.izin }}</h5>
              </div>
              <div>
                <span class="badge bg-label-warning px-2 py-1">Sakit (S)</span>
                <h5 class="mt-1 mb-0">{{ attendanceStats.sakit }}</h5>
              </div>
              <div>
                <span class="badge bg-label-danger px-2 py-1">Alfa (A)</span>
                <h5 class="mt-1 mb-0">{{ attendanceStats.alfa }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grafik Rata-Rata Nilai Siswa -->
      <div class="col-12 col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bx bx-bar-chart-alt-2 text-success me-2"></i>Grafik Nilai Siswa
            </h5>
            <span class="badge bg-label-success">Rata-rata Kelas</span>
          </div>
          <div class="card-body">
            <div style="height: 250px;" class="position-relative">
              <canvas ref="gradesChartRef"></canvas>
            </div>
            <div class="d-flex justify-content-between align-items-center pt-3 mt-2 border-top">
              <small class="text-muted">Standar KKM: <span class="fw-bold text-dark">75.0</span></small>
              <router-link to="/akademik/nilai" class="btn btn-sm btn-outline-primary">
                Kelola Nilai Lengkap &raquo;
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aktivitas Terbaru & Jurnal Terakhir -->
    <div class="row">
      <!-- Aktivitas Jurnal Mengajar Terbaru -->
      <div class="col-12 col-lg-7 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bx bx-time text-warning me-2"></i>Jurnal Mengajar Terbaru
            </h5>
            <router-link to="/akademik/jurnal" class="btn btn-sm btn-outline-primary">
              Lihat Semua
            </router-link>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Tanggal & Jam</th>
                    <th>Mata Pelajaran / Kelas</th>
                    <th>Materi Pembelajaran</th>
                    <th>Hadir</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="j in recentJournals" :key="j.id">
                    <td>
                      <span class="fw-semibold d-block">{{ formatDate(j.date) }}</span>
                      <small class="text-muted">{{ j.period }}</small>
                    </td>
                    <td>
                      <span class="badge bg-label-primary mb-1">{{ getSubjectName(j.subject_id) }}</span>
                      <br />
                      <span class="badge bg-label-info">{{ getClassName(j.class_id) }}</span>
                    </td>
                    <td>
                      <div class="fw-semibold text-truncate" style="max-width: 250px;">{{ j.topic }}</div>
                      <small class="text-muted text-truncate d-block" style="max-width: 250px;">{{ j.method }}</small>
                    </td>
                    <td>
                      <span class="badge bg-label-success">{{ j.present_count }} Siswa</span>
                    </td>
                  </tr>
                  <tr v-if="recentJournals.length === 0">
                    <td colspan="4" class="text-center py-4 text-muted">Belum ada jurnal mengajar tercatat.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Roster & Shortcuts -->
      <div class="col-12 col-lg-5 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bx bx-check-shield text-info me-2"></i>Mata Pelajaran & Jadwal
            </h5>
            <router-link to="/master/mata-pelajaran" class="btn btn-sm btn-icon btn-light">
              <i class="bx bx-plus"></i>
            </router-link>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div
                v-for="sub in store.subjects"
                :key="sub.id"
                class="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
              >
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="badge rounded-pill"
                    :style="{ backgroundColor: sub.color || '#696cff' }"
                  >
                    {{ sub.code }}
                  </span>
                  <div>
                    <h6 class="mb-0 fw-semibold">{{ sub.name }}</h6>
                    <small class="text-muted">Diajar di seluruh kelas paralel</small>
                  </div>
                </div>
                <router-link
                  :to="`/akademik/nilai?subject=${sub.id}`"
                  class="btn btn-sm btn-outline-secondary"
                  title="Nilai Mapel"
                >
                  <i class="bx bx-award"></i>
                </router-link>
              </div>
            </div>

            <!-- Supabase Sync Card Banner -->
            <div class="mt-4 p-3 rounded border bg-light d-flex align-items-center justify-content-between">
              <div>
                <small class="text-muted d-block">Penyimpanan Database</small>
                <span class="fw-bold text-dark">Supabase Postgres</span>
              </div>
              <router-link to="/pengaturan/supabase" class="btn btn-sm btn-primary">
                Lihat Skrip SQL
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGuruStore } from '../stores/guruStore';
import Chart from 'chart.js/auto';

const store = useGuruStore();

const attendanceChartRef = ref<HTMLCanvasElement | null>(null);
const gradesChartRef = ref<HTMLCanvasElement | null>(null);

let attendanceChartInstance: Chart | null = null;
let gradesChartInstance: Chart | null = null;

const recentJournals = computed(() => {
  return [...store.teachingJournals].slice(0, 4);
});

const getSubjectName = (id: string) => {
  return store.subjects.find((s) => s.id === id)?.name || 'Mata Pelajaran';
};

const getClassName = (id: string) => {
  return store.classes.find((c) => c.id === id)?.name || 'Kelas';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

const attendanceStats = computed(() => {
  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alfa = 0;

  store.attendance.forEach((a) => {
    if (a.status === 'H') hadir++;
    else if (a.status === 'I') izin++;
    else if (a.status === 'S') sakit++;
    else if (a.status === 'A') alfa++;
  });

  return { hadir, izin, sakit, alfa };
});

const initCharts = () => {
  // 1. Attendance Doughnut Chart
  if (attendanceChartRef.value) {
    if (attendanceChartInstance) {
      attendanceChartInstance.destroy();
    }
    const ctx = attendanceChartRef.value.getContext('2d');
    if (ctx) {
      attendanceChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Hadir', 'Izin', 'Sakit', 'Alfa'],
          datasets: [
            {
              data: [
                attendanceStats.value.hadir || 1,
                attendanceStats.value.izin,
                attendanceStats.value.sakit,
                attendanceStats.value.alfa
              ],
              backgroundColor: ['#71dd37', '#03c3ec', '#ffab00', '#ff3e1d'],
              borderWidth: 2,
              borderColor: store.darkMode ? '#2b2c40' : '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: store.darkMode ? '#cbcbe2' : '#566a7f',
                boxWidth: 12
              }
            }
          },
          cutout: '68%'
        }
      });
    }
  }

  // 2. Grades Average Bar Chart
  if (gradesChartRef.value) {
    if (gradesChartInstance) {
      gradesChartInstance.destroy();
    }
    const ctx = gradesChartRef.value.getContext('2d');
    if (ctx) {
      const labels = store.classes.map((c) => c.name);
      const dataAverages = store.classes.map((c) => {
        const classGrades = store.grades.filter((g) => g.class_id === c.id);
        if (classGrades.length === 0) return 80;
        const sum = classGrades.reduce((acc, curr) => acc + (curr.final_grade || 0), 0);
        return Math.round((sum / classGrades.length) * 10) / 10;
      });

      gradesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Nilai Rata-Rata Siswa',
              data: dataAverages,
              backgroundColor: '#696cff',
              borderRadius: 6,
              barThickness: 24
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 50,
              max: 100,
              grid: {
                color: store.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
              },
              ticks: {
                color: store.darkMode ? '#cbcbe2' : '#566a7f'
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: store.darkMode ? '#cbcbe2' : '#566a7f'
              }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }
};

onMounted(() => {
  initCharts();
});

watch(
  () => [store.attendance, store.grades, store.darkMode],
  () => {
    initCharts();
  },
  { deep: true }
);
</script>

<style scoped>
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--sneat-shadow-lg);
}
</style>
