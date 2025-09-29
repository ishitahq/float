
"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Activity, Globe, MapPin, Eye, EyeOff, Filter, Settings } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })
// Note: Tooltip component will be imported directly in the component

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

// Interface for float data
interface FloatData {
  id: string
  name: string
  position: [number, number]
  status: 'active' | 'inactive'
  lastUpdate: string
  depth: number
  temperature: number
  salinity: number
  trajectory: [number, number][]
  deploymentDate: string
}

// Interface for trajectory time range
type TrajectoryTimeRange = '1year' | '5years' | 'all'

// Dummy float data with realistic Indian Ocean positions
const dummyFloats: FloatData[] = [
  {
    id: 'float-4902345',
    name: 'ARGO-4902345',
    position: [-4.5655, 78.2224],
    status: 'active',
    lastUpdate: '2024-01-15T10:30:00Z',
    depth: 2000,
    temperature: 4.2,
    salinity: 34.8,
    trajectory: [
      [-4.5655, 78.2224], [-4.8, 78.8], [-5.2, 79.2], [-5.6, 79.5], [-6.0, 79.8],
      [-6.4, 80.1], [-6.8, 80.3], [-7.2, 80.5], [-7.6, 80.7], [-8.0, 80.8],
      [-8.4, 80.9], [-8.8, 81.0], [-9.2, 81.1], [-9.6, 81.2], [-10.0, 81.3],
      [-10.4, 81.4], [-10.8, 81.5], [-11.2, 81.6], [-11.6, 81.7], [-12.0, 81.8],
      [-12.4, 81.9], [-12.8, 82.0], [-13.2, 82.1], [-13.6, 82.2], [-14.0, 82.3],
      [-14.4, 82.4], [-14.8, 82.5], [-15.2, 82.6], [-15.6, 82.7], [-16.0, 82.8],
      [-16.4, 82.9], [-16.8, 83.0], [-17.2, 83.1], [-17.6, 83.2], [-18.0, 83.3],
      [-18.4, 83.4], [-18.8, 83.5], [-19.2, 83.6], [-19.6, 83.7], [-20.0, 83.8],
      [-20.4, 83.9], [-20.8, 84.0], [-21.2, 84.1], [-21.6, 84.2], [-22.0, 84.3],
      [-22.4, 84.4], [-22.8, 84.5], [-23.2, 84.6], [-23.6, 84.7], [-24.0, 84.8]
    ],
    deploymentDate: '2020-03-15'
  },
  {
    id: 'float-4902346',
    name: 'ARGO-4902346',
    position: [-8.1234, 85.6789],
    status: 'active',
    lastUpdate: '2024-01-14T15:45:00Z',
    depth: 1500,
    temperature: 6.8,
    salinity: 35.2,
    trajectory: [
      [-8.1234, 85.6789], [-8.5, 85.2], [-8.8, 84.7], [-9.1, 84.2], [-9.4, 83.7],
      [-9.7, 83.2], [-10.0, 82.7], [-10.3, 82.2], [-10.6, 81.7], [-10.9, 81.2],
      [-11.2, 80.7], [-11.5, 80.2], [-11.8, 79.7], [-12.1, 79.2], [-12.4, 78.7],
      [-12.7, 78.2], [-13.0, 77.7], [-13.3, 77.2], [-13.6, 76.7], [-13.9, 76.2],
      [-14.2, 75.7], [-14.5, 75.2], [-14.8, 74.7], [-15.1, 74.2], [-15.4, 73.7],
      [-15.7, 73.2], [-16.0, 72.7], [-16.3, 72.2], [-16.6, 71.7], [-16.9, 71.2],
      [-17.2, 70.7], [-17.5, 70.2], [-17.8, 69.7], [-18.1, 69.2], [-18.4, 68.7],
      [-18.7, 68.2], [-19.0, 67.7], [-19.3, 67.2], [-19.6, 66.7], [-19.9, 66.2],
      [-20.2, 65.7], [-20.5, 65.2], [-20.8, 64.7], [-21.1, 64.2], [-21.4, 63.7],
      [-21.7, 63.2], [-22.0, 62.7], [-22.3, 62.2], [-22.6, 61.7], [-22.9, 61.2]
    ],
    deploymentDate: '2019-11-20'
  },
  {
    id: 'float-4902347',
    name: 'ARGO-4902347',
    position: [-12.3456, 72.9876],
    status: 'inactive',
    lastUpdate: '2023-12-20T08:15:00Z',
    depth: 1000,
    temperature: 8.5,
    salinity: 34.5,
    trajectory: [
      [-12.3456, 72.9876], [-12.8, 73.2], [-13.2, 73.5], [-13.6, 73.8], [-14.0, 74.1],
      [-14.4, 74.4], [-14.8, 74.7], [-15.2, 75.0], [-15.6, 75.3], [-16.0, 75.6],
      [-16.4, 75.9], [-16.8, 76.2], [-17.2, 76.5], [-17.6, 76.8], [-18.0, 77.1],
      [-18.4, 77.4], [-18.8, 77.7], [-19.2, 78.0], [-19.6, 78.3], [-20.0, 78.6],
      [-20.4, 78.9], [-20.8, 79.2], [-21.2, 79.5], [-21.6, 79.8], [-22.0, 80.1],
      [-22.4, 80.4], [-22.8, 80.7], [-23.2, 81.0], [-23.6, 81.3], [-24.0, 81.6],
      [-24.4, 81.9], [-24.8, 82.2], [-25.2, 82.5], [-25.6, 82.8], [-26.0, 83.1],
      [-26.4, 83.4], [-26.8, 83.7], [-27.2, 84.0], [-27.6, 84.3], [-28.0, 84.6],
      [-28.4, 84.9], [-28.8, 85.2], [-29.2, 85.5], [-29.6, 85.8], [-30.0, 86.1],
      [-30.4, 86.4], [-30.8, 86.7], [-31.2, 87.0], [-31.6, 87.3], [-32.0, 87.6]
    ],
    deploymentDate: '2021-06-10'
  },
  {
    id: 'float-4902348',
    name: 'ARGO-4902348',
    position: [-6.7890, 95.4321],
    status: 'inactive',
    lastUpdate: '2024-01-10T12:20:00Z',
    depth: 2500,
    temperature: 3.1,
    salinity: 35.0,
    trajectory: [
      [-6.7890, 95.4321], [-7.2, 95.8], [-7.6, 96.2], [-8.0, 96.6], [-8.4, 97.0],
      [-8.8, 97.4], [-9.2, 97.8], [-9.6, 98.2], [-10.0, 98.6], [-10.4, 99.0],
      [-10.8, 99.4], [-11.2, 99.8], [-11.6, 100.2], [-12.0, 100.6], [-12.4, 101.0],
      [-12.8, 101.4], [-13.2, 101.8], [-13.6, 102.2], [-14.0, 102.6], [-14.4, 103.0],
      [-14.8, 103.4], [-15.2, 103.8], [-15.6, 104.2], [-16.0, 104.6], [-16.4, 105.0],
      [-16.8, 105.4], [-17.2, 105.8], [-17.6, 106.2], [-18.0, 106.6], [-18.4, 107.0],
      [-18.8, 107.4], [-19.2, 107.8], [-19.6, 108.2], [-20.0, 108.6], [-20.4, 109.0],
      [-20.8, 109.4], [-21.2, 109.8], [-21.6, 110.2], [-22.0, 110.6], [-22.4, 111.0],
      [-22.8, 111.4], [-23.2, 111.8], [-23.6, 112.2], [-24.0, 112.6], [-24.4, 113.0],
      [-24.8, 113.4], [-25.2, 113.8], [-25.6, 114.2], [-26.0, 114.6], [-26.4, 115.0]
    ],
    deploymentDate: '2018-09-05'
  },
  {
    id: 'float-4902349',
    name: 'ARGO-4902349',
    position: [-15.6789, 88.1234],
    status: 'active',
    lastUpdate: '2024-01-16T06:45:00Z',
    depth: 1800,
    temperature: 5.7,
    salinity: 34.9,
    trajectory: [
      [-15.6789, 88.1234], [-16.0, 88.4], [-16.3, 88.7], [-16.6, 89.0], [-16.9, 89.3],
      [-17.2, 89.6], [-17.5, 89.9], [-17.8, 90.2], [-18.1, 90.5], [-18.4, 90.8],
      [-18.7, 91.1], [-19.0, 91.4], [-19.3, 91.7], [-19.6, 92.0], [-19.9, 92.3],
      [-20.2, 92.6], [-20.5, 92.9], [-20.8, 93.2], [-21.1, 93.5], [-21.4, 93.8],
      [-21.7, 94.1], [-22.0, 94.4], [-22.3, 94.7], [-22.6, 95.0], [-22.9, 95.3],
      [-23.2, 95.6], [-23.5, 95.9], [-23.8, 96.2], [-24.1, 96.5], [-24.4, 96.8],
      [-24.7, 97.1], [-25.0, 97.4], [-25.3, 97.7], [-25.6, 98.0], [-25.9, 98.3],
      [-26.2, 98.6], [-26.5, 98.9], [-26.8, 99.2], [-27.1, 99.5], [-27.4, 99.8],
      [-27.7, 100.1], [-28.0, 100.4], [-28.3, 100.7], [-28.6, 101.0], [-28.9, 101.3],
      [-29.2, 101.6], [-29.5, 101.9], [-29.8, 102.2], [-30.1, 102.5], [-30.4, 102.8]
    ],
    deploymentDate: '2022-01-25'
  },
  {
    id: 'float-4902350',
    name: 'ARGO-4902350',
    position: [-2.4567, 65.7890],
    status: 'active',
    lastUpdate: '2024-01-15T14:30:00Z',
    depth: 1200,
    temperature: 7.3,
    salinity: 35.1,
    trajectory: [
      [-2.4567, 65.7890], [-2.8, 66.1], [-3.1, 66.4], [-3.4, 66.7], [-3.7, 67.0],
      [-4.0, 67.3], [-4.3, 67.6], [-4.6, 67.9], [-4.9, 68.2], [-5.2, 68.5],
      [-5.5, 68.8], [-5.8, 69.1], [-6.1, 69.4], [-6.4, 69.7], [-6.7, 70.0],
      [-7.0, 70.3], [-7.3, 70.6], [-7.6, 70.9], [-7.9, 71.2], [-8.2, 71.5],
      [-8.5, 71.8], [-8.8, 72.1], [-9.1, 72.4], [-9.4, 72.7], [-9.7, 73.0],
      [-10.0, 73.3], [-10.3, 73.6], [-10.6, 73.9], [-10.9, 74.2], [-11.2, 74.5],
      [-11.5, 74.8], [-11.8, 75.1], [-12.1, 75.4], [-12.4, 75.7], [-12.7, 76.0],
      [-13.0, 76.3], [-13.3, 76.6], [-13.6, 76.9], [-13.9, 77.2], [-14.2, 77.5],
      [-14.5, 77.8], [-14.8, 78.1], [-15.1, 78.4], [-15.4, 78.7], [-15.7, 79.0],
      [-16.0, 79.3], [-16.3, 79.6], [-16.6, 79.9], [-16.9, 80.2], [-17.2, 80.5]
    ],
    deploymentDate: '2023-04-12'
  }
]

export function Maps() {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentMapView, setCurrentMapView] = useState<MapView>({
    center: [-3.3362, 78.3926], 
    zoom: 3
  })
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null)
  const [selectedFloat, setSelectedFloat] = useState<FloatData | null>(null)
  const [showTrajectories, setShowTrajectories] = useState(true)
  const [showFloats, setShowFloats] = useState(true)
  const [trajectoryTimeRange, setTrajectoryTimeRange] = useState<TrajectoryTimeRange>('1year')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Don't render anything on server side
  if (!isClient) {
    return (
      <div className="h-screen overflow-hidden p-6 bg-background/50 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          <div className="mb-6 animate-in slide-in-from-top duration-500 flex-shrink-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">ARGO Float Map</h1>
            <p className="text-muted-foreground">Interactive map for exploring oceanographic data in the Indian Ocean</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading Map</h3>
              <p className="text-muted-foreground">Initializing client-side components...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to get filtered floats based on status
  const getFilteredFloats = () => {
    if (statusFilter === 'all') return dummyFloats
    return dummyFloats.filter(float => float.status === statusFilter)
  }

  // Helper function to get trajectory based on time range
  const getTrajectoryForTimeRange = (trajectory: [number, number][], timeRange: TrajectoryTimeRange) => {
    const totalPoints = trajectory.length
    switch (timeRange) {
      case '1year':
        return trajectory.slice(0, Math.floor(totalPoints * 0.2)) // Last 20% of points
      case '5years':
        return trajectory.slice(0, Math.floor(totalPoints * 0.6)) // Last 60% of points
      case 'all':
        return trajectory
      default:
        return trajectory
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e' // green
      case 'inactive':
        return '#ef4444' // red
      default:
        return '#6b7280' // gray
    }
  }

  // Helper function to create custom ARGO float icon (inline SVG, status-colored)
  const createCustomIcon = (status: string) => {
    if (typeof window === 'undefined') {
      return null
    }

    const L = require('leaflet')
    const color = getStatusColor(status)

    const svg = `
      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <!-- Mast -->
        <rect x="13" y="2" width="2" height="6" rx="1" fill="${color}" />
        <!-- Antenna tip -->
        <circle cx="14" cy="1.5" r="1" fill="${color}" />
        <!-- Float body -->
        <path d="M9,8 C9,6 11,5 14,5 C17,5 19,6 19,8 L19,18 C19,21 17,23 14,23 C11,23 9,21 9,18 Z" fill="${color}" stroke="white" stroke-width="1" />
        <!-- Shading -->
        <path d="M16.5,6.5 L16.5,20.5" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
      </svg>
    `

    return L.divIcon({
      className: 'custom-float-icon',
      html: `
        <div style="position: relative; width: 28px; height: 28px;">
          ${svg}
          <span style="position: absolute; right: -2px; bottom: -2px; width: 8px; height: 8px; border:2px solid white; border-radius: 50%; background-color: ${color}; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 24]
    })
  }

  const openDepthProfile = (floatItem: FloatData) => {
    const today = new Date().toISOString().split('T')[0]
    router.push(`/profile/${encodeURIComponent(floatItem.id)}?date=${encodeURIComponent(today)}`)
  }

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
                  ) : isClient ? (
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
                        
                        {/* Render float markers and trajectories */}
                        {showFloats && getFilteredFloats().map((float) => (
                          <div key={float.id}>
                            {/* Float Marker */}
                            <Marker
                              {...({
                                position: float.position,
                                icon: createCustomIcon(float.status) || undefined,
                                eventHandlers: {
                                  click: () => {
                                    setSelectedFloat(float)
                                    console.log('Selected float:', float)
                                  }
                                }
                              } as any)}
                            >
                              <Popup>
                                <div className="p-2 min-w-[200px]">
                                  <h3 className="font-semibold text-lg mb-2">{float.name}</h3>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge 
                                        variant={float.status === 'active' ? 'default' : 'secondary'}
                                        className={`text-xs ${
                                          float.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                      >
                                        {float.status}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Depth:</span>
                                      <span>{float.depth}m</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Temperature:</span>
                                      <span>{float.temperature}°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Salinity:</span>
                                      <span>{float.salinity} PSU</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Last Update:</span>
                                      <span>{new Date(float.lastUpdate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Deployed:</span>
                                      <span>{new Date(float.deploymentDate).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  <div className="pt-3">
                                    <Button size="sm" className="w-full" onClick={() => openDepthProfile(float)}>
                                      View Depth Profile
                                    </Button>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                            
                            {/* Trajectory */}
                            {showTrajectories && (
                              <Polyline
                                {...({
                                  positions: getTrajectoryForTimeRange(float.trajectory, trajectoryTimeRange),
                                  color: getStatusColor(float.status),
                                  weight: 4,
                                  opacity: 0.8,
                                  dashArray: float.status === 'inactive' ? '8, 8' : undefined
                                } as any)}
                              />
                            )}
                          </div>
                        ))}
                      </MapContainer>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Loading Map</h3>
                        <p className="text-muted-foreground">Initializing client-side components...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-400 overflow-y-auto max-h-full">
            {/* Control Panel */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Map Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show/Hide Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Show Floats</span>
                    </div>
                    <Switch
                      checked={showFloats}
                      onCheckedChange={setShowFloats}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Show Trajectories</span>
                    </div>
                    <Switch
                      checked={showTrajectories}
                      onCheckedChange={setShowTrajectories}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter by Status</span>
                  </div>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floats</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trajectory Time Range */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Trajectory Time Range</span>
                  <Select value={trajectoryTimeRange} onValueChange={(value: any) => setTrajectoryTimeRange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">Last 1 Year</SelectItem>
                      <SelectItem value="5years">Last 5 Years</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Float Statistics */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Float Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Floats</span>
                  <Badge variant="secondary">
                    {dummyFloats.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Floats</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {dummyFloats.filter(f => f.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Inactive Floats</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {dummyFloats.filter(f => f.status === 'inactive').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Coverage Area</span>
                  <Badge variant="outline">Indian Ocean</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Selected Float Information */}
            {selectedFloat && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Selected Float
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{selectedFloat.name}</span>
                    <Badge 
                      className={`text-xs ${
                        selectedFloat.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {selectedFloat.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Position</p>
                      <p className="font-semibold">
                        {selectedFloat.position[0].toFixed(4)}°, {selectedFloat.position[1].toFixed(4)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Depth</p>
                      <p className="font-semibold">{selectedFloat.depth}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{selectedFloat.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Salinity</p>
                      <p className="font-semibold">{selectedFloat.salinity} PSU</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-muted-foreground/20">
                    <p className="text-xs text-muted-foreground">
                      Last Update: {new Date(selectedFloat.lastUpdate).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Deployed: {new Date(selectedFloat.deploymentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedFloat(null)}
                  >
                    Clear Selection
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Current View */}
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
                    Click on floats to see details, or anywhere on the map for coordinates
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
