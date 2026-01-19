"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { checkGrammar } from '@/lib/languagetool'

interface ContributeQuestionDialogProps {
    open: boolean
    onClose: () => void
}

export function ContributeQuestionDialog({ open, onClose }: ContributeQuestionDialogProps) {
    const [step, setStep] = useState<'welcome' | 'submit' | 'success'>('welcome')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [questionText, setQuestionText] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [showGrammarDialog, setShowGrammarDialog] = useState(false)
    const [grammarResults, setGrammarResults] = useState<{ count: number; errors: string }>({ count: 0, errors: '' })

    const handleStart = () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }
        setError('')
        setStep('submit')
    }

    const handleProofread = async () => {
        if (!questionText.trim()) {
            setError('Please write a question first!')
            return
        }

        try {
            const matches = await checkGrammar(questionText)
            if (matches.length === 0) {
                setGrammarResults({ count: 0, errors: '✓ No grammar or spelling errors found!' })
            } else {
                const errors = matches.slice(0, 3).map((match, i) =>
                    `${i + 1}. ${match.message}\n   Suggestion: ${match.replacements[0]?.value || 'N/A'}`
                ).join('\n\n')
                setGrammarResults({
                    count: matches.length,
                    errors: `${errors}${matches.length > 3 ? '\n\n...and more' : ''}`
                })
            }
            setShowGrammarDialog(true)
        } catch (err) {
            setGrammarResults({ count: 0, errors: 'Error checking grammar. Please try again.' })
            setShowGrammarDialog(true)
        }
    }

    const handleSubmit = async (addMore: boolean = false) => {
        if (!questionText.trim()) {
            setError('Please enter a question')
            return
        }

        if (questionText.length < 10) {
            setError('Question must be at least 10 characters')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/contribute-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    phone: phone || null,
                    question_text: questionText
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to submit question')
                return
            }

            if (addMore) {
                setQuestionText('')
                setError('')
            } else {
                setStep('success')
            }
        } catch (err) {
            setError('Network error. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setStep('welcome')
        setEmail('')
        setPhone('')
        setQuestionText('')
        setError('')
        onClose()
    }

    const handleAddMore = () => {
        setStep('submit')
        setQuestionText('')
        setError('')
    }

    return (
        <>
            <AlertDialog open={open} onOpenChange={handleClose}>
                <AlertDialogContent className="max-w-2xl">
                    {step === 'welcome' && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">Thank You for Contributing! 🎁</AlertDialogTitle>
                                <AlertDialogDescription className="text-base space-y-4 pt-4">
                                    <p>
                                        Thank you for taking the moment to contribute questions! For your efforts, we will provide
                                        you with credits in our software or gifts that we randomly select on a monthly basis.
                                    </p>
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="font-semibold mb-2">Examples of rewards:</p>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Engraved coaster with your monogram</li>
                                            <li>MyLegacyLife subscription credits</li>
                                            <li>And more!</li>
                                        </ul>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            {/* Input fields outside AlertDialogDescription so they're editable */}
                            <div className="space-y-3 px-6 pb-2">
                                <div>
                                    <label htmlFor="contributor-email" className="text-sm font-medium">Email (Required)</label>
                                    <Input
                                        id="contributor-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contributor-phone" className="text-sm font-medium">Phone (Optional)</label>
                                    <Input
                                        id="contributor-phone"
                                        name="tel"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="(555) 123-4567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                {error && <p className="text-destructive text-sm">{error}</p>}
                            </div>
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleStart} className="bg-[#4A3728] hover:bg-[#5A4738]">
                                    Start Contributing
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}

                    {step === 'submit' && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Submit a Question</AlertDialogTitle>
                                <AlertDialogDescription className="space-y-4 pt-4">
                                    <div>
                                        <Textarea
                                            placeholder="Type your question here... (e.g., What was your favorite childhood memory?)"
                                            value={questionText}
                                            onChange={(e) => setQuestionText(e.target.value)}
                                            className="min-h-[120px] text-base"
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {questionText.length}/500 characters
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleProofread}
                                        disabled={!questionText.trim()}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        PROOFREAD
                                    </Button>
                                    {error && <p className="text-destructive text-sm">{error}</p>}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={handleClose} disabled={submitting}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmit(true)}
                                    disabled={submitting || !questionText.trim()}
                                >
                                    Submit & Add More
                                </Button>
                                <AlertDialogAction
                                    onClick={() => handleSubmit(false)}
                                    disabled={submitting || !questionText.trim()}
                                    className="bg-[#4A3728] hover:bg-[#5A4738]"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Question'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}

                    {step === 'success' && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">Question Submitted! ✅</AlertDialogTitle>
                                <AlertDialogDescription className="text-base space-y-4 pt-4">
                                    <p>
                                        Your question will be evaluated for duplicates against our bank of questions and you'll be
                                        notified via email to claim your reward.
                                    </p>
                                    <p className="font-semibold">
                                        Thank you for contributing to MyLegacyLife.AI!
                                    </p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={handleAddMore}>
                                    Submit Another Question
                                </Button>
                                <AlertDialogAction onClick={handleClose} className="bg-[#4A3728] hover:bg-[#5A4738]">
                                    Close
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>

            {/* Grammar Check Results Dialog */}
            <AlertDialog open={showGrammarDialog} onOpenChange={setShowGrammarDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {grammarResults.count === 0 ? 'Grammar Check' : `Found ${grammarResults.count} issue(s)`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="whitespace-pre-wrap">
                            {grammarResults.errors}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-[#4A3728] hover:bg-[#5A4738]">
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
