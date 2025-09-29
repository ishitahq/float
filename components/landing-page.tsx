"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  MapPin, 
  MessageSquare, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Waves, 
  Activity, 
  Eye, 
  Clock, 
  Globe, 
  Settings, 
  Mic, 
  Volume2, 
  Flag, 
  RotateCcw, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Shield,
  Target,
  Layers,
  Database,
  Cpu,
  Network,
  Satellite
} from "lucide-react"


function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

interface LandingPageProps {
  onNavigate?: (view: 'dashboard' | 'maps' | 'netcdf' | 'chat') => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {


  const netcdfFeatures = [
    "Drag-and-drop NetCDF file upload interface",
    "Real-time processing simulation with progress tracking",
    "Comprehensive oceanographic parameter analysis",
    "Spatial and temporal coverage visualization",
    "Data quality assessment with completeness metrics",
    "Professional PDF report generation",
    "Multi-file processing with staggered analysis",
    "Detailed insights and recommendations"
  ]

   const stats = [
     { label: "Active Floats", value: 247, icon: <Satellite className="h-5 w-5" /> },
     { label: "Data Points", value: 1500000, icon: <Database className="h-5 w-5" /> },
     { label: "Coverage Area", value: 75, suffix: "%", icon: <Globe className="h-5 w-5" /> },
     { label: "Data Quality", value: 98.7, suffix: "%", icon: <Shield className="h-5 w-5" /> }
   ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 animate-pulse" />
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                FloatChat
              </h1>
            </div>
             <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
               India's premier oceanographic data visualization and analysis platform powered by AI. 
               Explore, analyze, and understand ocean data like never before.
             </p>
             <div className="flex flex-wrap justify-center gap-4 mb-12">
               <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl">
                 <Play className="h-5 w-5 mr-2" />
                 Start Exploring
               </Button>
               <Button size="lg" variant="outline" className="border-2 border-blue-200 hover:bg-blue-50">
                 <MessageSquare className="h-5 w-5 mr-2" />
                 Try FloatChat
               </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-card/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>


       {/* FloatChat Detailed Section */}
       <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 py-20">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg">
                   <MessageSquare className="h-8 w-8" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-bold">AI-Powered FloatChat</h2>
                   <p className="text-lg text-muted-foreground">Your intelligent ocean data assistant</p>
                 </div>
               </div>
               <p className="text-muted-foreground mb-6">
                 Ask questions about ocean data in natural language. Get instant answers, visualizations, 
                 and insights from 247 ARGO floats. Voice commands, smart suggestions, and export capabilities.
               </p>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Natural language queries: "Show temperature anomalies in Bay of Bengal"</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Voice commands with microphone integration</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Instant data visualizations and graphs</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Export chat conversations as PDF reports</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Smart query suggestions and auto-complete</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Works with all dashboard and map data</span>
                 </div>
               </div>
             </div>
             <div className="relative">
               <Card className="bg-card/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5 text-purple-600" />
                     FloatChat Assistant
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3">
                     <div className="flex items-center gap-2 text-sm">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span>247 Active Floats Connected</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                       <span>Voice Interaction Enabled</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                       <span>AI-Powered Responses</span>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Button 
                       className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                       onClick={() => onNavigate?.('chat')}
                     >
                       <MessageSquare className="h-4 w-4 mr-2" />
                       Start FloatChat
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full border-purple-200 hover:bg-purple-50"
                       onClick={() => onNavigate?.('dashboard')}
                     >
                       <BarChart3 className="h-4 w-4 mr-2" />
                       View Dashboard
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>
           </div>
         </div>
       </div>

       {/* Dashboard Detailed Section */}
       <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 py-20">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="order-2 lg:order-1">
               <div className="relative">
                 <Card className="bg-card/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Activity className="h-5 w-5 text-blue-600" />
                       Live Dashboard Metrics
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                         <Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                         <div className="text-sm font-medium">Avg Temperature</div>
                         <div className="text-xs text-muted-foreground">26.8°C</div>
                       </div>
                       <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                         <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                         <div className="text-sm font-medium">Active Floats</div>
                         <div className="text-xs text-muted-foreground">247</div>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span>Data Quality</span>
                         <span className="font-medium">98.7%</span>
                       </div>
                       <Progress value={98.7} className="h-2" />
                     </div>
                     <div className="space-y-2">
                       <Button 
                         className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                         onClick={() => onNavigate?.('dashboard')}
                       >
                         <ArrowRight className="h-4 w-4 mr-2" />
                         Explore Dashboard
                       </Button>
                       <Button 
                         variant="outline" 
                         className="w-full border-blue-200 hover:bg-blue-50"
                         onClick={() => onNavigate?.('chat')}
                       >
                         <MessageSquare className="h-4 w-4 mr-2" />
                         Ask FloatChat
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>
             <div className="order-1 lg:order-2">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                   <BarChart3 className="h-8 w-8" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-bold">Ocean Data Dashboard</h2>
                   <p className="text-lg text-muted-foreground">Live float monitoring & analytics</p>
                 </div>
               </div>
               <p className="text-muted-foreground mb-6">
                 Real-time dashboard showing live data from 247 ARGO floats. Monitor temperature, pressure, 
                 and salinity with instant anomaly detection and data export capabilities.
               </p>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Live temperature, pressure, and salinity readings</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Anomaly alerts with severity levels (Critical/High/Medium)</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Filter by depth, temperature range, or specific floats</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Download data as CSV, TXT, or NetCDF files</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Interactive graphs for each float's data history</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Real-time status updates every 10 days</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Maps Detailed Section */}
       <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 py-20">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                   <MapPin className="h-8 w-8" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-bold">Interactive ARGO Float Map</h2>
                   <p className="text-lg text-muted-foreground">Visual ocean exploration</p>
                 </div>
               </div>
               <p className="text-muted-foreground mb-6">
                 See exactly where each float is, track their journeys, and explore ocean data geographically. 
                 Click any float to see its data, trajectory, and current status.
               </p>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Live float positions with custom markers</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Color-coded by status: Green (active), Red (inactive)</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Click any float to see its data and trajectory</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Filter by active/inactive floats only</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>Zoom to specific regions or follow individual floats</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                   <span>View float paths over time with date controls</span>
                 </div>
               </div>
             </div>
             <div className="relative">
               <Card className="bg-card/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-800">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5 text-green-600" />
                     Interactive ARGO Float Map
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                       <Globe className="h-6 w-6 text-green-600 mx-auto mb-2" />
                       <div className="text-sm font-medium">Coverage</div>
                       <div className="text-xs text-muted-foreground">Indian Ocean</div>
                     </div>
                     <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                       <Satellite className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                       <div className="text-sm font-medium">Active Floats</div>
                       <div className="text-xs text-muted-foreground">247</div>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span>Map Coverage</span>
                       <span className="font-medium">75%</span>
                     </div>
                     <Progress value={75} className="h-2" />
                   </div>
                   <div className="space-y-2">
                     <Button 
                       className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                       onClick={() => onNavigate?.('maps')}
                     >
                       <ArrowRight className="h-4 w-4 mr-2" />
                       Explore Interactive Map
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full border-green-200 hover:bg-green-50"
                       onClick={() => onNavigate?.('chat')}
                     >
                       <MessageSquare className="h-4 w-4 mr-2" />
                       Ask FloatChat
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>
           </div>
         </div>
       </div>


       {/* NetCDF Analysis Section */}
       <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 py-20">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="order-2 lg:order-1">
               <div className="relative">
                 <Card className="bg-card/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <FileText className="h-5 w-5 text-blue-600" />
                       Analysis Results
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                         <Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                         <div className="text-sm font-medium">Temperature</div>
                         <div className="text-xs text-muted-foreground">4.2°C - 28.5°C</div>
                       </div>
                       <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                         <Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                         <div className="text-sm font-medium">Salinity</div>
                         <div className="text-xs text-muted-foreground">34.2 - 35.8 PSU</div>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span>Data Quality</span>
                         <span className="font-medium">98.7%</span>
                       </div>
                       <Progress value={98.7} className="h-2" />
                     </div>
                     <div className="space-y-2">
                       <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                         <Download className="h-4 w-4 mr-2" />
                         Download PDF Report
                       </Button>
                       <Button 
                         variant="outline" 
                         className="w-full border-blue-200 hover:bg-blue-50"
                         onClick={() => onNavigate?.('netcdf')}
                       >
                         <ArrowRight className="h-4 w-4 mr-2" />
                         Explore NetCDF Analysis
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>
             <div className="order-1 lg:order-2">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                   <Upload className="h-8 w-8" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-bold">NetCDF Analysis</h2>
                   <p className="text-lg text-muted-foreground">Advanced file processing & insights</p>
                 </div>
               </div>
               <p className="text-muted-foreground mb-6">
                 Upload any NetCDF file and get clear, easy-to-understand insights from your ocean data. 
                 Our AI-powered analysis provides comprehensive oceanographic parameter analysis with professional reporting.
               </p>
               <div className="space-y-3">
                 {netcdfFeatures.map((feature, index) => (
                   <div key={index} className="flex items-center gap-3">
                     <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                     <span>{feature}</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Advanced Features Grid */}
       <div className="container mx-auto px-6 py-20">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-bold mb-4">Technical Capabilities</h2>
           <p className="text-xl text-muted-foreground">
             Advanced oceanographic data processing and analysis features
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-blue-600 text-white">
                 <Zap className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">Real-time Data Processing</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Live ARGO float data streaming with instant anomaly detection and alerting
             </p>
             <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
               <Activity className="h-3 w-3" />
               <span>247 active float connections</span>
             </div>
           </Card>

           <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-green-600 text-white">
                 <Target className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">Oceanographic Analytics</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Advanced statistical analysis of temperature, salinity, and pressure data
             </p>
             <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
               <TrendingUp className="h-3 w-3" />
               <span>98.7% data accuracy</span>
             </div>
           </Card>

           <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-purple-600 text-white">
                 <MessageSquare className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">AI-Powered Chat</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Natural language queries with voice interaction and smart data interpretation
             </p>
             <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
               <Mic className="h-3 w-3" />
               <span>Voice-enabled AI</span>
             </div>
           </Card>

           <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/50 border-cyan-200 dark:border-cyan-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-cyan-600 text-white">
                 <Upload className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">NetCDF File Analysis</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Upload and analyze NetCDF oceanographic files with automated insights
             </p>
             <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
               <FileText className="h-3 w-3" />
               <span>Scientific file processing</span>
             </div>
           </Card>

           <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-orange-600 text-white">
                 <Download className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">Data Export</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Download ocean data in multiple formats: CSV, TXT, NetCDF, and PDF reports
             </p>
             <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
               <FileText className="h-3 w-3" />
               <span>Multi-format export</span>
             </div>
           </Card>

           <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border-pink-200 dark:border-pink-800">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-pink-600 text-white">
                 <MapPin className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-semibold">Interactive Mapping</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-3">
               Visualize ARGO float positions and trajectories on interactive maps
             </p>
             <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400">
               <Globe className="h-3 w-3" />
               <span>Geospatial visualization</span>
             </div>
           </Card>
         </div>
       </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Explore the Indian Ocean?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join researchers, scientists, and oceanographers in discovering the secrets of the Indian Ocean with FloatChat by MoES.
          </p>
           <div className="flex flex-wrap justify-center gap-4">
             <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
               <ArrowRight className="h-5 w-5 mr-2" />
               Start Exploring
             </Button>
             <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
               <MessageSquare className="h-5 w-5 mr-2" />
               Try FloatChat
             </Button>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-xl font-bold">FloatChat</span>
              </div>
              <p className="text-slate-400 text-sm">
                India's premier oceanographic data visualization and analysis platform by Ministry of Earth Sciences (MoES).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Real-time Dashboard</li>
                <li>Interactive Maps</li>
                <li>AI Chat Assistant</li>
                <li>NetCDF Analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Data Sources</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>ARGO Float Network</li>
                <li>Indian Ocean Data</li>
                <li>Global Ocean Models</li>
                <li>Satellite Observations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community Forum</li>
                <li>Contact Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2024 FloatChat by Ministry of Earth Sciences (MoES). All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
