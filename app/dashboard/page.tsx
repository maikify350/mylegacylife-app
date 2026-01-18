import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/auth/login')
    }

    // Fetch user's profile
    const { data: profile } = await supabase
        .from('subscriber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Fetch user's answers count
    const { count: answersCount } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'submitted')

    // Fetch total questions
    const { count: totalQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_enabled', true)

    const progress = totalQuestions ? Math.round(((answersCount || 0) / totalQuestions) * 100) : 0

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-serif font-bold mb-2">
                            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
                        </h1>
                        <p className="text-2xl text-muted-foreground">
                            Continue sharing your stories
                        </p>
                    </div>

                    <form action="/auth/signout" method="post">
                        <Button variant="outline" size="lg" type="submit">
                            Sign Out
                        </Button>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Stories Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-primary">
                                {answersCount || 0}
                            </div>
                            <p className="text-lg text-muted-foreground mt-2">
                                out of {totalQuestions || 60}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-accent">
                                {progress}%
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 mt-4">
                                <div
                                    className="bg-accent h-3 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Weeks Left</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-success">
                                {Math.max(0, 52 - (answersCount || 0))}
                            </div>
                            <p className="text-lg text-muted-foreground mt-2">
                                until your book
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent">
                    <CardHeader>
                        <CardTitle className="text-3xl">Ready to answer today's question?</CardTitle>
                        <CardDescription className="text-xl">
                            Share your memories and preserve your legacy
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/answer" className="flex-1">
                                <Button variant="voice" size="xl" className="w-full">
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
                                    Answer This Week's Question
                                </Button>
                            </Link>

                            <Link href="/questions">
                                <Button variant="outline" size="lg" className="h-full px-8">
                                    Browse All Questions
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">Your Recent Stories</CardTitle>
                        <CardDescription className="text-xl">
                            {answersCount ? 'Keep up the great work!' : 'Start your first story today'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {answersCount === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-semibold mb-2">No stories yet</h3>
                                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                                    Start sharing your memories today. Your family will treasure them forever.
                                </p>
                                <Link href="/answer">
                                    <Button size="lg">
                                        Answer Your First Question
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-xl text-muted-foreground">
                                Recent stories list coming soon...
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/gallery">
                        <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                            <CardContent className="pt-6 text-center">
                                <div className="text-5xl mb-4">📸</div>
                                <h3 className="text-2xl font-semibold mb-2">Photo Gallery</h3>
                                <p className="text-lg text-muted-foreground">
                                    Upload and manage your photos
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/family-tree">
                        <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                            <CardContent className="pt-6 text-center">
                                <div className="text-5xl mb-4">🌳</div>
                                <h3 className="text-2xl font-semibold mb-2">Family Tree</h3>
                                <p className="text-lg text-muted-foreground">
                                    Build your family tree
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/book-preview">
                        <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                            <CardContent className="pt-6 text-center">
                                <div className="text-5xl mb-4">📚</div>
                                <h3 className="text-2xl font-semibold mb-2">Book Preview</h3>
                                <p className="text-lg text-muted-foreground">
                                    See your book taking shape
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
