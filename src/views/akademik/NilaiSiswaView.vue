<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Akademik /</span> Nilai Siswa</h4>
        <small class="text-muted">Kelola nilai tugas, harian, PTS, dan PAS dengan perhitungan nilai akhir & predikat otomatis.</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success" @click="handleExportExcel" :disabled="studentsInClass.length === 0">
          <i class="bx bx-file-blank me-1"></i> Export Excel
        </button>
        <button class="btn btn-outline-danger" @click="handleExportPDF" :disabled="studentsInClass.length === 0">
          <i class="bx bxs-file-pdf me-1"></i> Cetak PDF
        </button>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-5">
            <label class="form-label fw-semibold">Pilih Mata Pelajaran <span class="text-danger">*</span></label>
            <select v-model="selectedSubjectId" class="form-select">
              <option v-for="sub in store.subjects" :key="sub.id" :value="sub.id">
                [{{ sub.code }}] {{ sub.name }}
              </option>
            </select>
          </div>
          <div class="col-md-5">
            <label class="form-label fw-semibold">Pilih Kelas <span class="text-danger">*</span></label>
            <select v-model="selectedClassId" class="form-select">
              <option v-for="cls in store.classes" :key="cls.id" :value="cls.id">
                {{ cls.name }} — {{ cls.grade_level }} ({{ cls.academic_year }})
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" @click="saveAllGrades">
              <i class="bx bx-save me-1"></i> Simpan Nilai
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary KPI Stats for this Subject & Class -->
    <div class="row g-3 mb-4" v-if="studentsInClass.length > 0">
      <div class="col-sm-6 col-lg-3">
        <div class="card p-3 mb-0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Rata-Rata Kelas</span>
              <h4 class="mb-0 text-primary fw-bold">{{ summaryStats.average }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-primary">
              <i class="bx bx-calculator"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card p-3 mb-0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Nilai Tertinggi</span>
              <h4 class="mb-0 text-success fw-bold">{{ summaryStats.highest }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-success">
              <i class="bx bx-trending-up"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card p-3 mb-0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Nilai Terendah</span>
              <h4 class="mb-0 text-danger fw-bold">{{ summaryStats.lowest }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-danger">
              <i class="bx bx-trending-down"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card p-3 mb-0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Ketuntasan (KKM 75)</span>
              <h4 class="mb-0 text-info fw-bold">{{ summaryStats.passRate }}%</h4>
            </div>
            <div class="avatar-icon-box bg-label-info">
              <i class="bx bx-check-double"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Input Nilai -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 class="mb-0">Lembar Input Penilaian Siswa</h5>
          <small class="text-muted">
            Bobot Penilaian: Tugas (20%), Harian (20%), PTS (30%), PAS (30%)
          </small>
        </div>
        <span class="badge bg-label-primary">{{ currentSubjectName }} | {{ currentClassName }}</span>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr class="text-center">
              <th style="width: 40px;">No</th>
              <th style="width: 100px;">NIS</th>
              <th class="text-start" style="min-width: 180px;">Nama Siswa</th>
              <th style="width: 100px;">Tugas (20%)</th>
              <th style="width: 100px;">Harian (20%)</th>
              <th style="width: 100px;">PTS (30%)</th>
              <th style="width: 100px;">PAS (30%)</th>
              <th style="width: 100px;" class="table-primary text-primary">Nilai Akhir</th>
              <th style="width: 80px;">Predikat</th>
              <th style="min-width: 150px;">Catatan Guru</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in gradeRows" :key="row.student_id">
              <td class="text-center font-monospace"><strong>{{ idx + 1 }}</strong></td>
              <td class="text-center font-monospace text-muted">{{ row.nis }}</td>
              <td>
                <span class="fw-semibold text-heading">{{ row.student_name }}</span>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  v-model.number="row.assignment_score"
                  @input="recalculateRow(row)"
                  class="form-control form-control-sm text-center"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  v-model.number="row.daily_score"
                  @input="recalculateRow(row)"
                  class="form-control form-control-sm text-center"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  v-model.number="row.mid_exam_score"
                  @input="recalculateRow(row)"
                  class="form-control form-control-sm text-center"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  v-model.number="row.final_exam_score"
                  @input="recalculateRow(row)"
                  class="form-control form-control-sm text-center"
                />
              </td>
              <!-- Nilai Akhir Otomatis -->
              <td class="text-center fw-bold fs-6" :class="row.final_grade >= 75 ? 'text-primary' : 'text-danger'">
                {{ row.final_grade }}
              </td>
              <!-- Predikat Otomatis -->
              <td class="text-center">
                <span
                  class="badge"
                  :class="{
                    'bg-label-success': row.predicate === 'A',
                    'bg-label-primary': row.predicate === 'B',
                    'bg-label-warning': row.predicate === 'C',
                    'bg-label-danger': row.predicate === 'D'
                  }"
                >
                  {{ row.predicate }}
                </span>
              </td>
              <td>
                <input
                  type="text"
                  v-model="row.notes"
                  placeholder="Catatan perkembangan..."
                  class="form-control form-control-sm"
                />
              </td>
            </tr>
            <tr v-if="studentsInClass.length === 0">
              <td colspan="10" class="text-center py-4 text-muted">
                Tidak ada siswa yang terdaftar di kelas ini. Silakan tambahkan siswa di Data Master > Siswa.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
        <small class="text-muted">
          Kriteria Predikat: A (≥88 Sangat Baik), B (78-87 Baik), C (65-77 Cukup), D (&lt;65 Perlu Remedial)
        </small>
        <button class="btn btn-primary" @click="saveAllGrades">
          <i class="bx bx-check-double me-1"></i> Simpan Semua Perubahan Nilai
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exporter';

const store = useGuruStore();
const route = useRoute();

const selectedSubjectId = ref(
  (route.query.subject as string) || store.subjects[0]?.id || ''
);
const selectedClassId = ref(store.classes[0]?.id || '');

interface GradeRow {
  student_id: string;
  nis: string;
  student_name: string;
  assignment_score: number;
  daily_score: number;
  mid_exam_score: number;
  final_exam_score: number;
  final_grade: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  notes: string;
}

const gradeRows = ref<GradeRow[]>([]);

const currentSubjectName = computed(() => {
  return store.subjects.find((s) => s.id === selectedSubjectId.value)?.name || 'Mata Pelajaran';
});

const currentClassName = computed(() => {
  return store.classes.find((c) => c.id === selectedClassId.value)?.name || 'Kelas';
});

const studentsInClass = computed(() => {
  return store.getStudentsByClass(selectedClassId.value);
});

// Load grades for chosen subject & class into reactive rows
const loadGrades = () => {
  const currentGrades = store.getGradesByFilter(selectedSubjectId.value, selectedClassId.value);
  
  gradeRows.value = studentsInClass.value.map((st) => {
    const existing = currentGrades.find((g) => g.student_id === st.id);
    const tugas = existing ? Number(existing.assignment_score) || 0 : 80;
    const harian = existing ? Number(existing.daily_score) || 0 : 80;
    const pts = existing ? Number(existing.mid_exam_score) || 0 : 80;
    const pas = existing ? Number(existing.final_exam_score) || 0 : 80;

    const { finalGrade, predicate } = store.calculateGrade(tugas, harian, pts, pas);

    return {
      student_id: st.id,
      nis: st.nis,
      student_name: st.full_name,
      assignment_score: tugas,
      daily_score: harian,
      mid_exam_score: pts,
      final_exam_score: pas,
      final_grade: existing ? existing.final_grade : finalGrade,
      predicate: existing ? existing.predicate : predicate,
      notes: existing ? existing.notes || '' : ''
    };
  });
};

const recalculateRow = (row: GradeRow) => {
  const { finalGrade, predicate } = store.calculateGrade(
    Number(row.assignment_score) || 0,
    Number(row.daily_score) || 0,
    Number(row.mid_exam_score) || 0,
    Number(row.final_exam_score) || 0
  );
  row.final_grade = finalGrade;
  row.predicate = predicate;
};

// Summary stats
const summaryStats = computed(() => {
  if (gradeRows.value.length === 0) {
    return { average: 0, highest: 0, lowest: 0, passRate: 0 };
  }
  const grades = gradeRows.value.map((r) => r.final_grade);
  const sum = grades.reduce((acc, curr) => acc + curr, 0);
  const avg = Math.round((sum / grades.length) * 10) / 10;
  const high = Math.max(...grades);
  const low = Math.min(...grades);
  const passed = grades.filter((g) => g >= 75).length;
  const passRate = Math.round((passed / grades.length) * 100);

  return {
    average: avg,
    highest: high,
    lowest: low,
    passRate
  };
});

watch([selectedSubjectId, selectedClassId], () => {
  loadGrades();
}, { immediate: true });

const saveAllGrades = () => {
  if (!selectedSubjectId.value || !selectedClassId.value) {
    showAlert.warning('Perhatian', 'Pilih mata pelajaran dan kelas terlebih dahulu.');
    return;
  }

  gradeRows.value.forEach((row) => {
    store.saveGrade({
      subject_id: selectedSubjectId.value,
      class_id: selectedClassId.value,
      student_id: row.student_id,
      assignment_score: row.assignment_score,
      daily_score: row.daily_score,
      mid_exam_score: row.mid_exam_score,
      final_exam_score: row.final_exam_score,
      notes: row.notes
    });
  });

  showAlert.toast('Seluruh nilai siswa berhasil disimpan ke sistem!', 'success');
};

const handleExportExcel = () => {
  const data = gradeRows.value.map((r, i) => ({
    No: i + 1,
    NIS: r.nis,
    'Nama Siswa': r.student_name,
    'Mata Pelajaran': currentSubjectName.value,
    Kelas: currentClassName.value,
    'Nilai Tugas': r.assignment_score,
    'Nilai Harian': r.daily_score,
    'Nilai PTS': r.mid_exam_score,
    'Nilai PAS': r.final_exam_score,
    'Nilai Akhir': r.final_grade,
    Predikat: r.predicate,
    Catatan: r.notes
  }));

  exportTableToExcel(data, `Rekap_Nilai_${currentSubjectName.value}_${currentClassName.value}`);
  showAlert.toast('Rekap nilai berhasil diexport ke Excel', 'success');
};

const handleExportPDF = () => {
  const headers = ['No', 'NIS', 'Nama Siswa', 'Tugas', 'Harian', 'PTS', 'PAS', 'Nilai Akhir', 'Predikat'];
  const rows = gradeRows.value.map((r, i) => [
    i + 1,
    r.nis,
    r.student_name,
    r.assignment_score,
    r.daily_score,
    r.mid_exam_score,
    r.final_exam_score,
    r.final_grade,
    r.predicate
  ]);

  exportTableToPDF({
    title: 'DAFTAR REKAPITULASI NILAI SISWA',
    subtitle: `Mata Pelajaran: ${currentSubjectName.value} | Kelas: ${currentClassName.value} | Tahun Ajaran 2024/2025`,
    teacherName: store.profile.full_name,
    nip: store.profile.nip,
    headers,
    rows,
    fileName: `Nilai_${currentSubjectName.value}_${currentClassName.value}`,
    orientation: 'portrait'
  });
  showAlert.toast('Dokumen PDF nilai berhasil diunduh', 'success');
};
</script>
