'use client';

import React from 'react';
import { useRole } from './RoleContext';
import { Shield, User } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-[var(--neutral-30)] p-1">
      <button
        onClick={() => setRole('hr')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          role === 'hr'
            ? 'bg-[var(--primary)] text-white shadow-sm'
            : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
        }`}
      >
        <Shield size={14} />
        HR
      </button>
      <button
        onClick={() => setRole('employee')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          role === 'employee'
            ? 'bg-[var(--primary)] text-white shadow-sm'
            : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
        }`}
      >
        <User size={14} />
        Mitarbeiter
      </button>
    </div>
  );
}
