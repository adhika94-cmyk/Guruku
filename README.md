# GuruKu - Portal Manajemen Guru Modern

Aplikasi website manajemen akademik, data master siswa, penilaian kompetensi, absensi, dan jurnal mengajar harian guru yang dibangun dengan **Vue.js 3 (Composition API)**, **Vite**, **Bootstrap 5 (Sneat Admin Dashboard)**, dan **Supabase**.

---

## 🚀 Panduan Deployment dengan GitHub

Terdapat beberapa opsi mudah untuk mendeploy aplikasi ini menggunakan GitHub:

---

### OPSI 1: Deploy Otomatis ke GitHub Pages (Gratis & Otomatis)

Aplikasi ini sudah dilengkapi alur kerja CI/CD GitHub Actions di `.github/workflows/deploy-pages.yml`.

1. **Inisialisasi & Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi aplikasi GuruKu"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git
   git push -u origin main
   ```

2. **Aktifkan Fitur GitHub Pages**:
   - Buka repositori Anda di GitHub.
   - Masuk ke tab **Settings** &raquo; **Pages** (di menu navigasi sebelah kiri).
   - Pada bagian **Build and deployment** &raquo; **Source**, pilih **GitHub Actions**.

3. **(Opsional) Atur Supabase Secrets di GitHub**:
   - Masuk ke tab **Settings** &raquo; **Secrets and variables** &raquo; **Actions**.
   - Klik **New repository secret**:
     - `VITE_SUPABASE_URL`: Masukkan URL proyek Supabase Anda.
     - `VITE_SUPABASE_ANON_KEY`: Masukkan Anon Key publik Supabase Anda.

4. **Selesai**: Setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan otomatis melakukan build dan menerbitkan website ke alamat:
   `https://USERNAME-ANDA.github.io/NAMA-REPO-ANDA/`

---

### OPSI 2: Deploy ke VPS aaPanel Menggunakan GitHub

Ada dua metode praktis mendeploy ke VPS aaPanel dari GitHub:

#### METODE A: Menggunakan aaPanel WebHook (Rekomendasi)
1. Di aaPanel, buka menu **App Store** dan pasang plugin **WebHook**.
2. Buka plugin WebHook dan klik **Add**:
   - Title: `deploy-guruku`
   - Salin isi dari berkas `deploy-aapanel.sh` ke dalam kotak teks script.
   - Sesuaikan baris `WEB_DIR="/www/wwwroot/guruku.sch.id"` dengan domain website Anda.
3. Simpan, lalu klik tautan **View** di baris webhook untuk melihat **Webhook URL** (contoh: `http://IP-VPS:8888/hook?access_key=xyz...`).
4. Buka repositori Anda di GitHub &raquo; **Settings** &raquo; **Webhooks** &raquo; **Add webhook**:
   - **Payload URL**: Tempel Webhook URL dari aaPanel tadi.
   - **Content type**: `application/json`.
   - **Which events**: `Just the push event`.
   - Klik **Add webhook**.
5. Sekarang, setiap ada `git push` ke branch `main`, aaPanel akan otomatis menarik kode terbaru, menjalankan `npm run build`, dan memperbarui website!

#### METODE B: Menggunakan GitHub Actions SSH Deploy
Alur kerja `.github/workflows/deploy-vps-aapanel.yml` dapat langsung mengunggah folder `dist/` ke server VPS Anda melalui SSH.
Cukup tambahkan secrets berikut di GitHub (**Settings** &raquo; **Secrets and variables** &raquo; **Actions**):
- `VPS_HOST`: Alamat IP publik VPS Anda.
- `VPS_USER`: User SSH (biasanya `root`).
- `VPS_SSH_KEY`: Private SSH Key VPS Anda.
- `VPS_TARGET_PATH`: Direktori web di aaPanel (misal: `/www/wwwroot/guruku.sch.id`).

---

### ⚙️ Konfigurasi Penting Nginx di aaPanel (Vue Router SPA)

Agar routing halaman (seperti `/akademik/nilai`, `/master/siswa`, `/pengaturan/profil`) tidak mengalami error 404 saat halaman di-refresh di browser, tambahkan konfigurasi URL Rewrite berikut di aaPanel:

1. Di aaPanel, buka menu **Website**.
2. Klik nama domain website Anda &raquo; pilih tab **URL rewrite**.
3. Masukkan konfigurasi berikut:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```
4. Klik **Save**.
5. Aktifkan sertifikat SSL gratis di tab **SSL** &raquo; **Let's Encrypt** agar website dapat diakses dengan protokol aman `https://`.

---

### OPSI 3: Deploy ke Vercel / Netlify / Cloudflare Pages

1. Hubungkan akun GitHub Anda ke [Vercel](https://vercel.com) atau [Netlify](https://netlify.com).
2. Pilih repositori GuruKu Anda.
3. Konfigurasi build otomatis terdeteksi:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Tambahkan Environment Variables di dashboard Vercel/Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klik **Deploy**.

---

## 🛠️ Menjalankan di Komputer Lokal (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git
cd NAMA-REPO-ANDA

# 2. Pasang dependensi
npm install

# 3. Jalankan server lokal Vite
npm run dev

# 4. Buka di browser
# http://localhost:3000
```

---

## 🗄️ Database Supabase & Relasi Tabel

Aplikasi ini menggunakan skrip PostgreSQL yang lengkap dan idempoten (bebas error duplikasi):
- `profiles`: Data profil guru dan identitas akun.
- `subjects`: Daftar mata pelajaran yang diampu.
- `classes`: Kelas yang diajar guru.
- `students`: Data lengkap siswa dan kontak orang tua.
- `grades`: Penilaian kompetensi siswa (Tugas 20%, Harian 20%, PTS 30%, PAS 30%, Nilai Akhir & Predikat otomatis).
- `attendance`: Presensi harian (Hadir, Izin, Sakit, Alfa).
- `teaching_journals`: Agenda jurnal pembelajaran guru dan dokumentasi kegiatan.

Skrip SQL lengkap dapat disalin langsung melalui menu **Pengaturan &raquo; Supabase & SQL** di dalam aplikasi.
