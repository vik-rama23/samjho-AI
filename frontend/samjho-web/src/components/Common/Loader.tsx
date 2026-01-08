"use client";

import React from "react";
import styles from "./Loader.module.scss";

export default function Loader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
}
