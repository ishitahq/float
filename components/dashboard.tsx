"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart3, TrendingUp, Thermometer, Activity, Search, Image as ImageIcon, AlertTriangle, Clock, Droplets, Download, Filter, X } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  delay: number
}

interface FloatData {
  id: string
  temperature: number
  pressure: number
  salinity: number
  timestamp: string
  depth: number
  isAnomaly?: boolean
}

interface AnomalyAlert {
  id: string
  type: 'temperature' | 'pressure' | 'salinity'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
}

interface FilterState {
  temperatureRange: { min: number; max: number }
  pressureRange: { min: number; max: number }
  salinityRange: { min: number; max: number }
  anomalyStatus: 'all' | 'normal' | 'anomaly'
  showFilters: boolean
}

// Sample float data with realistic oceanographic measurements
const sampleFloatData: FloatData[] = [
  {
    id: "4902345",
    temperature: 26.8,
    pressure: 1013.2,
    salinity: 35.2,
    timestamp: "2024-01-15 14:30:00",
    depth: 150.5,
    isAnomaly: false
  },
  {
    id: "4902346",
    temperature: 28.1,
    pressure: 1012.8,
    salinity: 34.9,
    timestamp: "2024-01-15 14:25:00",
    depth: 200.3,
    isAnomaly: false
  },
  {
    id: "4902347",
    temperature: 32.5, // Anomaly: unusually high temperature
    pressure: 1015.1,
    salinity: 35.4,
    timestamp: "2024-01-15 14:20:00",
    depth: 75.2,
    isAnomaly: true
  },
  {
    id: "4902348",
    temperature: 25.3,
    pressure: 980.2, // Anomaly: unusually low pressure
    salinity: 35.1,
    timestamp: "2024-01-15 14:15:00",
    depth: 300.8,
    isAnomaly: true
  },
  {
    id: "4902349",
    temperature: 27.2,
    pressure: 1014.5,
    salinity: 38.9, // Anomaly: unusually high salinity
    timestamp: "2024-01-15 14:10:00",
    depth: 120.1,
    isAnomaly: true
  },
  {
    id: "4902350",
    temperature: 26.1,
    pressure: 1013.9,
    salinity: 35.0,
    timestamp: "2024-01-15 14:05:00",
    depth: 180.7,
    isAnomaly: false
  }
]

// Anomaly detection function
const detectAnomalies = (data: FloatData[]): AnomalyAlert[] => {
  const alerts: AnomalyAlert[] = []
  
  data.forEach((float) => {
    if (float.isAnomaly) {
      let type: 'temperature' | 'pressure' | 'salinity' = 'temperature'
      let message = ''
      let severity: 'low' | 'medium' | 'high' = 'medium'
      
      if (float.temperature > 30) {
        type = 'temperature'
        message = `Unusually high temperature detected: ${float.temperature}°C`
        severity = 'high'
      } else if (float.pressure < 1000) {
        type = 'pressure'
        message = `Unusually low pressure detected: ${float.pressure} hPa`
        severity = 'high'
      } else if (float.salinity > 37) {
        type = 'salinity'
        message = `Unusually high salinity detected: ${float.salinity} PSU`
        severity = 'medium'
      }
      
      alerts.push({
        id: `alert-${float.id}`,
        type,
        message,
        severity,
        timestamp: float.timestamp
      })
    }
  })
  
  return alerts
}

// Download functions
const downloadAsTXT = (data: FloatData[]) => {
  const headers = "Float ID,Temperature (°C),Pressure (hPa),Salinity (PSU),Depth (m),Timestamp,Status\n"
  const rows = data.map(float => 
    `${float.id},${float.temperature.toFixed(1)},${float.pressure.toFixed(1)},${float.salinity.toFixed(1)},${float.depth.toFixed(1)},${float.timestamp},${float.isAnomaly ? 'Anomaly' : 'Normal'}`
  ).join('\n')
  
  const content = headers + rows
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `float_data_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadAsCSV = (data: FloatData[]) => {
  const headers = "Float ID,Temperature (°C),Pressure (hPa),Salinity (PSU),Depth (m),Timestamp,Status\n"
  const rows = data.map(float => 
    `${float.id},${float.temperature.toFixed(1)},${float.pressure.toFixed(1)},${float.salinity.toFixed(1)},${float.depth.toFixed(1)},${float.timestamp},${float.isAnomaly ? 'Anomaly' : 'Normal'}`
  ).join('\n')
  
  const content = headers + rows
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `float_data_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadAsNetCDF = (data: FloatData[]) => {
  // For netCDF, we'll create a simplified JSON structure that represents netCDF metadata
  // In a real implementation, you would use a library like netcdfjs or similar
  const netCDFData = {
    global_attributes: {
      title: "Ocean Float Data",
      source: "Ocean Data Dashboard",
      history: `Created on ${new Date().toISOString()}`,
      conventions: "CF-1.6"
    },
    dimensions: {
      float: data.length,
      time: 1
    },
    variables: {
      float_id: {
        dimensions: ["float"],
        data: data.map(d => d.id),
        attributes: {
          long_name: "Float Identifier",
          units: "1"
        }
      },
      temperature: {
        dimensions: ["float"],
        data: data.map(d => d.temperature),
        attributes: {
          long_name: "Sea Water Temperature",
          units: "degrees_Celsius",
          standard_name: "sea_water_temperature"
        }
      },
      pressure: {
        dimensions: ["float"],
        data: data.map(d => d.pressure),
        attributes: {
          long_name: "Sea Water Pressure",
          units: "hPa",
          standard_name: "sea_water_pressure"
        }
      },
      salinity: {
        dimensions: ["float"],
        data: data.map(d => d.salinity),
        attributes: {
          long_name: "Sea Water Salinity",
          units: "PSU",
          standard_name: "sea_water_salinity"
        }
      },
      depth: {
        dimensions: ["float"],
        data: data.map(d => d.depth),
        attributes: {
          long_name: "Depth",
          units: "m",
          standard_name: "depth"
        }
      },
      timestamp: {
        dimensions: ["float"],
        data: data.map(d => d.timestamp),
        attributes: {
          long_name: "Time",
          units: "seconds since 1970-01-01 00:00:00"
        }
      }
    }
  }
  
  const content = JSON.stringify(netCDFData, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `float_data_${new Date().toISOString().split('T')[0]}.nc.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Filter function
const filterFloatData = (data: FloatData[], filters: FilterState): FloatData[] => {
  return data.filter(float => {
    // Temperature filter
    if (float.temperature < filters.temperatureRange.min || float.temperature > filters.temperatureRange.max) {
      return false
    }
    
    // Pressure filter
    if (float.pressure < filters.pressureRange.min || float.pressure > filters.pressureRange.max) {
      return false
    }
    
    // Salinity filter
    if (float.salinity < filters.salinityRange.min || float.salinity > filters.salinityRange.max) {
      return false
    }
    
    // Anomaly status filter
    if (filters.anomalyStatus === 'normal' && float.isAnomaly) {
      return false
    }
    if (filters.anomalyStatus === 'anomaly' && !float.isAnomaly) {
      return false
    }
    
    return true
  })
}

function MetricCard({ title, value, change, icon, delay }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (isVisible) {
      const numericValue = Number.parseInt(value.replace(/[^\d]/g, ""))
      if (numericValue) {
        let current = 0
        const increment = numericValue / 30
        const timer = setInterval(() => {
          current += increment
          if (current >= numericValue) {
            setAnimatedValue(numericValue)
            clearInterval(timer)
          } else {
            setAnimatedValue(Math.floor(current))
          }
        }, 50)
        return () => clearInterval(timer)
      }
    }
  }, [isVisible, value])

  return (
    <Card
      className={`bg-card/80 backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:shadow-lg ${
        isVisible ? "animate-in slide-in-from-bottom-4 fade-in" : "opacity-0 translate-y-4"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground transition-colors duration-300 hover:text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {title === "Active Floats" ? animatedValue.toLocaleString() : value}
        </div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [graphCount, setGraphCount] = useState(0)
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([])
  const [showAlerts, setShowAlerts] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    temperatureRange: { min: 20, max: 35 },
    pressureRange: { min: 950, max: 1050 },
    salinityRange: { min: 30, max: 40 },
    anomalyStatus: 'all',
    showFilters: false
  })
  const [filteredData, setFilteredData] = useState<FloatData[]>(sampleFloatData)

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          setIsLoaded(true)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const alerts = detectAnomalies(sampleFloatData)
      setAnomalyAlerts(alerts)
    }
  }, [isLoaded])

  useEffect(() => {
    const filtered = filterFloatData(sampleFloatData, filters)
    setFilteredData(filtered)
  }, [filters])

  const handleFloatSelect = (floatId: string) => {
    setSelectedFloat(floatId)
    // Specific graph counts for specific float numbers
    const graphCounts: { [key: string]: number } = {
      "12345": 3,
      "23456": 4,
    }
    setGraphCount(graphCounts[floatId] || 3)
  }

  const handleSearch = () => {
    if (searchValue.trim()) {
      handleFloatSelect(searchValue.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      temperatureRange: { min: 20, max: 35 },
      pressureRange: { min: 950, max: 1050 },
      salinityRange: { min: 30, max: 40 },
      anomalyStatus: 'all',
      showFilters: false
    })
  }

  const handleDownload = (format: 'txt' | 'csv' | 'netcdf') => {
    switch (format) {
      case 'txt':
        downloadAsTXT(filteredData)
        break
      case 'csv':
        downloadAsCSV(filteredData)
        break
      case 'netcdf':
        downloadAsNetCDF(filteredData)
        break
    }
  }


  const GraphSection = () => {
    if (!selectedFloat) return null

    const renderGraphs = () => {
      const graphs = []
      const titles3 = [
        "Pressure vs Temperature",
        "Sea Temp vs Salinity",
        "Pressure vs. Salinity",
      ]
      const titles4 = [...titles3, "Chlorophyll vs. Depth"]

      for (let i = 1; i <= graphCount; i++) {
        const title = (graphCount === 4 ? titles4 : titles3)[i - 1] ?? `Graph ${i}`
        graphs.push(
          <Card key={i} className="bg-card/80 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-1">{title}</div>
              <div className={`rounded-lg overflow-hidden ${
                graphCount === 4 
                  ? "aspect-square h-48" 
                  : graphCount === 3 
                  ? "aspect-video h-48" 
                  : "aspect-video h-48"
              }`}>
                <img 
                  src={`/graphs/float-4902345-graph${i}.png`}
                  alt={title}
                  className="w-full h-full object-contain rounded-md bg-muted p-1"
                />
              </div>
            </CardContent>
          </Card>
        )
      }
      return graphs
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Float {selectedFloat} Analytics</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedFloat(null)}
            className="text-xs"
          >
            Close
          </Button>
        </div>
        <div className={`grid gap-4 transition-all duration-500 ${
          graphCount === 4 
            ? "grid-cols-2 grid-rows-2 max-h-[calc(100vh-200px)]" 
            : graphCount === 3 
            ? "grid-cols-3 grid-rows-1" 
            : "grid-cols-1"
        }`}>
          {renderGraphs()}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-6 bg-background/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Ocean Data Dashboard</h1>
            <div className="flex gap-2 max-w-md flex-1 ml-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter float number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="px-6">
                Search
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Real-time oceanographic data visualization and analytics</p>

          {!isLoaded && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Loading dashboard data...</span>
                <span>{loadingProgress}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
          )}
        </div>

        {isLoaded && (
          <>
            {/* Metrics Grid - Only show when no float is selected */}
            {!selectedFloat && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in slide-in-from-bottom duration-700">
                <MetricCard
                  title="Active Floats"
                  value="247"
                  change="+8% from last month"
                  icon={<img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />}
                  delay={100}
                />
                <MetricCard
                  title="Profiles Today"
                  value="89"
                  change="+3% from yesterday"
                  icon={<BarChart3 className="h-4 w-4" />}
                  delay={200}
                />
                <MetricCard
                  title="Avg Temperature"
                  value="26.8°C"
                  change="Indian Ocean average"
                  icon={<Thermometer className="h-4 w-4" />}
                  delay={300}
                />
                <MetricCard
                  title="Data Quality"
                  value="98.7%"
                  change="Quality controlled data"
                  icon={<TrendingUp className="h-4 w-4" />}
                  delay={400}
                />
              </div>
            )}

            {/* Anomaly Alerts */}
            {!selectedFloat && anomalyAlerts.length > 0 && showAlerts && (
              <div className="mb-6 animate-in slide-in-from-left duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Anomaly Detection Alerts
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAlerts(false)}
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
                <div className="space-y-3">
                  {anomalyAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={alert.severity === 'high' ? 'destructive' : 'default'}
                      className="border-l-4 border-l-destructive"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Anomaly
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </AlertTitle>
                      <AlertDescription>
                        {alert.message} - Float ID: {alert.id.replace('alert-', '')}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Float Data Table */}
            {!selectedFloat && (
              <div className="mb-6 animate-in slide-in-from-bottom duration-700 delay-200">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5" />
                        Recent Float Measurements
                        <span className="text-sm text-muted-foreground ml-2">
                          ({filteredData.length} of {sampleFloatData.length} floats)
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFilter('showFilters', !filters.showFilters)}
                          className="flex items-center gap-2"
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                        <Select onValueChange={(value) => handleDownload(value as 'txt' | 'csv' | 'netcdf')}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Download" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="txt">TXT</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="netcdf">NetCDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Filter Controls */}
                  {filters.showFilters && (
                    <div className="px-6 pb-4 border-b">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Temperature Range (°C)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.temperatureRange.min}
                              onChange={(e) => updateFilter('temperatureRange', { ...filters.temperatureRange, min: Number(e.target.value) })}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.temperatureRange.max}
                              onChange={(e) => updateFilter('temperatureRange', { ...filters.temperatureRange, max: Number(e.target.value) })}
                              className="w-20"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pressure Range (hPa)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.pressureRange.min}
                              onChange={(e) => updateFilter('pressureRange', { ...filters.pressureRange, min: Number(e.target.value) })}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.pressureRange.max}
                              onChange={(e) => updateFilter('pressureRange', { ...filters.pressureRange, max: Number(e.target.value) })}
                              className="w-20"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Salinity Range (PSU)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.salinityRange.min}
                              onChange={(e) => updateFilter('salinityRange', { ...filters.salinityRange, min: Number(e.target.value) })}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.salinityRange.max}
                              onChange={(e) => updateFilter('salinityRange', { ...filters.salinityRange, max: Number(e.target.value) })}
                              className="w-20"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Anomaly Status</label>
                          <Select value={filters.anomalyStatus} onValueChange={(value) => updateFilter('anomalyStatus', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="normal">Normal Only</SelectItem>
                              <SelectItem value="anomaly">Anomalies Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" onClick={resetFilters} className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Float ID</TableHead>
                          <TableHead>Temperature (°C)</TableHead>
                          <TableHead>Pressure (hPa)</TableHead>
                          <TableHead>Salinity (PSU)</TableHead>
                          <TableHead>Depth (m)</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((float) => (
                          <TableRow
                            key={float.id}
                            className={float.isAnomaly ? "bg-destructive/10 border-l-4 border-l-destructive" : ""}
                          >
                            <TableCell className="font-medium">{float.id}</TableCell>
                            <TableCell className={float.temperature > 30 ? "text-destructive font-semibold" : ""}>
                              {float.temperature.toFixed(1)}
                            </TableCell>
                            <TableCell className={float.pressure < 1000 ? "text-destructive font-semibold" : ""}>
                              {float.pressure.toFixed(1)}
                            </TableCell>
                            <TableCell className={float.salinity > 37 ? "text-destructive font-semibold" : ""}>
                              {float.salinity.toFixed(1)}
                            </TableCell>
                            <TableCell>{float.depth.toFixed(1)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {float.timestamp}
                            </TableCell>
                            <TableCell>
                              {float.isAnomaly ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">
                                  <AlertTriangle className="h-3 w-3" />
                                  Anomaly
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                  <Activity className="h-3 w-3" />
                                  Normal
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {filteredData.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No floats match the current filter criteria.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Graph Section - Full width when float is selected */}
            {selectedFloat && (
              <div className="flex-1 animate-in slide-in-from-right duration-700 delay-300">
                <GraphSection />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
