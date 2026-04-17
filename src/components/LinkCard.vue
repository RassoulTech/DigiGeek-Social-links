<template>
  <button
    class="card"
    :style="`--accent: ${link.accent}`"
    @click="$emit('click', link)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- glow bg -->
    <div class="card-glow"></div>

    <!-- icon -->
    <div class="icon-wrap" v-html="link.icon"></div>

    <!-- label -->
    <div class="card-info">
      <span class="card-label">{{ link.label }}</span>
      <span class="card-url">{{ shortUrl }}</span>
    </div>

    <!-- QR mini preview badge -->
    <div class="qr-badge">
      <svg viewBox="0 0 24 24" fill="currentColor" class="qr-icon">
        <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm9-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8-1h2v2h-2v-2zm0 3h2v2h-2v-2zm3-3h2v2h-2v-2zm0 3h2v2h-2v-2zm-6 3h2v2h-2v-2zm3 0h2v2h-2v-2zm3-9h2v2h-2v-2zm3 0h2v2h-2v-2z"/>
      </svg>
      <span>QR</span>
    </div>

    <!-- arrow -->
    <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ link: Object })
defineEmits(['click'])
const hovered = ref(false)

const shortUrl = computed(() =>
  props.link.url.replace(/^https?:\/\/(www\.)?/, '')
)
</script>

<style scoped>
.card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  transition:
    border-color .25s,
    transform .25s cubic-bezier(.34,1.56,.64,1),
    box-shadow .25s;
}

.card:hover {
  border-color: var(--border-h);
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 30px -10px var(--accent);
}

/* glow on hover */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at left center, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}
.card:hover .card-glow { opacity: 1; }

/* icon */
.icon-wrap {
  width: 46px; height: 46px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 13px;
  display: grid; place-items: center;
  color: var(--accent);
  transition: background .25s, border-color .25s;
}
.card:hover .icon-wrap {
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
}
.icon-wrap :deep(svg) { width: 22px; height: 22px; }

/* info */
.card-info {
  flex: 1;
  min-width: 0;
}
.card-label {
  display: block;
  font-family: var(--font-head);
  font-size: .95rem;
  font-weight: 700;
  color: var(--txt);
}
.card-url {
  display: block;
  font-family: var(--font-mono);
  font-size: .7rem;
  color: var(--txt-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* QR badge */
.qr-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: .65rem;
  color: var(--txt-muted);
  transition: all .25s;
  flex-shrink: 0;
}
.card:hover .qr-badge {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  color: var(--accent);
}
.qr-icon { width: 12px; height: 12px; }

/* arrow */
.arrow {
  width: 18px; height: 18px;
  color: var(--txt-muted);
  flex-shrink: 0;
  transition: transform .25s, color .25s;
}
.card:hover .arrow {
  transform: translateX(3px);
  color: var(--txt);
}
</style>