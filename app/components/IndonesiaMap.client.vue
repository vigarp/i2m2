<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Map, Marker, NavigationControl, Popup } from 'maplibre-gl'

const mapContainer = ref<HTMLDivElement | null>(null)
let mapInstance: Map | null = null

const nodes = [
  { name: 'Jakarta (IIX / OpenIXP Hub)', lng: 106.8456, lat: -6.2088, status: 'Primary Exchange', asn: 'Major ASNs' },
  { name: 'Surabaya (East Java Node)', lng: 112.7521, lat: -7.2575, status: 'Regional Node', asn: 'Telkom / Indosat' },
  { name: 'Medan (North Sumatra Gateway)', lng: 98.6722, lat: 3.5952, status: 'West Gateway', asn: 'Subsea Cable Hub' },
  { name: 'Makassar (East Indonesia Gateway)', lng: 119.4327, lat: -5.1477, status: 'East Gateway', asn: 'Regional IX' },
  { name: 'Denpasar (Bali Hub)', lng: 115.2167, lat: -8.6500, status: 'Regional Hub', asn: 'Tourism & Cloud' },
  { name: 'IKN Nusantara', lng: 116.7118, lat: -0.9744, status: 'Future Backbone', asn: 'Government Network' }
]

onMounted(() => {
  if (!mapContainer.value) return

  mapInstance = new Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    center: [118.0149, -2.5489],
    zoom: 4.2
  })

  mapInstance.addControl(new NavigationControl(), 'top-right')

  // Add markers for major internet exchange nodes in Indonesia
  nodes.forEach((node) => {
    if (!mapInstance) return

    const el = document.createElement('div')
    el.className = 'w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer animate-pulse'

    const popup = new Popup({ offset: 12 }).setHTML(`
      <div class="text-slate-900 font-sans p-1">
        <strong class="text-sm block">${node.name}</strong>
        <p class="text-xs text-slate-600 mb-0.5">${node.status}</p>
        <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">${node.asn}</span>
      </div>
    `)

    new Marker({ element: el })
      .setLngLat([node.lng, node.lat])
      .setPopup(popup)
      .addTo(mapInstance)
  })
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div class="relative w-full h-[450px] rounded-xl overflow-hidden shadow-sm border border-slate-700/60 bg-slate-900">
    <div
      ref="mapContainer"
      class="w-full h-full"
    />
    <div class="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 pointer-events-none">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />
      <span>Major Internet Hubs & Exchange Nodes (Indonesia)</span>
    </div>
  </div>
</template>

