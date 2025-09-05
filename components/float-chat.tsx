"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, User, Flag, RotateCcw } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "data" | "suggestion"
  data?: any
}

interface FloatChatProps {
  isMinimized: boolean
}

const sampleQueries = [
  "Show me salinity profiles near the equator in March 2023",
  "Compare BGC parameters in the Arabian Sea for the last 6 months",
  "What are the nearest ARGO floats to coordinates 25.4°N, 157.8°W?",
  "Display temperature trends in the Pacific Ocean",
  "Find floats with recent oxygen measurements",
]

const argoResponses = {
  salinity:
    "I found 23 ARGO floats with salinity profiles in the Indian Ocean region. The average salinity was 35.2 PSU with variations between 34.8-35.6 PSU. Would you like me to show the depth profiles or map locations?",
  temperature:
    "Temperature data shows a warming trend of 0.3°C over the past decade in the Indian Ocean. Current surface temperatures range from 18-28°C depending on latitude. Shall I display the temperature-depth profiles?",
  bgc: "BGC (Biogeochemical) data from the Arabian Sea shows seasonal variations in oxygen levels (180-220 μmol/kg) and chlorophyll concentrations. 6 active BGC floats are currently monitoring this region.",
  floats:
    "I found 2 ARGO floats within 100km of those coordinates: Float 2902345 (15.1°N, 73.5°E) and Float 2902346 (15.7°N, 74.1°E). Both are active with recent profiles.",
  oxygen:
    "Currently tracking 78 floats with oxygen sensors in the Indian Ocean. Recent measurements show typical oceanic oxygen minimum zones at 800-1200m depth. Would you like specific regional data?",
}

export function FloatChat({ isMinimized }: FloatChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Indian Ocean ARGO data assistant. I can help you explore temperature, salinity, and biogeochemical data from over 240 active floats in the Indian Ocean region. Try asking about specific regions, time periods, or parameters!",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [flaggedMessageIds, setFlaggedMessageIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const buildBotResponse = (query: string) => {
    let botResponse = "I understand your query about ARGO data. Let me process that information for you."
    let responseType: "text" | "data" = "text"
    let responseData: any = null

    const lower = query.toLowerCase()

          if (lower.includes("salinity")) {
        botResponse = argoResponses.salinity
        responseType = "data"
        responseData = { type: "salinity", count: 23, avgValue: "35.2 PSU" }
    } else if (lower.includes("temperature")) {
      botResponse = argoResponses.temperature
      responseType = "data"
      responseData = { type: "temperature", trend: "+0.3°C/decade", range: "18-28°C" }
          } else if (lower.includes("bgc") || lower.includes("oxygen")) {
        botResponse = lower.includes("oxygen") ? argoResponses.oxygen : argoResponses.bgc
        responseType = "data"
        responseData = { type: "bgc", floats: lower.includes("oxygen") ? 78 : 6 }
          } else if (lower.includes("float") || lower.includes("coordinates") || lower.includes("location")) {
        botResponse = argoResponses.floats
        responseType = "data"
        responseData = { type: "location", floats: 2, coordinates: "15.4°N, 73.8°E" }
    }

    return { botResponse, responseType, responseData }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const { botResponse, responseType, responseData } = buildBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        type: responseType,
        data: responseData,
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleRetry = (botMessageId: string) => {
    const idx = messages.findIndex((m) => m.id === botMessageId)
    if (idx === -1) return
    // find the nearest previous user message as the source query
    let sourceQuery = ""
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        sourceQuery = messages[i].content
        break
      }
    }
    if (!sourceQuery) return
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const { botResponse, responseType, responseData } = buildBotResponse(sourceQuery)
      const newBotMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        type: responseType,
        data: responseData,
      }
      setMessages((prev) => [...prev, newBotMessage])
    }, 800)
  }

  const toggleFlag = (messageId: string) => {
    setFlaggedMessageIds((prev) => {
      const next = new Set(prev)
      if (next.has(messageId)) {
        next.delete(messageId)
      } else {
        next.add(messageId)
      }
      return next
    })
  }

  const handleSampleQuery = (query: string) => {
    setInputValue(query)
  }

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ${isMinimized ? "p-2 sm:p-4" : "p-4 sm:p-6 lg:p-8"}`}
    >
      <div className={`flex-1 flex flex-col ${!isMinimized ? "max-w-4xl mx-auto w-full" : ""}`}>
        <Card className="flex-1 flex flex-col shadow-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <CardHeader className={`${isMinimized ? "p-3" : "p-4 sm:p-6"} border-b border-white/20 dark:border-white/10`}>
            <CardTitle
              className={`flex items-center gap-2 ${
                isMinimized ? "text-base" : "text-2xl sm:text-3xl"
              } font-semibold text-blue-600 dark:text-blue-400`}
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                className={`${isMinimized ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"} object-contain`}
              />
              FloatChat
              <Badge
                variant="secondary"
                className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              >
                247 Active Floats
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef}>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 sm:gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <img 
                          src="/logo.png" 
                          alt="Logo" 
                          className="h-3 w-3 sm:h-4 sm:w-4 object-contain"
                        />
                      )}
                    </div>

                    <div
                      className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.sender === "user" ? "text-right" : ""}`}
                    >
                      <div
                        className={`inline-block p-2 sm:p-3 rounded-lg text-sm shadow-md ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-white/30 dark:border-slate-700"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.type === "data" && message.data && (
                        <div className="mt-2 p-3 bg-white/70 dark:bg-slate-800/70 border border-white/30 dark:border-slate-700 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            {message.data.type === "salinity" && <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />}
                            {message.data.type === "temperature" && <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />}
                            {message.data.type === "bgc" && <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />}
                            {message.data.type === "location" && <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />}
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 capitalize">
                              {message.data.type} Data
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {message.data.count && <p>Floats found: {message.data.count}</p>}
                            {message.data.avgValue && <p>Average: {message.data.avgValue}</p>}
                            {message.data.trend && <p>Trend: {message.data.trend}</p>}
                            {message.data.range && <p>Range: {message.data.range}</p>}
                            {message.data.floats && <p>Active floats: {message.data.floats}</p>}
                            {message.data.coordinates && <p>Near: {message.data.coordinates}</p>}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        {message.sender === "bot" && (
                          <div className="ml-2 flex items-center gap-2 text-slate-400">
                            <button
                              aria-label="Flag response"
                              title="Flag response"
                              onClick={() => toggleFlag(message.id)}
                              className={`transition-colors hover:text-slate-600 dark:hover:text-slate-200 ${
                                flaggedMessageIds.has(message.id)
                                  ? "text-red-500"
                                  : "text-slate-400"
                              }`}
                            >
                              <Flag className="h-3.5 w-3.5" />
                            </button>
                            <button
                              aria-label="Try again"
                              title="Try again"
                              onClick={() => handleRetry(message.id)}
                              className="transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
                      <img 
                        src="/logo.png" 
                        alt="Logo" 
                        className="h-4 w-4 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-3 rounded-lg text-sm bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-white/30 dark:border-slate-700 shadow-md">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {!isMinimized && messages.length === 1 && (
              <div className="px-3 sm:px-4 pb-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Try these sample queries:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.slice(0, 3).map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 px-2 bg-white/60 dark:bg-slate-800/60 border-white/30 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                      onClick={() => handleSampleQuery(query)}
                    >
                      {query.length > (isMinimized ? 25 : 40)
                        ? `${query.substring(0, isMinimized ? 25 : 40)}...`
                        : query}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 sm:p-4 border-t border-white/20 dark:border-white/10">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isMinimized ? "Ask about ARGO..." : "Ask about ARGO data, floats, or ocean parameters..."
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 text-sm bg-white/80 dark:bg-slate-800/80 border-white/30 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                  disabled={isTyping || !inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
