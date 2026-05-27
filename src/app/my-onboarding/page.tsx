'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
  Target,
  MessageSquare,
  CalendarDays,
  FileText,
  User,
  Users,
  Compass,
  Heart,
  ArrowRight,
} from 'lucide-react';
import onboardings from '@/data/onboarding.json';
import employees from '@/data/employees.json';

// In diesem Prototyp ist der eingeloggte Mitarbeiter Markus Braun
const MY_EMPLOYEE_ID = 'emp-004';

const aiContent = {
  focusPoints: [
    'Pair-Programming mit David intensivieren – deine technischen Grundlagen sind solide, die Architektur-Kenntnisse wachsen noch.',
    'Bereite dich auf das 1. IFC vor: Sammle deine bisherigen Learnings und offene Fragen für das Gespräch mit der Decider Group.',
    'Zeig weiterhin Eigeninitiative – dein Team schätzt das sehr und es ist genau das, was sich alle von dir wünschen.',
  ],
  erwartungen:
    'Deine Ziele aus dem Erwartungsabgleich: Eigenständige Bearbeitung kleiner Tickets bis Woche 6. David empfiehlt Pair-Programming zur technischen Vertiefung. Thomas sieht dich gut auf Kurs.',
  lastIFC:
    'Das 1. IFC steht in Kürze an. Nutze die Zeit, um deine bisherigen Erfahrungen zu reflektieren und konkrete Ziele für die nächsten Wochen zu formulieren.',
  lastReview:
    'Das erste fachliche Review mit David ist für Monat 3 geplant. Bis dahin zählt: Lernfortschritte dokumentieren und aktiv Pair-Programming nutzen.',
};

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  personal: { label: 'Personal', color: '#6B778C', bg: '#F4F5F7', icon: <User size={12} /> },
  fachLotse: { label: 'Fachlicher Lotse', color: '#0A7075', bg: '#E6F3F3', icon: <Compass size={12} /> },
  kulturLotse: { label: 'Kultureller Lotse', color: '#02464B', bg: '#E0F0F1', icon: <Heart size={12} /> },
  deciderGroup: { label: 'Decider Group', color: '#FF8B00', bg: '#FFF7E6', icon: <Users size={12} /> },
};

const statusConfig = {
  completed: { label: 'Abgeschlossen', color: '#00875A', bg: '#E3FCEF', icon: <CheckCircle2 size={14} /> },
  'in-progress': { label: 'Ausstehend', color: '#FF8B00', bg: '#FFF7E6', icon: <Clock size={14} /> },
  upcoming: { label: 'Geplant', color: '#6B778C', bg: '#F4F5F7', icon: <Circle size={14} /> },
};

export default function MyOnboardingPage() {
  const onb = onboardings.find((o) => o.newbie === MY_EMPLOYEE_ID);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!onb) {
    return (
      <div className="text-center py-20 text-[var(--neutral-200)]">
        Kein aktives Onboarding gefunden.
      </div>
    );
  }

  const me = employees.find((e) => e.id === MY_EMPLOYEE_ID);
  const fachLotse = employees.find((e) => e.id === onb.fachLotse);
  const kulturLotse = employees.find((e) => e.id === onb.kulturLotse);
  const deciderMembers = onb.deciderGroup.map((id) => employees.find((e) => e.id === id));

  const completedPhases = onb.phases.filter((p) => p.status === 'completed').length;
  const totalPhases = onb.phases.length;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  const erwartungenPhase = onb.phases.find((p) => p.id === 'phase-2');
  const ifcPhases = onb.phases.filter((p) => p.name.includes('IFC'));
  const lastIFCPhase = [...ifcPhases].reverse().find((p) => p.status !== 'upcoming') ?? ifcPhases[0];
  const reviewPhases = onb.phases.filter((p) => p.name.includes('Review'));
  const lastReviewPhase = [...reviewPhases].reverse().find((p) => p.status !== 'upcoming') ?? reviewPhases[0];

  const getResponsibleEmployee = (key: string) => {
    if (key === 'fachLotse') return fachLotse;
    if (key === 'kulturLotse') return kulturLotse;
    if (key === 'personal') return employees.find((e) => e.id === onb.personal);
    return null;
  };

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  const sections = [
    {
      id: 'erwartungen',
      title: 'Meine Erwartungen',
      icon: <Target size={18} />,
      aiSummary: aiContent.erwartungen,
      phase: erwartungenPhase,
      accentColor: '#0A7075',
      accentBg: '#E6F3F3',
    },
    {
      id: 'ifc',
      title: 'Mein letzter IFC',
      icon: <MessageSquare size={18} />,
      aiSummary: aiContent.lastIFC,
      phase: lastIFCPhase,
      accentColor: '#FF8B00',
      accentBg: '#FFF7E6',
    },
    {
      id: 'review',
      title: 'Mein letztes Review',
      icon: <FileText size={18} />,
      aiSummary: aiContent.lastReview,
      phase: lastReviewPhase,
      accentColor: '#6B778C',
      accentBg: '#F4F5F7',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
          {me?.avatar}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Mein Onboarding</h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">
            {me?.role} · {me?.department} · Start: {onb.startDate}
          </p>
        </div>
        {/* Progress */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold text-[var(--neutral-800)]">{progress}%</span>
          <div className="w-40 h-2.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[var(--neutral-100)]">
            {completedPhases} von {totalPhases} Phasen abgeschlossen
          </span>
        </div>
      </div>

      {/* AI Focus Summary */}
      <div className="rounded-xl bg-gradient-to-r from-[#02464B] to-[#0A7075] p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">KI-Zusammenfassung – Deine aktuellen Fokuspunkte</span>
        </div>
        <ul className="space-y-2">
          {aiContent.focusPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/90 leading-relaxed">
              <span className="mt-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-4">
        <h2 className="text-xs font-semibold text-[var(--neutral-100)] uppercase tracking-wider mb-3">
          Dein Onboarding-Team
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#E6F3F3]/50 border border-[#E6F3F3]">
            <div className="w-8 h-8 rounded-full bg-[#0A7075] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {fachLotse?.avatar}
            </div>
            <div>
              <div className="text-[10px] text-[#0A7075] font-semibold uppercase tracking-wider">Fachl. Lotse</div>
              <div className="text-xs font-medium text-[var(--neutral-800)]">{fachLotse?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#E0F0F1]/50 border border-[#E0F0F1]">
            <div className="w-8 h-8 rounded-full bg-[#02464B] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {kulturLotse?.avatar}
            </div>
            <div>
              <div className="text-[10px] text-[#02464B] font-semibold uppercase tracking-wider">Kult. Lotse</div>
              <div className="text-xs font-medium text-[var(--neutral-800)]">{kulturLotse?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FFF7E6]/50 border border-[#FFF7E6]">
            <div className="w-8 h-8 rounded-full bg-[#FF8B00] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              DG
            </div>
            <div>
              <div className="text-[10px] text-[#FF8B00] font-semibold uppercase tracking-wider">Decider Group</div>
              <div className="text-xs font-medium text-[var(--neutral-800)]">
                {deciderMembers.map((m) => m?.name).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Teaser */}
      <Link
        href="/journey"
        className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-[var(--neutral-30)] hover:border-[var(--primary)] hover:shadow-sm transition-all group"
      >
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[var(--neutral-800)]">Meine Employee Journey</div>
          <div className="text-xs text-[var(--neutral-200)] mt-0.5">
            Onboarding, IFCs, Feedback-Prozesse und Reviews – alles in einer Chronik
          </div>
        </div>
        <ArrowRight size={16} className="text-[var(--neutral-100)] group-hover:text-[var(--primary)] transition-colors" />
      </Link>

      {/* 3 Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const phase = section.phase;
          if (!phase) return null;
          const isOpen = expanded === section.id;
          const sc = statusConfig[phase.status as keyof typeof statusConfig] ?? statusConfig.upcoming;

          return (
            <div key={section.id} className="bg-white rounded-xl border border-[var(--neutral-30)] overflow-hidden">
              {/* Card Header – always visible */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full text-left p-5 hover:bg-[var(--neutral-10)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: section.accentBg, color: section.accentColor }}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-semibold text-[var(--neutral-800)] text-sm">{section.title}</span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>
                    {/* Phase name + date */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[var(--neutral-200)]">{phase.name}</span>
                      {'completedDate' in phase && phase.completedDate && (
                        <span className="text-xs text-[#00875A] flex items-center gap-1">
                          <CalendarDays size={10} />
                          {phase.completedDate as string}
                        </span>
                      )}
                      {'dueDate' in phase && phase.dueDate && phase.status !== 'completed' && (
                        <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                          <CalendarDays size={10} />
                          Faellig: {phase.dueDate as string}
                        </span>
                      )}
                    </div>
                    {/* AI Summary preview */}
                    <div className="flex items-start gap-1.5">
                      <Sparkles size={11} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[var(--neutral-200)] leading-relaxed line-clamp-2">
                        {section.aiSummary}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-[var(--neutral-100)]">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Expanded full documentation */}
              {isOpen && (
                <div className="border-t border-[var(--neutral-30)] p-5 space-y-4 bg-[var(--neutral-10)]">
                  {/* AI Summary (full) */}
                  <div className="rounded-lg bg-gradient-to-r from-[#02464B] to-[#0A7075] p-4 text-white">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={12} />
                      <span className="text-xs font-semibold">KI-Zusammenfassung</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{section.aiSummary}</p>
                  </div>

                  {/* Description */}
                  <div className="rounded-lg bg-white border border-[var(--neutral-30)] p-4">
                    <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-2">
                      Beschreibung
                    </h4>
                    <p className="text-sm text-[var(--neutral-200)] leading-relaxed">{phase.description}</p>
                  </div>

                  {/* Activities */}
                  {phase.activities && phase.activities.length > 0 && (
                    <div className="rounded-lg bg-white border border-[var(--neutral-30)] p-4">
                      <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <FileText size={12} />
                        Aufgaben & Aktivitaeten
                      </h4>
                      <div className="space-y-2">
                        {phase.activities.map((activity, i) => {
                          const rc = roleConfig[activity.responsible];
                          const emp = getResponsibleEmployee(activity.responsible);
                          return (
                            <div
                              key={i}
                              className={`flex items-start gap-3 p-2.5 rounded-lg ${
                                activity.done ? 'bg-[#E3FCEF]/40' : 'bg-[var(--neutral-10)]'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  activity.done
                                    ? 'border-[#00875A] bg-[#00875A]'
                                    : 'border-[var(--neutral-40)]'
                                }`}
                              >
                                {activity.done && <CheckCircle2 size={12} className="text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`text-sm ${
                                    activity.done
                                      ? 'text-[var(--neutral-100)] line-through'
                                      : 'text-[var(--neutral-800)]'
                                  }`}
                                >
                                  {activity.text}
                                </span>
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

                  {/* Feedback Responses */}
                  {phase.feedback && phase.feedback.responses.length > 0 && (
                    <div className="rounded-lg bg-white border border-[var(--neutral-30)] p-4">
                      <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <MessageSquare size={12} />
                        Feedback das du erhalten hast
                      </h4>
                      <div className="space-y-2">
                        {phase.feedback.responses.map((resp, i) => {
                          const respEmp = employees.find((e) => e.id === resp.from);
                          // Hide own responses (the newbie's self-assessment) from this view
                          if (resp.from === MY_EMPLOYEE_ID) return null;
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
                              <p className="text-sm text-[var(--neutral-200)] leading-relaxed">{resp.summary}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Phase notes */}
                  {phase.notes && (
                    <div className="rounded-lg bg-white border border-[var(--neutral-30)] p-4">
                      <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-2">
                        Zusammenfassung / Notizen
                      </h4>
                      <p className="text-sm text-[var(--neutral-200)] leading-relaxed">{phase.notes}</p>
                    </div>
                  )}

                  {/* No feedback yet */}
                  {phase.feedback &&
                    phase.feedback.responses.length === 0 &&
                    phase.status !== 'completed' && (
                      <div className="rounded-lg bg-white border border-[var(--neutral-30)] p-4 text-center">
                        <Clock size={20} className="mx-auto text-[var(--neutral-100)] mb-2" />
                        <p className="text-sm text-[var(--neutral-200)]">
                          {phase.status === 'in-progress'
                            ? 'Das Feedback fuer diese Phase steht noch aus.'
                            : 'Diese Phase ist noch nicht gestartet.'}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
