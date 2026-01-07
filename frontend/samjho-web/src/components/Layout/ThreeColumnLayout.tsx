"use client";

import styles from "./ThreeColumnLayout.module.scss";

export default function ThreeColumnLayout({
//   sidebarLeft,
  sidebarRight,
  children,
}: {
//   sidebarLeft: React.ReactNode;
  sidebarRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.left}>{""}</aside>

      <main className={styles.center}>{children}</main>

      {sidebarRight && (
        <aside className={styles.right}>{sidebarRight}</aside>
      )}
    </div>
  );
}
