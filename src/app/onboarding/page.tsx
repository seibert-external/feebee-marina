'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, UserCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import onboardings from '@/data/onboarding.json';
import employees from '@/data/employees.json';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  active: { label: 'Aktiv', color: '#02464B', bg: '#E0F0F1', icon: <Clock size={14} /> },
  completed: { label: 'Abgeschlossen', color: '#00875A', bg: '#E3FCEF', icon: <CheckCircle2 size={14} /> },
  paused: { label: 'Pausiert', color: '#FF8B00', bg: '#FFF7E6', icon: <AlertCircle size={14} /> },
};

export default function OnboardingOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Onboarding</h1>
          <p className="text-[var(--neutral-200)] mt-1">
            Alle laufenden und abgeschlossenen Onboarding-Prozesse im Ueberblick.
          </p>
        </div>
        <Link href="/employees/new" className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors">
          <Plus size={16} />
          Neuen Mitarbeiter anlegen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E0F0F1] text-[#02464B] flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">
                {onboardings.filter((o) => o.status === 'active').length}
              </div>
              <div className="text-xs text-[var(--neutral-100)]">Aktive Onboardings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF7E6] text-[#FF8B00] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">
                {onboardings.reduce((acc, o) => {
                  const pending = o.phases.filter((p) => p.status === 'in-progress');
                  return acc + pending.length;
                }, 0)}
              </div>
              <div className="text-xs text-[var(--neutral-100)]">Offene Phasen</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E3FCEF] text-[#00875A] flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">
                {onboardings.reduce((acc, o) => {
                  const done = o.phases.filter((p) => p.status === 'completed').length;
                  return acc + done;
                }, 0)}
              </div>
              <div className="text-xs text-[var(--neutral-100)]">Abgeschlossene Phasen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding List */}
      <div className="space-y-4">
        {onboardings.map((onb) => {
          const newbie = employees.find((e) => e.id === onb.newbie);
          const fachLotse = employees.find((e) => e.id === onb.fachLotse);
          const kulturLotse = employees.find((e) => e.id === onb.kulturLotse);
          const completedPhases = onb.phases.filter((p) => p.status === 'completed').length;
          const totalPhases = onb.phases.length;
          const progress = Math.round((completedPhases / totalPhases) * 100);
          const currentPhaseObj = onb.phases.find((p) => p.status === 'in-progress');
          const sc = statusConfig[onb.status] || statusConfig.active;

          return (
            <Link
              key={onb.id}
              href={`/onboarding/${onb.id}`}
              className="block bg-white rounded-xl border border-[var(--neutral-30)] p-6 hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {newbie?.avatar}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-[var(--neutral-800)]">
                      {newbie?.name}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      {sc.icon}
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--neutral-200)] mb-3">
                    {newbie?.role} · {newbie?.department} · Start: {onb.startDate}
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
                      <div className="w-5 h-5 rounded-full bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center text-[9px] font-bold">
                        {fachLotse?.avatar}
                      </div>
                      <span>Fachl. Lotse: {fachLotse?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
                      <div className="w-5 h-5 rounded-full bg-[#E0F0F1] text-[#02464B] flex items-center justify-center text-[9px] font-bold">
                        {kulturLotse?.avatar}
                      </div>
                      <span>Kult. Lotse: {kulturLotse?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
                      <div className="w-5 h-5 rounded-full bg-[#FFF7E6] text-[#FF8B00] flex items-center justify-center text-[9px] font-bold">
                        DG
                      </div>
                      <span>
                        Decider:{' '}
                        {onb.deciderGroup
                          .map((id) => employees.find((e) => e.id === id)?.name)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Current phase + progress */}
                  <div className="flex items-center gap-4">
                    {currentPhaseObj && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF7E6] text-xs">
                        <Clock size={12} className="text-[#FF8B00]" />
                        <span className="font-medium text-[#FF8B00]">
                          Aktuelle Phase: {currentPhaseObj.name}
                        </span>
                        <span className="text-[#FF8B00]/60">({currentPhaseObj.timing})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                      <div className="flex-1 h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--neutral-200)] whitespace-nowrap">
                        {completedPhases}/{totalPhases} Phasen
                      </span>
                    </div>
                  </div>
                </div>

                <ArrowRight size={20} className="text-[var(--neutral-100)] flex-shrink-0 mt-2" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
