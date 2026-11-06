<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Akademik /</span> Absensi Siswa</h4>
        <small class="text-muted">Pencatatan presensi siswa harian per mata pelajaran dan kelas (Hadir, Izin, Sakit, Alfa).</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success" @click="handleExportExcel" :disabled="attendanceRows.length === 0">
          <i class="bx bx-file-blank me-1"></i> Export Excel
        </button>
        <button class="btn btn-outline-danger" @click="handleExportPDF" :disabled="attendanceRows.length === 0">
          <i class="bx bxs-file-pdf me-1"></i> Cetak PDF
        </button>
      </div>
    </div>

    <!-- Filter Control Card -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label fw-semibold">Mata Pelajaran <span class="text-danger">*</span></label>
            <select v-model="selectedSubjectId" class="form-select">
              <option v-for="sub in store.subjects" :key="sub.id" :value="sub.id">
                [{{ sub.code }}] {{ sub.name }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold">Kelas <span class="text-danger">*</span></label>
            <select v-model="selectedClassId" class="form-select">
              <option v-for="cls in store.classes" :key="cls.id" :value="cls.id">
                {{ cls.name }} — {{ cls.grade_level }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold">Tanggal Absensi <span class="text-danger">*</span></label>
            <input type="date" v-model="selectedDate" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Stats Counters -->
    <div class="row g-3 mb-4" v-if="attendanceRows.length > 0">
      <div class="col-6 col-md-3">
        <div class="card p-3 mb-0 border-start border-success border-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Hadir (H)</span>
              <h4 class="mb-0 text-success fw-bold">{{ stats.hadir }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-success">
              <i class="bx bx-check"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card p-3 mb-0 border-start border-info border-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Izin (I)</span>
              <h4 class="mb-0 text-info fw-bold">{{ stats.izin }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-info">
              <i class="bx bx-info-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card p-3 mb-0 border-start border-warning border-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Sakit (S)</span>
              <h4 class="mb-0 text-warning fw-bold">{{ stats.sakit }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-warning">
              <i class="bx bx-plus-medical"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card p-3 mb-0 border-start border-danger border-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Alfa (A)</span>
              <h4 class="mb-0 text-danger fw-bold">{{ stats.alfa }}</h4>
            </div>
            <div class="avatar-icon-box bg-label-danger">
              <i class="bx bx-x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Table Card -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 class="mb-0">Daftar Presensi Harian Siswa</h5>
          <small class="text-muted">
            {{ currentSubjectName }} | {{ currentClassName }} | Tanggal: {{ formatDate(selectedDate) }}
          </small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-success" @click="markAllPresent">
            <i class="bx bx-check-double me-1"></i> Tandai Semua Hadir
          </button>
          <button class="btn btn-sm btn-primary" @click="saveAttendance">
            <i class="bx bx-save me-1"></i> Simpan Absensi
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th style="width: 50px;">No</th>
              <th style="width: 100px;">NIS</th>
              <th>Nama Siswa</th>
              <th class="text-center" style="width: 280px;">Status Kehadiran</th>
              <th>Keterangan / Alasan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in attendanceRows" :key="row.student_id">
              <td><strong>{{ idx + 1 }}</strong></td>
              <td><span class="badge bg-label-primary font-monospace">{{ row.nis }}</span></td>
              <td>
                <span class="fw-semibold text-heading">{{ row.student_name }}</span>
              </td>
              <td class="text-center">
                <!-- Radio Button Group for Attendance Status -->
                <div class="btn-group btn-group-sm w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    :name="'status_' + row.student_id"
                    :id="'status_H_' + row.student_id"
                    value="H"
                    v-model="row.status"
                  />
                  <label
                    class="btn"
                    :class="row.status === 'H' ? 'btn-success text-white' : 'btn-outline-success'"
                    :for="'status_H_' + row.student_id"
                  >
                    Hadir
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    :name="'status_' + row.student_id"
                    :id="'status_I_' + row.student_id"
                    value="I"
                    v-model="row.status"
                  />
                  <label
                    class="btn"
                    :class="row.status === 'I' ? 'btn-info text-white' : 'btn-outline-info'"
                    :for="'status_I_' + row.student_id"
                  >
                    Izin
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    :name="'status_' + row.student_id"
                    :id="'status_S_' + row.student_id"
                    value="S"
                    v-model="row.status"
                  />
                  <label
                    class="btn"
                    :class="row.status === 'S' ? 'btn-warning text-white' : 'btn-outline-warning'"
                    :for="'status_S_' + row.student_id"
                  >
                    Sakit
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    :name="'status_' + row.student_id"
                    :id="'status_A_' + row.student_id"
                    value="A"
                    v-model="row.status"
                  />
                  <label
                    class="btn"
                    :class="row.status === 'A' ? 'btn-danger text-white' : 'btn-outline-danger'"
                    :for="'status_A_' + row.student_id"
                  >
                    Alfa
                  </label>
                </div>
              </td>
              <td>
                <input
                  type="text"
                  v-model="row.notes"
                  placeholder="Catatan surat izin/sakit atau alasan..."
                  class="form-control form-control-sm"
                />
              </td>
            </tr>
            <tr v-if="attendanceRows.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                Tidak ada siswa yang terdaftar di kelas ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span class="text-muted small">
          Tingkat Kehadiran: <strong class="text-success">{{ stats.presentPercentage }}%</strong>
        </span>
        <button class="btn btn-primary" @click="saveAttendance">
          <i class="bx bx-save me-1"></i> Simpan Data Presensi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exporter';

const store = useGuruStore();

const selectedSubjectId = ref(store.subjects[0]?.id || '');
const selectedClassId = ref(store.classes[0]?.id || '');
const selectedDate = ref(new Date().toISOString().substring(0, 10));

interface AttRow {
  student_id: string;
  nis: string;
  student_name: string;
  status: 'H' | 'I' | 'S' | 'A';
  notes: string;
}

const attendanceRows = ref<AttRow[]>([]);

const currentSubjectName = computed(() => {
  return store.subjects.find((s) => s.id === selectedSubjectId.value)?.name || 'Mata Pelajaran';
});

const currentClassName = computed(() => {
  return store.classes.find((c) => c.id === selectedClassId.value)?.name || 'Kelas';
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

const loadAttendance = () => {
  const students = store.getStudentsByClass(selectedClassId.value);
  const existingRecords = store.getAttendanceByFilter(
    selectedSubjectId.value,
    selectedClassId.value,
    selectedDate.value
  );

  attendanceRows.value = students.map((st) => {
    const rec = existingRecords.find((r) => r.student_id === st.id);
    return {
      student_id: st.id,
      nis: st.nis,
      student_name: st.full_name,
      status: rec ? rec.status : 'H',
      notes: rec ? rec.notes || '' : ''
    };
  });
};

watch([selectedSubjectId, selectedClassId, selectedDate], () => {
  loadAttendance();
}, { immediate: true });

const markAllPresent = () => {
  attendanceRows.value.forEach((r) => {
    r.status = 'H';
    if (!r.notes) r.notes = 'Hadir';
  });
  showAlert.toast('Seluruh siswa ditandai Hadir (H)', 'success');
};

const stats = computed(() => {
  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alfa = 0;

  attendanceRows.value.forEach((r) => {
    if (r.status === 'H') hadir++;
    else if (r.status === 'I') izin++;
    else if (r.status === 'S') sakit++;
    else if (r.status === 'A') alfa++;
  });

  const total = attendanceRows.value.length;
  const presentPercentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return { hadir, izin, sakit, alfa, total, presentPercentage };
});

const saveAttendance = () => {
  if (!selectedSubjectId.value || !selectedClassId.value || !selectedDate.value) {
    showAlert.warning('Perhatian', 'Lengkapi pilihan mata pelajaran, kelas, dan tanggal.');
    return;
  }

  attendanceRows.value.forEach((row) => {
    store.saveAttendanceEntry({
      subject_id: selectedSubjectId.value,
      class_id: selectedClassId.value,
      student_id: row.student_id,
      date: selectedDate.value,
      status: row.status,
      notes: row.notes
    });
  });

  showAlert.toast('Presensi siswa berhasil disimpan!', 'success');
};

const handleExportExcel = () => {
  const statusLabel = { H: 'Hadir', I: 'Izin', S: 'Sakit', A: 'Alfa' };
  const data = attendanceRows.value.map((r, i) => ({
    No: i + 1,
    NIS: r.nis,
    'Nama Siswa': r.student_name,
    'Mata Pelajaran': currentSubjectName.value,
    Kelas: currentClassName.value,
    Tanggal: selectedDate.value,
    Status: statusLabel[r.status] || r.status,
    Keterangan: r.notes
  }));

  exportTableToExcel(data, `Presensi_${currentSubjectName.value}_${currentClassName.value}_${selectedDate.value}`);
  showAlert.toast('Data presensi berhasil diexport ke Excel', 'success');
};

const handleExportPDF = () => {
  const statusLabel = { H: 'Hadir', I: 'Izin', S: 'Sakit', A: 'Alfa' };
  const headers = ['No', 'NIS', 'Nama Siswa', 'Status', 'Keterangan'];
  const rows = attendanceRows.value.map((r, i) => [
    i + 1,
    r.nis,
    r.student_name,
    statusLabel[r.status] || r.status,
    r.notes || '-'
  ]);

  exportTableToPDF({
    title: 'BERITA ACARA & REKAPITULASI PRESENSI SISWA',
    subtitle: `Mapel: ${currentSubjectName.value} | Kelas: ${currentClassName.value} | Tanggal: ${formatDate(selectedDate.value)}`,
    teacherName: store.profile.full_name,
    nip: store.profile.nip,
    headers,
    rows,
    fileName: `Presensi_${currentSubjectName.value}_${currentClassName.value}_${selectedDate.value}`,
    orientation: 'portrait'
  });
  showAlert.toast('Dokumen PDF presensi berhasil diunduh', 'success');
};
</script>
