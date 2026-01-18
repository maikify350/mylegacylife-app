"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: 'Check your email for the magic link!'
            })
            setEmail("")
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Header */}
                <div className="text-center space-y-4">
                    <Link href="/">
                        <div className="inline-block text-6xl mb-4">📖</div>
                    </Link>
                    <h1 className="text-4xl font-serif font-bold">
                        Welcome Back
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Sign in to continue your story
                    </p>
                </div>

                {/* Login Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription className="text-lg">
                            We'll send you a magic link - no password needed!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="email" className="text-lg font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="text-xl"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Magic Link'}
                            </Button>

                            {message && (
                                <div
                                    className={`p-4 rounded-lg text-lg ${message.type === 'success'
                                            ? 'bg-success/10 text-success border-2 border-success'
                                            : 'bg-destructive/10 text-destructive border-2 border-destructive'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}
                        </form>

                        <div className="mt-8 pt-6 border-t-2 border-border">
                            <p className="text-lg text-muted-foreground text-center leading-relaxed">
                                Don't have an account?{' '}
                                <Link href="/auth/signup" className="text-accent font-semibold hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Info */}
                <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✉️</span>
                                <div>
                                    <h4 className="text-lg font-semibold mb-1">Check Your Email</h4>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        We'll send you a secure link. Click it to sign in instantly.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔒</span>
                                <div>
                                    <h4 className="text-lg font-semibold mb-1">No Password Needed</h4>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        Safer and easier than remembering passwords.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link href="/">
                        <Button variant="ghost" size="lg">
                            ← Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
