"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  MapPin, 
  MessageSquare, 
  Upload, 
  Download, 
  Thermometer, 
  Droplets, 
  Activity, 
  Globe, 
  Mic, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Play,
  Shield,
  Target,
  Database,
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

function AnimatedIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>
}

interface LandingPageProps {
  onNavigate?: (view: 'dashboard' | 'maps' | 'netcdf' | 'chat') => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    const elements = document.querySelectorAll('.observe-me')
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slide-in-up {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      .animate-fade-in {
        animation: fade-in 0.8s ease-out forwards;
      }
      .observe-me {
        opacity: 0;
      }
      .observe-me.animate-in {
        animation: slide-in-up 0.8s ease-out forwards;
      }
      .observe-me.slide-left.animate-in {
        animation: slide-in-left 0.8s ease-out forwards;
      }
      .observe-me.slide-right.animate-in {
        animation: slide-in-right 0.8s ease-out forwards;
      }
      .observe-me.scale-in.animate-in {
        animation: scale-in 0.6s ease-out forwards;
      }
      .pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

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
    { label: "Active Floats", value: 247, icon: <Satellite className="h-5 w-5" />, delay: 0 },
    { label: "Data Points", value: 1500000, icon: <Database className="h-5 w-5" />, delay: 0.1 },
    { label: "Coverage Area", value: 75, suffix: "%", icon: <Globe className="h-5 w-5" />, delay: 0.2 },
    { label: "Data Quality", value: 98.7, suffix: "%", icon: <Shield className="h-5 w-5" />, delay: 0.3 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950">
      <div className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1 - Slowest (0.2x) */}
      <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pulse-glow" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Layer 2 - Medium (0.3x) */}
      <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-400/25 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Layer 3 - Fastest (0.4x) */}
      <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pulse-glow" style={{ transform: `translate(-50%, -50%)`, animationDelay: '1s' }} />
        <div className="absolute top-60 left-40 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '2.5s' }} />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 animate-pulse" />
    </div>
            
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
              <AnimatedIcon>
                <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
              </AnimatedIcon>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                FloatChat
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              India's premier oceanographic data visualization and analysis platform powered by AI. 
              Explore, analyze, and understand ocean data like never before.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                onClick={() => onNavigate?.('dashboard')}
              >
                <AnimatedIcon delay={0.5}>
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                </AnimatedIcon>
                Start Exploring
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                onClick={() => onNavigate?.('chat')}
              >
                <AnimatedIcon delay={0.6}>
                  <MessageSquare className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                </AnimatedIcon>
                Try FloatChat
              </Button>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex flex-col items-center gap-2 text-muted-foreground">
                <span className="text-sm">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex items-start justify-center p-2">
                  <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="observe-me scale-in text-center p-6 bg-card/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${stat.delay}s` }}
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedIcon delay={stat.delay}>{stat.icon}</AnimatedIcon>
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

      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="observe-me slide-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg">
                  <AnimatedIcon><MessageSquare className="h-8 w-8" /></AnimatedIcon>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">AI-Powered FloatChat</h2>
                  <p className="text-lg text-muted-foreground">Your intelligent ocean data assistant</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Ask questions about ocean data in natural language. Get instant answers, visualizations, 
                and insights from 247 ARGO floats.
              </p>
              <div className="space-y-3">
                {['Natural language queries', 'Voice commands with microphone', 'Instant visualizations', 'PDF report exports', 'Smart suggestions', 'Works with all data'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="observe-me slide-right">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AnimatedIcon delay={0.2}><MessageSquare className="h-5 w-5 text-purple-600" /></AnimatedIcon>
                    FloatChat Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                      <span>247 Active Floats Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                      <span>Voice Interaction Enabled</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full pulse-glow" style={{ animationDelay: '1s' }}></div>
                      <span>AI-Powered Responses</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 transform hover:scale-105 transition-all"
                      onClick={() => onNavigate?.('chat')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />Start FloatChat
                    </Button>
                    <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('dashboard')}>
                      <BarChart3 className="h-4 w-4 mr-2" />View Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 observe-me slide-left">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AnimatedIcon><Activity className="h-5 w-5 text-blue-600" /></AnimatedIcon>
                    Live Dashboard Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.1}><Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" /></AnimatedIcon>
                      <div className="text-sm font-medium">Avg Temperature</div>
                      <div className="text-xs text-muted-foreground">26.8°C</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.2}><Activity className="h-6 w-6 text-green-600 mx-auto mb-2" /></AnimatedIcon>
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
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('dashboard')}>
                      <ArrowRight className="h-4 w-4 mr-2" />Explore Dashboard
                    </Button>
                    <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('chat')}>
                      <MessageSquare className="h-4 w-4 mr-2" />Ask FloatChat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2 observe-me slide-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                  <AnimatedIcon><BarChart3 className="h-8 w-8" /></AnimatedIcon>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Ocean Data Dashboard</h2>
                  <p className="text-lg text-muted-foreground">Live float monitoring</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Real-time dashboard showing live data from 247 ARGO floats with instant anomaly detection.
              </p>
              <div className="space-y-3">
                {['Live temperature, pressure, salinity', 'Anomaly alerts (Critical/High/Medium)', 'Filter by depth or range', 'Download CSV, TXT, NetCDF', 'Interactive graphs', 'Real-time updates'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.06}px)` }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="observe-me slide-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                  <AnimatedIcon><MapPin className="h-8 w-8" /></AnimatedIcon>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Interactive ARGO Float Map</h2>
                  <p className="text-lg text-muted-foreground">Visual ocean exploration</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                See exactly where each float is, track their journeys, and explore ocean data geographically.
              </p>
              <div className="space-y-3">
                {['Live float positions', 'Color-coded by status', 'Click for data & trajectory', 'Filter active/inactive', 'Zoom to regions', 'Time-based paths'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="observe-me slide-right">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AnimatedIcon><MapPin className="h-5 w-5 text-green-600" /></AnimatedIcon>
                    Interactive Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.1}><Globe className="h-6 w-6 text-green-600 mx-auto mb-2" /></AnimatedIcon>
                      <div className="text-sm font-medium">Coverage</div>
                      <div className="text-xs text-muted-foreground">Indian Ocean</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.2}><Satellite className="h-6 w-6 text-blue-600 mx-auto mb-2" /></AnimatedIcon>
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
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('maps')}>
                      <ArrowRight className="h-4 w-4 mr-2" />Explore Map
                    </Button>
                    <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('chat')}>
                      <MessageSquare className="h-4 w-4 mr-2" />Ask FloatChat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 observe-me slide-left">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AnimatedIcon><FileText className="h-5 w-5 text-blue-600" /></AnimatedIcon>
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.1}><Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" /></AnimatedIcon>
                      <div className="text-sm font-medium">Temperature</div>
                      <div className="text-xs text-muted-foreground">4.2°C - 28.5°C</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg transform hover:scale-105 transition-transform">
                      <AnimatedIcon delay={0.2}><Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-2" /></AnimatedIcon>
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
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all">
                      <Download className="h-4 w-4 mr-2" />Download PDF Report
                    </Button>
                    <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 transform hover:scale-105 transition-all" onClick={() => onNavigate?.('netcdf')}>
                      <ArrowRight className="h-4 w-4 mr-2" />Explore NetCDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2 observe-me slide-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                  <AnimatedIcon><Upload className="h-8 w-8" /></AnimatedIcon>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">NetCDF Analysis</h2>
                  <p className="text-lg text-muted-foreground">Advanced file processing</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Upload any NetCDF file and get clear insights from your ocean data with AI-powered analysis.
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

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 observe-me">
          <h2 className="text-4xl font-bold mb-4">Technical Capabilities</h2>
          <p className="text-xl text-muted-foreground">
            Advanced oceanographic data processing and analysis features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Real-time Processing",
              desc: "Live ARGO float data streaming with instant anomaly detection",
              stat: "247 active connections",
              statIcon: <Activity className="h-3 w-3" />,
              gradient: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
              border: "border-blue-200 dark:border-blue-800",
              bgColor: "bg-blue-600",
              textColor: "text-blue-600 dark:text-blue-400"
            },
            {
              icon: <Target className="h-5 w-5" />,
              title: "Oceanographic Analytics",
              desc: "Advanced statistical analysis of temperature, salinity, and pressure",
              stat: "98.7% accuracy",
              statIcon: <TrendingUp className="h-3 w-3" />,
              gradient: "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
              border: "border-green-200 dark:border-green-800",
              bgColor: "bg-green-600",
              textColor: "text-green-600 dark:text-green-400"
            },
            {
              icon: <MessageSquare className="h-5 w-5" />,
              title: "AI-Powered Chat",
              desc: "Natural language queries with voice interaction",
              stat: "Voice-enabled AI",
              statIcon: <Mic className="h-3 w-3" />,
              gradient: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
              border: "border-purple-200 dark:border-purple-800",
              bgColor: "bg-purple-600",
              textColor: "text-purple-600 dark:text-purple-400"
            },
            {
              icon: <Upload className="h-5 w-5" />,
              title: "NetCDF Analysis",
              desc: "Upload and analyze oceanographic files with automated insights",
              stat: "Scientific processing",
              statIcon: <FileText className="h-3 w-3" />,
              gradient: "from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/50",
              border: "border-cyan-200 dark:border-cyan-800",
              bgColor: "bg-cyan-600",
              textColor: "text-cyan-600 dark:text-cyan-400"
            },
            {
              icon: <Download className="h-5 w-5" />,
              title: "Data Export",
              desc: "Download data in CSV, TXT, NetCDF, and PDF formats",
              stat: "Multi-format export",
              statIcon: <FileText className="h-3 w-3" />,
              gradient: "from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50",
              border: "border-orange-200 dark:border-orange-800",
              bgColor: "bg-orange-600",
              textColor: "text-orange-600 dark:text-orange-400"
            },
            {
              icon: <MapPin className="h-5 w-5" />,
              title: "Interactive Mapping",
              desc: "Visualize ARGO float positions and trajectories",
              stat: "Geospatial viz",
              statIcon: <Globe className="h-3 w-3" />,
              gradient: "from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50",
              border: "border-pink-200 dark:border-pink-800",
              bgColor: "bg-pink-600",
              textColor: "text-pink-600 dark:text-pink-400"
            }
          ].map((feature, index) => (
            <Card 
              key={index} 
              className={`observe-me scale-in p-6 bg-gradient-to-br ${feature.gradient} ${feature.border} hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${feature.bgColor} text-white group-hover:scale-110 transition-transform duration-300`}>
                  <AnimatedIcon delay={index * 0.1}>{feature.icon}</AnimatedIcon>
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{feature.desc}</p>
              <div className={`flex items-center gap-2 text-xs ${feature.textColor}`}>
                {feature.statIcon}
                <span>{feature.stat}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.03}px)` }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.02}px)` }} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="observe-me">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Explore the Indian Ocean?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join researchers, scientists, and oceanographers in discovering the secrets of the Indian Ocean with FloatChat by MoES.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                onClick={() => onNavigate?.('dashboard')}
              >
                <AnimatedIcon delay={0.1}>
                  <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </AnimatedIcon>
                Start Exploring
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group bg-transparent"
                onClick={() => onNavigate?.('chat')}
              >
                <AnimatedIcon delay={0.2}>
                  <MessageSquare className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                </AnimatedIcon>
                Try FloatChat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="observe-me">
              <div className="flex items-center gap-2 mb-4">
                <AnimatedIcon>
                  <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                </AnimatedIcon>
                <span className="text-xl font-bold">FloatChat</span>
              </div>
              <p className="text-slate-400 text-sm">
                India's premier oceanographic data visualization and analysis platform by Ministry of Earth Sciences (MoES).
              </p>
            </div>
            <div className="observe-me">
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Real-time Dashboard</li>
                <li className="hover:text-white transition-colors cursor-pointer">Interactive Maps</li>
                <li className="hover:text-white transition-colors cursor-pointer">AI Chat Assistant</li>
                <li className="hover:text-white transition-colors cursor-pointer">NetCDF Analysis</li>
              </ul>
            </div>
            <div className="observe-me">
              <h3 className="font-semibold mb-3">Data Sources</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">ARGO Float Network</li>
                <li className="hover:text-white transition-colors cursor-pointer">Indian Ocean Data</li>
                <li className="hover:text-white transition-colors cursor-pointer">Global Ocean Models</li>
                <li className="hover:text-white transition-colors cursor-pointer">Satellite Observations</li>
              </ul>
            </div>
            <div className="observe-me">
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">API Reference</li>
                <li className="hover:text-white transition-colors cursor-pointer">Community Forum</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2025 FloatChat by Ministry of Earth Sciences (MoES). All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}