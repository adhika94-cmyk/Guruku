<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Data Master /</span> Data Kelas</h4>
        <small class="text-muted">Kelola kelas-kelas yang diajar oleh Guru.</small>
      </div>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bx bx-plus me-1"></i> Tambah Kelas Baru
      </button>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">Daftar Kelas Binaan</h5>
        <input
          type="text"
          v-model="search"
          class="form-control form-control-sm"
          placeholder="Cari kelas atau tahun ajaran..."
          style="width: 250px;"
        />
      </div>

      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 60px;">No</th>
              <th>Nama Kelas</th>
              <th>Tingkat</th>
              <th>Tahun Ajaran</th>
              <th>Jumlah Siswa</th>
              <th class="text-center" style="width: 140px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cls, idx) in filteredList" :key="cls.id">
              <td><strong>{{ idx + 1 }}</strong></td>
              <td>
                <span class="badge bg-label-info fs-7 fw-bold">{{ cls.name }}</span>
              </td>
              <td>
                <span class="fw-semibold text-heading">{{ cls.grade_level }}</span>
              </td>
              <td>
                <span class="badge bg-label-secondary">{{ cls.academic_year }}</span>
              </td>
              <td>
                <span class="badge bg-label-success">
                  <i class="bx bx-user me-1"></i>
                  {{ countStudents(cls.id) }} Siswa
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                  <button
                    class="btn btn-sm btn-icon btn-outline-warning"
                    title="Edit Kelas"
                    @click="openEditModal(cls)"
                  >
                    <i class="bx bx-edit-alt"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-icon btn-outline-danger"
                    title="Hapus Kelas"
                    @click="handleDelete(cls)"
                  >
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                Belum ada data kelas yang sesuai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah/Edit Kelas -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0,0,0,0.5);"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Data Kelas' : 'Tambah Kelas Baru' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveClass">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Nama Kelas <span class="text-danger">*</span></label>
                <input
                  type="text"
                  v-model="form.name"
                  class="form-control"
                  placeholder="Contoh: VII-A, VIII-B, IX-C"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Tingkat Kelas <span class="text-danger">*</span></label>
                <select v-model="form.grade_level" class="form-select" required>
                  <option value="" disabled>Pilih Tingkat</option>
                  <option value="Kelas 7">Kelas 7 (Tujuh / Fase D)</option>
                  <option value="Kelas 8">Kelas 8 (Delapan / Fase D)</option>
                  <option value="Kelas 9">Kelas 9 (Sembilan / Fase D)</option>
                  <option value="Kelas 10">Kelas 10 (Sepuluh / Fase E)</option>
                  <option value="Kelas 11">Kelas 11 (Sebelas / Fase F)</option>
                  <option value="Kelas 12">Kelas 12 (Dua Belas / Fase F)</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Tahun Ajaran <span class="text-danger">*</span></label>
                <input
                  type="text"
                  v-model="form.academic_year"
                  class="form-control"
                  placeholder="Contoh: 2024/2025"
                  required
                />
              </div>
            </div>

            <div class="modal-footer border-top">
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn btn-primary">
                <i class="bx bx-save me-1"></i> Simpan Kelas
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { ClassRoom } from '../../types';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const search = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  name: '',
  grade_level: 'Kelas 7',
  academic_year: '2024/2025'
});

const countStudents = (classId: string) => {
  return store.students.filter((s) => s.class_id === classId).length;
};

const filteredList = computed(() => {
  return store.classes.filter((c) => {
    const q = search.value.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.academic_year.toLowerCase().includes(q);
  });
});

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  form.grade_level = 'Kelas 7';
  form.academic_year = '2024/2025';
  showModal.value = true;
};

const openEditModal = (cls: ClassRoom) => {
  isEditing.value = true;
  editingId.value = cls.id;
  form.name = cls.name;
  form.grade_level = cls.grade_level;
  form.academic_year = cls.academic_year;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveClass = () => {
  if (!form.name.trim()) {
    showAlert.warning('Perhatian', 'Nama kelas tidak boleh kosong.');
    return;
  }

  if (isEditing.value && editingId.value) {
    store.updateClass(editingId.value, {
      name: form.name.trim(),
      grade_level: form.grade_level,
      academic_year: form.academic_year.trim()
    });
    showAlert.toast('Data kelas berhasil diperbarui', 'success');
  } else {
    store.addClass({
      name: form.name.trim(),
      grade_level: form.grade_level,
      academic_year: form.academic_year.trim()
    });
    showAlert.toast('Kelas baru berhasil ditambahkan', 'success');
  }
  closeModal();
};

const handleDelete = async (cls: ClassRoom) => {
  const confirmed = await showAlert.confirm(
    `Hapus Kelas ${cls.name}?`,
    'Seluruh data siswa, nilai, dan absensi di kelas ini akan ikut terhapus.'
  );
  if (confirmed) {
    store.deleteClass(cls.id);
    showAlert.toast('Kelas telah dihapus', 'info');
  }
};
</script>
