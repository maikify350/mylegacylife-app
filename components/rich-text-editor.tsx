"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { ImageEditorDialog } from './image-editor-dialog'
import { checkGrammar } from '@/lib/languagetool'

interface RichTextEditorProps {
    content: string
    onUpdate: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onUpdate, placeholder }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showImageEditor, setShowImageEditor] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string>('')

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
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

        // Convert to base64 and open editor dialog
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target?.result as string
            setSelectedImage(base64)
            setShowImageEditor(true)
        }
        reader.readAsDataURL(file)

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleImageSave = (editedImage: string, caption: string) => {
        if (!editor) return

        // Insert the edited image
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
            alert('Please write some text first!')
            return
        }

        try {
            const matches = await checkGrammar(text)

            if (matches.length === 0) {
                alert('✓ No grammar or spelling errors found!')
            } else {
                const errors = matches.slice(0, 5).map((match, i) =>
                    `${i + 1}. ${match.message}\n   Suggestion: ${match.replacements[0]?.value || 'N/A'}`
                ).join('\n\n')

                alert(`Found ${matches.length} issue(s):\n\n${errors}${matches.length > 5 ? '\n\n...and more' : ''}`)
            }
        } catch (error) {
            alert('Error checking grammar. Please try again.')
        }
    }

    if (!editor) {
        return null
    }

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
            <div className="flex items-center gap-1 p-2 border-b-2 border-input bg-muted/30">
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

                <div className="w-px h-6 bg-border mx-1" />

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

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Image Editor Dialog */}
            <ImageEditorDialog
                open={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageSrc={selectedImage}
                onSave={handleImageSave}
            />
        </div>
    )
}
