# 🚀 ReyCloud Deploy

<p align="center">
  <b>Modern Website Deployment Platform</b><br>
  Deploy website ZIP / HTML langsung ke Vercel dengan custom domain otomatis.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ReyCloud-Deploy-black?style=for-the-badge&logo=vercel">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Vercel-API-black?style=for-the-badge&logo=vercel">
</p>

---

## ✨ Tentang

**ReyCloud Deploy** adalah platform deployment website sederhana yang memungkinkan pengguna meng-upload project website dan langsung melakukan deployment ke Vercel.

Project dapat di-upload dalam format:

- 📦 ZIP
- 🌐 HTML
- 📄 HTM

Setelah proses deployment selesai, website akan mendapatkan custom domain otomatis.

Contoh:

https://reyshop.legionteknologi.my.id

---

## 🎯 Fitur

- 🚀 Deploy website ke Vercel
- 📦 Support ZIP
- 🌐 Support HTML
- 📄 Support HTM
- ☁️ Vercel API Integration
- 🔐 Token Vercel menggunakan Environment Variable
- 🌐 Custom domain otomatis
- 📊 Deployment progress
- ⚡ Interface sederhana dan cepat
- 📱 Responsive mobile UI
- 🧹 Temporary files otomatis dibersihkan
- 🛡️ Token Vercel tidak diekspos ke frontend

---

## 📊 Deployment Flow

📦 Memuat file
      ↓
☁️ Meminta request API Vercel
      ↓
👤 Memeriksa akun Vercel
      ↓
📁 Create / Get Project
      ↓
📤 Data berhasil di-upload
      ↓
🚀 Menuju tahap akhir
      ↓
⏳ Menunggu deployment
      ↓
🌐 Custom Domain
      ↓
✅ Deployment berhasil

---

## 🧩 Struktur Project

reycloud-deploy/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── config.js
├── package.json
├── vercel.json
├── .env
└── .gitignore

---

## 📦 Requirements

Pastikan sudah tersedia:

- Node.js 18+
- npm
- Vercel Account
- Vercel Token
- Domain yang sudah terhubung ke Vercel

---

## ⚙️ Installation

Clone repository:

git clone https://github.com/reyclouddev-ops/reycloud-deploy.git

Masuk ke folder:

cd reycloud-deploy

Install dependencies:

npm install

---

## 🔐 Environment Variable

Buat file:

.env

Isi:

TOKEN_VERCEL=token_vercel_kamu

Jangan upload `.env` ke GitHub.

Pastikan `.gitignore` berisi:

node_modules/
.env

---

## 🌐 Domain Configuration

Buka:

config.js

Isi:

global.domain = "legionteknologi.my.id";

Domain tersebut akan digunakan sebagai custom domain deployment.

Contoh:

Project:
reyshop

Domain:
https://reyshop.legionteknologi.my.id

---

## ▶️ Menjalankan Lokal

Jalankan:

npm start

Jika berhasil:

ReyCloud Deploy berjalan di port 3000

Kemudian buka:

http://localhost:3000

---

## ☁️ Deploy ReyCloud Deploy ke Vercel

Project ini sendiri juga dapat di-host menggunakan Vercel.

Saat membuat project di Vercel:

Application Preset:
Other

Root Directory:
./

Tambahkan Environment Variable:

Key:
TOKEN_VERCEL

Value:
TOKEN_VERCEL_KAMU

Pilih:

Production and Preview

Kemudian klik:

Deploy

---

## 🚀 Cara Menggunakan

### 1. Masukkan nama project

Contoh:

reyshop

### 2. Upload project

Support:

.zip
.html
.htm

### 3. Klik

🚀 Deploy Sekarang

### 4. Tunggu proses

📦 Memuat file
↓
☁️ Meminta request API Vercel
↓
📤 Data berhasil di-upload
↓
🚀 Menuju tahap akhir
↓
✅ Deployment berhasil

### 5. Website selesai

Contoh:

https://reyshop.legionteknologi.my.id

---

## 🔌 Vercel API

ReyCloud Deploy menggunakan Vercel REST API:

const VERCEL_API = "https://api.vercel.com";

Authorization menggunakan:

function vercelHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

Token diambil dari Environment Variable:

const token = String(
  process.env.TOKEN_VERCEL || ""
).trim();

---

## 🔄 Deployment Architecture

USER
 ↓
ReyCloud Deploy Website
 ↓
Upload ZIP / HTML
 ↓
ReyCloud Backend
 ↓
Vercel REST API
 ↓
Create Project
 ↓
Upload Files
 ↓
Deployment
 ↓
READY
 ↓
Custom Domain
 ↓
https://project.legionteknologi.my.id

---

## 🛡️ Security

Token Vercel tidak disimpan di frontend.

Gunakan:

TOKEN_VERCEL=xxxxxxxx

Jangan pernah menaruh token secara langsung di:

public/
index.html
script.js
README.md
GitHub repository

Gunakan Environment Variables Vercel untuk production.

---

## 📁 Supported Files

| Format | Support |
|---|---|
| .zip | ✅ |
| .html | ✅ |
| .htm | ✅ |

---

## ⚡ Deployment Limit

Untuk versi saat ini, upload project dibatasi sampai sekitar:

50 MB

Batas tersebut dapat disesuaikan pada konfigurasi upload dan request Vercel.

---

## 🧰 Dependencies

Project ini menggunakan:

Express
Multer
Axios
Adm-Zip
Dotenv

Install semuanya menggunakan:

npm install

---

## 🛠️ Development

Jalankan project:

npm start

Edit file:

public/index.html
public/style.css
public/script.js
server.js
config.js

---

## 📌 Roadmap

- [x] UI ReyCloud Deploy
- [x] Upload ZIP
- [x] Upload HTML
- [x] Vercel API
- [x] Create Project
- [x] Deploy Files
- [x] Deployment Status
- [x] Custom Domain
- [x] Environment Variable
- [ ] Deployment History
- [ ] Dashboard
- [ ] Project Management
- [ ] Delete Deployment
- [ ] Custom Domain Management
- [ ] Authentication
- [ ] User Dashboard

---

## 👨‍💻 Developer

Developed by:

**ReyCloud**

Powered by:

**ReyCloudShop**

---

## ⭐ Support

Jika project ini membantu atau menarik buat kamu, jangan lupa kasih:

⭐ Star

pada repository GitHub.

---

## 📜 License

Project ini dibuat untuk kebutuhan pengembangan dan pembelajaran.

Gunakan dan modifikasi dengan bijak.

---

<p align="center">
  🚀 <b>ReyCloud Deploy</b><br>
  <sub>Powered by ReyCloudShop</sub>
</p>
