import { useState } from "react";
import styles from "./JobList.module.scss";
import Link from "next/link";

export default function JobList({ jobs }: { jobs: any[] }) {
    if (jobs.length === 0) {
        return <p>No active government jobs found.</p>;
    }

    const [filter, setFilter] = useState<"all" | "central" | "state">("all");
    const filtered = jobs.filter((j) =>
        filter === "all" ? true : j.level.toLowerCase() === filter
    );

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.viewAll}>
                Back to Dashboard →
            </Link>
            <h2>Active Sarkari Naukri</h2>

            <div className={styles.filters}>
                <button
                    type="button"
                    className={`${styles.filterButton} ${
                        filter === "all" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("all")}
                    aria-pressed={filter === "all"}
                >
                    All
                </button>

                <button
                    type="button"
                    className={`${styles.filterButton} ${
                        filter === "central" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("central")}
                    aria-pressed={filter === "central"}
                >
                    Central
                </button>

                <button
                    type="button"
                    className={`${styles.filterButton} ${
                        filter === "state" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("state")}
                    aria-pressed={filter === "state"}
                >
                    State
                </button>
            </div>

            <div className={styles.grid}>
                {filtered.map((job) => (
                    <div key={job.id} className={styles.card}>
                        <h3>{job.title}</h3>

                        <p className={styles.org}>
                            {job.organization}{" "}
                            {job.job_type === "central" ? "Central Govt" : job.state}
                        </p>

                        <a
                            href={job.official_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            View Official Notification →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
