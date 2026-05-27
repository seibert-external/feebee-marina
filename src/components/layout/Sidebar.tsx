'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/components/common/RoleContext';
import {
  LayoutDashboard,
  GitPullRequestDraft,
  MessageSquareText,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Sparkles,
  FileText,
  RefreshCw,
  Send,
  Layers,
  UserCheck,
  FolderOpen,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: ('hr' | 'employee')[];
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    roles: ['hr', 'employee'],
  },
  {
    href: '/onboarding',
    label: 'Onboarding',
    icon: <UserCheck size={20} />,
    roles: ['hr'],
  },
  {
    href: '/personalakte',
    label: 'Personalakten',
    icon: <FolderOpen size={20} />,
    roles: ['hr'],
  },
  {
    href: '/my-onboarding',
    label: 'Mein Onboarding',
    icon: <UserCheck size={20} />,
    roles: ['employee'],
  },
  {
    href: '/processes',
    label: 'Feedback-Prozesse',
    icon: <GitPullRequestDraft size={20} />,
    roles: ['hr'],
  },
  {
    href: '/templates',
    label: 'Vorlagen',
    icon: <FileText size={20} />,
    roles: ['hr'],
  },
  {
    href: '/cyclic',
    label: 'Zyklisches Feedback',
    icon: <RefreshCw size={20} />,
    roles: ['hr'],
  },
  {
    href: '/skills',
    label: 'Skilluebersicht',
    icon: <Layers size={20} />,
    roles: ['hr'],
  },
  {
    href: '/journey',
    label: 'Meine Journey',
    icon: <TrendingUp size={20} />,
    roles: ['employee'],
  },
  {
    href: '/feedback',
    label: 'Mein Feedback',
    icon: <MessageSquareText size={20} />,
    roles: ['employee'],
  },
  {
    href: '/peer-feedback',
    label: 'Peer Feedback',
    icon: <Send size={20} />,
    roles: ['employee'],
  },
  {
    href: '/chat',
    label: 'AI-Assistent',
    icon: <MessageCircle size={20} />,
    roles: ['hr', 'employee'],
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    roles: ['hr'],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] bg-[var(--primary)] text-white flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-wide">HR Feedback</div>
          <div className="text-[10px] text-white/60 uppercase tracking-wider">Seibert Group</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider text-white/40 px-3 mb-2">
          Navigation
        </div>
        {filteredItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-xs text-white/40">
          Clickable Prototyp v2.0
        </div>
      </div>
    </aside>
  );
}
