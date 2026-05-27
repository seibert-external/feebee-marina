'use client';

import React from 'react';
import { RoleProvider } from '@/components/common/RoleContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[var(--sidebar-width)]">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </RoleProvider>
  );
}
