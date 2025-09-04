
"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Activity, Globe } from "lucide-react"
import dynamic from "next/dynamic"
import L from "leaflet"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

// Interface for map view coordinates
interface MapView {
  center: [number, number]
  zoom: number
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

export function Maps() {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [currentMapView, setCurrentMapView] = useState<MapView>({
    center: [-27.6057, 78.8352], // Updated coordinates
    zoom: 3
  })
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Function to handle map view changes (zoom, pan)
  const handleMapViewChange = (map: any) => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    const bounds = map.getBounds()
    
    const newView: MapView = {
      center: [center.lat, center.lng],
      zoom: zoom,
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      }
    }
    
    setCurrentMapView(newView)
    console.log('Current map view:', newView) // For debugging - this will be used by chatbot
  }

  // Function to handle map clicks
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng
    const coordinates: [number, number] = [lat, lng]
    setClickedCoordinates(coordinates)
    console.log('Clicked coordinates:', coordinates) // For debugging - this will be used by chatbot
  }

  return (
    <div className="h-screen overflow-hidden p-6 bg-background/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-in slide-in-from-top duration-500 flex-shrink-0">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARGO Float Map</h1>
          <p className="text-muted-foreground">Interactive map for exploring oceanographic data in the Indian Ocean</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2">
            <Card className="h-full bg-card/80 backdrop-blur-sm animate-in slide-in-from-left duration-700 delay-300">
              <CardContent className="p-4 h-full">
                <div className="h-full bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 relative overflow-hidden">
                  {!isMapLoaded ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Loading OpenStreetMap</h3>
                        <p className="text-muted-foreground">Initializing interactive map interface...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full">
                      <MapContainer
                        {...({
                          center: currentMapView.center,
                          zoom: currentMapView.zoom,
                          style: { height: "100%", width: "100%" },
                          zoomControl: false,
                          whenReady: (map: any) => {
                            const leafletMap = map.target
                            leafletMap.on('moveend', () => handleMapViewChange(leafletMap))
                            leafletMap.on('zoomend', () => handleMapViewChange(leafletMap))
                            leafletMap.on('click', handleMapClick)
                          }
                        } as any)}
                      >
                        <TileLayer
                          {...({
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          } as any)}
                        />
                        <ZoomControl position="topright" />
                      </MapContainer>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-400 overflow-y-auto max-h-full">
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
                  <span className="text-sm text-muted-foreground">Recent Profiles</span>
                  <Badge variant="outline">42</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data Quality</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">98.7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Coverage Area</span>
                  <Badge variant="outline">Indian Ocean</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Current View
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Center Coordinates</p>
                  <p className="font-semibold text-sm">
                    {currentMapView.center[0].toFixed(4)}°, {currentMapView.center[1].toFixed(4)}°
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zoom Level</p>
                  <p className="font-semibold text-sm">{currentMapView.zoom}</p>
                </div>
                {currentMapView.bounds && (
                  <div>
                    <p className="text-sm text-muted-foreground">View Bounds</p>
                    <div className="text-xs space-y-1">
                      <p>North: {currentMapView.bounds.north.toFixed(2)}°</p>
                      <p>South: {currentMapView.bounds.south.toFixed(2)}°</p>
                      <p>East: {currentMapView.bounds.east.toFixed(2)}°</p>
                      <p>West: {currentMapView.bounds.west.toFixed(2)}°</p>
                    </div>
                  </div>
                )}
                {clickedCoordinates && (
                  <div>
                    <p className="text-sm text-muted-foreground">Clicked Point</p>
                    <p className="font-semibold text-sm">
                      {clickedCoordinates[0].toFixed(4)}°, {clickedCoordinates[1].toFixed(4)}°
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground">
                    Click anywhere on the map to get coordinates for chatbot integration
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
