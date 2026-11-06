#!/usr/bin/env bash
# ====================================================================
# SCRIPT DEPLOY OTOMATIS GURUKU DARI GITHUB KE VPS aaPANEL
# ====================================================================
# Panduan pemakaian di aaPanel:
# 1. Pasang plugin "WebHook" di menu App Store aaPanel.
# 2. Tambahkan Webhook baru, beri nama "deploy-guruku".
# 3. Tempel isi skrip ini ke dalam form shell script webhook aaPanel.
# 4. Salin Webhook URL yang dihasilkan ke GitHub:
#    (Repository Anda -> Settings -> Webhooks -> Add webhook -> Payload URL)
# ====================================================================

set -e

# Path direktori website di aaPanel Anda (sesuaikan dengan nama domain Anda)
WEB_DIR="/www/wwwroot/guruku.sch.id"

echo "=========================================="
echo "Memulai proses deployment GuruKu..."
echo "Waktu: $(date)"
echo "Direktori target: $WEB_DIR"
echo "=========================================="

# Masuk ke direktori website
cd "$WEB_DIR"

# 1. Tarik pembaruan kode terbaru dari GitHub
echo "-> Mengambil kode terbaru dari GitHub (git pull)..."
git reset --hard HEAD
git pull origin main

# 2. Pasang dependencies
echo "-> Menginstall dependensi (npm install)..."
npm install --legacy-peer-deps

# 3. Build aplikasi untuk produksi
echo "-> Melakukan build aplikasi (npm run build)..."
npm run build

# 4. Atur permission file untuk user www di aaPanel
echo "-> Mengatur hak akses file..."
chown -R www:www "$WEB_DIR"
chmod -R 755 "$WEB_DIR"

echo "=========================================="
echo "Deployment Berhasil Selesai!"
echo "=========================================="
