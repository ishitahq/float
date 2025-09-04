"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Waves, Thermometer, Activity, Database, Globe, Zap } from "lucide-react"

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

  const recentProfiles = [
    { id: "4902345", location: "Pacific Ocean", time: "2 hours ago", depth: "2000m", status: "active" },
    { id: "4902346", location: "Atlantic Ocean", time: "4 hours ago", depth: "1500m", status: "active" },
    { id: "4902347", location: "Indian Ocean", time: "6 hours ago", depth: "1800m", status: "processing" },
    { id: "4902348", location: "Southern Ocean", time: "8 hours ago", depth: "2200m", status: "active" },
  ]

  return (
    <div className="h-full p-6 bg-background/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARGO Dashboard</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm animate-in slide-in-from-left duration-700 delay-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentProfiles.map((profile, index) => (
                      <div
                        key={profile.id}
                        className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg transition-all duration-300 hover:bg-muted/70 hover:scale-[1.02] animate-in slide-in-from-bottom duration-500`}
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              profile.status === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">Float {profile.id}</p>
                            <p className="text-sm text-muted-foreground">{profile.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{profile.time}</p>
                          <p className="text-xs text-muted-foreground">Depth: {profile.depth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm animate-in slide-in-from-right duration-700 delay-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: "700ms" }}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Leafly Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Ready for Integration
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          Connect
                        </Button>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: "800ms" }}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">OpenStreetMap</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Ready for Integration
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          Connect
                        </Button>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: "900ms" }}
                    >
                      <div className="flex items-center gap-3">
                        <Waves className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">ARGO Data API</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full animate-pulse">
                          Connected
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: "1000ms" }}
                    >
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Vector Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full animate-pulse">
                          Active
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      </div>
                    </div>

                    <div
                      className="mt-4 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg animate-in fade-in duration-700"
                      style={{ animationDelay: "1100ms" }}
                    >
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-foreground mb-1">Leafly Dashboard Integration</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Advanced analytics and visualization components will be embedded here
                        </p>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Configure Leafly Integration
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
