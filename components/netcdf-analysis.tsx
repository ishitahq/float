"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Waves, 
  BarChart3,
  File,
  X,
  Eye,
  Clock,
  MapPin
} from "lucide-react"

interface NetCDFFile {
  name: string
  size: number
  type: string
  lastModified: number
}

interface AnalysisResult {
  id: string
  fileName: string
  timestamp: string
  status: 'processing' | 'completed' | 'error'
  progress: number
  insights: {
    summary: string
    keyFindings: string[]
    oceanographicParameters: {
      temperature: {
        min: number
        max: number
        mean: number
        units: string
      }
      salinity: {
        min: number
        max: number
        mean: number
        units: string
      }
      pressure: {
        min: number
        max: number
        mean: number
        units: string
      }
      depth: {
        min: number
        max: number
        mean: number
        units: string
      }
    }
    spatialCoverage: {
      latitude: { min: number; max: number }
      longitude: { min: number; max: number }
      depth: { min: number; max: number }
    }
    temporalCoverage: {
      start: string
      end: string
      duration: string
    }
    dataQuality: {
      completeness: number
      accuracy: number
      flags: string[]
    }
    recommendations: string[]
  }
}

// Dummy analysis results for demonstration
const generateDummyAnalysis = (fileName: string): AnalysisResult => ({
  id: `analysis-${Date.now()}`,
  fileName,
  timestamp: new Date().toISOString(),
  status: 'completed',
  progress: 100,
  insights: {
    summary: "This NetCDF file contains comprehensive oceanographic data from the Indian Ocean region, showing typical seasonal variations in temperature and salinity patterns. The data quality is excellent with minimal gaps and high accuracy measurements.",
    keyFindings: [
      "Strong temperature gradient observed between surface (28.5°C) and deep waters (4.2°C)",
      "Salinity shows typical Indian Ocean values ranging from 34.2 to 35.8 PSU",
      "Mixed layer depth varies from 20m in winter to 80m in summer",
      "Significant upwelling events detected in the western Indian Ocean",
      "Data spans 2.5 years with 95% temporal coverage"
    ],
    oceanographicParameters: {
      temperature: {
        min: 4.2,
        max: 28.5,
        mean: 16.8,
        units: "°C"
      },
      salinity: {
        min: 34.2,
        max: 35.8,
        mean: 35.1,
        units: "PSU"
      },
      pressure: {
        min: 1013.2,
        max: 2500.0,
        mean: 1256.6,
        units: "hPa"
      },
      depth: {
        min: 0,
        max: 2000,
        mean: 1000,
        units: "m"
      }
    },
    spatialCoverage: {
      latitude: { min: -15.2, max: 5.8 },
      longitude: { min: 65.4, max: 95.7 },
      depth: { min: 0, max: 2000 }
    },
    temporalCoverage: {
      start: "2022-01-15T00:00:00Z",
      end: "2024-07-20T23:59:59Z",
      duration: "2 years, 6 months, 5 days"
    },
    dataQuality: {
      completeness: 95.2,
      accuracy: 98.7,
      flags: ["Good data", "Quality controlled", "CF compliant"]
    },
    recommendations: [
      "Consider extending the time series for better seasonal analysis",
      "Data is suitable for climate change impact studies",
      "High-quality dataset for ocean circulation modeling",
      "Recommended for educational and research purposes"
    ]
  }
})

export function NetCDFAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<NetCDFFile[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.toLowerCase().endsWith('.nc') || 
      file.name.toLowerCase().endsWith('.netcdf')
    )
    
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    const netcdfFiles: NetCDFFile[] = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }))
    
    setUploadedFiles(prev => [...prev, ...netcdfFiles])
    
    // Simulate processing for each file
    files.forEach((file, index) => {
      setTimeout(() => {
        processFile(file.name)
      }, index * 1000) // Stagger processing
    })
  }, [])

  const processFile = useCallback((fileName: string) => {
    setIsProcessing(true)
    
    // Create initial processing result
    const processingResult: AnalysisResult = {
      id: `analysis-${Date.now()}-${Math.random()}`,
      fileName,
      timestamp: new Date().toISOString(),
      status: 'processing',
      progress: 0,
      insights: {} as any
    }
    
    setAnalysisResults(prev => [...prev, processingResult])
    
    // Simulate processing with progress updates
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Complete the analysis
        const completedResult = generateDummyAnalysis(fileName)
        setAnalysisResults(prev => 
          prev.map(result => 
            result.id === processingResult.id ? completedResult : result
          )
        )
        setIsProcessing(false)
      } else {
        setAnalysisResults(prev => 
          prev.map(result => 
            result.id === processingResult.id 
              ? { ...result, progress: Math.floor(progress) }
              : result
          )
        )
      }
    }, 200)
  }, [])

  const removeFile = useCallback((fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName))
    setAnalysisResults(prev => prev.filter(result => result.fileName !== fileName))
  }, [])

  const downloadPDF = useCallback((result: AnalysisResult) => {
    // Simulate PDF generation and download
    const pdfContent = `
NetCDF Analysis Report
=====================

File: ${result.fileName}
Analysis Date: ${new Date(result.timestamp).toLocaleString()}

Summary
-------
${result.insights.summary}

Key Findings
------------
${result.insights.keyFindings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}

Oceanographic Parameters
-----------------------
Temperature: ${result.insights.oceanographicParameters.temperature.min} - ${result.insights.oceanographicParameters.temperature.max} ${result.insights.oceanographicParameters.temperature.units} (Mean: ${result.insights.oceanographicParameters.temperature.mean}${result.insights.oceanographicParameters.temperature.units})
Salinity: ${result.insights.oceanographicParameters.salinity.min} - ${result.insights.oceanographicParameters.salinity.max} ${result.insights.oceanographicParameters.salinity.units} (Mean: ${result.insights.oceanographicParameters.salinity.mean}${result.insights.oceanographicParameters.salinity.units})
Pressure: ${result.insights.oceanographicParameters.pressure.min} - ${result.insights.oceanographicParameters.pressure.max} ${result.insights.oceanographicParameters.pressure.units} (Mean: ${result.insights.oceanographicParameters.pressure.mean}${result.insights.oceanographicParameters.pressure.units})
Depth: ${result.insights.oceanographicParameters.depth.min} - ${result.insights.oceanographicParameters.depth.max} ${result.insights.oceanographicParameters.depth.units} (Mean: ${result.insights.oceanographicParameters.depth.mean}${result.insights.oceanographicParameters.depth.units})

Spatial Coverage
----------------
Latitude: ${result.insights.spatialCoverage.latitude.min}° to ${result.insights.spatialCoverage.latitude.max}°
Longitude: ${result.insights.spatialCoverage.longitude.min}° to ${result.insights.spatialCoverage.longitude.max}°
Depth: ${result.insights.spatialCoverage.depth.min}m to ${result.insights.spatialCoverage.depth.max}m

Temporal Coverage
-----------------
Start: ${result.insights.temporalCoverage.start}
End: ${result.insights.temporalCoverage.end}
Duration: ${result.insights.temporalCoverage.duration}

Data Quality
------------
Completeness: ${result.insights.dataQuality.completeness}%
Accuracy: ${result.insights.dataQuality.accuracy}%
Flags: ${result.insights.dataQuality.flags.join(', ')}

Recommendations
---------------
${result.insights.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Generated by Ocean Data Dashboard
${new Date().toLocaleString()}
    `
    
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `netcdf_analysis_${result.fileName.replace('.nc', '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="h-full p-6 bg-background/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <h1 className="text-3xl font-bold text-foreground mb-2">NetCDF Analysis</h1>
          <p className="text-muted-foreground">
            Upload any NetCDF file and get clear, easy-to-understand insights from your ocean data
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload Area */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload NetCDF Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/30 hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Drop NetCDF files here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse your computer
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".nc,.netcdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports .nc and .netcdf files
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Uploaded Files ({uploadedFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Processing Status */}
            {analysisResults.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Analysis Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResults.map((result) => (
                    <div key={result.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{result.fileName}</span>
                        <Badge 
                          variant={result.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            result.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : ''
                          }
                        >
                          {result.status === 'completed' ? 'Completed' : 'Processing'}
                        </Badge>
                      </div>
                      {result.status === 'processing' && (
                        <div className="space-y-1">
                          <Progress value={result.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {result.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysisResults.filter(result => result.status === 'completed').map((result) => (
              <Card key={result.id} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Analysis Results
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPDF(result)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.insights.summary}
                    </p>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h3 className="font-semibold mb-2">Key Findings</h3>
                    <ul className="space-y-1">
                      {result.insights.keyFindings.map((finding, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary font-bold">{index + 1}.</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Oceanographic Parameters */}
                  <div>
                    <h3 className="font-semibold mb-3">Oceanographic Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Temperature</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          <p>Range: {result.insights.oceanographicParameters.temperature.min} - {result.insights.oceanographicParameters.temperature.max} {result.insights.oceanographicParameters.temperature.units}</p>
                          <p>Mean: {result.insights.oceanographicParameters.temperature.mean} {result.insights.oceanographicParameters.temperature.units}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-cyan-500" />
                          <span className="text-sm font-medium">Salinity</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          <p>Range: {result.insights.oceanographicParameters.salinity.min} - {result.insights.oceanographicParameters.salinity.max} {result.insights.oceanographicParameters.salinity.units}</p>
                          <p>Mean: {result.insights.oceanographicParameters.salinity.mean} {result.insights.oceanographicParameters.salinity.units}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-medium">Pressure</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          <p>Range: {result.insights.oceanographicParameters.pressure.min} - {result.insights.oceanographicParameters.pressure.max} {result.insights.oceanographicParameters.pressure.units}</p>
                          <p>Mean: {result.insights.oceanographicParameters.pressure.mean} {result.insights.oceanographicParameters.pressure.units}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Depth</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          <p>Range: {result.insights.oceanographicParameters.depth.min} - {result.insights.oceanographicParameters.depth.max} {result.insights.oceanographicParameters.depth.units}</p>
                          <p>Mean: {result.insights.oceanographicParameters.depth.mean} {result.insights.oceanographicParameters.depth.units}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spatial Coverage */}
                  <div>
                    <h3 className="font-semibold mb-2">Spatial Coverage</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Latitude</p>
                        <p className="font-medium">
                          {result.insights.spatialCoverage.latitude.min}° to {result.insights.spatialCoverage.latitude.max}°
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Longitude</p>
                        <p className="font-medium">
                          {result.insights.spatialCoverage.longitude.min}° to {result.insights.spatialCoverage.longitude.max}°
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Depth</p>
                        <p className="font-medium">
                          {result.insights.spatialCoverage.depth.min}m to {result.insights.spatialCoverage.depth.max}m
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Temporal Coverage */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Temporal Coverage
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Start:</span> {new Date(result.insights.temporalCoverage.start).toLocaleDateString()}</p>
                      <p><span className="text-muted-foreground">End:</span> {new Date(result.insights.temporalCoverage.end).toLocaleDateString()}</p>
                      <p><span className="text-muted-foreground">Duration:</span> {result.insights.temporalCoverage.duration}</p>
                    </div>
                  </div>

                  {/* Data Quality */}
                  <div>
                    <h3 className="font-semibold mb-2">Data Quality</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Completeness</p>
                        <p className="font-medium">{result.insights.dataQuality.completeness}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{result.insights.dataQuality.accuracy}%</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-muted-foreground text-sm">Quality Flags:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.insights.dataQuality.flags.map((flag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {result.insights.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary font-bold">{index + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* No results message */}
            {analysisResults.length === 0 && (
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
                  <p className="text-muted-foreground text-center">
                    Upload NetCDF files to see detailed oceanographic analysis results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
