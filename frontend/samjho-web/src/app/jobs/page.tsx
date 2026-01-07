"use client";

import { useEffect, useState } from "react";
import TwoColumnLayout from "../../components/Layout/TwoColumnLayout";
import Header from "../../components/Header/Header";
import JobList from "../../components/Jobs/JobsList";
import { fetchJobs } from "../../services/jobs.service";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      {/* <TwoColumnLayout sidebar={null}> */}
        {loading ? (
          <p>Loading active jobs…</p>
        ) : (
          <JobList jobs={jobs} />
        )}
      {/* </TwoColumnLayout> */}
    </>
  );
}
