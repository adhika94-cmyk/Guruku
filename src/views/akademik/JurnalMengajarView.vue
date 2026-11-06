<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Akademik /</span> Jurnal Mengajar</h4>
        <small class="text-muted">Agenda kegiatan pembelajaran harian guru, materi pokok, metode, dan dokumentasi kelas.</small>
      </div>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bx bx-plus me-1"></i> Buat Jurnal Baru
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-muted">Pencarian Materi / Catatan</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input
                type="text"
                v-model="search"
                class="form-control"
                placeholder="Cari materi, metode, atau catatan..."
              />
            </div>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-muted">Filter Mata Pelajaran</label>
            <select v-model="filterSubject" class="form-select">
              <option value="">Semua Mata Pelajaran</option>
              <option v-for="s in store.subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-muted">Filter Kelas</label>
            <select v-model="filterClass" class="form-select">
              <option value="">Semua Kelas</option>
              <option v-for="c in store.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Journals List Card -->
    <div class="row g-4">
      <div v-for="item in filteredJournals" :key="item.id" class="col-12 col-md-6 col-xl-4">
        <div class="card h-100 shadow-sm border">
          <!-- Card Attachment Image if available -->
          <div v-if="item.attachment_url" class="position-relative overflow-hidden" style="height: 160px;">
            <img
              :src="item.attachment_url"
              class="card-img-top w-100 h-100"
              style="object-fit: cover;"
              alt="Lampiran Jurnal"
            />
            <span class="position-absolute top-0 end-0 m-2 badge bg-dark opacity-75">
              <i class="bx bx-image me-1"></i> Dokumentasi
            </span>
          </div>

          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-label-primary">{{ getSubjectName(item.subject_id) }}</span>
              <span class="badge bg-label-info">{{ getClassName(item.class_id) }}</span>
            </div>

            <div class="d-flex align-items-center text-muted small mb-2 gap-2">
              <span><i class="bx bx-calendar me-1"></i>{{ formatDate(item.date) }}</span>
              <span>•</span>
              <span><i class="bx bx-time-five me-1"></i>{{ item.period }}</span>
            </div>

            <h5 class="card-title text-heading fw-bold mb-2">{{ item.topic }}</h5>

            <div class="mb-3">
              <small class="text-muted d-block mb-1"><strong>Metode:</strong> {{ item.method || 'Ceramah & Praktik' }}</small>
              <small class="text-muted d-block">
                <strong>Siswa Hadir:</strong>
                <span class="badge bg-label-success ms-1">{{ item.present_count }} Siswa</span>
              </small>
            </div>

            <p class="card-text text-muted small bg-light p-2 rounded mb-0" style="min-height: 50px;">
              {{ item.notes || 'Tidak ada catatan tambahan untuk sesi ini.' }}
            </p>
          </div>

          <div class="card-footer bg-transparent border-top d-flex justify-content-between align-items-center">
            <small class="text-muted"><i class="bx bx-check-circle text-success me-1"></i>Tervalidasi</small>
            <div class="d-flex gap-1">
              <button
                class="btn btn-sm btn-icon btn-outline-warning"
                title="Edit Jurnal"
                @click="openEditModal(item)"
              >
                <i class="bx bx-edit-alt"></i>
              </button>
              <button
                class="btn btn-sm btn-icon btn-outline-danger"
                title="Hapus Jurnal"
                @click="handleDelete(item)"
              >
                <i class="bx bx-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredJournals.length === 0" class="col-12">
        <div class="card p-5 text-center text-muted">
          <i class="bx bx-receipt fs-1 text-primary mb-2"></i>
          <h5>Belum Ada Jurnal Mengajar</h5>
          <p class="mb-3">Mulai tulis jurnal mengajar untuk merekam aktivitas kegiatan belajar mengajar.</p>
          <div>
            <button class="btn btn-primary" @click="openAddModal">
              <i class="bx bx-plus me-1"></i> Tulis Jurnal Pertama
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah/Edit Jurnal -->
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
              {{ isEditing ? 'Edit Jurnal Mengajar' : 'Tulis Jurnal Mengajar Baru' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveJournal">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Tanggal Pembelajaran <span class="text-danger">*</span></label>
                  <input type="date" v-model="form.date" class="form-control" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Jam Pelajaran <span class="text-danger">*</span></label>
                  <select v-model="form.period" class="form-select" required>
                    <option value="Jam ke-1 s/d 2 (07:30 - 09:00)">Jam ke-1 s/d 2 (07:30 - 09:00)</option>
                    <option value="Jam ke-3 s/d 4 (09:15 - 10:45)">Jam ke-3 s/d 4 (09:15 - 10:45)</option>
                    <option value="Jam ke-5 s/d 6 (11:00 - 12:30)">Jam ke-5 s/d 6 (11:00 - 12:30)</option>
                    <option value="Jam ke-7 s/d 8 (13:15 - 14:45)">Jam ke-7 s/d 8 (13:15 - 14:45)</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Mata Pelajaran <span class="text-danger">*</span></label>
                  <select v-model="form.subject_id" class="form-select" required>
                    <option value="" disabled>Pilih Mata Pelajaran</option>
                    <option v-for="s in store.subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Kelas <span class="text-danger">*</span></label>
                  <select v-model="form.class_id" class="form-select" required @change="onClassChange">
                    <option value="" disabled>Pilih Kelas</option>
                    <option v-for="c in store.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Materi Pokok / Topik Pembelajaran <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    v-model="form.topic"
                    class="form-control"
                    placeholder="Contoh: Algoritma Percabangan IF-THEN-ELSE dan Flowchart"
                    required
                  />
                </div>

                <div class="col-md-8">
                  <label class="form-label fw-semibold">Metode / Model Pembelajaran</label>
                  <input
                    type="text"
                    v-model="form.method"
                    class="form-control"
                    placeholder="Contoh: Problem Based Learning, Diskusi & Demonstrasi Lab"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Jumlah Siswa Hadir</label>
                  <input
                    type="number"
                    min="0"
                    v-model.number="form.present_count"
                    class="form-control"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Catatan Guru & Evaluasi Sesi</label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    class="form-control"
                    placeholder="Catatan kendala, respon siswa, tindak lanjut tugas rumah..."
                  ></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Lampiran / Foto Dokumentasi Kegiatan (URL / Unggah)</label>
                  <div class="input-group">
                    <input
                      type="text"
                      v-model="form.attachment_url"
                      class="form-control"
                      placeholder="Masukkan URL foto atau pilih preset dokumentasi kelas..."
                    />
                    <button
                      class="btn btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Pilih Foto Contoh
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <a class="dropdown-item" href="javascript:void(0);" @click="form.attachment_url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'">
                          Lab Komputer & Informatika
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:void(0);" @click="form.attachment_url = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'">
                          Suasana Kelas Matematika
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:void(0);" @click="form.attachment_url = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80'">
                          Presentasi Siswa
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top">
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn btn-primary">
                <i class="bx bx-save me-1"></i> Simpan Jurnal
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
import { TeachingJournal } from '../../types';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();
const search = ref('');
const filterSubject = ref('');
const filterClass = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  subject_id: '',
  class_id: '',
  date: new Date().toISOString().substring(0, 10),
  period: 'Jam ke-1 s/d 2 (07:30 - 09:00)',
  topic: '',
  method: 'Problem Based Learning',
  present_count: 32,
  notes: '',
  attachment_url: ''
});

const getSubjectName = (id: string) => store.subjects.find((s) => s.id === id)?.name || 'Mata Pelajaran';
const getClassName = (id: string) => store.classes.find((c) => c.id === id)?.name || 'Kelas';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

const onClassChange = () => {
  if (form.class_id) {
    form.present_count = store.getStudentsByClass(form.class_id).length || 30;
  }
};

const filteredJournals = computed(() => {
  return store.teachingJournals.filter((j) => {
    if (filterSubject.value && j.subject_id !== filterSubject.value) return false;
    if (filterClass.value && j.class_id !== filterClass.value) return false;

    const q = search.value.toLowerCase().trim();
    if (!q) return true;
    return (
      j.topic.toLowerCase().includes(q) ||
      (j.method && j.method.toLowerCase().includes(q)) ||
      (j.notes && j.notes.toLowerCase().includes(q))
    );
  });
});

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.subject_id = store.subjects[0]?.id || '';
  form.class_id = store.classes[0]?.id || '';
  form.date = new Date().toISOString().substring(0, 10);
  form.period = 'Jam ke-1 s/d 2 (07:30 - 09:00)';
  form.topic = '';
  form.method = 'Problem Based Learning & Diskusi';
  form.present_count = store.getStudentsByClass(form.class_id).length || 30;
  form.notes = '';
  form.attachment_url = '';
  showModal.value = true;
};

const openEditModal = (j: TeachingJournal) => {
  isEditing.value = true;
  editingId.value = j.id;
  form.subject_id = j.subject_id;
  form.class_id = j.class_id;
  form.date = j.date;
  form.period = j.period;
  form.topic = j.topic;
  form.method = j.method;
  form.present_count = j.present_count;
  form.notes = j.notes || '';
  form.attachment_url = j.attachment_url || '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveJournal = () => {
  if (!form.subject_id || !form.class_id || !form.topic.trim()) {
    showAlert.warning('Perhatian', 'Mata pelajaran, kelas, dan topik materi wajib diisi.');
    return;
  }

  if (isEditing.value && editingId.value) {
    store.updateJournal(editingId.value, {
      subject_id: form.subject_id,
      class_id: form.class_id,
      date: form.date,
      period: form.period,
      topic: form.topic.trim(),
      method: form.method.trim(),
      present_count: form.present_count,
      notes: form.notes.trim(),
      attachment_url: form.attachment_url.trim()
    });
    showAlert.toast('Jurnal mengajar berhasil diperbarui', 'success');
  } else {
    store.addJournal({
      subject_id: form.subject_id,
      class_id: form.class_id,
      date: form.date,
      period: form.period,
      topic: form.topic.trim(),
      method: form.method.trim(),
      present_count: form.present_count,
      notes: form.notes.trim(),
      attachment_url: form.attachment_url.trim()
    });
    showAlert.toast('Jurnal mengajar baru berhasil disimpan', 'success');
  }
  closeModal();
};

const handleDelete = async (j: TeachingJournal) => {
  const confirmed = await showAlert.confirm(
    'Hapus Jurnal Mengajar?',
    `Catatan materi "${j.topic}" tanggal ${formatDate(j.date)} akan dihapus permanen.`
  );
  if (confirmed) {
    store.deleteJournal(j.id);
    showAlert.toast('Jurnal telah dihapus', 'info');
  }
};
</script>
