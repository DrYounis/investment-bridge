'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HandCoins,
  Users,
  Target,
  NotebookPen,
  Lightbulb,
  FolderOpen,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'لوحة التحكم', href: '/dashboard/entrepreneur', icon: <LayoutDashboard size={18} /> },
  { label: 'التمويل', href: '/dashboard/entrepreneur/funding', icon: <HandCoins size={18} /> },
  { label: 'المستثمرون', href: '/dashboard/entrepreneur/investors', icon: <Users size={18} /> },
  { label: 'الأهداف', href: '/dashboard/entrepreneur/goals', icon: <Target size={18} /> },
  { label: 'المفكرة', href: '/dashboard/entrepreneur/notepad', icon: <NotebookPen size={18} /> },
  { label: 'محلل الأفكار', href: '/dashboard/entrepreneur/idea', icon: <Lightbulb size={18} /> },
  { label: 'الوثائق', href: '/dashboard/entrepreneur/documents', icon: <FolderOpen size={18} /> },
  { label: 'الإعدادات', href: '/dashboard/entrepreneur/settings', icon: <Settings size={18} /> },
];

export default function EntrepreneurSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-screen flex flex-col p-4 pt-24 gap-1 fixed right-0 top-0 z-40 overflow-y-auto"
      style={{ background: '#0a0f1e', borderLeft: '1px solid #1c2640' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <span className="text-lg font-black" style={{ color: '#c9a84c' }}>
          مرفأ
        </span>
        <span className="text-xs mt-1" style={{ color: '#6b7a95' }}>
          | رائد أعمال
        </span>
      </div>

      {/* Daily update box */}
      <div
        className="mx-2 mb-4 rounded-xl p-3 text-center"
        style={{ background: '#c9a84c15', border: '1px solid #c9a84c30' }}
      >
        <span className="text-xs font-bold" style={{ color: '#c9a84c' }}>
          ٢ مستثمر ينتظران ردك
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: isActive ? '#c9a84c' : '#6b7a95',
                background: isActive ? '#c9a84c12' : 'transparent',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role label at bottom */}
      <div
        className="mt-auto mx-2 rounded-xl p-3 text-center"
        style={{ background: '#0d1428', border: '1px solid #1c2640' }}
      >
        <span className="text-xs font-bold" style={{ color: '#c9a84c' }}>
          رائد أعمال
        </span>
      </div>
    </aside>
  );
}
