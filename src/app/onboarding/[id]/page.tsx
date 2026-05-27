'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Compass,
  Heart,
  FileText,
  MessageSquare,
  Sparkles,
  BookOpen,
  Send,
  CalendarDays,
  Zap,
  Bell,
} from 'lucide-react';
import onboardings from '@/data/onboarding.json';
import employees from '@/data/employees.json';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  const d = new Date(dateStr);
  const today = new Date('2024-11-10'); // Prototyp-Datum
  return d < today;
}

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  personal: { label: 'Personal', color: '#6B778C', bg: '#F4F5F7', icon: <User size={12} /> },
  fachLotse: { label: 'Fachlicher Lotse', color: '#0A7075', bg: '#E6F3F3', icon: <Compass size={12} /> },
  kulturLotse: { label: 'Kultureller Lotse', color: '#02464B', bg: '#E0F0F1', icon: <Heart size={12} /> },
  deciderGroup: { label: 'Decider Group', color: '#FF8B00', bg: '#FFF7E6', icon: <Users size={12} /> },
  newbie: { label: 'Newbie', color: '#00875A', bg: '#E3FCEF', icon: <User size={12} /> },
};

const phaseStatusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  completed: { color: '#00875A', bg: '#E3FCEF', icon: <CheckCircle2 size={20} /> },
  'in-progress': { color: '#FF8B00', bg: '#FFF7E6', icon: <Clock size={20} /> },
  upcoming: { color: '#B3BAC5', bg: '#F4F5F7', icon: <Circle size={20} /> },
};

export default function OnboardingDetailPage() {
  const params = useParams();
  const onb = onboardings.find((o) => o.id === params.id);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    onb?.phases.find((p) => p.status === 'in-progress')?.id || null
  );
  const [autoSend, setAutoSend] = useState(true);
  const [sentIFC, setSentIFC] = useState<Record<string, boolean>>({});

  if (!onb) {
    return (
      <div className="text-center py-20 text-[var(--neutral-200)]">
        Onboarding nicht gefunden.
      </div>
    );
  }

  const newbie = employees.find((e) => e.id === onb.newbie);
  const fachLotse = employees.find((e) => e.id === onb.fachLotse);
  const kulturLotse = employees.find((e) => e.id === onb.kulturLotse);
  const deciderMembers = onb.deciderGroup.map((id) => employees.find((e) => e.id === id));
  const completedPhases = onb.phases.filter((p) => p.status === 'completed').length;
  const totalPhases = onb.phases.length;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  // IFC Trigger-Daten: 1. IFC nach 5 Wochen, 2. IFC nach 13 Wochen
  const ifc1Date = addDays(onb.startDate, 35);
  const ifc2Date = addDays(onb.startDate, 91);
  const ifc1Overdue = isOverdue(addDays(onb.startDate, 35));
  const ifc2Overdue = isOverdue(addDays(onb.startDate, 91));

  const getResponsibleEmployee = (key: string) => {
    switch (key) {
      case 'fachLotse':
        return fachLotse;
      case 'kulturLotse':
        return kulturLotse;
      case 'personal':
        return employees.find((e) => e.id === onb.personal);
      case 'deciderGroup':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/onboarding"
          className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
            Onboarding: {newbie?.name}
          </h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">
            {newbie?.role} · {newbie?.department} · Start: {onb.startDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--primary-light)]">
            <div className="w-full h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden w-24">
              <div
                className="h-full bg-[var(--primary)] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[var(--primary)]">
              {completedPhases}/{totalPhases}
            </span>
          </div>
        </div>
      </div>

      {/* Beteiligte Rollen */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
        <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">Beteiligte</h2>
        <div className="grid grid-cols-4 gap-4">
          {/* Newbie */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E3FCEF]/50 border border-[#E3FCEF]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-sm font-bold">
              {newbie?.avatar}
            </div>
            <div>
              <div className="text-xs text-[#00875A] font-semibold uppercase tracking-wider">Newbie</div>
              <div className="text-sm font-medium text-[var(--neutral-800)]">{newbie?.name}</div>
              <div className="text-[10px] text-[var(--neutral-100)]">{newbie?.role}</div>
            </div>
          </div>
          {/* Fachlicher Lotse */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E6F3F3]/50 border border-[#E6F3F3]">
            <div className="w-10 h-10 rounded-full bg-[#0A7075] text-white flex items-center justify-center text-sm font-bold">
              {fachLotse?.avatar}
            </div>
            <div>
              <div className="text-xs text-[#0A7075] font-semibold uppercase tracking-wider">Fachl. Lotse</div>
              <div className="text-sm font-medium text-[var(--neutral-800)]">{fachLotse?.name}</div>
              <div className="text-[10px] text-[var(--neutral-100)]">{fachLotse?.role}</div>
            </div>
          </div>
          {/* Kultureller Lotse */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E0F0F1]/50 border border-[#E0F0F1]">
            <div className="w-10 h-10 rounded-full bg-[#02464B] text-white flex items-center justify-center text-sm font-bold">
              {kulturLotse?.avatar}
            </div>
            <div>
              <div className="text-xs text-[#02464B] font-semibold uppercase tracking-wider">Kult. Lotse</div>
              <div className="text-sm font-medium text-[var(--neutral-800)]">{kulturLotse?.name}</div>
              <div className="text-[10px] text-[var(--neutral-100)]">Recruiting</div>
            </div>
          </div>
          {/* Decider Group */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF7E6]/50 border border-[#FFF7E6]">
            <div className="w-10 h-10 rounded-full bg-[#FF8B00] text-white flex items-center justify-center text-sm font-bold">
              DG
            </div>
            <div>
              <div className="text-xs text-[#FF8B00] font-semibold uppercase tracking-wider">Decider Group</div>
              <div className="text-sm font-medium text-[var(--neutral-800)]">
                {deciderMembers.map((m) => m?.name).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IFC Automatisierung */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--neutral-800)]">IFC-Fragebogen Automatisierung</h2>
              <p className="text-xs text-[var(--neutral-100)]">Trigger: Einstellungsdatum · 1. IFC nach 5 Wochen · 2. IFC nach 13 Wochen</p>
            </div>
          </div>
          {/* Auto-Send Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-[var(--neutral-200)]">Automatisch versenden</span>
            <div
              onClick={() => setAutoSend(!autoSend)}
              className={`relative w-10 h-5 rounded-full transition-colors ${autoSend ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-30)]'}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoSend ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. IFC */}
          {[
            { label: '1. IFC-Fragebogen', date: ifc1Date, overdue: ifc1Overdue, key: 'ifc1', weeks: 5 },
            { label: '2. IFC-Fragebogen', date: ifc2Date, overdue: ifc2Overdue, key: 'ifc2', weeks: 13 },
          ].map((ifc) => {
            const sent = sentIFC[ifc.key];
            const statusColor = sent ? '#00875A' : ifc.overdue ? '#FF5630' : '#FF8B00';
            const statusBg = sent ? '#E3FCEF' : ifc.overdue ? '#FFEBE6' : '#FFF7E6';
            const statusLabel = sent ? 'Versendet' : ifc.overdue ? 'Ueberfaellig' : 'Geplant';

            return (
              <div
                key={ifc.key}
                className="rounded-lg border border-[var(--neutral-30)] p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm text-[var(--neutral-800)]">{ifc.label}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--neutral-200)]">
                      <CalendarDays size={11} />
                      <span>Trigger: {ifc.weeks} Wochen nach Einstellung</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium" style={{ color: statusColor }}>
                      <Bell size={11} />
                      <span>Versanddatum: {ifc.date}</span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: statusBg, color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                </div>

                {autoSend && !sent && (
                  <div className="text-xs text-[var(--neutral-100)] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--neutral-10)]">
                    <Zap size={10} className="text-[var(--primary)]" />
                    Wird automatisch am {ifc.date} versendet
                  </div>
                )}

                <button
                  onClick={() => setSentIFC((prev) => ({ ...prev, [ifc.key]: true }))}
                  disabled={sent}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sent
                      ? 'bg-[#E3FCEF] text-[#00875A] cursor-default'
                      : 'bg-[var(--primary)] text-white hover:bg-[#013438]'
                  }`}
                >
                  {sent ? (
                    <>
                      <CheckCircle2 size={13} />
                      Versendet
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Jetzt versenden
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continuous Activity Banner */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0A7075] to-[#14919B] text-white">
        <BookOpen size={18} />
        <div>
          <div className="text-sm font-medium">Durchgehend: {onb.continuousActivity}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {onb.phases.map((phase, index) => {
          const sc = phaseStatusConfig[phase.status] || phaseStatusConfig.upcoming;
          const isExpanded = expandedPhase === phase.id;
          const isLast = index === onb.phases.length - 1;

          return (
            <div key={phase.id} className="relative flex gap-4">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center flex-shrink-0 w-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2"
                  style={{
                    backgroundColor: sc.bg,
                    color: sc.color,
                    borderColor: phase.status === 'in-progress' ? sc.color : 'transparent',
                  }}
                >
                  {sc.icon}
                </div>
                {!isLast && (
                  <div
                    className="w-0.5 flex-1 min-h-[20px]"
                    style={{
                      backgroundColor:
                        phase.status === 'completed' ? '#00875A' : 'var(--neutral-30)',
                    }}
                  />
                )}
              </div>

              {/* Phase content */}
              <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    phase.status === 'in-progress'
                      ? 'border-[#FF8B00] bg-[#FFF7E6]/30 shadow-sm'
                      : phase.status === 'completed'
                      ? 'border-[var(--neutral-30)] bg-white hover:border-[var(--primary)]'
                      : 'border-[var(--neutral-30)] bg-[var(--neutral-10)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold text-sm ${
                              phase.status === 'upcoming'
                                ? 'text-[var(--neutral-100)]'
                                : 'text-[var(--neutral-800)]'
                            }`}
                          >
                            {phase.name}
                          </h3>
                          {phase.status === 'in-progress' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF8B00] text-white">
                              AKTUELL
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                            <CalendarDays size={11} />
                            {phase.timing}
                          </span>
                          {phase.status === 'completed' && 'completedDate' in phase && (
                            <span className="text-xs text-[#00875A]">
                              Abgeschlossen: {(phase as Record<string, unknown>).completedDate as string}
                            </span>
                          )}
                          {phase.status !== 'completed' && 'dueDate' in phase && (
                            <span className="text-xs text-[var(--neutral-100)]">
                              Faellig: {(phase as Record<string, unknown>).dueDate as string}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {phase.activities && (
                        <span className="text-xs text-[var(--neutral-100)]">
                          {phase.activities.filter((a) => a.done).length}/{phase.activities.length} Aufgaben
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-[var(--neutral-100)]" />
                      ) : (
                        <ChevronDown size={16} className="text-[var(--neutral-100)]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-3 ml-0 space-y-4">
                    {/* Description */}
                    <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                      <p className="text-sm text-[var(--neutral-200)] leading-relaxed">
                        {phase.description}
                      </p>
                    </div>

                    {/* Activities / Checklist */}
                    {phase.activities && phase.activities.length > 0 && (
                      <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                        <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <FileText size={12} />
                          Aufgaben
                        </h4>
                        <div className="space-y-2">
                          {phase.activities.map((activity, i) => {
                            const rc = roleConfig[activity.responsible];
                            const emp = getResponsibleEmployee(activity.responsible);
                            return (
                              <div
                                key={i}
                                className={`flex items-start gap-3 p-2.5 rounded-lg ${
                                  activity.done ? 'bg-[#E3FCEF]/30' : 'bg-[var(--neutral-10)]'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    activity.done
                                      ? 'border-[#00875A] bg-[#00875A]'
                                      : 'border-[var(--neutral-40)]'
                                  }`}
                                >
                                  {activity.done && (
                                    <CheckCircle2 size={12} className="text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-sm ${
                                      activity.done
                                        ? 'text-[var(--neutral-100)] line-through'
                                        : 'text-[var(--neutral-800)]'
                                    }`}
                                  >
                                    {activity.text}
                                  </div>
                                </div>
                                {rc && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
                                    style={{ backgroundColor: rc.bg, color: rc.color }}
                                  >
                                    {rc.icon}
                                    {emp ? emp.name : rc.label}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Feedback / Questions & Responses */}
                    {phase.feedback && (
                      <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                        <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <MessageSquare size={12} />
                          Feedback & Fragen
                        </h4>
                        <div className="space-y-2 mb-3">
                          {phase.feedback.questions.map((q, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--neutral-10)] text-sm text-[var(--neutral-200)]"
                            >
                              <span className="text-[var(--primary)] font-medium text-xs">
                                F{i + 1}
                              </span>
                              {q}
                            </div>
                          ))}
                        </div>

                        {phase.feedback.responses.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-[var(--neutral-200)] mb-1">
                              Antworten:
                            </div>
                            {phase.feedback.responses.map((resp, i) => {
                              const respEmp = employees.find((e) => e.id === resp.from);
                              return (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg border border-[var(--neutral-30)] bg-[var(--neutral-10)]"
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[9px] font-bold">
                                      {respEmp?.avatar}
                                    </div>
                                    <span className="text-xs font-medium text-[var(--neutral-800)]">
                                      {respEmp?.name}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[var(--neutral-200)] leading-relaxed">
                                    {resp.summary}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          phase.status !== 'completed' && (
                            <div className="text-center py-4 text-xs text-[var(--neutral-100)]">
                              Noch kein Feedback eingegangen.
                              {phase.status === 'in-progress' && (
                                <button className="block mx-auto mt-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[#013438] transition-colors">
                                  <span className="flex items-center gap-1.5">
                                    <Send size={12} />
                                    Fragebogen versenden
                                  </span>
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {phase.notes && (
                      <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#0A7075] to-[#14919B] text-white">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles size={12} />
                          <span className="text-xs font-semibold">Notizen / AI-Zusammenfassung</span>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{phase.notes}</p>
                      </div>
                    )}

                    {/* Actions for in-progress phase */}
                    {phase.status === 'in-progress' && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-[var(--success)] text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Phase abschliessen
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-[var(--neutral-30)] text-[var(--neutral-200)] text-xs font-medium hover:bg-[var(--neutral-20)] transition-colors flex items-center gap-1.5">
                          <MessageSquare size={14} />
                          Notiz hinzufuegen
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
