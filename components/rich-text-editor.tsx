"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import CharacterCount from '@tiptap/extension-character-count'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { ImageEditorDialog } from './image-editor-dialog'
import { checkGrammar } from '@/lib/languagetool'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface RichTextEditorProps {
    content: string
    onUpdate: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onUpdate, placeholder }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showImageEditor, setShowImageEditor] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showHighlightPicker, setShowHighlightPicker] = useState(false)
    const [showGrammarDialog, setShowGrammarDialog] = useState(false)
    const [grammarResults, setGrammarResults] = useState<{ count: number; errors: string }>({ count: 0, errors: '' })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            BulletList,
            OrderedList,
            ListItem,
            CharacterCount,
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[260px] p-4 text-lg',
                spellcheck: 'true',
            },
        },
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target?.result as string
            setSelectedImage(base64)
            setShowImageEditor(true)
        }
        reader.readAsDataURL(file)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleImageSave = (editedImage: string, caption: string) => {
        if (!editor) return

        editor.chain().focus().setImage({
            src: editedImage,
            alt: caption || undefined,
            title: caption || undefined,
        }).run()

        setShowImageEditor(false)
        setSelectedImage('')
    }

    const handleProofread = async () => {
        if (!editor) return

        const text = editor.getText()
        if (!text.trim()) {
            setGrammarResults({ count: 0, errors: 'Please write some text first!' })
            setShowGrammarDialog(true)
            return
        }

        try {
            const matches = await checkGrammar(text)

            if (matches.length === 0) {
                setGrammarResults({ count: 0, errors: '✓ No grammar or spelling errors found!' })
            } else {
                const errors = matches.slice(0, 5).map((match, i) =>
                    `${i + 1}. ${match.message}\n   Suggestion: ${match.replacements[0]?.value || 'N/A'}`
                ).join('\n\n')

                setGrammarResults({
                    count: matches.length,
                    errors: `${errors}${matches.length > 5 ? '\n\n...and more' : ''}`
                })
            }
            setShowGrammarDialog(true)
        } catch (error) {
            setGrammarResults({ count: 0, errors: 'Error checking grammar. Please try again.' })
            setShowGrammarDialog(true)
        }
    }

    if (!editor) {
        return null
    }

    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    const highlights = ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', 'transparent']

    return (
        <div className="border-2 border-black rounded-lg bg-background resize-y overflow-auto" style={{ minHeight: '260px' }}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b-2 border-input bg-muted/30">
                {/* Left side - Formatting buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-accent' : ''}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-accent' : ''}
                        title="Italic"
                    >
                        <em>I</em>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'bg-accent' : ''}
                        title="Underline"
                    >
                        <u>U</u>
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                        title="Bullet List"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
                        title="Numbered List"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
                        </svg>
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Text Color */}
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            title="Text Color"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </Button>
                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-white border-2 border-black rounded-lg shadow-lg z-50 flex gap-1">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-black"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run()
                                            setShowColorPicker(false)
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Highlight Color */}
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                            title="Highlight"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </Button>
                        {showHighlightPicker && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-white border-2 border-black rounded-lg shadow-lg z-50 flex gap-1">
                                {highlights.map(color => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-black"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            if (color === 'transparent') {
                                                editor.chain().focus().unsetHighlight().run()
                                            } else {
                                                editor.chain().focus().setHighlight({ color }).run()
                                            }
                                            setShowHighlightPicker(false)
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                        </svg>
                    </Button>
                </div>

                {/* Right side - PHOTO and PROOFREAD */}
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        title="Insert Photo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="ml-1">PHOTO</span>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleProofread}
                        title="Check Grammar & Spelling"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ml-1">PROOFREAD</span>
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Character and Word Counter with Reading Time */}
            <div className="text-xs text-muted-foreground mt-1 px-2">
                {(() => {
                    const chars = editor?.storage.characterCount?.characters() || 0
                    const words = editor?.storage.characterCount?.words() || 0
                    const readingTimeMinutes = Math.ceil(words / 200) // 200 words per minute average
                    const readingTime = readingTimeMinutes === 0
                        ? '< 1 min'
                        : readingTimeMinutes === 1
                            ? '1 min'
                            : `${readingTimeMinutes} mins`

                    return `${chars} characters · ${words} words · ${readingTime} read`
                })()}
            </div>

            {/* Image Editor Dialog */}
            <ImageEditorDialog
                open={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageSrc={selectedImage}
                onSave={handleImageSave}
            />

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
        </div>
    )
}
