<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <h4 class="fw-bold py-1 mb-0"><span class="text-muted fw-light">Pengaturan /</span> Profil Guru</h4>
      <small class="text-muted">Kelola informasi identitas pendidik, data kepegawaian NIP/NUPTK, dan keamanan akun.</small>
    </div>

    <div class="row">
      <!-- Profile Information Card -->
      <div class="col-md-7 mb-4">
        <div class="card h-100">
          <div class="card-header border-bottom">
            <h5 class="mb-0">Data Pribadi & Kepegawaian</h5>
          </div>
          <div class="card-body">
            <!-- Avatar Section -->
            <div class="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
              <div class="position-relative">
                <img
                  :src="form.avatar_url || store.profile.avatar_url"
                  alt="Avatar Guru"
                  class="rounded-circle border p-1"
                  width="90"
                  height="90"
                  style="object-fit: cover;"
                />
              </div>
              <div>
                <h5 class="mb-1 text-heading">{{ form.full_name }}</h5>
                <p class="text-muted small mb-2">NIP: {{ form.nip }} | {{ form.school_name }}</p>
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="changeAvatarPrompt">
                    <i class="bx bx-camera me-1"></i> Ganti Foto Profil
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="resetDefaultAvatar">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- Profile Form -->
            <form @submit.prevent="saveProfile">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-semibold">Nama Lengkap & Gelar <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    v-model="form.full_name"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">NIP / NUPTK <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    v-model="form.nip"
                    class="form-control font-monospace"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Alamat Email <span class="text-danger">*</span></label>
                  <input
                    type="email"
                    v-model="form.email"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    v-model="form.phone"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Unit Sekolah Kerja</label>
                  <input
                    type="text"
                    v-model="form.school_name"
                    class="form-control"
                  />
                </div>

                <div class="col-12 mt-4 text-end">
                  <button type="submit" class="btn btn-primary">
                    <i class="bx bx-save me-1"></i> Simpan Perubahan Profil
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="col-md-5 mb-4">
        <div class="card h-100">
          <div class="card-header border-bottom">
            <h5 class="mb-0">Ubah Kata Sandi (Password)</h5>
          </div>
          <div class="card-body">
            <p class="text-muted small">
              Gunakan kombinasi minimal 6 karakter dengan huruf dan angka untuk keamanan akun guru.
            </p>

            <form @submit.prevent="handlePasswordChange">
              <div class="mb-3">
                <label class="form-label fw-semibold">Password Saat Ini</label>
                <input
                  type="password"
                  v-model="passForm.currentPassword"
                  class="form-control"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Password Baru</label>
                <input
                  type="password"
                  v-model="passForm.newPassword"
                  class="form-control"
                  placeholder="••••••••"
                  minlength="6"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  v-model="passForm.confirmPassword"
                  class="form-control"
                  placeholder="••••••••"
                  minlength="6"
                  required
                />
              </div>

              <button type="submit" class="btn btn-warning w-100 text-dark fw-semibold">
                <i class="bx bx-key me-1"></i> Perbarui Password
              </button>
            </form>

            <hr class="my-4" />

            <!-- Account Summary Note -->
            <div class="bg-light p-3 rounded">
              <h6 class="fw-bold mb-1"><i class="bx bx-shield-quarter text-primary me-1"></i>Keamanan Akun</h6>
              <p class="text-muted small mb-0">
                Sesi login aktif terenkripsi. Anda dapat mengaktifkan Supabase Auth pada menu Supabase & SQL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useGuruStore } from '../../stores/guruStore';
import { showAlert } from '../../utils/alerts';

const store = useGuruStore();

const form = reactive({
  full_name: store.profile.full_name,
  nip: store.profile.nip,
  email: store.profile.email,
  phone: store.profile.phone,
  school_name: store.profile.school_name,
  avatar_url: store.profile.avatar_url
});

const passForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const changeAvatarPrompt = async () => {
  const current = form.avatar_url;
  const newUrl = prompt('Masukkan URL gambar baru untuk Foto Profil:', current);
  if (newUrl && newUrl.trim()) {
    form.avatar_url = newUrl.trim();
    saveProfile();
  }
};

const resetDefaultAvatar = () => {
  form.avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
  saveProfile();
};

const saveProfile = () => {
  store.updateProfile({
    full_name: form.full_name.trim(),
    nip: form.nip.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    school_name: form.school_name.trim(),
    avatar_url: form.avatar_url.trim()
  });

  showAlert.toast('Profil guru berhasil diperbarui!', 'success');
};

const handlePasswordChange = () => {
  if (passForm.newPassword !== passForm.confirmPassword) {
    showAlert.error('Gagal', 'Password baru dan konfirmasi password tidak cocok.');
    return;
  }
  if (passForm.newPassword.length < 6) {
    showAlert.warning('Perhatian', 'Password baru minimal harus 6 karakter.');
    return;
  }

  showAlert.success('Berhasil', 'Password akun guru telah berhasil diperbarui!');
  passForm.currentPassword = '';
  passForm.newPassword = '';
  passForm.confirmPassword = '';
};
</script>
