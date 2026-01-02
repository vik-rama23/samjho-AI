"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import UploadForm from "../../components/UploadDocument/UploadForm";
import styles from "../landing.module.scss";
import Header from "@/src/components/Header/Header";


export default function Home() {
  const router = useRouter();

  const handleSuccess = (doc: any) => {
    const domain = doc.domain;
    if (["education", "policy", "general"].includes(domain)) {
      router.push("/qa");
    } else if (domain === "finance") {
      router.push("/finance");
    } else if (domain === "eligibility") {
      router.push("/eligibility");
    }
  }

  return (
    <>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>Samadhan AI</h1>

        <p className={styles.subtitle}>
          Understand government documents, finance rules, and eligibility
          using AI — in simple language.
        </p>

        <div className={styles.step}>
          <h3>Step 1: Upload your document</h3>
          <p>Upload any government PDF to start</p>

          <UploadForm
            onSuccess={handleSuccess}
          />
        </div>

        <div className={styles.step}>
          <h3>Step 2: Choose what you want to do</h3>

          <div className={styles.actions}>
            <Link href="/qa">Ask Questions</Link>
            <Link href="/finance">Finance Help</Link>
            <Link href="/eligibility">Check Eligibility</Link>
          </div>
        </div>

        <div className={styles.step}>
          <h3>Step 3: Get clear answers</h3>
          <p>
            Samadhan AI explains everything in simple,
            easy-to-understand language.
          </p>
        </div>
      </div>
    </>
  );
}