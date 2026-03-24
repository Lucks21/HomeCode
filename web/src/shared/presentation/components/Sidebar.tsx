'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Wallet, ArrowLeftRight, FileText, Calendar } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/accounts', label: 'Cuentas', icon: Wallet },
  { href: '/dashboard/transactions', label: 'Movimientos', icon: ArrowLeftRight },
  { href: '/dashboard/debts', label: 'Deudas', icon: FileText },
  { href: '/dashboard/installments', label: 'Cuotas', icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>HomeCode</h2>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
