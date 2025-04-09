'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Users, Plus, Database, FileText, BarChart } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'View Clients', href: '/clients', icon: <Users size={18} /> },
    { name: 'New Client', href: '/clients/new', icon: <Plus size={18} /> },
    { name: 'Add Data', href: '/database', icon: <Database size={18} /> },
    { name: 'Full Records', href: '/records', icon: <FileText size={18} /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart size={18} /> },
  ];

  return (
    <nav className="menu-wrapper">
      <div className="menu-toggle">
        <button onClick={() => setMenuOpen(!menuOpen)}>☰ Menu</button>
      </div>

      <div className={`menu ${menuOpen ? 'show' : ''}`}>
        {links.map((link) => (
          <span
            key={link.href}
            className={`nav-item ${pathname === link.href ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="icon">{link.icon}</span>
            <Link href={link.href}>{link.name}</Link>
          </span>
        ))}
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .menu-wrapper {
          width: 100%;
        }

        .menu-toggle {
          display: none;
          padding: 8px 16px;
        }

        .menu-toggle button {
          font-size: 18px;
          background-color: #eee;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .menu {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          background-color: #fff;
          color: #000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          border-radius: 8px;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          flex: 1;
          min-width: 60px;
          font-size: 14px;
          transition: background 0.3s;
        }

        .nav-item:hover {
          background-color: #f0f0f0;
        }

        .nav-item.active {
          font-weight: bold;
          background-color: #e6e6e6;
          border-radius: 8px;
        }

        .icon {
          margin-bottom: 4px;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .menu-toggle {
            display: block;
          }

          .menu {
            display: none;
            flex-direction: column;
          }

          .menu.show {
            display: flex;
          }

          .nav-item {
            flex-direction: row;
            justify-content: flex-start;
            gap: 10px;
            padding: 12px;
          }
        }
      `}</style>
    </nav>
  );
}
