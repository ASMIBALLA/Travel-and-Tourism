"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Download, Calendar, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Festival {
  id: number;
  name: string;
  startDate: string;  // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  location: string;
  type: "religious" | "cultural" | "music";
  description: string;
  img?: string;
}

// ----------------- Hardcoded seed -----------------
const seedFestivals: Festival[] = [
  { id: 1, name: "Losar Festival", startDate: "2025-02-08", endDate: "2025-02-10", location: "Gangtok", description: "Tibetan New Year celebrated with prayer dances and local feasts.", type: "religious", img: "/tibetan-new-year-celebration-with-colorful-prayer-.jpg" },
  { id: 2, name: "Sikkim International Flower Festival", startDate: "2025-03-10", endDate: "2025-03-15", location: "Gangtok", description: "Showcases Sikkim's rich biodiversity, floriculture and cultural programs.", type: "cultural", img: "/beautiful-flower-festival-with-rhododendrons-and-o.jpg" },
  { id: 3, name: "Pang Lhabsol", startDate: "2025-09-15", location: "Pelling", description: "Honoring Mount Kanchenjunga with rituals and mask dances.", type: "religious", img: "/traditional-mask-dance-ceremony-in-mountains.jpg" },
  { id: 4, name: "Sikkim Music Festival", startDate: "2025-06-20", endDate: "2025-06-22", location: "Gangtok", description: "Celebration of local and international music performances.", type: "music", img: "/music-festival-stage-with-mountain-backdrop.jpg" },
  { id: 5, name: "Bumchu Festival", startDate: "2025-01-15", location: "Tashiding", description: "Sacred water ceremony at Tashiding Monastery.", type: "religious", img: "/sacred-water-ceremony-at-buddhist-monastery.jpg" },
  { id: 6, name: "Saga Dawa", startDate: "2025-05-12", endDate: "2025-05-14", location: "Gangtok", description: "Celebrates Buddha's birth, enlightenment, and death.", type: "religious", img: "/buddhist-celebration-with-prayer-wheels-and-monks.jpg" },
  { id: 7, name: "Teej Festival", startDate: "2025-08-20", location: "Namchi", description: "Hindu festival celebrating the monsoon season.", type: "cultural", img: "/hindu-festival-celebration-with-traditional-dances.jpg" },
  { id: 8, name: "Drupka Teshi", startDate: "2025-07-28", location: "Rumtek", description: "Celebrates Buddha's first sermon.", type: "religious", img: "/buddhist-monastery-celebration-with-prayer-flags.jpg" },
];

// ----------------- UI helpers -----------------
const typeColors = {
  religious: "bg-red-500",
  cultural: "bg-green-500",
  music: "bg-blue-500",
} as const;

const typeLabels = {
  religious: "religious",
  cultural: "cultural",
  music: "music",
} as const;

const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December",
];

// change this if your file is inside /public/data/
const XLSX_PATH = "/sikkim_festivals_full.xlsx";

// Convert Excel serial or string to YYYY-MM-DD
function toISODate(value: unknown): string | undefined {
  if (value == null) return undefined;

  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return undefined;
    // take first token before space, normalize slashes
    const token = s.split(/[ T]/)[0].replace(/\./g, "-").replace(/\//g, "-");
    // If already YYYY-MM-DD
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(token)) {
      const [y, m, d] = token.split("-").map((n) => parseInt(n, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return `${y.toString().padStart(4,"0")}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
      }
    }
    // Try Date parsing fallback
    const dt = new Date(token);
    if (!isNaN(dt.getTime())) {
      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      return `${y.toString().padStart(4,"0")}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
    }
    return undefined;
  }

  if (typeof value === "number") {
    // Excel serial date: days since 1899-12-30 (SheetJS convention)
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millis = value * 24 * 60 * 60 * 1000;
    const dt = new Date(excelEpoch.getTime() + millis);
    if (!isNaN(dt.getTime())) {
      const y = dt.getUTCFullYear();
      const m = dt.getUTCMonth() + 1;
      const d = dt.getUTCDate();
      return `${y.toString().padStart(4,"0")}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
    }
  }

  return undefined;
}

// Normalize “type” strings to limited set
function normalizeType(v: unknown): Festival["type"] {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("music")) return "music";
  if (s.includes("relig")) return "religious";
  if (s.includes("cultur")) return "cultural";
  // default bucket
  return "cultural";
}

export function FestivalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [dynamicFestivals, setDynamicFestivals] = useState<Festival[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const today = new Date();

  // ---------- Load from /public XLSX (robust, client-only) ----------
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        // dynamic import ensures purely client-side bundling
        const XLSX = await import("xlsx");

        const res = await fetch(XLSX_PATH, { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${XLSX_PATH}`);

        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error("No worksheet found in XLSX");

        // defval keeps empty cells as "", raw: false makes dates strings where possible
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });

        const parsed: Festival[] = rows
          .map((r, idx) => {
            // tolerant header access
            const id = Number(r.id ?? r.ID ?? r.Id ?? idx + 1000);
            const name = String(r.name ?? r.Name ?? r.title ?? "").trim();
            const location = String(r.location ?? r.Location ?? r.Place ?? "").trim();
            const description = String(r.description ?? r.Description ?? r.Desc ?? "").trim();
            const img = String(r.img ?? r.Img ?? r.image ?? r.Image ?? "").trim() || undefined;

            const startRaw = r.startDate ?? r.StartDate ?? r.start_date ?? r.Start ?? r.Date ?? r.date;
            const endRaw = r.endDate ?? r.EndDate ?? r.end_date ?? r.End ?? r.Until ?? r.until;

            const startDate = toISODate(startRaw);
            const endDate = toISODate(endRaw) || startDate;

            if (!name || !startDate || !location) return null;

            const typeValue = normalizeType(r.type ?? r.Type ?? r.category ?? r.Category);

            return {
              id,
              name,
              startDate,
              endDate,
              location,
              type: typeValue,
              description,
              img,
            } as Festival;
          })
          .filter(Boolean) as Festival[];

        if (!aborted) {
          setDynamicFestivals(parsed);
          setLoadError(null);
        }
      } catch (e: any) {
        if (!aborted) {
          console.error("XLSX load error:", e);
          setLoadError(e?.message || "Failed to load festivals from Excel.");
          setDynamicFestivals([]); // keep only seed
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  // Merge seed + dynamic (dedupe by id, prefer dynamic)
  const allFestivals = useMemo(() => {
    const map = new Map<number, Festival>();
    for (const f of seedFestivals) map.set(f.id, f);
    for (const f of dynamicFestivals) map.set(f.id, f);
    return Array.from(map.values()).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [dynamicFestivals]);

  // Filters
  const filteredFestivals = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allFestivals.filter((festival) => {
      const matchesSearch =
        festival.name.toLowerCase().includes(q) ||
        festival.location.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || festival.type === (typeFilter as any);
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter, allFestivals]);

  // Helpers
  const getFestivalsForDate = (date: Date) =>
    filteredFestivals.filter((f) => {
      const s = new Date(f.startDate);
      const e = new Date(f.endDate ?? f.startDate);
      // compare dates at midnight to avoid TZ drift
      const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const s0 = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const e0 = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
      return d0 >= s0 && d0 <= e0;
    });

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days: Date[] = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const navigateMonth = (direction: number) =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + direction);
      return d;
    });

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();
  const isCurrentMonth = (d: Date) => d.getMonth() === currentDate.getMonth();

  // Export ICS
  const exportToICS = () => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sikkim Tourism//Festival Calendar//EN",
    ];
    for (const f of filteredFestivals) {
      const dtStart = f.startDate.replace(/-/g, "");
      const dtEnd = (f.endDate ?? f.startDate).replace(/-/g, "");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${f.id}@sikkimtourism.com`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${f.name}`,
        `DESCRIPTION:${f.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${f.location}`,
        "END:VEVENT"
      );
    }
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sikkim-festivals.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ----------------- UI -----------------
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4">Festival Calendar</h2>
        <p className="text-xl text-muted-foreground">
          Discover Sikkim&apos;s vibrant cultural celebrations throughout the year
        </p>
        {loadError && (
          <p className="mt-3 text-sm text-red-600">
            {loadError} (Make sure the file exists at <code>{XLSX_PATH}</code>.)
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search festivals or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2">
          <Button variant={typeFilter === "all" ? "default" : "outline"} onClick={() => setTypeFilter("all")} size="sm">
            All
          </Button>
          {Object.entries(typeLabels).map(([type, label]) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              onClick={() => setTypeFilter(type)}
              size="sm"
              className="flex items-center gap-2"
            >
              <div className={cn("w-3 h-3 rounded-full", typeColors[type as keyof typeof typeColors])} />
              {label}
            </Button>
          ))}
        </div>

        {/* Export */}
        <Button onClick={exportToICS} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Calendar */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((date, index) => {
              const dayFestivals = getFestivalsForDate(date);
              const inMonth = isCurrentMonth(date);
              const today = isToday(date);

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "relative p-2 min-h-[80px] border rounded-lg cursor-pointer transition-all",
                    inMonth ? "bg-background" : "bg-muted/30",
                    today && "ring-2 ring-primary",
                    dayFestivals.length > 0 && "hover:shadow-md",
                  )}
                  whileHover={{ scale: dayFestivals.length > 0 ? 1.02 : 1 }}
                  onClick={() => {
                    if (dayFestivals.length > 0) {
                      setSelectedDate(date);
                      setSelectedFestival(dayFestivals[0]);
                    }
                  }}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      inMonth ? "text-foreground" : "text-muted-foreground",
                      today && "text-primary font-bold",
                    )}
                  >
                    {date.getDate()}
                  </div>

                  {/* Indicators */}
                  {dayFestivals.length > 0 && (
                    <div className="space-y-1">
                      {dayFestivals.slice(0, 2).map((festival) => (
                        <div key={festival.id} className={cn("h-1 rounded-full", typeColors[festival.type])} />
                      ))}
                      {dayFestivals.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayFestivals.length - 2} more</div>
                      )}
                    </div>
                  )}

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredDate?.toDateString() === date.toDateString() && dayFestivals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover border rounded-lg shadow-lg min-w-[200px]"
                      >
                        <div className="text-sm font-medium mb-1">
                          {dayFestivals.length} festival{dayFestivals.length > 1 ? "s" : ""}
                        </div>
                        {dayFestivals.map((festival) => (
                          <div key={festival.id} className="text-xs text-muted-foreground">
                            {festival.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFestival(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedFestival.img && (
                  <img
                    src={selectedFestival.img || "/placeholder.svg"}
                    alt={selectedFestival.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40"
                  onClick={() => setSelectedFestival(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedFestival.name}</h3>
                  <Badge className={cn("text-white", typeColors[selectedFestival.type])}>
                    {typeLabels[selectedFestival.type]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedFestival.startDate).toLocaleDateString()}
                      {selectedFestival.endDate && ` - ${new Date(selectedFestival.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedFestival.location}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{selectedFestival.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Festival Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(typeLabels).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded-full", typeColors[type as keyof typeof typeColors])} />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
