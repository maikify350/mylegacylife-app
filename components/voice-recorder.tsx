"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
    onTranscriptChange?: (transcript: string) => void
    initialTranscript?: string
    className?: string
}

export function VoiceRecorder({
    onTranscriptChange,
    initialTranscript = "",
    className,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [transcript, setTranscript] = useState(initialTranscript)
    const [duration, setDuration] = useState(0)
    const [isSupported, setIsSupported] = useState(true)
    const [showPermissionHelp, setShowPermissionHelp] = useState(false)

    const recognitionRef = useRef<any>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Check if Web Speech API is supported
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            setIsSupported(!!SpeechRecognition)

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = true
                recognitionRef.current.interimResults = true
                recognitionRef.current.lang = 'en-US'

                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = ''
                    let finalTranscript = transcript

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcriptPiece = event.results[i][0].transcript
                        if (event.results[i].isFinal) {
                            finalTranscript += transcriptPiece + ' '
                        } else {
                            interimTranscript += transcriptPiece
                        }
                    }

                    const newTranscript = finalTranscript + interimTranscript
                    setTranscript(newTranscript)
                    onTranscriptChange?.(newTranscript)
                }

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error)
                    if (event.error === 'not-allowed') {
                        setShowPermissionHelp(true)
                    }
                    if (event.error === 'no-speech') {
                        return
                    }
                    setIsRecording(false)
                    setIsPaused(false)
                }

                recognitionRef.current.onend = () => {
                    if (isRecording && !isPaused) {
                        recognitionRef.current?.start()
                    }
                }
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    const startRecording = () => {
        if (!recognitionRef.current) return

        setIsRecording(true)
        setIsPaused(false)
        setDuration(0)
        setShowPermissionHelp(false)

        try {
            recognitionRef.current.start()
        } catch (error) {
            console.error('Failed to start recording:', error)
            setShowPermissionHelp(true)
        }

        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)
    }

    const pauseRecording = () => {
        if (!recognitionRef.current) return

        setIsPaused(true)
        recognitionRef.current.stop()

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
    }

    const resumeRecording = () => {
        if (!recognitionRef.current) return

        setIsPaused(false)
        recognitionRef.current.start()

        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)
    }

    const stopRecording = () => {
        if (!recognitionRef.current) return

        setIsRecording(false)
        setIsPaused(false)
        recognitionRef.current.stop()

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
    }

    const clearTranscript = () => {
        setTranscript("")
        setDuration(0)
        onTranscriptChange?.("")
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Write or Dictate Your Story
                </CardTitle>
                <CardDescription className="text-lg">
                    <strong>💡 Recommended:</strong> Press <kbd className="px-2 py-1 bg-muted rounded border text-sm">Win</kbd> + <kbd className="px-2 py-1 bg-muted rounded border text-sm">H</kbd> (Windows) or <kbd className="px-2 py-1 bg-muted rounded border text-sm">Fn</kbd> + <kbd className="px-2 py-1 bg-muted rounded border text-sm">Fn</kbd> (Mac) for voice dictation
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Primary Textarea */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xl font-semibold">Your Story</label>
                        {transcript && (
                            <Button variant="ghost" size="sm" onClick={clearTranscript}>
                                Clear
                            </Button>
                        )}
                    </div>

                    <Textarea
                        value={transcript}
                        onChange={(e) => {
                            setTranscript(e.target.value)
                            onTranscriptChange?.(e.target.value)
                        }}
                        placeholder="Click here and start typing... or use voice dictation (Win+H on Windows, Fn+Fn on Mac)"
                        className="min-h-[300px] text-lg leading-relaxed"
                        autoFocus
                    />

                    <div className="flex items-start gap-2 p-4 bg-info/10 rounded-lg border border-info/20">
                        <span className="text-2xl">🎤</span>
                        <div className="flex-1">
                            <p className="text-base leading-relaxed">
                                <strong>Easy Voice Dictation:</strong> Click in the text box above, then press:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                                <li><strong>Windows:</strong> <kbd className="px-1.5 py-0.5 bg-background rounded text-sm">Win+H</kbd> to start dictating</li>
                                <li><strong>Mac:</strong> Press <kbd className="px-1.5 py-0.5 bg-background rounded text-sm">Fn</kbd> key twice to start dictation</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-2">
                                Your spoken words will appear where your cursor is. This works everywhere and doesn't require browser permissions!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Optional: Browser Microphone */}
                {isSupported && (
                    <details className="group">
                        <summary className="cursor-pointer list-none">
                            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                <svg className="w-6 h-6 text-accent group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-lg font-semibold">Optional: Browser Microphone (Advanced)</span>
                            </div>
                        </summary>

                        <div className="mt-4 space-y-4 pl-4">
                            <p className="text-base text-muted-foreground">
                                This uses your browser's speech recognition. <strong>You'll need to grant microphone permission.</strong> Windows/Mac dictation is easier!
                            </p>

                            {showPermissionHelp && (
                                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <span>⚠️</span> Microphone Permission Needed
                                    </h4>
                                    <div className="space-y-2 text-base">
                                        <p><strong>Chrome/Edge (Windows/Mac):</strong></p>
                                        <ol className="list-decimal list-inside space-y-1 ml-4">
                                            <li>Click the 🔒 lock icon in the address bar</li>
                                            <li>Find "Microphone" and select "Allow"</li>
                                            <li>Refresh the page and try again</li>
                                        </ol>

                                        <p className="mt-3"><strong>Safari (Mac):</strong></p>
                                        <ol className="list-decimal list-inside space-y-1 ml-4">
                                            <li>Safari menu → Settings → Websites → Microphone</li>
                                            <li>Find this website and select "Allow"</li>
                                            <li>Refresh the page</li>
                                        </ol>

                                        <p className="mt-3"><strong>Firefox:</strong></p>
                                        <ol className="list-decimal list-inside space-y-1 ml-4">
                                            <li>Click the 🔒 icon → More Information</li>
                                            <li>Permissions tab → Microphone → Allow</li>
                                            <li>Refresh the page</li>
                                        </ol>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-6">
                                {!isRecording ? (
                                    <Button variant="voice" size="xl" onClick={startRecording} className="w-full">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                        Start Browser Recording
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-center gap-4 p-6 bg-accent/10 rounded-xl border-2 border-accent">
                                            <div className={cn("w-4 h-4 rounded-full bg-destructive", !isPaused && "animate-pulse")} />
                                            <span className="text-3xl font-bold font-mono">{formatTime(duration)}</span>
                                            <span className="text-xl text-muted-foreground">{isPaused ? "Paused" : "Recording..."}</span>
                                        </div>

                                        <div className="flex gap-4">
                                            {!isPaused ? (
                                                <Button variant="outline" size="lg" onClick={pauseRecording} className="flex-1">
                                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                    </svg>
                                                    Pause
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="lg" onClick={resumeRecording} className="flex-1">
                                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    Resume
                                                </Button>
                                            )}

                                            <Button variant="default" size="lg" onClick={stopRecording} className="flex-1">
                                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 6h12v12H6z" />
                                                </svg>
                                                Stop
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </details>
                )}
            </CardContent>
        </Card>
    )
}
