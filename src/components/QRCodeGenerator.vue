<template>
  <div class="page">
    <div class="qr-card">
      <!-- Header -->
      <div class="card-header">
        <div class="logo">GH</div>
        <div>
          <h2>GitHub</h2>
          <p>Profil officiel</p>
        </div>
      </div>

      <!-- QR Code -->
      <div class="qr-wrapper">
        <img :src="qrCodeUrl" alt="QR Code GitHub" />
      </div>

      <!-- Description -->
      <p class="description">
        Scannez ce QR Code pour accéder directement à
        <strong>GitHub</strong>.
      </p>

      <!-- URL -->
      <span class="url">{{ pageUrl }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

const pageUrl = 'https://github.com/RassoulTech'
const qrCodeUrl = ref('')

onMounted(async () => {
  qrCodeUrl.value = await QRCode.toDataURL(pageUrl, {
    width: 220,
    margin: 2
  })
})
</script>

<style scoped>
/* Page */
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  padding: 24px;
}

/* Carte principale */
.qr-card {
  width: 340px;
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  box-shadow:
    0 10px 15px rgba(0, 0, 0, 0.08),
    0 25px 50px rgba(0, 0, 0, 0.12);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.qr-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 15px 25px rgba(0, 0, 0, 0.12),
    0 40px 70px rgba(0, 0, 0, 0.18);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.logo {
  width: 44px;
  height: 44px;
  background: #111827;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.card-header p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* QR Code */
.qr-wrapper {
  margin: 24px auto;
  width: fit-content;
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.08),
    0 10px 25px rgba(0, 0, 0, 0.12);
}

.qr-wrapper img {
  width: 200px;
  height: 200px;
}

/* Description */
.description {
  font-size: 14px;
  color: #374151;
  margin-top: 12px;
}

/* URL */
.url {
  display: block;
  margin-top: 14px;
  font-size: 11px;
  color: #9ca3af;
  word-break: break-all;
}
</style>
