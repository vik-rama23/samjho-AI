"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import UploadForm from "../UploadDocument/UploadForm";
import styles from "./Header.module.scss";
import Link from "next/link";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { fetchDocuments } from "../../services/documents.service";

export default function Header() {
    const [showUpload, setShowUpload] = useState(false);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => setMounted(true), []);


    const handleUploadSuccess = async(doc: any) => {
        setShowUpload(false);
        await fetchDocuments();
        const domain = doc.domain;
        if (["education", "policy", "general"].includes(domain)) {
            router.push("/qa");
        } else if (domain === "finance") {
            router.push("/finance");
        } else if (domain === "eligibility") {
            router.push("/eligibility");
        }
    };

    return (
        <>
            <header className={styles.header}>

                <Link href="/dashboard">
                    <h2 className={styles.logo}>Samadhan AI</h2>
                </Link>

                <div className={styles.actions}>
                    {mounted && pathname !== "/dashboard" && (
                        <button
                            className={styles.uploadBtn}
                            onClick={() => setShowUpload(true)}
                        >
                            + Upload Document
                        </button>
                    )}
                    <ProfileMenu />
                </div>
            </header>

            {showUpload && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <UploadForm onSuccess={handleUploadSuccess} />
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowUpload(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
