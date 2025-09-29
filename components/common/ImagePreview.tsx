import React, { useState, useEffect } from 'react';
import { Button } from '@/components/radix/button';
import { Card, CardContent } from '@/components/radix/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/radix/alert-dialog';
import { Trash2, ZoomIn, Loader2, ImageOff } from 'lucide-react';
import { useFile } from '@/lib/hooks/useFile';
import { encodeBase64 } from '@/lib/utils/utils';
import { cn } from '@/lib/utils/utils';

interface ImagePreviewProps {
    fileId: number | null;
    className?: string;
    imageClassName?: string;
    containerClassName?: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: 'square' | 'video' | 'auto' | number;
    rounded?: boolean | string;
    zoomable?: boolean;
    zoomModalClassName?: string;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
}

export function ImagePreview({
                                 fileId,
                                 className,
                                 imageClassName,
                                 containerClassName,
                                 width = '100%',
                                 height,
                                 aspectRatio = 'square',
                                 rounded = false,
                                 zoomModalClassName,
                                 loadingComponent,
                                 errorComponent,
                                 zoomable=false
                             }: ImagePreviewProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);

    const { fetchFile, isFetchingFile } = useFile();

    useEffect(() => {
        const fetchFromServer = async () => {
            if (!fileId) {
                setPreviewUrl(null);
                setError(false);
                return;
            }

            try {
                const file = await fetchFile(fileId, 1);
                if (file?.content) {
                    const blobUrl = encodeBase64(file.content);
                    setPreviewUrl(blobUrl);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("❌ Error fetching file:", err);
                setError(true);
            }
        };

        fetchFromServer();
    }, [fileId, fetchFile]);

    // محاسبه کلاس‌های مربوط به گردی و نسبت تصویر
    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'square':
                return 'aspect-square';
            case 'video':
                return 'aspect-video';
            case 'auto':
                return '';
            default:
                if (typeof aspectRatio === 'number') {
                    return `aspect-[${aspectRatio}]`;
                }
                return 'aspect-square';
        }
    };

    const getRoundedClass = () => {
        if (rounded === true) {
            return 'rounded-lg';
        } else if (typeof rounded === 'string') {
            return rounded;
        }
        return '';
    };

    if (isFetchingFile) {
        if (loadingComponent) {
            return <>{loadingComponent}</>;
        }
        return (
            <div className={cn("flex items-center justify-center", getRoundedClass(), className)} style={{ width, height }}>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error || !previewUrl) {
        if (errorComponent) {
            return <>{errorComponent}</>;
        }
        return (
            <div className={cn("flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600", getRoundedClass(), className)} style={{ width, height }}>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4">
                        <ImageOff className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={cn("group relative overflow-hidden border dark:border-gray-700", getRoundedClass(), className)} style={{ width, height }}>
                <div
                    className={cn("relative w-full h-full overflow-hidden", getAspectRatioClass(), containerClassName)}>

                    <img
                        src={previewUrl}
                        alt="Preview"
                        className={cn("w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer", imageClassName)}
                        onClick={() => setIsZoomed(true)}
                    />


                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomed && zoomable && (
                <div
                    className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/90", zoomModalClassName)}
                    onClick={() => setIsZoomed(false)}
                >
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-[80vh] w-auto object-contain"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 text-white"
                            onClick={() => setIsZoomed(false)}
                        >
                            <ZoomIn className="h-6 w-6 rotate-45" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}