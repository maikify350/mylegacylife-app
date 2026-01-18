"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
    id: string
    question_text: string
}

export default function AnswerPage() {
    const [question, setQuestion] = useState<Question | null>(null)
    const [transcript, setTranscript] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadRandomQuestion()
    }, [])

    const loadRandomQuestion = async () => {
        setLoading(true)

        // Get a random question
        const { data: questions, error } = await supabase
            .from('questions')
            .select('*')
            .eq('is_enabled', true)
            .limit(10)

        if (error) {
            console.error('Error loading questions:', error)
            setLoading(false)
            return
        }

        if (questions && questions.length > 0) {
            // Pick a random one
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
            setQuestion(randomQuestion)
        }

        setLoading(false)
    }

    const handleSave = async () => {
        if (!transcript.trim()) {
            alert('Please record or type your answer first!')
            return
        }

        setSaving(true)

        try {
            // For now, just save to localStorage (no auth)
            const savedAnswers = JSON.parse(localStorage.getItem('mylegacylife_answers') || '[]')

            const newAnswer = {
                id: Date.now().toString(),
                question_id: question?.id,
                question_text: question?.question_text,
                answer_text: transcript,
                created_at: new Date().toISOString(),
            }

            savedAnswers.push(newAnswer)
            localStorage.setItem('mylegacylife_answers', JSON.stringify(savedAnswers))

            setSaved(true)

            // Show success message
            setTimeout(() => {
                router.push('/my-stories')
            }, 2000)
        } catch (error) {
            console.error('Error saving answer:', error)
            alert('Failed to save. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleSkip = () => {
        if (confirm('Skip this question and get a new one?')) {
            setTranscript("")
            loadRandomQuestion()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">📖</div>
                    <p className="text-2xl text-muted-foreground">Loading your question...</p>
                </div>
            </div>
        )
    }

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <Card className="max-w-2xl">
                    <CardContent className="pt-8 text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-3xl font-serif font-bold mb-4">No Questions Available</h2>
                        <p className="text-xl text-muted-foreground mb-6">
                            Please check back later or contact support.
                        </p>
                        <Link href="/">
                            <Button size="lg">Go Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="lg">
                            ← Back
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSkip}
                        disabled={saving}
                    >
                        Skip Question
                    </Button>
                </div>

                {/* Question Card */}
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent">
                    <CardHeader>
                        <CardTitle className="text-3xl">Today's Question</CardTitle>
                        <CardDescription className="text-xl">
                            Take your time and speak from the heart
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl md:text-3xl font-serif leading-relaxed">
                            {question.question_text}
                        </p>
                    </CardContent>
                </Card>

                {/* Voice Recorder */}
                <VoiceRecorder
                    onTranscriptChange={setTranscript}
                    initialTranscript={transcript}
                />

                {/* Save Button */}
                {transcript && (
                    <Card className="bg-gradient-to-br from-success/10 to-accent/10 border-2 border-success">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-2xl font-semibold mb-2">
                                        {saved ? 'Story Saved! 🎉' : 'Ready to save your story?'}
                                    </h3>
                                    <p className="text-lg text-muted-foreground">
                                        {saved
                                            ? 'Redirecting to your stories...'
                                            : 'Your story will be preserved for future generations'
                                        }
                                    </p>
                                </div>

                                {!saved && (
                                    <Button
                                        size="xl"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="min-w-[200px]"
                                    >
                                        {saving ? 'Saving...' : 'Save Story'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Tips for Great Stories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3 items-start">
                            <span className="text-2xl">💭</span>
                            <div>
                                <h4 className="text-xl font-semibold mb-1">Be Specific</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Include details like names, places, dates, and sensory details (sights, sounds, smells).
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="text-2xl">❤️</span>
                            <div>
                                <h4 className="text-xl font-semibold mb-1">Share Emotions</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    How did you feel? What did you learn? Why does this memory matter to you?
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="text-2xl">🎯</span>
                            <div>
                                <h4 className="text-xl font-semibold mb-1">Don't Worry About Perfection</h4>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Your authentic voice is what matters. You can always edit later.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
