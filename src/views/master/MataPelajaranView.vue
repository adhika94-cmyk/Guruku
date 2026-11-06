<template>
  <div>
    <!-- Breadcrumb & Title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Data Master /</span> Mata Pelajaran</h4>
        <small class="text-muted">Kelola seluruh mata pelajaran yang diampu oleh Guru.</small>
      </div>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bx bx-plus me-1"></i> Tambah Mata Pelajaran
      </button>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">Daftar Mata Pelajaran</h5>
        <div class="d-flex gap-2">
          <input
            type="text"
            v-model="search"
            class="form-control form-control-sm"
            placeholder="Cari kode atau nama mapel..."
            style="width: 250px;"
          />
        </div>
      </div>

      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 60px;">No</th>
              <th>Kode Mapel</th>
              <th>Nama Mata Pelajaran</th>
              <th>Aksen Warna</th>
              <th>Total Terdaftar</th>
              <th class="text-center" style="width: 140px;">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in filteredList" :key="item.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <span class="badge bg-label-primary fs-7 fw-bold">{{ item.code }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <span class="p-2 rounded-circle" :style="{ backgroundColor: item.color || '#696cff' }"></span>
                  <span class="fw-semibold text-heading">{{ item.name }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :style="{ backgroundColor: item.color || '#696cff', color: '#fff' }">
                  {{ item.color || '#696cff' }}
                </span>
              </td>
              <td>
                <span class="text-muted"><i class="bx bx-group me-1"></i>Seluruh Kelas</span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                  <button
                    class="btn btn-sm btn-icon btn-outline-warning"
                    title="Edit Mapel"
                    @click="openEditModal(item)"
                  >
                    <i class="bx bx-edit-alt"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-icon btn-outline-danger"
                    title="Hapus Mapel"
                    @click="handleDelete(item)"
                  >
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                Tidak ada data mata pelajaran yang cocok.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit -->
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
              {{ isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveSubject">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Kode Mata Pelajaran <span class="text-danger">*</span></label>
                <input
                  type="text"
                  v-model="form.code"
                  class="form-control"
                  placeholder="Contoh: INF-07, MAT-01"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Nama Mata Pelajaran <span class="text-danger">*</span></label>
                <input
                  type="text"
                  v-model="form.name"
                  class="form-control"
                  placeholder="Contoh: Informatika & Komputer, Matematika Dasar"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Warna Label / Badge</label>
                <div class="d-flex align-items-center gap-3">
                  <input
                    type="color"
                    v-model="form.color"
                    class="form-control form-control-color"
                    style="width: 50px; height: 38px; cursor: pointer;"
                  />
                  <div class="d-flex gap-2 flex-wrap">
                    <span
                      v-for="c in presetColors"
                      :key="c"
                      class="badge cursor-pointer p-2 rounded-circle"
                      :style="{ backgroundColor: c, width: '24px', height: '24px' }"
                      @click="form.color = c"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top">
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn btn-primary">
                <i class="bx bx-save me-1"></i> Simpan Data
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
import { Subject } from '../../types';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const search = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const presetColors = ['#696cff', '#71dd37', '#03c3ec', '#ffab00', '#ff3e1d', '#8592a3', '#e83e8c'];

const form = reactive({
  code: '',
  name: '',
  color: '#696cff'
});

const filteredList = computed(() => {
  return store.subjects.filter((s) => {
    const q = search.value.toLowerCase();
    return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });
});

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.code = '';
  form.name = '';
  form.color = '#696cff';
  showModal.value = true;
};

const openEditModal = (sub: Subject) => {
  isEditing.value = true;
  editingId.value = sub.id;
  form.code = sub.code;
  form.name = sub.name;
  form.color = sub.color || '#696cff';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveSubject = () => {
  if (!form.code.trim() || !form.name.trim()) {
    showAlert.warning('Perhatian', 'Kode dan nama mata pelajaran wajib diisi.');
    return;
  }

  if (isEditing.value && editingId.value) {
    store.updateSubject(editingId.value, {
      code: form.code.trim(),
      name: form.name.trim(),
      color: form.color
    });
    showAlert.toast('Mata pelajaran berhasil diperbarui', 'success');
  } else {
    store.addSubject({
      code: form.code.trim(),
      name: form.name.trim(),
      color: form.color
    });
    showAlert.toast('Mata pelajaran baru berhasil ditambahkan', 'success');
  }
  closeModal();
};

const handleDelete = async (sub: Subject) => {
  const confirmed = await showAlert.confirm(
    `Hapus Mata Pelajaran ${sub.name}?`,
    'Semua data nilai, absensi, dan jurnal terkait mata pelajaran ini juga akan dihapus.'
  );
  if (confirmed) {
    store.deleteSubject(sub.id);
    showAlert.toast('Mata pelajaran telah dihapus', 'info');
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
