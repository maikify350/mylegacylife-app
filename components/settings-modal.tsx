'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

interface SubscriberProfile {
    id: string
    email: string
    phone: string | null
    full_name: string
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'about'>('profile')
    const [profile, setProfile] = useState<SubscriberProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Form state
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchProfile()
        }
    }, [isOpen])

    const fetchProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/profile')
            if (!response.ok) {
                throw new Error('Failed to load profile')
            }

            const data = await response.json()
            setProfile(data)
            setFullName(data.full_name || '')
            setEmail(data.email || '')
            setPhone(data.phone || '')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    phone: phone || null
                })
            })

            if (!response.ok) {
                throw new Error('Failed to save profile')
            }

            const updated = await response.json()
            setProfile(updated)
            setSuccessMessage('Profile updated successfully!')

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile')
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-semibold">⚙️ Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b px-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preferences'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'about'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        About
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Manage your account information
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
                                    {successMessage}
                                </div>
                            )}

                            {isLoading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Loading profile...
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone <span className="text-gray-400">(optional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Customize your experience
                            </p>
                            <div className="text-center py-8 text-gray-400">
                                Coming soon: Theme selection, notifications, and more!
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">MyLegacyLife.AI</h3>
                            <p className="text-sm text-gray-600">
                                Preserve your life story for future generations
                            </p>
                            <div className="pt-4 space-y-2 text-sm text-gray-600">
                                <p><strong>Version:</strong> 1.0.0-beta</p>
                                <p><strong>Built with:</strong> Next.js, Supabase, TypeScript</p>
                                <p><strong>© 2026</strong> MyLegacyLife.AI</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
