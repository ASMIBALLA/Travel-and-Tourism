"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet-control-geocoder";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Link from "next/link";

// ---------- Leaflet marker icon fix ----------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LatLng = [number, number];

interface Monastery {
  id: number;
  name: string;
  desc: string;
  visiting: string;
  link: string;
  img: string;
  coordinates: LatLng;
  town?: string;
}

const monasteries: Monastery[] = [
  {
    id: 1,
    name: "Rumtek Monastery",
    town: "Gangtok",
    desc: "Seat-in-exile of the Karmapa, near Gangtok.",
    visiting: "Open: 9 AM – 6 PM",
    link: "https://rumtek.org/",
    img: "/beautiful-himalayan-monastery-with-golden-roofs-an.jpg",
    coordinates: [27.3258, 88.6012],
  },
  {
    id: 2,
    name: "Pemayangtse Monastery",
    town: "Pelling",
    desc: "Historic Nyingma monastery near Pelling.",
    visiting: "Open: 9 AM – 5 PM",
    link: "https://www.sikkimstdc.com/",
    img: "/ancient-tibetan-monastery-interior-with-wooden-scu.jpg",
    coordinates: [27.30453, 88.25204],
  },
  {
    id: 3,
    name: "Tashiding Monastery",
    town: "Tashiding",
    desc: "Pilgrimage site known for Bumchu's sacred water ritual.",
    visiting: "Open: 8 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Tashiding_Monastery_Sikkim.jpg",
    coordinates: [27.274, 88.287],
  },
  {
    id: 4,
    name: "Enchey Monastery",
    town: "Gangtok",
    desc: "A 200-year-old monastery with rich murals and ceremonies.",
    visiting: "Open: 9 AM – 6 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Enchey_Monastery_Gangtok.jpg",
    coordinates: [27.3381, 88.6132],
  },
  {
    id: 5,
    name: "Ralang Monastery",
    town: "Ralang",
    desc: "Known for its stunning architecture and prayer halls.",
    visiting: "Open: 8 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ralang_Monastery.jpg",
    coordinates: [27.1675, 88.6622],
  },
  {
    id: 6,
    name: "Phodong Monastery",
    town: "Phodong",
    desc: "Seat of the Nyingma sect with rich cultural heritage.",
    visiting: "Open: 9 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Phodong_Monastery_Sikkim.jpg",
    coordinates: [27.428, 88.613],
  },
];

export default function InteractiveMap({ height = "80vh" }: { height?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const geocoderRef = useRef<any>(null);
  const [selected, setSelected] = useState<Monastery | null>(null);
  const [mounted, setMounted] = useState(false);

  // Gate rendering to client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // If a previous map instance exists on this node, remove it defensively
    if (mapRef.current) {
      try { mapRef.current.remove(); } catch {}
      mapRef.current = null;
    }

    // Create map
    const map = L.map(containerRef.current, {
      center: [27.35, 88.45],
      zoom: 9,
      zoomControl: true,
    });
    mapRef.current = map;

    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    // Clustered markers
    const markers = L.markerClusterGroup();
    monasteries.forEach((m) => {
      const marker = L.marker([m.coordinates[0], m.coordinates[1]]);
      const tooltipHtml = `
        <div class="text-center max-w-xs">
          <h3 class="font-bold text-sm mb-1">${m.name}</h3>
          <img src="${m.img}" alt="${m.name}" class="w-24 h-16 object-cover rounded mb-1"/>
          <p class="text-xs mb-1">${m.desc}</p>
          <p class="text-xs font-semibold">${m.visiting}</p>
          <p class="text-xs text-gray-600">${m.town ?? ""}</p>
        </div>
      `;
      marker.bindTooltip(tooltipHtml, {
        direction: "top",
        offset: [0, -10],
        className: "custom-tooltip",
        permanent: false,
      });
      marker.on("click", () => setSelected(m));
      markers.addLayer(marker);
    });
    markers.addTo(map);
    clusterRef.current = markers;

    // Fit bounds
    try {
      const bounds = markers.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.25));
      else map.setView([27.35, 88.45], 9);
    } catch {
      map.setView([27.35, 88.45], 9);
    }

    // Geocoder
    const geocoder = (L.Control as any)
      .geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", (e: any) => map.fitBounds(e.geocode.bbox))
      .addTo(map);
    geocoderRef.current = geocoder;

    // GPX export control
    const ExportControl = (L.Control as any).extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-bar p-2 bg-white rounded shadow cursor-pointer"
        );
        div.innerHTML = "⬇ GPX";
        div.onclick = () => {
          const gpx =
            `<?xml version="1.0"?>` +
            `<gpx version="1.1" creator="Monastery360">` +
            `<trk><name>Monastery Route</name><trkseg>` +
            monasteries
              .map(
                (m) =>
                  `<trkpt lat="${m.coordinates[0]}" lon="${m.coordinates[1]}"></trkpt>`
              )
              .join("\n") +
            `</trkseg></trk></gpx>`;
          const blob = new Blob([gpx], { type: "application/gpx+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "monasteries.gpx";
          a.click();
          URL.revokeObjectURL(url);
        };
        return div;
      },
    });
    const exportButton = new ExportControl({ position: "topright" });
    exportButton.addTo(map);

    // Cleanup on unmount
    return () => {
      try {
        if (geocoderRef.current) map.removeControl(geocoderRef.current);
      } catch {}
      geocoderRef.current = null;

      try {
        if (clusterRef.current) map.removeLayer(clusterRef.current);
      } catch {}
      clusterRef.current = null;

      try {
        map.remove();
      } catch {}
      mapRef.current = null;
    };
  }, [mounted]);

  return (
    <div className="relative w-full rounded-2xl shadow-lg overflow-hidden" style={{ height }}>
      {/* Map container div */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Floating card for selected monastery */}
      {selected && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm border-0 shadow-xl z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl w-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {selected.img && (
              <img
                src={selected.img}
                alt={selected.name}
                className="rounded-lg w-full md:w-1/2 h-auto object-contain"
              />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {selected.town}
                  </p>
                  <p className="text-muted-foreground mb-1">{selected.desc}</p>
                  <p className="text-sm font-medium">{selected.visiting}</p>

                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    More Info
                  </a>

                  <Link
                    href="/travel"
                    className="inline-block mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Travel Page
                  </Link>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Badge className="mt-3">{selected.coordinates.join(", ")}</Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
