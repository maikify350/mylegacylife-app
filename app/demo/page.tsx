"use client"

import { VoiceRecorder } from "@/components/voice-recorder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoPage() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block">
                        <Button variant="ghost" size="lg">
                            ← Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-5xl font-serif font-bold">
                        Voice Recorder Demo
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Try our voice-first storytelling experience. Just speak naturally!
                    </p>
                </div>

                {/* Sample Question */}
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <CardTitle className="text-3xl">Today's Question</CardTitle>
                        <CardDescription className="text-xl">
                            Take your time and speak from the heart
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-serif leading-relaxed">
                            What is your earliest childhood memory? Describe it in as much detail as you can remember.
                        </p>
                    </CardContent>
                </Card>

                {/* Voice Recorder */}
                <VoiceRecorder
                    onTranscriptChange={(transcript) => {
                        console.log("Transcript updated:", transcript)
                    }}
                />

                {/* Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Tap "Start Recording"</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    The large button with the microphone icon. Your browser may ask for microphone permission.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Speak Naturally</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Just talk as if you're telling a story to a friend. Your words will appear as text automatically.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Pause or Stop</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Take breaks anytime. You can pause, resume, or stop when you're done. Edit the text if needed.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Browser Support */}
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Browser Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                            Voice recording works best on:
                        </p>
                        <ul className="space-y-2 text-lg">
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <span>Chrome (Desktop & Android)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <span>Safari (Mac, iPhone, iPad)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <span>Microsoft Edge</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
