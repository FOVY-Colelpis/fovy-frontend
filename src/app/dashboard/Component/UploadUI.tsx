'use client'
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillmapAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface UploadAreaProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UploadArea({ show, setShow }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { user, isLoggedIn } = useAuth();


  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(file.name);

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum 10MB allowed');
      return;
    }

    try {
      setIsUploading(true);
      const res = await skillmapAPI.uploadPdf(file, user?.username);
      if (!res?.success) {
        alert(res?.error || 'Upload failed');
      } else {
        alert(`PDF uploaded successfully: ${res.file_name}`);
        setShow(false);
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)} // 點擊背景關閉
          />

          {/* 上傳區塊 */}
          <motion.div
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-80 h-60 rounded-xl border-2 border-dashed cursor-pointer z-[300]
              ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"} transition-colors`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="mb-2 text-blue-400">
              {isUploading ? (
                <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                </svg>
              )}
            </div>

            <div className="text-blue-700 font-semibold mb-2">.PDF</div>
            <div className="font-semibold text-gray-800 mb-1">Drag / Upload your CV</div>
            <div className="text-gray-500 text-sm text-center">
              let us map your skills automatically.<br />
              PDF format required
            </div>

            {fileName && (
              <div className="mt-2 text-gray-700 text-sm truncate w-full text-center">{fileName}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
