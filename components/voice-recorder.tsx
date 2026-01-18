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
                    if (event.error === 'no-speech') {
                        // User stopped speaking, this is normal
                        return
                    }
                    setIsRecording(false)
                    setIsPaused(false)
                }

                recognitionRef.current.onend = () => {
                    if (isRecording && !isPaused) {
                        // Restart if we're still supposed to be recording
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

        recognitionRef.current.start()

        // Start timer
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

    if (!isSupported) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>Voice Recording Not Supported</CardTitle>
                    <CardDescription>
                        Your browser doesn't support voice recording. Please use Chrome, Safari, or Edge.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <svg
                        className="w-8 h-8 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                    </svg>
                    Record Your Story
                </CardTitle>
                <CardDescription>
                    Tap the microphone button and speak naturally. Your words will appear below.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Recording Controls */}
                <div className="flex flex-col items-center gap-6">
                    {!isRecording ? (
                        <Button
                            variant="voice"
                            size="xl"
                            onClick={startRecording}
                            className="w-full"
                        >
                            <svg
                                className="w-12 h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                            Start Recording
                        </Button>
                    ) : (
                        <div className="w-full space-y-4">
                            {/* Recording indicator */}
                            <div className="flex items-center justify-center gap-4 p-6 bg-accent/10 rounded-xl border-2 border-accent">
                                <div className={cn(
                                    "w-4 h-4 rounded-full bg-destructive",
                                    !isPaused && "animate-pulse"
                                )} />
                                <span className="text-3xl font-bold font-mono">
                                    {formatTime(duration)}
                                </span>
                                <span className="text-xl text-muted-foreground">
                                    {isPaused ? "Paused" : "Recording..."}
                                </span>
                            </div>

                            {/* Control buttons */}
                            <div className="flex gap-4">
                                {!isPaused ? (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={pauseRecording}
                                        className="flex-1"
                                    >
                                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                        Pause
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={resumeRecording}
                                        className="flex-1"
                                    >
                                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Resume
                                    </Button>
                                )}

                                <Button
                                    variant="default"
                                    size="lg"
                                    onClick={stopRecording}
                                    className="flex-1"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 6h12v12H6z" />
                                    </svg>
                                    Stop
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transcript */}
                {transcript && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xl font-semibold">Your Story</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearTranscript}
                            >
                                Clear
                            </Button>
                        </div>

                        <Textarea
                            value={transcript}
                            onChange={(e) => {
                                setTranscript(e.target.value)
                                onTranscriptChange?.(e.target.value)
                            }}
                            placeholder="Your story will appear here as you speak..."
                            className="min-h-[200px] text-lg leading-relaxed"
                        />

                        <p className="text-base text-muted-foreground">
                            You can edit the text above if needed. The recording captures your voice, and you can refine the words.
                        </p>
                    </div>
                )}

                {!transcript && !isRecording && (
                    <div className="text-center p-8 bg-muted/30 rounded-xl">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Tap "Start Recording" and begin speaking. Your words will appear here automatically.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
