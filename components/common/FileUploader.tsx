import React, { useRef, useState, useEffect } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react"; // Loader2 برای لودینگ
import { useFile } from "@/lib/hooks/useFile";
import jMoment from "moment-jalaali";
import { generateMyMac } from "@/lib/utils/utils";

export interface FileUploadCardProps {
    width?: number;
    height?: number;
    className?: string;
    fileType?: string;
    label?: string;
    autoUpload?: boolean;
    onUploadComplete?: (fileId: number) => void;
    onChange?: (file: string) => void;
    value?: number | null; // 🔹 الان آیدی فایل میاد
    name?: string;
}

const FileUploader: React.FC<FileUploadCardProps> = ({
                                                         width = 100,
                                                         height = 100,
                                                         className = "",
                                                         fileType = "image/*",
                                                         autoUpload = true,
                                                         onUploadComplete,
                                                         onChange,
                                                         label = "انتخاب فایل",
                                                         value,
                                                         name,
                                                     }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { uploadFile, uploadProgress, uploading, fetchFile, isFetchingFile } = useFile();

    // ---- وقتی value آیدی فایل بود، فایل رو از سرور بیاریم ----
    useEffect(() => {
        const fetchFromServer = async () => {
            if (value) {
                try {
                    const res = await fetchFile(value);
                    if (res?.file?.content) {
                        const blobUrl = `data:image/*;base64,${res.file.content}`;
                        setPreview(blobUrl);
                    } else {
                        setPreview(null);
                    }
                } catch (err) {
                    console.error("❌ Error fetching file:", err);
                    setPreview(null);
                }
            } else {
                setPreview(null);
            }
        };

        fetchFromServer();
    }, [value]);

    // ---- انتخاب فایل از سیستم ----
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result as string;
            setPreview(result);
            if (onChange) onChange(result);

            if (autoUpload) {
                try {
                    const res = await uploadFile({
                        type: file.type.split("/")[1] || "image",
                        name: file.name,
                        result,
                    });
                    if (res?.file?.id && onUploadComplete) onUploadComplete(res.file.id);
                } catch (err) {
                    console.error("Upload failed", err);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div
            className={`bg-white shadow-md rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden cursor-pointer ${className}`}
            style={{ width, height }}
            onClick={triggerFileSelect}
        >
            <input
                type="file"
                accept={fileType}
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                name={name}
            />

            {/* لودینگ در حالت دانلود از سرور */}
            {isFetchingFile ? (
                <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
            ) : preview ? (
                <img src={preview} alt="Preview" className="w-full h-full rounded-xl object-cover" />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadCloud size={32} />
                    <span className="text-xs mt-1 text-center">{label}</span>
                </div>
            )}

            {/* پروگرس‌بار آپلود */}
            {uploading && autoUpload && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-b-xl overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}

            {/* دکمه حذف */}
            {preview && !uploading && (
                <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        if (onUploadComplete) onUploadComplete(0);
                        if (onChange) onChange("");
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default FileUploader;
