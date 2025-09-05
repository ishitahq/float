"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FloatChat } from "@/components/float-chat"
import { Dashboard } from "@/components/dashboard"
import { Maps } from "@/components/maps"
import { WaterBackground } from "@/components/water-background"
import { Moon, Sun } from "lucide-react"

type ViewMode = "chat" | "dashboard" | "maps"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("chat")
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  // Initialize dark mode on mount
  useState(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark")
    }
  })

  const handleLogoClick = () => {
    setViewMode("chat")
  }

  return (
    <div className={`min-h-screen relative ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950 transition-colors duration-300">
        <WaterBackground />

        <nav className="relative z-10 flex items-center justify-between p-4 backdrop-blur-sm bg-white/20 dark:bg-black/20 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  // Fallback to SVG if image fails to load
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'block'
                }}
              />
              <svg className="h-8 w-8 text-white hidden" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === "dashboard" ? "default" : "outline"}
              onClick={() => setViewMode("dashboard")}
              className="rounded-2xl px-6 py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-black/80 border-white/30 dark:border-white/20 text-slate-700 dark:text-slate-200"
            >
              Dashboard
            </Button>
            <Button
              variant={viewMode === "maps" ? "default" : "outline"}
              onClick={() => setViewMode("maps")}
              className="rounded-2xl px-6 py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-black/80 border-white/30 dark:border-white/20 text-slate-700 dark:text-slate-200"
            >
              Maps
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-black/80 border-white/30 dark:border-white/20"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </Button>
          </div>
        </nav>

        <div className="relative z-10 flex min-h-[calc(100vh-80px)] overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out ${
              viewMode === "chat"
                ? "w-full flex-1"
                : "w-full lg:w-96 lg:min-w-96 border-r border-white/20 dark:border-white/10 h-[calc(100vh-200px)]"
            }`}
          >
            <FloatChat isMinimized={viewMode !== "chat"} />
          </div>

          {viewMode !== "chat" && (
            <div className="flex-1 min-h-0 transition-all duration-500 ease-in-out animate-in slide-in-from-right overflow-auto">
              {viewMode === "dashboard" && <Dashboard />}
              {viewMode === "maps" && <Maps />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
