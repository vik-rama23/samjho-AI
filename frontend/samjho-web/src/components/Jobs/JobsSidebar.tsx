"use client";

import styles from "./JobSidebar.module.scss";
import { fetchJobs } from "../../services/jobs.service";
import { useEffect, useState } from "react";
import Link from "next/link";

// const mockJobs = [
//     {
//         title: "UPSC Civil Services Examination 2025",
//         authority: "UPSC",
//         link: "https://upsc.gov.in",
//     },
//     {
//         title: "SSC CGL 2025 Notification",
//         authority: "SSC",
//         link: "https://ssc.gov.in",
//     },
//     {
//         title: "Railway Group D Recruitment",
//         authority: "Railways",
//         link: "https://indianrailways.gov.in",
//     },
// ];

export default function JobsSidebar() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchJobs()
            .then((res) => {
                if (!mounted) return;
                if (Array.isArray(res) && res.length > 0) {
                    setJobs(res);
                }
            })
            .catch((err) => {
                console.error("fetchJobs error:", err);
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>🏛️ Sarkari Naukri</h3>
            <p className={styles.subtitle}>Active government jobs</p>
            
            <div className={styles.list}>
                {jobs.slice(0, 5).map((job, idx) => (
                    <a
                        key={idx}
                        href={job.official_link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.job}
                    >
                        <div className={styles.jobTitle}>{job.title}</div>
                        {/* <div className={styles.meta}>{job.authority}</div> */}
                        <div className={styles.organization}>{job.source}</div>

                    </a>
                ))}
            </div>

            <Link href="/jobs" className={styles.viewAll}>
                View all jobs →
            </Link>
        </div>
    );
}
