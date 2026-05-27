'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, X } from 'lucide-react';
import processes from '@/data/processes.json';
import employees from '@/data/employees.json';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Entwurf', color: '#6B778C', bg: '#F4F5F7' },
  active: { label: 'Aktiv', color: '#02464B', bg: '#E0F0F1' },
  completed: { label: 'Abgeschlossen', color: '#00875A', bg: '#E3FCEF' },
  cancelled: { label: 'Abgebrochen', color: '#FF5630', bg: '#FFEBE6' },
};

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  onboarding: { label: 'Onboarding', color: '#02464B', bg: '#E0F0F1' },
  'high-potential': { label: 'High Potential', color: '#0A7075', bg: '#E6F3F3' },
  'peer-feedback': { label: 'Peer Feedback', color: '#00875A', bg: '#E3FCEF' },
  'performance-improvement': { label: 'Performance', color: '#FF5630', bg: '#FFEBE6' },
  custom: { label: 'Custom', color: '#6B778C', bg: '#F4F5F7' },
};

export default function ProcessesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = processes.filter((p) => {
    const matchesSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      employees.find((e) => e.id === p.targetEmployee)?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Feedback-Prozesse</h1>
          <p className="text-[var(--neutral-200)] mt-1">Verwalte alle laufenden und abgeschlossenen Feedback-Prozesse.</p>
        </div>
        <Link
          href="/processes/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
        >
          <Plus size={16} />
          Neuen Prozess starten
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Prozesse suchen..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-sm border border-[var(--neutral-30)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
            showFilters || statusFilter ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--neutral-30)] text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
          }`}
        >
          <Filter size={14} />
          Filter
          {statusFilter && (
            <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">1</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-[var(--neutral-30)]">
          <span className="text-xs text-[var(--neutral-200)] mr-2">Status:</span>
          {Object.entries(statusConfig).map(([key, sc]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? null : key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === key ? 'ring-2 ring-[var(--primary)] ring-offset-1' : ''
              }`}
              style={{ backgroundColor: sc.bg, color: sc.color }}
            >
              {sc.label}
            </button>
          ))}
          {statusFilter && (
            <button onClick={() => setStatusFilter(null)} className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--neutral-200)] hover:text-[var(--neutral-800)]">
              <X size={12} /> Zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Process List */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--neutral-30)] bg-[var(--neutral-10)]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--neutral-200)] uppercase tracking-wider">Prozess</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--neutral-200)] uppercase tracking-wider">Typ</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--neutral-200)] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--neutral-200)] uppercase tracking-wider">Fortschritt</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--neutral-200)] uppercase tracking-wider">Zeitraum</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((process) => {
              const target = employees.find((e) => e.id === process.targetEmployee);
              const progress = Math.round((process.completedCount / process.totalCount) * 100);
              const sc = statusConfig[process.status] || statusConfig.draft;
              const tc = typeConfig[process.type] || typeConfig.custom;

              return (
                <tr key={process.id} className="border-b border-[var(--neutral-30)] last:border-0 hover:bg-[var(--neutral-10)] transition-colors cursor-pointer" onClick={() => window.location.href = `/processes/${process.id}`}>
                  <td className="px-6 py-4">
                    <Link href={`/processes/${process.id}`} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xs font-medium">
                        {target?.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--neutral-800)] hover:text-[var(--primary)]">{process.title}</div>
                        <div className="text-xs text-[var(--neutral-100)]">{target?.name} · {target?.department}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tc.bg, color: tc.color }}>
                      {tc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-[var(--neutral-200)]">
                        {process.completedCount}/{process.totalCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--neutral-200)]">
                    {process.startDate} — {process.endDate}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--neutral-100)]">
                  Keine Prozesse gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
