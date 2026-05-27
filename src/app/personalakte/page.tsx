'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Pause,
  LogOut,
  Archive,
  UserCheck,
  Search,
  Plus,
} from 'lucide-react';
import personalakten from '@/data/personalakte.json';
import employees from '@/data/employees.json';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  preboarding: {
    label: 'Preboarding',
    color: '#5243AA',
    bg: '#EAE6FF',
    icon: <Clock size={13} />,
  },
  onboarding: {
    label: 'Aktiv / Onboarding',
    color: '#FF8B00',
    bg: '#FFF7E6',
    icon: <UserCheck size={13} />,
  },
  aktiv: {
    label: 'Aktiv',
    color: '#00875A',
    bg: '#E3FCEF',
    icon: <CheckCircle2 size={13} />,
  },
  ruhend: {
    label: 'Ruhend',
    color: '#6B778C',
    bg: '#F4F5F7',
    icon: <Pause size={13} />,
  },
  offboarding: {
    label: 'Offboarding',
    color: '#DE350B',
    bg: '#FFEBE6',
    icon: <LogOut size={13} />,
  },
  archiv: {
    label: 'Archiv',
    color: '#42526E',
    bg: '#EBECF0',
    icon: <Archive size={13} />,
  },
};

export default function PersonalaktePage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = personalakten.filter((pa) => {
    const emp = employees.find((e) => e.id === pa.employeeId);
    const matchSearch =
      !search ||
      emp?.name.toLowerCase().includes(search.toLowerCase()) ||
      emp?.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || pa.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: personalakten.length,
    preboarding: personalakten.filter((p) => p.status === 'preboarding').length,
    onboarding: personalakten.filter((p) => p.status === 'onboarding').length,
    aktiv: personalakten.filter((p) => p.status === 'aktiv').length,
    ruhend: personalakten.filter((p) => p.status === 'ruhend').length,
    offboarding: personalakten.filter((p) => p.status === 'offboarding').length,
    archiv: personalakten.filter((p) => p.status === 'archiv').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Personalakten</h1>
          <p className="text-[var(--neutral-200)] mt-1">
            Gedächtnis des Arbeitsverhältnisses — alle Vorgänge, Meilensteine und Automationen auf einen Blick.
          </p>
        </div>
        <Link
          href="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
        >
          <Plus size={16} />
          Neue Akte anlegen
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-6 gap-3">
        {(Object.entries(statusConfig) as [string, typeof statusConfig[string]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
            className={`rounded-xl border p-3 text-left transition-all ${
              filterStatus === key
                ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-[var(--neutral-30)] bg-white hover:border-[var(--primary)]/40'
            }`}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              {cfg.icon}
            </div>
            <div className="text-xl font-bold text-[var(--neutral-800)]">
              {counts[key as keyof typeof counts]}
            </div>
            <div className="text-[10px] text-[var(--neutral-100)] leading-tight mt-0.5">{cfg.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
        <input
          type="text"
          placeholder="Name oder Funktion suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--neutral-30)] rounded-lg text-sm outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--neutral-100)] text-sm">
            Keine Personalakten gefunden.
          </div>
        )}
        {filtered.map((pa) => {
          const emp = employees.find((e) => e.id === pa.employeeId);
          const fuehrung = employees.find((e) => e.id === pa.fuehrungskraft);
          const lotse = employees.find((e) => e.id === pa.fachLotse);
          const sc = statusConfig[pa.status] || statusConfig.aktiv;
          const lastEvent = pa.timeline[pa.timeline.length - 1];

          return (
            <Link
              key={pa.id}
              href={`/personalakte/${pa.id}`}
              className="block bg-white rounded-xl border border-[var(--neutral-30)] p-5 hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {emp?.avatar}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[var(--neutral-800)]">{emp?.name}</span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      {sc.icon}
                      {sc.label}
                    </span>
                    {pa.status === 'ruhend' && 'ruhendGrund' in pa && (
                      <span className="text-xs text-[var(--neutral-100)] bg-[#F4F5F7] px-2 py-0.5 rounded-full">
                        {pa.ruhendGrund as string}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--neutral-200)]">
                    {emp?.role} · {emp?.department} · Start: {pa.startDate}
                    {fuehrung && ` · FK: ${fuehrung.name}`}
                    {lotse && ` · Lotse: ${lotse.name}`}
                  </div>
                </div>

                {/* Last event */}
                <div className="hidden lg:flex flex-col items-end gap-0.5 flex-shrink-0 max-w-[240px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--neutral-100)]">
                    <FolderOpen size={12} />
                    <span>Letzter Eintrag</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--neutral-800)] text-right truncate">
                    {lastEvent?.title}
                  </div>
                  <div className="text-[11px] text-[var(--neutral-100)]">{lastEvent?.date}</div>
                </div>

                <ArrowRight size={18} className="text-[var(--neutral-100)] flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
