import React, { useState, useEffect } from 'react';
import { Button } from '@/components/radix/button';
import { Card, CardContent } from '@/components/radix/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/radix/alert-dialog';
import { Trash2, ZoomIn, Loader2, ImageOff } from 'lucide-react';
import { useFile } from '@/lib/hooks/useFile';
import { encodeBase64 } from '@/lib/utils/utils';

interface ImagePreviewProps {
    fileId: number | null;
    onDelete: () => void;
}

export function ImagePreview({ fileId, onDelete }: ImagePreviewProps) {
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

    if (isFetchingFile) {
        return (
            <Card className="flex items-center justify-center h-64">
                <CardContent className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (error || !previewUrl) {
        return (
            <Card className="flex items-center justify-center h-64 border border-dashed border-gray-300 dark:border-gray-600">
                <CardContent className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4">
                        <ImageOff className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="group relative overflow-hidden border dark:border-gray-700">
                <CardContent className="p-0">
                    <div className="relative aspect-square w-full">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                            onClick={() => setIsZoomed(true)}
                        />

                        {/* Delete Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>حذف تصویر</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            آیا از حذف این تصویر مطمئن هستید؟ این عمل غیرقابل بازگشت است.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDelete}>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
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