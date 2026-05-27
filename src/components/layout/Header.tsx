'use client';

import React from 'react';
import RoleSwitcher from '@/components/common/RoleSwitcher';
import { useRole } from '@/components/common/RoleContext';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  const { role } = useRole();
  const currentUser = role === 'hr' ? 'Marina Smelkov' : 'Anna Müller';
  const currentUserRole = role === 'hr' ? 'HR Business Partner' : 'Senior Software Engineer';
  const initials = role === 'hr' ? 'MS' : 'AM';

  return (
    <header className="h-16 bg-white border-b border-[var(--neutral-30)] flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
          <input
            type="text"
            placeholder="Suche nach Mitarbeitern, Prozessen..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--neutral-20)] rounded-lg text-sm border border-transparent focus:border-[var(--primary)] focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <RoleSwitcher />

        <button className="relative p-2 text-[var(--neutral-200)] hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-[var(--neutral-30)]">
          <div className="text-right">
            <div className="text-sm font-medium text-[var(--neutral-800)]">{currentUser}</div>
            <div className="text-xs text-[var(--neutral-100)]">{currentUserRole}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
