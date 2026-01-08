"use client";

import React, { useEffect, useState } from "react";
import loadingService from "../services/loadingService";
import Loader from "../components/Common/Loader";

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = loadingService.subscribe((v) => setLoading(v));
    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      {children}
      <Loader visible={loading} />
    </>
  );
};

export default LoadingProvider;
