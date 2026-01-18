"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface SavedAnswer {
    id: string
    question_id: string
    question_text: string
    answer_text: string
    created_at: string
}

export default function MyStoriesPage() {
    const [stories, setStories] = useState<SavedAnswer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStories()
    }, [])

    const loadStories = () => {
        try {
            const savedAnswers = JSON.parse(localStorage.getItem('mylegacylife_answers') || '[]')
            setStories(savedAnswers.reverse()) // Most recent first
        } catch (error) {
            console.error('Error loading stories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this story?')) {
            const savedAnswers = JSON.parse(localStorage.getItem('mylegacylife_answers') || '[]')
            const filtered = savedAnswers.filter((a: SavedAnswer) => a.id !== id)
            localStorage.setItem('mylegacylife_answers', JSON.stringify(filtered))
            loadStories()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">📚</div>
                    <p className="text-2xl text-muted-foreground">Loading your stories...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-5xl font-serif font-bold mb-2">
                            My Stories
                        </h1>
                        <p className="text-2xl text-muted-foreground">
                            {stories.length} {stories.length === 1 ? 'story' : 'stories'} preserved
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/answer">
                            <Button size="lg" variant="voice">
                                <svg
                                    className="w-8 h-8 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Add New Story
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                {stories.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Total Stories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-primary">
                                    {stories.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-accent">
                                    {Math.round((stories.length / 60) * 100)}%
                                </div>
                                <p className="text-lg text-muted-foreground mt-2">
                                    of 60 questions
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Latest Story</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">
                                    {formatDate(stories[0].created_at)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Stories List */}
                {stories.length === 0 ? (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="text-6xl mb-6">📝</div>
                            <h2 className="text-3xl font-serif font-bold mb-4">
                                No Stories Yet
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                Start sharing your memories today. Your family will treasure them forever.
                            </p>
                            <Link href="/answer">
                                <Button size="xl" variant="voice">
                                    <svg
                                        className="w-10 h-10 mr-3"
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
                                    Record Your First Story
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {stories.map((story) => (
                            <Card key={story.id} className="hover:border-accent transition-colors">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl mb-2">
                                                {story.question_text}
                                            </CardTitle>
                                            <CardDescription className="text-lg">
                                                {formatDate(story.created_at)}
                                            </CardDescription>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(story.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                            {story.answer_text}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t-2 border-border flex items-center justify-between">
                                        <div className="text-base text-muted-foreground">
                                            {story.answer_text.split(' ').length} words
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Add Photo
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {stories.length > 0 && stories.length < 60 && (
                    <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent">
                        <CardContent className="pt-8 pb-8 text-center">
                            <h3 className="text-3xl font-serif font-bold mb-4">
                                Keep Going!
                            </h3>
                            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                                You're doing great! {60 - stories.length} more {stories.length === 59 ? 'story' : 'stories'} until your book is complete.
                            </p>
                            <Link href="/answer">
                                <Button size="xl" variant="voice">
                                    Answer Another Question
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
