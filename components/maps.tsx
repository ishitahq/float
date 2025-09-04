"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MapPin, Layers, Search, Filter, Globe, Waves, Thermometer, Droplets, Activity, Zap } from "lucide-react"

interface FloatData {
  id: string
  lat: number
  lng: number
  status: "active" | "inactive" | "maintenance"
  lastProfile: string
  depth: string
  temperature?: number
  salinity?: number
}

const mockFloats: FloatData[] = [
  {
    id: "4902345",
    lat: 25.1,
    lng: -157.5,
    status: "active",
    lastProfile: "2h ago",
    depth: "2000m",
    temperature: 18.5,
    salinity: 35.2,
  },
  {
    id: "4902346",
    lat: 25.7,
    lng: -158.1,
    status: "active",
    lastProfile: "4h ago",
    depth: "1500m",
    temperature: 19.2,
    salinity: 35.1,
  },
  {
    id: "4902347",
    lat: 24.9,
    lng: -157.3,
    status: "maintenance",
    lastProfile: "6h ago",
    depth: "1800m",
    temperature: 17.8,
    salinity: 35.3,
  },
  {
    id: "4902348",
    lat: 26.2,
    lng: -156.8,
    status: "active",
    lastProfile: "1h ago",
    depth: "2200m",
    temperature: 16.9,
    salinity: 35.4,
  },
]

interface LayerControlProps {
  layers: { [key: string]: boolean }
  onLayerToggle: (layer: string) => void
}

function LayerControl({ layers, onLayerToggle }: LayerControlProps) {
  return (
    <Card className="bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(layers).map(([layer, enabled]) => (
          <div key={layer} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {layer === "floats" && <MapPin className="h-3 w-3 text-primary" />}
              {layer === "trajectories" && <Activity className="h-3 w-3 text-accent" />}
              {layer === "temperature" && <Thermometer className="h-3 w-3 text-red-500" />}
              {layer === "salinity" && <Droplets className="h-3 w-3 text-blue-500" />}
              {layer === "bathymetry" && <Waves className="h-3 w-3 text-teal-500" />}
              <span className="text-sm capitalize">{layer}</span>
            </div>
            <Switch checked={enabled} onCheckedChange={() => onLayerToggle(layer)} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function Maps() {
  const [selectedFloat, setSelectedFloat] = useState<FloatData | null>(mockFloats[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [layers, setLayers] = useState({
    floats: true,
    trajectories: false,
    temperature: false,
    salinity: false,
    bathymetry: true,
  })
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [visibleFloats, setVisibleFloats] = useState(156)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleLayerToggle = (layer: string) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  const filteredFloats = mockFloats.filter((float) => float.id.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full p-6 bg-background/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARGO Float Map</h1>
          <p className="text-muted-foreground">Interactive map showing global ARGO float positions and trajectories</p>
        </div>

        <div className="flex gap-4 mb-6 animate-in slide-in-from-top duration-700 delay-200">
          <Button variant="outline" size="sm" className="gap-2 bg-card/80 backdrop-blur-sm">
            <Layers className="h-4 w-4" />
            Layers ({Object.values(layers).filter(Boolean).length})
          </Button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search floats by ID or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/80 backdrop-blur-sm"
              />
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-card/80 backdrop-blur-sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-full bg-card/80 backdrop-blur-sm animate-in slide-in-from-left duration-700 delay-300">
              <CardContent className="p-6 h-full">
                <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 relative overflow-hidden">
                  {!isMapLoaded ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Loading OpenStreetMap</h3>
                      <p className="text-muted-foreground">Initializing interactive map interface...</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Simulated map background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20" />

                      {/* Grid overlay to simulate map tiles */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="border border-muted-foreground/20" />
                          ))}
                        </div>
                      </div>

                      {/* Simulated float markers */}
                      {layers.floats &&
                        mockFloats.map((float, index) => (
                          <div
                            key={float.id}
                            className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 animate-in zoom-in duration-500 ${
                              float.status === "active"
                                ? "bg-green-500 animate-pulse"
                                : float.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            } ${selectedFloat?.id === float.id ? "ring-4 ring-primary/50 scale-125" : ""}`}
                            style={{
                              left: `${20 + index * 15}%`,
                              top: `${30 + index * 10}%`,
                              animationDelay: `${index * 200}ms`,
                            }}
                            onClick={() => setSelectedFloat(float)}
                          />
                        ))}

                      {/* Simulated trajectories */}
                      {layers.trajectories && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <path
                            d="M 20% 30% Q 35% 20% 50% 40% T 80% 60%"
                            stroke="hsl(var(--accent))"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="5,5"
                            className="animate-pulse"
                          />
                        </svg>
                      )}

                      {/* Map integration placeholder */}
                      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="font-medium">OpenStreetMap Integration</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Interactive map with real-time data will be embedded here
                        </p>
                      </div>

                      {/* Zoom controls */}
                      <div className="absolute top-4 right-4 flex flex-col gap-1">
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-card/90 backdrop-blur-sm">
                          +
                        </Button>
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-card/90 backdrop-blur-sm">
                          -
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-400">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Float Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Floats</span>
                  <Badge variant="secondary" className="animate-pulse">
                    3,847
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">In View</span>
                  <Badge variant="outline">{visibleFloats}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recent Profiles</span>
                  <Badge variant="outline">42</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data Quality</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">98.7%</Badge>
                </div>
              </CardContent>
            </Card>

            <LayerControl layers={layers} onLayerToggle={handleLayerToggle} />

            {selectedFloat && (
              <Card className="bg-card/80 backdrop-blur-sm animate-in slide-in-from-bottom duration-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Selected Float
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Float ID</p>
                    <p className="font-semibold">{selectedFloat.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-semibold">
                      {selectedFloat.lat.toFixed(1)}°N, {Math.abs(selectedFloat.lng).toFixed(1)}°W
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={
                        selectedFloat.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : selectedFloat.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }
                    >
                      {selectedFloat.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Profile</p>
                    <p className="font-semibold">{selectedFloat.lastProfile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Depth</p>
                    <p className="font-semibold">{selectedFloat.depth}</p>
                  </div>
                  {selectedFloat.temperature && (
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{selectedFloat.temperature}°C</p>
                    </div>
                  )}
                  {selectedFloat.salinity && (
                    <div>
                      <p className="text-sm text-muted-foreground">Salinity</p>
                      <p className="font-semibold">{selectedFloat.salinity} PSU</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Map Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">OpenStreetMap</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Full interactive map with real-time ARGO data will be integrated here
                  </p>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Configure Map Integration
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Real-time float positions</p>
                  <p>• Historical trajectories</p>
                  <p>• Temperature/Salinity overlays</p>
                  <p>• Bathymetry data layers</p>
                  <p>• Custom zoom and pan controls</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
