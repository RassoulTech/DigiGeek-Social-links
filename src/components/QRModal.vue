<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="link" class="overlay" @click.self="$emit('close')">
        <div class="modal" :style="`--accent: ${link.accent}`">
          <!-- Close -->
          <button class="close-btn" @click="$emit('close')" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <div class="network-icon" v-html="link.icon"></div>
            <div>
              <p class="network-name">{{ link.label }}</p>
              <p class="network-url">{{ shortUrl }}</p>
            </div>
          </div>

          <!-- QR Code canvas -->
          <div class="qr-wrapper">
            <div class="qr-glow"></div>
            <canvas ref="canvas" class="qr-canvas"></canvas>
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-corner br"></div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <a :href="link.url" target="_blank" rel="noopener" class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              Ouvrir le lien
            </a>
            <button class="btn btn-ghost" @click="download">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Télécharger QR
            </button>
          </div>

          <!-- Copy link -->
          <button class="copy-row" @click="copy">
            <span class="copy-url">{{ link.url }}</span>
            <span class="copy-badge" :class="{ copied }">
              {{ copied ? '✓ Copié !' : 'Copier' }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({ link: Object })
defineEmits(['close'])

const canvas  = ref(null)
const copied  = ref(false)

const shortUrl = computed(() => {
  if (!props.link) return ''
  return props.link.url.replace(/^https?:\/\/(www\.)?/, '')
})

watch(() => props.link, async (l) => {
  if (!l) return
  await nextTick()
  if (!canvas.value) return
  await QRCode.toCanvas(canvas.value, l.url, {
    width: 260,
    margin: 2,
    color: { dark: '#0d0f1a', light: '#f0f4ff' },
    errorCorrectionLevel: 'H',
  })
})

function download() {
  if (!canvas.value) return
  const a = document.createElement('a')
  a.download = `qr-${props.link.id}.png`
  a.href = canvas.value.toDataURL('image/png')
  a.click()
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.link.url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<style scoped>
/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4,6,16,0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

/* ── Modal box ── */
.modal {
  position: relative;
  background: rgba(12,15,28,0.92);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 28px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),
    0 32px 80px rgba(0,0,0,0.6),
    0 0 60px -20px var(--accent, rgba(99,60,255,0.4));
}

/* ── Close ── */
.close-btn {
  position: absolute;
  top: 1.1rem; right: 1.1rem;
  width: 34px; height: 34px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 50%;
  color: rgba(238,242,255,0.6);
  cursor: pointer;
  display: grid; place-items: center;
  transition: all .2s;
}
.close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
.close-btn svg { width: 14px; height: 14px; }

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.network-icon {
  width: 48px; height: 48px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  display: grid; place-items: center;
  color: var(--accent, #fff);
  flex-shrink: 0;
}
.network-icon :deep(svg) { width: 22px; height: 22px; }
.network-name {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--txt);
}
.network-url {
  font-family: var(--font-mono);
  font-size: .72rem;
  color: var(--txt-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

/* ── QR area ── */
.qr-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.qr-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent, #6b3cff) 30%, transparent) 0%, transparent 70%);
  filter: blur(20px);
  border-radius: 50%;
  z-index: 0;
}
.qr-canvas {
  position: relative;
  z-index: 1;
  border-radius: 16px;
  display: block;
}

/* Corner decorators */
.qr-corner {
  position: absolute;
  width: 20px; height: 20px;
  border-color: var(--accent, #6b3cff);
  border-style: solid;
  z-index: 2;
}
.qr-corner.tl { top: 4px; left: calc(50% - 130px); border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
.qr-corner.tr { top: 4px; right: calc(50% - 130px); border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
.qr-corner.bl { bottom: 4px; left: calc(50% - 130px); border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
.qr-corner.br { bottom: 4px; right: calc(50% - 130px); border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

/* ── Actions ── */
.modal-actions {
  display: flex;
  gap: .75rem;
  margin-bottom: 1rem;
}
.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  padding: .7rem 1rem;
  border-radius: 12px;
  font-family: var(--font-head);
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all .2s;
}
.btn svg { width: 15px; height: 15px; flex-shrink: 0; }
.btn-primary {
  background: var(--accent, #6b3cff);
  color: #fff;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--accent, #6b3cff) 50%, transparent);
}
.btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); }
.btn-ghost {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--txt);
}
.btn-ghost:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

/* ── Copy row ── */
.copy-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: .6rem .85rem;
  cursor: pointer;
  transition: background .2s;
  text-align: left;
}
.copy-row:hover { background: rgba(255,255,255,0.08); }
.copy-url {
  font-family: var(--font-mono);
  font-size: .7rem;
  color: var(--txt-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.copy-badge {
  font-family: var(--font-head);
  font-size: .7rem;
  font-weight: 600;
  color: var(--txt-muted);
  white-space: nowrap;
  transition: color .2s;
  flex-shrink: 0;
}
.copy-badge.copied { color: #4ade80; }

/* ── Transition ── */
.modal-enter-active, .modal-leave-active { transition: all .3s cubic-bezier(.34,1.56,.64,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.88) translateY(16px); }
</style>