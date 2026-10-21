<script setup lang="ts">
import { ref } from 'vue'
import type { IndonesiaRadarResponse } from '~~/types/radar'

const { data: summary, refresh: refreshSummary, status: summaryStatus } = await useFetch<IndonesiaRadarResponse>('/api/radar/indonesia')

const selectedEndpoint = ref('/radar/http/summary/bot')
const dateRange = ref('7d')
const exploreResult = ref<unknown>(null)
const exploreLoading = ref(false)

const popularEndpoints = [
  { label: 'Bot Traffic', path: '/radar/http/summary/bot' },
  { label: 'Device Type', path: '/radar/http/summary/device_type' },
  { label: 'HTTP Version', path: '/radar/http/summary/http_version' },
  { label: 'TLS Version', path: '/radar/http/summary/tls_version' },
  { label: 'Layer 3 Attacks', path: '/radar/attacks/layer3/summary' },
  { label: 'Speed & Latency', path: '/radar/quality/speed/summary' }
]

async function runExplore(path?: string) {
  if (path) {
    selectedEndpoint.value = path
  }
  exploreLoading.value = true
  try {
    const res = await $fetch('/api/radar/explore', {
      params: {
        path: selectedEndpoint.value,
        location: 'ID',
        dateRange: dateRange.value
      }
    })
    exploreResult.value = res
  }
  catch (err: unknown) {
    exploreResult.value = err
  }
  finally {
    exploreLoading.value = false
  }
}

// Initial fetch for explore
await runExplore()
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
    <!-- Navigation Bar -->
    <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 font-mono">
            i2
          </div>
          <div>
            <h1 class="text-base font-bold tracking-tight">
              i2m2
            </h1>
            <p class="text-xs text-slate-400 hidden sm:block">
              Indonesia Internet Metric Monitor
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3 text-xs">
          <span
            class="px-2.5 py-1 rounded-full border font-mono flex items-center gap-1.5"
            :class="summary?.source === 'live'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-400'"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="summary?.source === 'live' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"
            />
            {{ summary?.source === 'live' ? 'Live Cloudflare API' : 'Simulated / Mock Mode' }}
          </span>

          <button
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-700 text-slate-300 font-medium"
            :disabled="summaryStatus === 'pending'"
            @click="() => refreshSummary()"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Intro Notice -->
      <section class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Project Overview</span>
            <h2 class="text-xl font-bold mt-1 text-white">
              Monitoring Infrastruktur & Trafik Internet Indonesia
            </h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl">
              Memvisualisasikan metrik dari Cloudflare Radar (adopsi IPv6, trafik bot vs human, kecepatan, dan distribusi perangkat) ke peta interaktif MapLibre GL.
            </p>
          </div>
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
            <span class="text-slate-500 block text-[11px]">Token Config (.env):</span>
            <code class="text-emerald-400 font-semibold">CLOUDFLARE_API_TOKEN</code>
          </div>
        </div>
      </section>

      <!-- Key Metrics Row -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p class="text-xs text-slate-400 font-medium">
            Human Traffic
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{ summary?.metrics?.humanTrafficPercentage ?? 68.4 }}%</span>
            <span class="text-xs text-emerald-400 font-mono">Dominan</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            vs Bot: {{ summary?.metrics?.botTrafficPercentage ?? 31.6 }}%
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p class="text-xs text-slate-400 font-medium">
            IPv6 Adoption
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{ summary?.metrics?.ipv6AdoptionPercentage ?? 27.5 }}%</span>
            <span class="text-xs text-slate-400 font-mono">Nasional</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Target transisi IPv6 ID
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p class="text-xs text-slate-400 font-medium">
            Mobile vs Desktop
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{ summary?.metrics?.mobileTrafficPercentage ?? 74.2 }}%</span>
            <span class="text-xs text-emerald-400 font-mono">Mobile</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Desktop: {{ summary?.metrics?.desktopTrafficPercentage ?? 25.8 }}%
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p class="text-xs text-slate-400 font-medium">
            Top ASN Hub
          </p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">AS7713</span>
            <span class="text-xs text-slate-400 font-mono">42.1%</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1 truncate">
            Telkom Indonesia
          </p>
        </div>
      </section>

      <!-- MapLibre Map Section -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">
              Peta Simpul Internet Indonesia
            </h3>
            <p class="text-xs text-slate-400">
              Visualisasi simpul internet exchange & gateway utama berbasis MapLibre GL
            </p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            MapLibre GL client-only
          </span>
        </div>

        <ClientOnly>
          <IndonesiaMap />
          <template #fallback>
            <div class="w-full h-[450px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              Memuat MapLibre GL...
            </div>
          </template>
        </ClientOnly>
      </section>

      <!-- Cloudflare Radar Endpoint Kulik / Explorer -->
      <section class="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 space-y-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Endpoint Explorer</span>
          <h3 class="text-lg font-bold text-white mt-1">
            Eksplorasi Cloudflare Radar API
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Gunakan alat internal ini untuk menguji dan mengecek payload dari berbagai endpoint Cloudflare Radar sebelum difinalisasi ke tampilan UI.
          </p>
        </div>

        <!-- Quick Select Buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ep in popularEndpoints"
            :key="ep.path"
            class="px-2.5 py-1 text-xs rounded-lg border transition font-mono"
            :class="selectedEndpoint === ep.path
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'"
            @click="runExplore(ep.path)"
          >
            {{ ep.label }}
          </button>
        </div>

        <!-- Custom Path Input -->
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="relative flex-1">
            <label for="custom-endpoint-input" class="sr-only">Cloudflare Radar Endpoint Path</label>
            <span class="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">/client/v4</span>
            <input
              id="custom-endpoint-input"
              v-model="selectedEndpoint"
              type="text"
              placeholder="/radar/http/summary/bot"
              class="w-full pl-24 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
            >
          </div>

          <div class="flex gap-2">
            <label for="date-range-select" class="sr-only">Date Range</label>
            <select
              id="date-range-select"
              v-model="dateRange"
              class="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="24h">
                24 Jam
              </option>
              <option value="7d">
                7 Hari
              </option>
              <option value="28d">
                28 Hari
              </option>
            </select>

            <button
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs rounded-lg transition disabled:opacity-50 text-white flex items-center gap-1.5"
              :disabled="exploreLoading"
              @click="() => runExplore()"
            >
              <span v-if="exploreLoading">Mengambil...</span>
              <span v-else>Fetch Endpoint</span>
            </button>
          </div>
        </div>

        <!-- Response Viewer -->
        <div class="bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-x-auto max-h-[350px]">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-[11px] text-slate-400 font-mono">
            <span>Response Output</span>
            <span class="text-slate-500">JSON Format</span>
          </div>
          <pre class="text-xs font-mono text-emerald-400/90 leading-relaxed">{{ JSON.stringify(exploreResult, null, 2) }}</pre>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
      <p>i2m2 (Indonesia Internet Metric Monitor) &bull; Built with Nuxt 4, MapLibre GL, and Cloudflare Radar</p>
    </footer>
  </div>
</template>
