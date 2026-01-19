import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
    const supabase = await createClient()

    // Fetch all enabled questions
    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_enabled', true)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching questions:', error)
    }

    const questionCount = questions?.length || 0

    // Group questions by category (based on order - first 10 are childhood, etc.)
    const categories = [
        { name: 'Childhood & Early Years', start: 0, count: 10, icon: '🧒' },
        { name: 'Family & Relationships', start: 10, count: 10, icon: '👨‍👩‍👧‍👦' },
        { name: 'Career & Achievements', start: 20, count: 8, icon: '💼' },
        { name: 'Life Lessons & Wisdom', start: 28, count: 10, icon: '💡' },
        { name: 'Memorable Moments', start: 38, count: 10, icon: '⭐' },
        { name: 'Interests & Hobbies', start: 48, count: 6, icon: '🎨' },
        { name: 'Legacy & Reflection', start: 54, count: 6, icon: '🏆' },
    ]

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Link href="/">
                        <Button variant="ghost" size="lg">
                            ← Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-5xl font-serif font-bold">
                        Story Questions
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {questionCount} thoughtful questions to help you share your life's memories
                    </p>
                </div>

                {/* Stats Card */}
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent style={{ padding: '8px' }}>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div style={{ lineHeight: 1 }}>
                                <div className="text-4xl font-bold text-primary">{questionCount}</div>
                                <div className="text-lg text-muted-foreground">Total Questions</div>
                            </div>
                            <div style={{ lineHeight: 1 }}>
                                <div className="text-4xl font-bold text-accent">52</div>
                                <div className="text-lg text-muted-foreground">Weeks of Stories</div>
                            </div>
                            <div style={{ lineHeight: 1 }}>
                                <div className="text-4xl font-bold text-success">1</div>
                                <div className="text-lg text-muted-foreground">Beautiful Book</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions by Category */}
                {categories.map((category) => {
                    const categoryQuestions = questions?.slice(category.start, category.start + category.count) || []

                    return (
                        <Card key={category.name}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-3xl">
                                    <span className="text-4xl">{category.icon}</span>
                                    {category.name}
                                </CardTitle>
                                <CardDescription className="text-xl">
                                    {category.count} questions in this category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {categoryQuestions.map((question, index) => (
                                        <div
                                            key={question.id}
                                            className="rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-accent"
                                            style={{ padding: '4px' }}
                                        >
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg font-bold">
                                                    {category.start + index + 1}
                                                </div>
                                                <p className="text-xl flex-1" style={{ lineHeight: 1.2 }}>
                                                    {question.question_text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {/* CTA */}
                <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent">
                    <CardContent className="pt-8 text-center space-y-6">
                        <h2 className="text-3xl font-serif font-bold">
                            Ready to start answering?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Try our voice recorder and see how easy it is to share your stories.
                        </p>
                        <Link href="/demo">
                            <Button variant="voice" size="xl" className="mx-auto">
                                <svg
                                    className="w-10 h-10"
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
                                Try Voice Recording
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Footer Navigation */}
                <div className="flex justify-center pt-8">
                    <Link href="/">
                        <Button variant="outline" size="xl" className="min-w-[250px]">
                            ← Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
