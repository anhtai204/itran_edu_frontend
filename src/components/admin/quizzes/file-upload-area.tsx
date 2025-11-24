"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  accept?: string;
  value?: string;
  className?: string;
  size?: "default" | "compact";
}

export function FileUploadArea({
  onFileSelect,
  accept = "image/*",
  value,
  className,
  size = "default",
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

  const handleFile = (file: File) => {
    if (!file.type.match(accept.replace(/\*/g, ".*"))) {
      alert("File type not accepted");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const previewUrl = e.target.result as string;
        setPreview(previewUrl);
        onFileSelect(file, previewUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {size === "compact" ? (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full border border-muted cursor-pointer transition-all duration-200",
            isDragging ? "border-primary bg-primary/10" : "hover:bg-muted/20",
            isUploading && "opacity-50 pointer-events-none",
            "w-full h-full"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="file-upload-area"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={accept}
            className="hidden"
          />
        </div>
      ) : (
        <>
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
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:bg-accent",
                isUploading && "opacity-50 pointer-events-none"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-testid="file-upload-area"
            >
              <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
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
        </>
      )}
    </div>
  );
}