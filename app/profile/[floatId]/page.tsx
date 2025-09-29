"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Info } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

type ProfileRow = { depth: number; temperature: number; salinity: number }

export default function DepthProfilePage() {
  const router = useRouter()
  const params = useParams<{ floatId: string }>()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<string>(searchParams?.get("date") || new Date().toISOString().split("T")[0])
  const [data, setData] = useState<ProfileRow[]>([])
  const [maxDepth, setMaxDepth] = useState<number>(2000)
  const [metric, setMetric] = useState<'temperature' | 'salinity'>('temperature')

  const floatId = decodeURIComponent(params.floatId)

  const floatTemperature = 8
  const floatSalinity = 35

  const generateProfile = (targetDepth: number) => {
    const seedBase = Array.from(`${floatId}-${date}`).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    const random = (i: number) => {
      const x = Math.sin(seedBase + i * 31.7) * 10000
      return x - Math.floor(x)
    }
    const step = Math.max(5, Math.floor(targetDepth / 400))
    const rows: ProfileRow[] = []
    for (let d = 0; d <= targetDepth; d += step) {
      const rt = random(d)
      const rs = random(d + 7)
      const temperature = Math.max(0, floatTemperature + 12 * Math.exp(-d / 200) - rt * 1.5)
      const salinity = floatSalinity + 0.8 * (1 - Math.exp(-d / 800)) + (rs - 0.5) * 0.2
      rows.push({ depth: d, temperature: Number(temperature.toFixed(2)), salinity: Number(salinity.toFixed(2)) })
    }
    return rows
  }

  useEffect(() => {
    setData(generateProfile(maxDepth))
  }, [floatId, date, maxDepth])

  const trackRef = useRef<HTMLDivElement | null>(null)
  const indicatorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = trackRef.current
    const indicator = indicatorRef.current
    if (!el || !indicator) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalScrollable = rect.height - viewportHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable)
      const progress = totalScrollable > 0 ? scrolled / totalScrollable : 0
      const translateY = progress * (rect.height - 40)
      indicator.style.transform = `translateY(${translateY}px)`
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleApply = () => {
    setData(generateProfile(maxDepth))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/70 border-b p-3 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">Float {floatId} Depth Profile</div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Metric</label>
          <Select value={metric} onValueChange={(v) => setMetric(v as 'temperature' | 'salinity')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="salinity">Salinity</SelectItem>
            </SelectContent>
          </Select>
          <label className="text-sm text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
          <label className="text-sm text-muted-foreground ml-3">Max depth (m)</label>
          <Input type="number" value={maxDepth} onChange={(e) => setMaxDepth(Math.max(100, Number(e.target.value) || 100))} className="w-28" />
          <Button size="sm" onClick={handleApply}>Apply</Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Info className="h-4 w-4" /> How to read this</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>These plots show how measurements change with depth. Depth increases downward.</p>
                <p><span className="text-primary font-medium">Blue line</span>: Temperature (°C) vs depth (m). Oceans are warmer near the surface and cool with depth.</p>
                <p><span className="text-green-600 dark:text-green-400 font-medium">Green line</span>: Salinity (PSU) vs depth (m). Salinity tends to increase slightly with depth.</p>
                <p>Scroll to move deeper. The animated float indicates the approximate depth level matching your scroll.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-sm">Annotations</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-muted-foreground">
                <p><b>Surface mixed layer</b>: Top ~50–200 m with small temperature change.</p>
                <p><b>Thermocline</b>: Rapid temperature drop typically between 200–1000 m.</p>
                <p><b>Deep layer</b>: Below ~1000 m, temperature changes slowly.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div ref={trackRef} className="relative">
              <div ref={indicatorRef} className="absolute left-[-40px] top-0 w-30 h-150 transition-transform duration-75">
                <svg width="40" height="40" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13" y="2" width="2" height="6" rx="1" fill="#06b6d4" />
                  <circle cx="14" cy="1.5" r="1" fill="#06b6d4" />
                  <path d="M9,8 C9,6 11,5 14,5 C17,5 19,6 19,8 L19,18 C19,21 17,23 14,23 C11,23 9,21 9,18 Z" fill="#06b6d4" stroke="white" stroke-width="1" />
                  <path d="M16.5,6.5 L16.5,20.5" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
                </svg>
              </div>

              <Card className="bg-card/80 mb-6">
                <CardHeader>
                  <CardTitle className="text-sm">{metric === 'temperature' ? 'Temperature vs Depth' : 'Salinity vs Depth'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[2000px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={metric} type="number" unit={metric === 'temperature' ? '°C' : ' PSU'} tick={{ fontSize: 12 }} />
                        <YAxis dataKey="depth" type="number" reversed tick={{ fontSize: 12 }} unit=" m" />
                        <Line type="monotone" dataKey="depth" stroke={metric === 'temperature' ? '#2563eb' : '#16a34a'} strokeWidth={2} dot={false} xAxisId={0} yAxisId={0} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}