"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  onFileUpload?: (url: string) => void;
  accept?: string;
  value?: string;
  className?: string;
}

export function FileUploadArea({
  onFileSelect,
  onFileUpload,
  accept = "image/*",
  value,
  className,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // const handleFile = async (file: File) => {
  //   if (!file.type.match(accept.replace(/\*/g, ".*"))) {
  //     alert("File type not accepted");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     if (e.target?.result) {
  //       setPreview(e.target.result as string);
  //     }
  //   };
  //   reader.readAsDataURL(file);

  //   onFileSelect(file);
  //   const uploadedUrl = await uploadFileToServer(file);
  //   if (onFileUpload) {
  //     onFileUpload(uploadedUrl);
  //   }
  // };

  const handleFile = (file: File) => {
    if (!file.type.match(accept.replace(/\*/g, ".*"))) {
      alert("File type not accepted");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    onFileSelect(file); // Chỉ truyền file lên component cha, không upload ngay
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/single`,
      {
        method: "POST",
        body: formData,
      }
    );

    setIsUploading(false);
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    const result = await uploadResponse.json();
    console.log("Uploaded URL:", result.url); // Debug URL
    return result.url;
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-[200px] object-contain rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={clearPreview}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted hover:bg-accent",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          // onClick={handleClick}
          data-testid="file-upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isUploading
                ? "Uploading..."
                : "Drag and drop an image here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={accept}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

