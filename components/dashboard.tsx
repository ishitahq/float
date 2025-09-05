"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BarChart3, TrendingUp, Waves, Thermometer, Activity, Search, Image as ImageIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  delay: number
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
            <h1 className="text-3xl font-bold text-foreground">ARGO Dashboard</h1>
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
                  value="3847"
                  change="+12% from last month"
                  icon={<Waves className="h-4 w-4" />}
                  delay={100}
                />
                <MetricCard
                  title="Profiles Today"
                  value="1,234"
                  change="+5% from yesterday"
                  icon={<BarChart3 className="h-4 w-4" />}
                  delay={200}
                />
                <MetricCard
                  title="Avg Temperature"
                  value="15.2°C"
                  change="Global ocean average"
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
