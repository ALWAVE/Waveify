"use client";

import React from "react";
import useUploadModal from "@/hooks/useUploadModal";
import UploadModal from "@/component/UploadModal";
import YouTubeImportModal from "./YouTubeImportModal";

export default function ClientRootShell({ children }: { children: React.ReactNode }) {

    return (
        <>
            {children}
            <UploadModal />
            <YouTubeImportModal />
        </>
    );
}
