<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Data Master /</span> Data Siswa</h4>
        <small class="text-muted">Kelola basis data siswa per kelas, data kontak orang tua, dan identitas.</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bx bx-user-plus me-1"></i> Tambah Siswa Baru
        </button>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-5">
            <label class="form-label small fw-semibold text-muted">Pencarian Siswa</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input
                type="text"
                v-model="search"
                class="form-control"
                placeholder="Cari berdasarkan NIS, nama siswa, atau alamat..."
              />
            </div>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-muted">Filter Kelas</label>
            <select v-model="selectedClass" class="form-select">
              <option value="">Semua Kelas ({{ store.totalStudents }} Siswa)</option>
              <option v-for="c in store.classes" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.grade_level }} - {{ c.academic_year }})
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold text-muted">Filter Gender</label>
            <select v-model="selectedGender" class="form-select">
              <option value="">Semua (L & P)</option>
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Daftar Siswa ({{ filteredStudents.length }} Data Ditemukan)</h5>
      </div>

      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 50px;">No</th>
              <th>NIS</th>
              <th>Nama Lengkap</th>
              <th>Kelas</th>
              <th>L/P</th>
              <th>Tempat, Tgl Lahir</th>
              <th>No HP Orang Tua</th>
              <th class="text-center" style="width: 140px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(st, idx) in filteredStudents" :key="st.id">
              <td><strong>{{ idx + 1 }}</strong></td>
              <td>
                <span class="badge bg-label-primary font-monospace">{{ st.nis }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div
                    class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    :style="{
                      width: '32px',
                      height: '32px',
                      fontSize: '0.8rem',
                      backgroundColor: st.gender === 'L' ? '#696cff' : '#e83e8c'
                    }"
                  >
                    {{ getInitials(st.full_name) }}
                  </div>
                  <div>
                    <span class="fw-semibold text-heading">{{ st.full_name }}</span>
                    <small class="d-block text-muted text-truncate" style="max-width: 200px;">{{ st.address }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge bg-label-info">{{ getClassName(st.class_id) }}</span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="st.gender === 'L' ? 'bg-label-primary' : 'bg-label-danger'"
                >
                  {{ st.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </span>
              </td>
              <td>
                <small class="d-block fw-semibold">{{ st.birth_place }}</small>
                <small class="text-muted">{{ formatDate(st.birth_date) }}</small>
              </td>
              <td>
                <a :href="'tel:' + st.parent_phone" class="text-decoration-none text-muted">
                  <i class="bx bx-phone me-1 text-success"></i>{{ st.parent_phone || '-' }}
                </a>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                  <button
                    class="btn btn-sm btn-icon btn-outline-warning"
                    title="Edit Siswa"
                    @click="openEditModal(st)"
                  >
                    <i class="bx bx-edit-alt"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-icon btn-outline-danger"
                    title="Hapus Siswa"
                    @click="handleDelete(st)"
                  >
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                Tidak ada data siswa yang memenuhi kriteria pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah/Edit Siswa -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0,0,0,0.5);"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-bottom">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Data Siswa' : 'Tambah Siswa Baru' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveStudent">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Nomor Induk Siswa (NIS) <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    v-model="form.nis"
                    class="form-control"
                    placeholder="Contoh: 2407001"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Kelas <span class="text-danger">*</span></label>
                  <select v-model="form.class_id" class="form-select" required>
                    <option value="" disabled>Pilih Kelas</option>
                    <option v-for="c in store.classes" :key="c.id" :value="c.id">
                      {{ c.name }} ({{ c.grade_level }})
                    </option>
                  </select>
                </div>

                <div class="col-md-8">
                  <label class="form-label fw-semibold">Nama Lengkap Siswa <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    v-model="form.full_name"
                    class="form-control"
                    placeholder="Nama lengkap sesuai akta / ijazah"
                    required
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Jenis Kelamin <span class="text-danger">*</span></label>
                  <select v-model="form.gender" class="form-select" required>
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Tempat Lahir</label>
                  <input
                    type="text"
                    v-model="form.birth_place"
                    class="form-control"
                    placeholder="Kota kelahiran, misal: Bogor"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Tanggal Lahir</label>
                  <input
                    type="date"
                    v-model="form.birth_date"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Nomor HP / WhatsApp Orang Tua</label>
                  <input
                    type="tel"
                    v-model="form.parent_phone"
                    class="form-control"
                    placeholder="0812xxxxxx"
                  />
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold">Alamat Lengkap</label>
                  <textarea
                    v-model="form.address"
                    rows="2"
                    class="form-control"
                    placeholder="Alamat tempat tinggal siswa..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top">
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn btn-primary">
                <i class="bx bx-save me-1"></i> Simpan Data Siswa
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
import { Student } from '../../types';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const search = ref('');
const selectedClass = ref('');
const selectedGender = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  nis: '',
  class_id: '',
  full_name: '',
  gender: 'L' as 'L' | 'P',
  birth_place: '',
  birth_date: '2011-01-01',
  address: '',
  parent_phone: ''
});

const getClassName = (classId: string) => {
  return store.classes.find((c) => c.id === classId)?.name || '-';
};

const getInitials = (name: string) => {
  if (!name) return 'S';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

const filteredStudents = computed(() => {
  return store.students.filter((s) => {
    // filter class
    if (selectedClass.value && s.class_id !== selectedClass.value) {
      return false;
    }
    // filter gender
    if (selectedGender.value && s.gender !== selectedGender.value) {
      return false;
    }
    // search query
    const q = search.value.toLowerCase().trim();
    if (!q) return true;
    return (
      s.full_name.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  });
});

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.nis = '';
  form.class_id = store.classes[0]?.id || '';
  form.full_name = '';
  form.gender = 'L';
  form.birth_place = '';
  form.birth_date = '2011-01-01';
  form.address = '';
  form.parent_phone = '';
  showModal.value = true;
};

const openEditModal = (st: Student) => {
  isEditing.value = true;
  editingId.value = st.id;
  form.nis = st.nis;
  form.class_id = st.class_id;
  form.full_name = st.full_name;
  form.gender = st.gender;
  form.birth_place = st.birth_place;
  form.birth_date = st.birth_date;
  form.address = st.address;
  form.parent_phone = st.parent_phone;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveStudent = () => {
  if (!form.nis.trim() || !form.full_name.trim() || !form.class_id) {
    showAlert.warning('Perhatian', 'NIS, Nama Lengkap, dan Kelas wajib diisi.');
    return;
  }

  if (isEditing.value && editingId.value) {
    store.updateStudent(editingId.value, {
      nis: form.nis.trim(),
      class_id: form.class_id,
      full_name: form.full_name.trim(),
      gender: form.gender,
      birth_place: form.birth_place.trim(),
      birth_date: form.birth_date,
      address: form.address.trim(),
      parent_phone: form.parent_phone.trim()
    });
    showAlert.toast('Data siswa berhasil diperbarui', 'success');
  } else {
    store.addStudent({
      nis: form.nis.trim(),
      class_id: form.class_id,
      full_name: form.full_name.trim(),
      gender: form.gender,
      birth_place: form.birth_place.trim(),
      birth_date: form.birth_date,
      address: form.address.trim(),
      parent_phone: form.parent_phone.trim()
    });
    showAlert.toast('Siswa baru berhasil ditambahkan', 'success');
  }
  closeModal();
};

const handleDelete = async (st: Student) => {
  const confirmed = await showAlert.confirm(
    `Hapus Siswa ${st.full_name}?`,
    `Data nilai dan riwayat absensi siswa dengan NIS ${st.nis} akan dihapus.`
  );
  if (confirmed) {
    store.deleteStudent(st.id);
    showAlert.toast('Data siswa telah dihapus', 'info');
  }
};
</script>
