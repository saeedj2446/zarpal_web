import React, { useRef, useState, useEffect } from "react";
import { X, UploadCloud, Loader2, CheckCircle } from "lucide-react";
import { useFile } from "@/lib/hooks/useFile";
import jMoment from "moment-jalaali";
import {encodeBase64, generateMyMac} from "@/lib/utils/utils";

export interface FileUploadCardProps {
    width?: number;
    height?: number;
    className?: string;
    fileType?: string;
    label?: string;
    autoUpload?: boolean;
    onUploadComplete?: (fileId: number) => void;
    onFileSelect?: (file: string) => void;
    value?: number | null;
    name?: string;
}

const FileUploader: React.FC<FileUploadCardProps> = ({
                                                         width = 100,
                                                         height = 100,
                                                         className = "",
                                                         fileType = "image/*",
                                                         autoUpload = true,
                                                         onUploadComplete,
                                                         onFileSelect,
                                                         label = "انتخاب فایل",
                                                         value,
                                                         name,
                                                     }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { uploadFile, uploadProgress, isUploadingFile, fetchFile, isFetchingFile } = useFile();

    // ---- وقتی value آیدی فایل بود، فایل رو از سرور بیاریم ----
    useEffect(() => {
        const fetchFromServer = async () => {
            if (value) {
                try {
                    const file = await fetchFile(value);
                    if (file?.content) {
                        const blobUrl = encodeBase64(file.content);
                        setPreview(blobUrl);
                    }
                } catch (err) {
                    console.error("❌ Error fetching file:", err);
                }
            }else{
                setPreview(null)
            }
        };

        fetchFromServer();
    }, [value, fetchFile]);

    // ---- انتخاب فایل از سیستم ----
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result as string;
            setPreview(result);
            if (onFileSelect) onFileSelect(result);

            if (autoUpload) {
                try {
                    const res = await uploadFile({
                        fileType: file.type.split("/")[1] || "image",
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
                <div className="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-30 rounded-xl">
                    <Loader2 className="animate-spin text-white w-8 h-8" />
                    <span className="text-xs mt-2 text-white">در حال دانلود...</span>
                </div>
            ) : preview ? (
                <>
                    <img src={preview} alt="Preview" className="w-full h-full rounded-xl object-cover" />

                    {/* پروگرس‌بار آپلود */}
                    {isUploadingFile && autoUpload && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-xl">
                            <div className="w-4/5 h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="text-white text-sm font-medium mb-3">
                                {uploadProgress}%
                            </span>
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin text-white w-6 h-6" />
                            </div>
                        </div>
                    )}

                    {/* نمایش آیکون موفقیت پس از آپلود کامل */}
                    {!isUploadingFile && value && (
                        <div className="absolute top-2 left-2 bg-green-500 rounded-full p-1 shadow-lg">
                            <CheckCircle size={18} className="text-white" />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadCloud size={32} />
                    <span className="text-xs mt-1 text-center">{label}</span>
                </div>
            )}

            {/* دکمه حذف */}
            {preview && !isUploadingFile && (
                <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        if (onUploadComplete) onUploadComplete(0);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default FileUploader;