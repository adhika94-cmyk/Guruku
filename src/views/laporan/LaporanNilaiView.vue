<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Laporan /</span> Laporan Nilai Siswa</h4>
        <small class="text-muted">Cetak dan unduh rekapitulasi nilai akademik per mata pelajaran dan per kelas.</small>
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
          <div class="col-md-5">
            <label class="form-label fw-semibold">Pilih Mata Pelajaran</label>
            <select v-model="selectedSubjectId" class="form-select">
              <option v-for="s in store.subjects" :key="s.id" :value="s.id">{{ s.name }} ({{ s.code }})</option>
            </select>
          </div>
          <div class="col-md-5">
            <label class="form-label fw-semibold">Pilih Kelas</label>
            <select v-model="selectedClassId" class="form-select">
              <option v-for="c in store.classes" :key="c.id" :value="c.id">{{ c.name }} — {{ c.grade_level }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-primary w-100" @click="windowPrint">
              <i class="bx bx-printer me-1"></i> Print
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Preview Paper -->
    <div class="card shadow-sm border p-4">
      <!-- Kop Surat Sekolah -->
      <div class="text-center pb-3 border-bottom mb-4">
        <h5 class="fw-bold text-uppercase mb-1">{{ store.profile.school_name }}</h5>
        <h6 class="fw-bold text-primary mb-1">LAPORAN HASIL PENILAIAN AKADEMIK SISWA</h6>
        <p class="text-muted small mb-0">
          Mata Pelajaran: <strong>{{ currentSubjectName }}</strong> | Kelas: <strong>{{ currentClassName }}</strong> | Tahun Pelajaran 2024/2025
        </p>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6 text-center border-end">
          <span class="text-muted small d-block">Jumlah Siswa</span>
          <h5 class="mb-0 fw-bold">{{ reportRows.length }} Siswa</h5>
        </div>
        <div class="col-md-3 col-6 text-center border-end">
          <span class="text-muted small d-block">Nilai Rata-rata</span>
          <h5 class="mb-0 fw-bold text-primary">{{ stats.avg }}</h5>
        </div>
        <div class="col-md-3 col-6 text-center border-end">
          <span class="text-muted small d-block">Ketuntasan (KKM ≥ 75)</span>
          <h5 class="mb-0 fw-bold text-success">{{ stats.passPercent }}% ({{ stats.passedCount }}/{{ reportRows.length }})</h5>
        </div>
        <div class="col-md-3 col-6 text-center">
          <span class="text-muted small d-block">Predikat Dominan</span>
          <h5 class="mb-0 fw-bold text-info">{{ stats.predA }} A / {{ stats.predB }} B / {{ stats.predC }} C</h5>
        </div>
      </div>

      <!-- Table Report -->
      <div class="table-responsive">
        <table class="table table-bordered table-sm align-middle">
          <thead class="table-light text-center">
            <tr>
              <th style="width: 40px;">No</th>
              <th style="width: 90px;">NIS</th>
              <th class="text-start">Nama Lengkap Siswa</th>
              <th style="width: 70px;">L/P</th>
              <th style="width: 70px;">Tugas</th>
              <th style="width: 70px;">Harian</th>
              <th style="width: 70px;">PTS</th>
              <th style="width: 70px;">PAS</th>
              <th style="width: 80px;" class="fw-bold text-primary">Nilai Akhir</th>
              <th style="width: 70px;">Predikat</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in reportRows" :key="r.student_id">
              <td class="text-center">{{ i + 1 }}</td>
              <td class="text-center font-monospace">{{ r.nis }}</td>
              <td class="fw-semibold">{{ r.full_name }}</td>
              <td class="text-center">{{ r.gender }}</td>
              <td class="text-center">{{ r.assignment }}</td>
              <td class="text-center">{{ r.daily }}</td>
              <td class="text-center">{{ r.pts }}</td>
              <td class="text-center">{{ r.pas }}</td>
              <td class="text-center fw-bold" :class="r.final >= 75 ? 'text-primary' : 'text-danger'">{{ r.final }}</td>
              <td class="text-center">
                <span class="badge" :class="r.predicate === 'A' ? 'bg-label-success' : (r.predicate === 'B' ? 'bg-label-primary' : 'bg-label-warning')">
                  {{ r.predicate }}
                </span>
              </td>
              <td><small class="text-muted">{{ r.final >= 75 ? 'Tuntas' : 'Perlu Remedial' }}</small></td>
            </tr>
            <tr v-if="reportRows.length === 0">
              <td colspan="11" class="text-center py-4 text-muted">Belum ada data nilai di kelas ini.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Signature Section -->
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
          <p class="small fw-bold">Guru Mata Pelajaran</p>
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

const selectedSubjectId = ref(store.subjects[0]?.id || '');
const selectedClassId = ref(store.classes[0]?.id || '');

const currentSubjectName = computed(() => {
  return store.subjects.find((s) => s.id === selectedSubjectId.value)?.name || 'Mata Pelajaran';
});

const currentClassName = computed(() => {
  return store.classes.find((c) => c.id === selectedClassId.value)?.name || 'Kelas';
});

const todayIndo = computed(() => {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
});

const reportRows = computed(() => {
  const students = store.getStudentsByClass(selectedClassId.value);
  const grades = store.getGradesByFilter(selectedSubjectId.value, selectedClassId.value);

  return students.map((st) => {
    const g = grades.find((item) => item.student_id === st.id);
    const assign = g ? Number(g.assignment_score) || 0 : 80;
    const daily = g ? Number(g.daily_score) || 0 : 80;
    const pts = g ? Number(g.mid_exam_score) || 0 : 80;
    const pas = g ? Number(g.final_exam_score) || 0 : 80;
    const { finalGrade, predicate } = store.calculateGrade(assign, daily, pts, pas);

    return {
      student_id: st.id,
      nis: st.nis,
      full_name: st.full_name,
      gender: st.gender,
      assignment: assign,
      daily,
      pts,
      pas,
      final: g ? g.final_grade : finalGrade,
      predicate: g ? g.predicate : predicate
    };
  });
});

const stats = computed(() => {
  const rows = reportRows.value;
  if (rows.length === 0) return { avg: 0, passedCount: 0, passPercent: 0, predA: 0, predB: 0, predC: 0 };

  const sum = rows.reduce((acc, curr) => acc + curr.final, 0);
  const avg = Math.round((sum / rows.length) * 10) / 10;
  const passedCount = rows.filter((r) => r.final >= 75).length;
  const passPercent = Math.round((passedCount / rows.length) * 100);

  const predA = rows.filter((r) => r.predicate === 'A').length;
  const predB = rows.filter((r) => r.predicate === 'B').length;
  const predC = rows.filter((r) => r.predicate === 'C').length;

  return { avg, passedCount, passPercent, predA, predB, predC };
});

const windowPrint = () => {
  window.print();
};

const exportExcel = () => {
  const data = reportRows.value.map((r, i) => ({
    No: i + 1,
    NIS: r.nis,
    'Nama Siswa': r.full_name,
    'L/P': r.gender,
    Tugas: r.assignment,
    Harian: r.daily,
    PTS: r.pts,
    PAS: r.pas,
    'Nilai Akhir': r.final,
    Predikat: r.predicate,
    Keterangan: r.final >= 75 ? 'Tuntas' : 'Belum Tuntas'
  }));

  exportTableToExcel(data, `Laporan_Nilai_${currentSubjectName.value}_${currentClassName.value}`);
  showAlert.toast('Laporan nilai berhasil diekspor ke Excel', 'success');
};

const exportPDF = () => {
  const headers = ['No', 'NIS', 'Nama Siswa', 'L/P', 'Tugas', 'Harian', 'PTS', 'PAS', 'Nilai Akhir', 'Predikat'];
  const rows = reportRows.value.map((r, i) => [
    i + 1,
    r.nis,
    r.full_name,
    r.gender,
    r.assignment,
    r.daily,
    r.pts,
    r.pas,
    r.final,
    r.predicate
  ]);

  exportTableToPDF({
    title: 'LAPORAN REKAPITULASI NILAI AKADEMIK SISWA',
    subtitle: `Mata Pelajaran: ${currentSubjectName.value} | Kelas: ${currentClassName.value} | ${store.profile.school_name}`,
    teacherName: store.profile.full_name,
    nip: store.profile.nip,
    headers,
    rows,
    fileName: `Laporan_Nilai_${currentSubjectName.value}_${currentClassName.value}`,
    orientation: 'landscape'
  });
  showAlert.toast('PDF Laporan nilai berhasil diunduh', 'success');
};
</script>
