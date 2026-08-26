import { Home, User } from 'lucide-react';
import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/home" className={styles.navItem} aria-label="Hjem">
        <Home size={38} />
      </Link>
      <Link href="/profile" className={styles.navItem} aria-label="Profil">
        <User size={38} />
      </Link>
    </nav>
  );
}