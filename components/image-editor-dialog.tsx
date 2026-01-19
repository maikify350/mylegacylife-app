"use client"

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImageEditorDialogProps {
    open: boolean
    onClose: () => void
    imageSrc: string
    onSave: (editedImage: string, caption: string) => void
}

export function ImageEditorDialog({ open, onClose, imageSrc, onSave }: ImageEditorDialogProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [caption, setCaption] = useState('')
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
    const [croppedDimensions, setCroppedDimensions] = useState({ width: 0, height: 0 })

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
        // Calculate actual output dimensions by multiplying crop area by zoom
        setCroppedDimensions({
            width: Math.round(croppedAreaPixels.width * zoom),
            height: Math.round(croppedAreaPixels.height * zoom)
        })
    }, [zoom])

    // Load original dimensions when image changes
    useEffect(() => {
        if (imageSrc) {
            const img = new Image()
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height })
                setCroppedDimensions({ width: img.width, height: img.height })
            }
            img.src = imageSrc
        }
    }, [imageSrc])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: any,
        rotation = 0
    ): Promise<string> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        canvas.width = safeArea
        canvas.height = safeArea

        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        )

        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.putImageData(
            data,
            0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
            0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
        )

        return canvas.toDataURL('image/jpeg')
    }

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            onSave(croppedImage, caption)
            onClose()
        } catch (e) {
            console.error(e)
        }
    }

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360)
    }

    const handleReset = () => {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setRotation(0)
        setCaption('')
        setAspectRatio(undefined)
        setCroppedDimensions(originalDimensions)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Crop Area */}
                    <div className="relative h-[400px] bg-gray-100 rounded-lg">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    {/* Dimensions Display */}
                    <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground">
                            Scale: <span className="font-bold">
                                {zoom > 1 ? '+' : zoom < 1 ? '-' : ''}{Math.round(zoom * 100)}%
                            </span>
                        </p>
                        <p className="text-sm font-bold italic">
                            Output: {croppedDimensions.width} × {croppedDimensions.height} px
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        {/* Crop Aspect Ratio */}
                        <div>
                            <Label>Crop Aspect Ratio</Label>
                            <div className="flex gap-2 mt-2">
                                <Button
                                    type="button"
                                    variant={aspectRatio === undefined ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAspectRatio(undefined)}
                                >
                                    Free
                                </Button>
                                <Button
                                    type="button"
                                    variant={aspectRatio === 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAspectRatio(1)}
                                >
                                    Square
                                </Button>
                                <Button
                                    type="button"
                                    variant={aspectRatio === 16 / 9 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAspectRatio(16 / 9)}
                                >
                                    16:9
                                </Button>
                                <Button
                                    type="button"
                                    variant={aspectRatio === 4 / 3 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAspectRatio(4 / 3)}
                                >
                                    4:3
                                </Button>
                            </div>
                        </div>

                        {/* Scale */}
                        <div>
                            <Label>Scale</Label>
                            <input
                                type="range"
                                min={0.5}
                                max={1.5}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Rotate Button */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleRotate}
                                className="flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Rotate 90°
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Caption */}
                        <div>
                            <Label htmlFor="caption">Caption (optional)</Label>
                            <Input
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Add a caption to your image..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            className="bg-[#4A3728] hover:bg-[#5A4738] text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
