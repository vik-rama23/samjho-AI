"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProfileMenu.module.scss";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.avatar}
        onClick={() => setOpen(!open)}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <strong>{user?.name}</strong> <br/><br/>
            <label style={{paddingTop: "5px"}}>{user?.email}</label>
          </div>

          <button className={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
