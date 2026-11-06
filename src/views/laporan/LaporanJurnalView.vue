<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Laporan /</span> Laporan Jurnal Mengajar</h4>
        <small class="text-muted">Rekapitulasi agenda mengajar dan realisasi materi pembelajaran untuk bukti kinerja / SKP guru.</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success" @click="exportExcel">
          <i class="bx bx-file-blank me-1"></i> Unduh Excel
        </button>
        <button class="btn btn-primary" @click="exportPDF">
          <i class="bx bxs-file-pdf me-1"></i> Cetak / Export PDF
        </button>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="card mb-4 no-print">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label fw-semibold">Mata Pelajaran</label>
            <select v-model="filterSubject" class="form-select">
              <option value="">Semua Mata Pelajaran</option>
              <option v-for="s in store.subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Kelas</label>
            <select v-model="filterClass" class="form-select">
              <option value="">Semua Kelas</option>
              <option v-for="c in store.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Mulai Tanggal</label>
            <input type="date" v-model="startDate" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Sampai Tanggal</label>
            <input type="date" v-model="endDate" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Paper Report -->
    <div class="card shadow-sm border p-4">
      <!-- Kop Surat -->
      <div class="text-center pb-3 border-bottom mb-4">
        <h5 class="fw-bold text-uppercase mb-1">{{ store.profile.school_name }}</h5>
        <h6 class="fw-bold text-primary mb-1">AGENDA & JURNAL KEGIATAN BELAJAR MENGAJAR</h6>
        <p class="text-muted small mb-0">
          Guru Pengampu: <strong>{{ store.profile.full_name }}</strong> (NIP: {{ store.profile.nip }}) | Periode: <strong>{{ formatDate(startDate) }} s/d {{ formatDate(endDate) }}</strong>
        </p>
      </div>

      <!-- Quick KPI Counters -->
      <div class="row g-3 mb-4 text-center">
        <div class="col-md-4">
          <div class="p-2 border rounded bg-light">
            <span class="text-muted small">Total Pertemuan / Sesi</span>
            <h5 class="mb-0 text-primary fw-bold">{{ filteredJournals.length }} Sesi Pembelajaran</h5>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-2 border rounded bg-light">
            <span class="text-muted small">Total Jam Mengajar Terlaksana</span>
            <h5 class="mb-0 text-success fw-bold">{{ filteredJournals.length * 2 }} Jam Pelajaran (JP)</h5>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-2 border rounded bg-light">
            <span class="text-muted small">Rata-Rata Kehadiran Kelas</span>
            <h5 class="mb-0 text-info fw-bold">96.8%</h5>
          </div>
        </div>
      </div>

      <!-- Table Report -->
      <div class="table-responsive">
        <table class="table table-bordered table-sm align-middle">
          <thead class="table-light text-center">
            <tr>
              <th style="width: 40px;">No</th>
              <th style="width: 100px;">Hari / Tanggal</th>
              <th style="width: 80px;">Kelas</th>
              <th style="width: 130px;">Mata Pelajaran</th>
              <th style="width: 120px;">Jam Ke</th>
              <th class="text-start">Materi Pokok Pembelajaran</th>
              <th style="width: 140px;">Metode Belajar</th>
              <th style="width: 80px;">Hadir</th>
              <th>Catatan Perkembangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(j, i) in filteredJournals" :key="j.id">
              <td class="text-center">{{ i + 1 }}</td>
              <td class="text-center font-monospace">{{ formatDate(j.date) }}</td>
              <td class="text-center fw-semibold">{{ getClassName(j.class_id) }}</td>
              <td>{{ getSubjectName(j.subject_id) }}</td>
              <td class="text-center small">{{ j.period }}</td>
              <td class="fw-semibold">{{ j.topic }}</td>
              <td class="small">{{ j.method }}</td>
              <td class="text-center fw-bold text-success">{{ j.present_count }}</td>
              <td class="small text-muted">{{ j.notes || '-' }}</td>
            </tr>
            <tr v-if="filteredJournals.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">Belum ada catatan jurnal pada rentang filter ini.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Signatures -->
      <div class="row mt-5 pt-3">
        <div class="col-6">
          <p class="small mb-1">Mengetahui,</p>
          <p class="small fw-bold">Kepala Sekolah</p>
          <div style="height: 60px;"></div>
          <p class="fw-bold mb-0 text-decoration-underline">H. Dadang Suhendar, M.Pd.</p>
          <small class="text-muted">NIP. 196803151992031004</small>
        </div>
        <div class="col-6 text-end">
          <p class="small mb-1">Bogor, {{ todayIndo }}</p>
          <p class="small fw-bold">Guru Pengampu</p>
          <div style="height: 60px;"></div>
          <p class="fw-bold mb-0 text-decoration-underline">{{ store.profile.full_name }}</p>
          <small class="text-muted">NIP. {{ store.profile.nip }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exporter';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();

const filterSubject = ref('');
const filterClass = ref('');
const startDate = ref('2026-10-01');
const endDate = ref('2026-11-30');

const getSubjectName = (id: string) => store.subjects.find((s) => s.id === id)?.name || '-';
const getClassName = (id: string) => store.classes.find((c) => c.id === id)?.name || '-';

const todayIndo = computed(() => {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

const filteredJournals = computed(() => {
  return store.teachingJournals.filter((j) => {
    if (filterSubject.value && j.subject_id !== filterSubject.value) return false;
    if (filterClass.value && j.class_id !== filterClass.value) return false;
    if (j.date < startDate.value || j.date > endDate.value) return false;
    return true;
  });
});

const exportExcel = () => {
  const data = filteredJournals.value.map((j, i) => ({
    No: i + 1,
    Tanggal: j.date,
    Kelas: getClassName(j.class_id),
    'Mata Pelajaran': getSubjectName(j.subject_id),
    'Jam Pelajaran': j.period,
    'Materi Pokok': j.topic,
    'Metode Pembelajaran': j.method,
    'Jumlah Siswa Hadir': j.present_count,
    Catatan: j.notes
  }));

  exportTableToExcel(data, `Laporan_Jurnal_Mengajar_${startDate.value}_${endDate.value}`);
  showAlert.toast('Laporan jurnal mengajar berhasil diexport ke Excel', 'success');
};

const exportPDF = () => {
  const headers = ['No', 'Tanggal', 'Kelas', 'Mata Pelajaran', 'Jam Ke', 'Materi Pokok', 'Hadir', 'Catatan'];
  const rows = filteredJournals.value.map((j, i) => [
    i + 1,
    formatDate(j.date),
    getClassName(j.class_id),
    getSubjectName(j.subject_id),
    j.period,
    j.topic,
    j.present_count,
    j.notes || '-'
  ]);

  exportTableToPDF({
    title: 'AGENDA & JURNAL PELAKSANAAN MENGAJAR GURU',
    subtitle: `Guru: ${store.profile.full_name} | Periode: ${formatDate(startDate.value)} s/d ${formatDate(endDate.value)} | ${store.profile.school_name}`,
    teacherName: store.profile.full_name,
    nip: store.profile.nip,
    headers,
    rows,
    fileName: `Laporan_Jurnal_Mengajar_${startDate.value}_${endDate.value}`,
    orientation: 'landscape'
  });
  showAlert.toast('PDF Laporan jurnal mengajar berhasil diunduh', 'success');
};
</script>
