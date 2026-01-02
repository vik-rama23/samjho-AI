import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/dashboard">
        <h2>Samadhan AI</h2>
      </Link>
      <div style={{paddingTop: "20px"}}>
        <Link href="/qa">Ask</Link>
        <Link href="/finance">Finance</Link>
        <Link href="/eligibility">Eligibility</Link>
        <Link href="/">Upload</Link>
      </div>
    </nav>
  );
}
