<template>
  <div class="app">
    <!-- ── Background particles ── -->
    <canvas ref="particleCanvas" class="particles"></canvas>

    <!-- ── Main container ── -->
    <main class="container">

      <!-- Profile header -->
      <header class="profile">
        <div class="avatar">
          <img v-if="profile.avatar" :src="resolvedAvatar" :alt="profile.name" @error="onAvatarError" />
          <span v-else class="initials">{{ initials }}</span>
          <div class="avatar-ring"></div>
        </div>
        <h1 class="profile-name">{{ profile.name }}</h1>
        <p class="profile-tagline">{{ profile.tagline }}</p>

        <!-- Stats row -->
        <div class="stats">
          <div class="stat">
            <span class="stat-val">{{ links.length }}</span>
            <span class="stat-lbl">Réseaux</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-val">QR</span>
            <span class="stat-lbl">Partage</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-val">↗</span>
            <span class="stat-lbl">Direct</span>
          </div>
        </div>
      </header>

      <!-- Search bar -->
      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="query"
          type="text"
          placeholder="Rechercher un réseau…"
          class="search-input"
          spellcheck="false"
        />
        <button v-if="query" class="search-clear" @click="query = ''">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Link list -->
      <TransitionGroup name="list" tag="div" class="link-list">
        <LinkCard
          v-for="link in filtered"
          :key="link.id"
          :link="link"
          @click="openModal"
        />
      </TransitionGroup>

      <!-- Empty state -->
      <Transition name="fade">
        <div v-if="filtered.length === 0" class="empty">
          <span>🔍</span>
          <p>Aucun réseau trouvé pour <strong>« {{ query }} »</strong></p>
        </div>
      </Transition>

      <!-- Footer -->
      <footer class="footer">
        <span>Cliquez sur un réseau pour voir son QR code</span>
      </footer>
    </main>

    <!-- QR Modal -->
    <QRModal :link="activeLink" @close="activeLink = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LinkCard from './components/LinkCard.vue'
import QRModal  from './components/QRModal.vue'
import { profile, links } from './links.js'

const query      = ref('')
const activeLink = ref(null)
const avatarError = ref(false)

// Résout le chemin de l'avatar en tenant compte de BASE_URL (GitHub Pages)
const resolvedAvatar = computed(() => {
  if (!profile.avatar || avatarError.value) return null
  if (profile.avatar.startsWith('http') || profile.avatar.startsWith('data:')) return profile.avatar
  // Extrait juste le nom du fichier et le place dans /public/images/
  const filename = profile.avatar.split(/[\/]/).pop()
  return `${import.meta.env.BASE_URL}images/${filename}`
})

function onAvatarError() { avatarError.value = true }

const initials = computed(() =>
  profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
)

const filtered = computed(() => {
  if (!query.value) return links
  const q = query.value.toLowerCase()
  return links.filter(l =>
    l.label.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
  )
})

function openModal(link) { activeLink.value = link }

// ── Floating particles ────────────────────────────────────────────────
const particleCanvas = ref(null)
let   animId         = null
let   particles      = []

function initParticles() {
  const cvs = particleCanvas.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  const resize = () => { cvs.width = innerWidth; cvs.height = innerHeight }
  resize()
  window.addEventListener('resize', resize)

  particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.5 + .4,
    dx: (Math.random() - .5) * .3,
    dy: (Math.random() - .5) * .3,
    alpha: Math.random() * .4 + .05,
  }))

  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180,190,255,${p.alpha})`
      ctx.fill()
      p.x += p.dx; p.y += p.dy
      if (p.x < 0 || p.x > cvs.width)  p.dx *= -1
      if (p.y < 0 || p.y > cvs.height) p.dy *= -1
    }
    animId = requestAnimationFrame(draw)
  }
  draw()
}

onMounted(initParticles)
onUnmounted(() => cancelAnimationFrame(animId))
</script>

<style scoped>
/* ── Layout ── */
.app { min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 3rem 1rem 4rem; }

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
}

/* ── Profile ── */
.profile {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  position: relative;
  display: inline-block;
  width: 88px; height: 88px;
  margin-bottom: 1rem;
}
.avatar img {
  width: 100%; height: 100%;
  border-radius: 22px;
  object-fit: contain;
  display: block;
  background: rgba(255,255,255,0.04);
}
.initials {
  width: 100%; height: 100%;
  border-radius: 22px;
  background: linear-gradient(135deg, #6b3cff, #ec4899);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; font-weight: 800;
  color: #fff;
}
.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 26px;
  background: conic-gradient(from 0deg, #6b3cff, #0d0814, #0ea5e9, #0d0814);
  z-index: -1;
  animation: spin 6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.profile-name {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -.02em;
  color: var(--txt);
}
.profile-tagline {
  font-family: var(--font-mono);
  font-size: .78rem;
  color: var(--txt-muted);
  margin-top: .35rem;
  line-height: 1.6;
}

/* Stats */
.stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: .75rem 1.5rem;
  display: inline-flex;
}
.stat { text-align: center; }
.stat-val {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--txt);
}
.stat-lbl {
  font-family: var(--font-mono);
  font-size: .62rem;
  color: var(--txt-muted);
  text-transform: uppercase;
  letter-spacing: .05em;
}
.stat-sep {
  width: 1px; height: 28px;
  background: var(--border);
}

/* ── Search ── */
.search-wrap {
  position: relative;
  margin-bottom: 1.25rem;
}
.search-icon {
  position: absolute;
  left: 1rem; top: 50%; transform: translateY(-50%);
  width: 17px; height: 17px;
  color: var(--txt-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: .82rem 3rem;
  font-family: var(--font-head);
  font-size: .9rem;
  color: var(--txt);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.search-input::placeholder { color: var(--txt-muted); }
.search-input:focus {
  border-color: rgba(107,60,255,.5);
  box-shadow: 0 0 0 3px rgba(107,60,255,.12);
}
.search-clear {
  position: absolute;
  right: .85rem; top: 50%; transform: translateY(-50%);
  width: 26px; height: 26px;
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 50%;
  color: var(--txt-muted);
  cursor: pointer;
  display: grid; place-items: center;
  transition: background .2s;
}
.search-clear:hover { background: rgba(255,255,255,0.15); }
.search-clear svg { width: 12px; height: 12px; }

/* ── Link list ── */
.link-list {
  display: flex;
  flex-direction: column;
  gap: .65rem;
}

/* ── Empty ── */
.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--txt-muted);
  font-family: var(--font-mono);
  font-size: .85rem;
}
.empty span { display: block; font-size: 2rem; margin-bottom: .75rem; }
.empty strong { color: var(--txt); }

/* ── Footer ── */
.footer {
  margin-top: 2rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: .68rem;
  color: var(--txt-muted);
  opacity: .6;
}

/* ── List transition ── */
.list-enter-active { transition: all .3s ease; }
.list-leave-active { transition: all .2s ease; }
.list-enter-from   { opacity: 0; transform: translateY(10px); }
.list-leave-to     { opacity: 0; transform: translateX(-10px); }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
</style>