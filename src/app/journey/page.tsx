'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  UserCheck,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Flag,
  Users,
  ArrowRight,
  Star,
  Send,
  User,
  Compass,
  Heart,
  Award,
  Target,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  TrendingUp,
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts';
import onboardings from '@/data/onboarding.json';
import employees from '@/data/employees.json';
import feedback from '@/data/feedback.json';
import processes from '@/data/processes.json';
import developmentData from '@/data/development.json';

const MY_EMPLOYEE_ID = 'emp-004';

// -------------------------------------------------------------------------------
// Typen & Konfiguration – Timeline
// -------------------------------------------------------------------------------

type EventStatus = 'completed' | 'in-progress' | 'upcoming' | 'future';
type EventType = 'onboarding' | 'ifc' | 'review' | 'feedback-received' | 'feedback-todo' | 'milestone';

interface TimelineEvent {
  id: string;
  type: EventType;
  category: string;
  title: string;
  timing: string;
  sortDate: string;
  displayDate: string | null;
  status: EventStatus;
  description: string;
  onboardingFeedback?: { questions: string[]; responses: { from: string; summary: string }[] };
  notes?: string | null;
  activities?: { text: string; responsible: string; done: boolean }[];
  feedbackId?: string;
  feedbackAnswers?: { questionId: string; rating?: number; text?: string }[];
  processTitle?: string;
  toEmployee?: string;
  feedbackTodoId?: string;
}

const typeConfig: Record<EventType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  onboarding: { label: 'Onboarding', color: '#02464B', bg: '#E0F0F1', icon: <UserCheck size={16} /> },
  ifc: { label: 'IFC', color: '#FF8B00', bg: '#FFF7E6', icon: <MessageSquare size={16} /> },
  review: { label: 'Review', color: '#0A7075', bg: '#E6F3F3', icon: <FileText size={16} /> },
  'feedback-received': { label: 'Feedback erhalten', color: '#00875A', bg: '#E3FCEF', icon: <Star size={16} /> },
  'feedback-todo': { label: 'Feedback geben', color: '#6B778C', bg: '#F4F5F7', icon: <Send size={16} /> },
  milestone: { label: 'Meilenstein', color: '#6B778C', bg: '#F4F5F7', icon: <Flag size={16} /> },
};

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  personal: { label: 'Personal', color: '#6B778C', bg: '#F4F5F7', icon: <User size={12} /> },
  fachLotse: { label: 'Fachlicher Lotse', color: '#0A7075', bg: '#E6F3F3', icon: <Compass size={12} /> },
  kulturLotse: { label: 'Kultureller Lotse', color: '#02464B', bg: '#E0F0F1', icon: <Heart size={12} /> },
  deciderGroup: { label: 'Decider Group', color: '#FF8B00', bg: '#FFF7E6', icon: <Users size={12} /> },
};

// -------------------------------------------------------------------------------
// Entwicklung – Konfigurationen
// -------------------------------------------------------------------------------

const devIconMap: Record<string, React.ReactNode> = {
  feedback: <MessageSquare size={16} />,
  training: <GraduationCap size={16} />,
  milestone: <Flag size={16} />,
  goal: <Target size={16} />,
};

const devColorMap: Record<string, { bg: string; text: string }> = {
  feedback: { bg: '#DEEBFF', text: '#02464B' },
  training: { bg: '#EAE6FF', text: '#0A7075' },
  milestone: { bg: '#E3FCEF', text: '#00875A' },
  goal: { bg: '#FFF7E6', text: '#FF8B00' },
};

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: '#FF5630', bg: '#FFEBE6', label: 'Hoch' },
  medium: { color: '#FF8B00', bg: '#FFF7E6', label: 'Mittel' },
  low: { color: '#6B778C', bg: '#F4F5F7', label: 'Normal' },
};

// -------------------------------------------------------------------------------
// Timeline aufbauen
// -------------------------------------------------------------------------------

function buildTimeline(onb: (typeof onboardings)[0]): TimelineEvent[] {
  const getPhaseType = (name: string): EventType => {
    if (name.includes('IFC')) return 'ifc';
    if (name.includes('Review')) return 'review';
    if (name.includes('Abschluss')) return 'milestone';
    return 'onboarding';
  };

  const onboardingEvents: TimelineEvent[] = onb.phases.map((phase) => {
    const dateStr =
      'completedDate' in phase ? (phase.completedDate as string) :
      'dueDate' in phase ? (phase.dueDate as string) : '9999-99-99';
    return {
      id: phase.id,
      type: getPhaseType(phase.name),
      category: 'Onboarding',
      title: phase.name,
      timing: phase.timing,
      sortDate: dateStr,
      displayDate: dateStr === '9999-99-99' ? null : dateStr,
      status: phase.status as EventStatus,
      description: phase.description,
      onboardingFeedback: phase.feedback ?? undefined,
      notes: phase.notes || null,
      activities: phase.activities,
    };
  });

  const receivedFeedback = feedback.filter(
    (f) => f.toEmployee === MY_EMPLOYEE_ID && f.status === 'completed'
  );
  const feedbackEvents: TimelineEvent[] = receivedFeedback.map((fb) => {
    const proc = processes.find((p) => p.id === fb.processId);
    return {
      id: `fb-received-${fb.id}`,
      type: 'feedback-received',
      category: 'Feedback erhalten',
      title: proc?.title ?? 'Feedback erhalten',
      timing: fb.date,
      sortDate: fb.date || '9999-99-99',
      displayDate: fb.date || null,
      status: 'completed' as EventStatus,
      description: `Feedback aus dem Prozess „${proc?.title ?? ''}"`,
      feedbackId: fb.id,
      feedbackAnswers: fb.answers,
      processTitle: proc?.title,
    };
  });

  const pendingToGive = feedback.filter(
    (f) => f.fromEmployee === MY_EMPLOYEE_ID && f.status === 'pending'
  );
  const todoEvents: TimelineEvent[] = pendingToGive.map((fb) => {
    const proc = processes.find((p) => p.id === fb.processId);
    return {
      id: `fb-todo-${fb.id}`,
      type: 'feedback-todo',
      category: 'Feedback geben',
      title: `Feedback für ${employees.find((e) => e.id === fb.toEmployee)?.name ?? ''}`,
      timing: 'Jetzt offen',
      sortDate: '2024-11-01',
      displayDate: null,
      status: 'in-progress' as EventStatus,
      description: `Du wurdest gebeten, Feedback im Prozess „${proc?.title ?? ''}" zu geben.`,
      toEmployee: fb.toEmployee,
      feedbackTodoId: fb.id,
      processTitle: proc?.title,
    };
  });

  const futureEvents: TimelineEvent[] = [
    {
      id: 'future-360',
      type: 'feedback-received',
      category: 'Reguläres Feedback',
      title: 'Erster regulärer 360°-Feedback-Prozess',
      timing: '~6 Monate',
      sortDate: '2025-03-01',
      displayDate: '2025-03-01',
      status: 'future',
      description: 'Der erste vollständige 360°-Feedback-Prozess nach dem Onboarding – mit Peer Feedback, Selbsteinschätzung und Fremdeinschätzung.',
    },
    {
      id: 'future-review',
      type: 'milestone',
      category: 'Entwicklung',
      title: 'Jährliches Performance-Review',
      timing: '~12 Monate',
      sortDate: '2025-09-01',
      displayDate: '2025-09-01',
      status: 'future',
      description: 'Vollständiger Rückblick auf das erste Jahr: Kompetenzentwicklung, Zielerreichung und gemeinsame Planung für das nächste Jahr.',
    },
  ];

  return [...onboardingEvents, ...feedbackEvents, ...todoEvents, ...futureEvents].sort(
    (a, b) => a.sortDate.localeCompare(b.sortDate)
  );
}

type FilterKey = 'all' | 'onboarding' | 'ifc' | 'review' | 'feedback-received' | 'milestone';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Alles' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'ifc', label: 'IFC' },
  { key: 'review', label: 'Review' },
  { key: 'feedback-received', label: 'Feedback' },
  { key: 'milestone', label: 'Meilensteine' },
];

// -------------------------------------------------------------------------------
// Hauptkomponente
// -------------------------------------------------------------------------------

export default function JourneyPage() {
  const onb = onboardings.find((o) => o.newbie === MY_EMPLOYEE_ID);
  const [activeTab, setActiveTab] = useState<'timeline' | 'entwicklung'>('timeline');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [interests, setInterests] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    developmentData.recommendations.forEach((r) => { init[r.id] = r.interested; });
    return init;
  });

  if (!onb) {
    return <div className="text-center py-20 text-[var(--neutral-200)]">Keine Daten gefunden.</div>;
  }

  const me = employees.find((e) => e.id === MY_EMPLOYEE_ID);
  const fachLotse = employees.find((e) => e.id === onb.fachLotse);
  const kulturLotse = employees.find((e) => e.id === onb.kulturLotse);

  const allEvents = buildTimeline(onb);
  const receivedCount = allEvents.filter((e) => e.type === 'feedback-received' && e.status === 'completed').length;
  const todoCount = allEvents.filter((e) => e.type === 'feedback-todo').length;

  const getResponsibleEmployee = (key: string) => {
    if (key === 'fachLotse') return fachLotse;
    if (key === 'kulturLotse') return kulturLotse;
    if (key === 'personal') return employees.find((e) => e.id === onb.personal);
    return null;
  };

  const filteredEvents =
    activeFilter === 'all'
      ? allEvents
      : activeFilter === 'feedback-received'
      ? allEvents.filter((e) => e.type === 'feedback-received' || e.type === 'feedback-todo')
      : allEvents.filter((e) => e.type === activeFilter);

  const nowIndex = filteredEvents.findIndex((e) => e.status !== 'completed' && e.type !== 'feedback-todo');
  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  // Entwicklung tab
  const radarData = developmentData.competencies.map((c) => ({
    subject: c.name,
    'Fremdeinschätzung': c.current,
    'Selbsteinschätzung': c.selfAssessment,
    'Vorher': c.previous,
    fullMark: c.max,
  }));
  const sortedCompetencies = [...developmentData.competencies].sort((a, b) => b.current - a.current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
          {me?.avatar}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Meine Journey</h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">
            {me?.role} · {me?.department} · Dabei seit {onb.startDate}
          </p>
        </div>
      </div>

      {/* Tab-Leiste */}
      <div className="flex gap-1 p-1 bg-[var(--neutral-20)] rounded-xl w-fit">
        {[
          { key: 'timeline' as const, label: 'Verlauf', icon: <CalendarDays size={15} /> },
          { key: 'entwicklung' as const, label: 'Entwicklung', icon: <TrendingUp size={15} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[var(--neutral-800)] shadow-sm'
                : 'text-[var(--neutral-200)] hover:text-[var(--neutral-800)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* TAB: TIMELINE                                                 */}
      {/* ============================================================ */}
      {activeTab === 'timeline' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E0F0F1] text-[#02464B] flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--neutral-800)]">
                    {allEvents.filter((e) => e.status === 'completed' && e.type !== 'feedback-received').length}
                    <span className="text-sm font-normal text-[var(--neutral-100)] ml-1">
                      / {allEvents.filter((e) => e.status !== 'future' && e.type !== 'feedback-received' && e.type !== 'feedback-todo').length}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--neutral-100)]">Stationen abgeschlossen</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E3FCEF] text-[#00875A] flex items-center justify-center">
                  <Star size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--neutral-800)]">{receivedCount}</div>
                  <div className="text-xs text-[var(--neutral-100)]">Feedback erhalten</div>
                </div>
              </div>
            </div>
            <div className={`rounded-xl border p-4 ${todoCount > 0 ? 'bg-[#FFF7E6] border-[#FFCC88]' : 'bg-white border-[var(--neutral-30)]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${todoCount > 0 ? 'bg-[#FF8B00] text-white' : 'bg-[var(--neutral-20)] text-[var(--neutral-100)]'}`}>
                  <Send size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--neutral-800)]">{todoCount}</div>
                  <div className="text-xs text-[var(--neutral-100)]">Feedback zu geben</div>
                </div>
              </div>
            </div>
          </div>

          {/* Offene Aufgaben */}
          {todoCount > 0 && (
            <div className="rounded-xl border border-[#FFCC88] bg-[#FFF7E6] p-4">
              <h3 className="text-sm font-semibold text-[#FF8B00] mb-3 flex items-center gap-2">
                <Send size={14} />
                Offene Aufgabe – Feedback geben
              </h3>
              <div className="space-y-2">
                {allEvents.filter((e) => e.type === 'feedback-todo').map((e) => {
                  const target = employees.find((emp) => emp.id === e.toEmployee);
                  return (
                    <Link
                      key={e.id}
                      href={`/feedback/give/${e.feedbackTodoId}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#FFCC88] hover:border-[#FF8B00] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FFF7E6] text-[#FF8B00] flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {target?.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--neutral-800)]">{e.title}</div>
                        <div className="text-xs text-[var(--neutral-100)]">{e.processTitle}</div>
                      </div>
                      <ArrowRight size={14} className="text-[#FF8B00] flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Summary */}
          <div className="rounded-xl bg-gradient-to-r from-[#02464B] to-[#0A7075] p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">KI – Wo stehst du gerade?</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed mb-3">
              Du hast die ersten drei Phasen deines Onboardings erfolgreich abgeschlossen und bereits {receivedCount} formale Feedbacks erhalten. Dein Team schätzt besonders deine Eigeninitiative und schnelle Integration.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Stärke erkannt', text: 'Eigeninitiative & Teamintegration' },
                { label: 'Fokus jetzt', text: '1. IFC vorbereiten + Architektur vertiefen' },
                { label: 'Nächster Schritt', text: '360°-Feedback nach Onboarding' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-1">{item.label}</div>
                  <div className="text-sm text-white font-medium leading-snug">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => {
              const tc = f.key !== 'all' ? typeConfig[f.key] : null;
              const isActive = activeFilter === f.key;
              const count =
                f.key === 'all'
                  ? allEvents.filter((e) => e.type !== 'feedback-todo').length
                  : f.key === 'feedback-received'
                  ? allEvents.filter((e) => e.type === 'feedback-received').length
                  : allEvents.filter((e) => e.type === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-[var(--neutral-30)] text-[var(--neutral-200)] hover:border-[var(--neutral-40)] bg-white'
                  }`}
                >
                  {tc && !isActive && <span style={{ color: tc.color }}>{tc.icon}</span>}
                  {f.label}
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--neutral-20)] text-[var(--neutral-100)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="relative">
            {filteredEvents
              .filter((e) => e.type !== 'feedback-todo')
              .map((event, index, arr) => {
                const tc = typeConfig[event.type];
                const isFuture = event.status === 'future' || event.status === 'upcoming';
                const isExpanded = expanded === event.id;
                const isLast = index === arr.length - 1;
                const showNowMarker = activeFilter === 'all' && index === nowIndex && index > 0;

                return (
                  <React.Fragment key={event.id}>
                    {showNowMarker && (
                      <div className="flex items-center gap-3 my-1">
                        <div className="w-10 flex-shrink-0 flex justify-center">
                          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="h-px flex-1 border-t-2 border-dashed border-[var(--primary)] opacity-40" />
                          <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest px-2 py-0.5 bg-[var(--primary-light)] rounded-full whitespace-nowrap">
                            Du bist hier
                          </span>
                          <div className="h-px flex-1 border-t-2 border-dashed border-[var(--primary)] opacity-40" />
                        </div>
                      </div>
                    )}

                    <div className="relative flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0 w-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all ${isFuture ? 'opacity-40' : ''}`}
                          style={{
                            backgroundColor: isFuture ? '#F4F5F7' : tc.bg,
                            color: isFuture ? '#B3BAC5' : tc.color,
                            borderColor: event.status === 'in-progress' ? tc.color : 'transparent',
                          }}
                        >
                          {event.status === 'completed' ? <CheckCircle2 size={20} /> : event.status === 'in-progress' ? <Clock size={20} /> : <Circle size={20} />}
                        </div>
                        {!isLast && (
                          <div
                            className="flex-1 min-h-[20px]"
                            style={{ width: isFuture ? '0' : '2px', backgroundColor: event.status === 'completed' ? '#00875A' : '#DFE1E6' }}
                          />
                        )}
                      </div>

                      <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''} ${isFuture ? 'opacity-55' : ''}`}>
                        <button
                          onClick={() => !isFuture && toggle(event.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            event.status === 'in-progress'
                              ? 'border-[#FF8B00] bg-[#FFF7E6]/40 shadow-sm'
                              : event.status === 'completed'
                              ? 'border-[var(--neutral-30)] bg-white hover:border-[var(--primary)] hover:shadow-sm'
                              : isFuture
                              ? 'border-dashed border-[var(--neutral-30)] bg-[var(--neutral-10)] cursor-default'
                              : 'border-[var(--neutral-30)] bg-[var(--neutral-10)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                  style={{ backgroundColor: isFuture ? '#F4F5F7' : tc.bg, color: isFuture ? '#B3BAC5' : tc.color }}
                                >
                                  {tc.icon}
                                  {event.category}
                                </span>
                                {event.status === 'in-progress' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8B00] text-white">JETZT</span>
                                )}
                                {isFuture && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--neutral-20)] text-[var(--neutral-100)]">Geplant</span>
                                )}
                              </div>
                              <h3 className={`font-semibold text-sm ${isFuture ? 'text-[var(--neutral-100)]' : 'text-[var(--neutral-800)]'}`}>
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                                  <CalendarDays size={10} />
                                  {event.timing}
                                </span>
                                {event.displayDate && (
                                  <span className={`text-xs ${event.status === 'completed' ? 'text-[#00875A]' : 'text-[var(--neutral-100)]'}`}>
                                    {event.status === 'completed' ? 'Abgeschlossen: ' : 'Geplant: '}{event.displayDate}
                                  </span>
                                )}
                              </div>
                              {event.type === 'feedback-received' && event.feedbackAnswers && event.feedbackAnswers.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => {
                                      const avg = event.feedbackAnswers!.filter((a) => a.rating).reduce((acc, a) => acc + (a.rating ?? 0), 0) / (event.feedbackAnswers!.filter((a) => a.rating).length || 1);
                                      return <Star key={s} size={12} className={s <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />;
                                    })}
                                  </div>
                                  <span className="text-xs text-[var(--neutral-100)]">
                                    Ø {(event.feedbackAnswers.filter((a) => a.rating).reduce((acc, a) => acc + (a.rating ?? 0), 0) / (event.feedbackAnswers.filter((a) => a.rating).length || 1)).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {event.onboardingFeedback && event.onboardingFeedback.responses.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  <Sparkles size={11} className="text-[var(--primary)]" />
                                  <span className="text-xs text-[var(--neutral-200)]">
                                    {event.onboardingFeedback.responses.length} Feedback{event.onboardingFeedback.responses.length > 1 ? 's' : ''} eingegangen
                                  </span>
                                </div>
                              )}
                            </div>
                            {!isFuture && (
                              <div className="flex-shrink-0 text-[var(--neutral-100)] mt-0.5">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            )}
                          </div>
                        </button>

                        {isExpanded && !isFuture && (
                          <div className="mt-2 space-y-3">
                            <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                              <p className="text-sm text-[var(--neutral-200)] leading-relaxed">{event.description}</p>
                            </div>

                            {event.type === 'feedback-received' && event.feedbackAnswers && (
                              <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                                <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <Star size={12} />
                                  Dein Feedback
                                </h4>
                                <div className="space-y-3">
                                  {event.feedbackAnswers.filter((a) => a.rating).map((a, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="text-xs text-[var(--neutral-100)] w-20 flex-shrink-0">Frage {i + 1}</span>
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                          <Star key={s} size={14} className={s <= (a.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />
                                        ))}
                                      </div>
                                      <span className="text-xs font-medium text-[var(--neutral-800)]">{a.rating}/5</span>
                                    </div>
                                  ))}
                                  {event.feedbackAnswers.filter((a) => a.text).map((a, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-[var(--neutral-10)] border border-[var(--neutral-30)]">
                                      <p className="text-sm text-[var(--neutral-200)] leading-relaxed italic">&quot;{a.text}&quot;</p>
                                    </div>
                                  ))}
                                </div>
                                <Link href={`/feedback/results/${event.feedbackId}`} className="mt-3 flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline">
                                  Vollständige Ergebnisse <ArrowRight size={12} />
                                </Link>
                              </div>
                            )}

                            {event.onboardingFeedback && event.onboardingFeedback.responses.length > 0 && (
                              <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                                <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <MessageSquare size={12} />
                                  Feedback aus dieser Phase
                                </h4>
                                <div className="space-y-2">
                                  {event.onboardingFeedback.responses.map((resp, i) => {
                                    const respEmp = employees.find((e) => e.id === resp.from);
                                    if (resp.from === MY_EMPLOYEE_ID) return null;
                                    return (
                                      <div key={i} className="p-3 rounded-lg border border-[var(--neutral-30)] bg-[var(--neutral-10)]">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[9px] font-bold">
                                            {respEmp?.avatar ?? '?'}
                                          </div>
                                          <span className="text-xs font-medium text-[var(--neutral-800)]">{respEmp?.name ?? 'Anonymes Feedback'}</span>
                                        </div>
                                        <p className="text-sm text-[var(--neutral-200)] leading-relaxed">{resp.summary}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {event.activities && event.activities.length > 0 && (
                              <div className="px-4 py-3 rounded-lg bg-white border border-[var(--neutral-30)]">
                                <h4 className="text-xs font-semibold text-[var(--neutral-800)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <FileText size={12} />
                                  Aufgaben
                                </h4>
                                <div className="space-y-2">
                                  {event.activities.map((activity, i) => {
                                    const rc = roleConfig[activity.responsible];
                                    const emp = getResponsibleEmployee(activity.responsible);
                                    return (
                                      <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${activity.done ? 'bg-[#E3FCEF]/40' : 'bg-[var(--neutral-10)]'}`}>
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${activity.done ? 'border-[#00875A] bg-[#00875A]' : 'border-[var(--neutral-40)]'}`}>
                                          {activity.done && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`flex-1 text-sm ${activity.done ? 'text-[var(--neutral-100)] line-through' : 'text-[var(--neutral-800)]'}`}>{activity.text}</span>
                                        {rc && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0" style={{ backgroundColor: rc.bg, color: rc.color }}>
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

                            {event.notes && (
                              <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#0A7075] to-[#14919B] text-white">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Sparkles size={12} />
                                  <span className="text-xs font-semibold">KI-Zusammenfassung</span>
                                </div>
                                <p className="text-sm text-white/90 leading-relaxed">{event.notes}</p>
                              </div>
                            )}

                            {event.onboardingFeedback && event.onboardingFeedback.responses.length === 0 && event.status !== 'completed' && (
                              <div className="px-4 py-4 rounded-lg bg-white border border-[var(--neutral-30)] text-center">
                                <Clock size={18} className="mx-auto text-[var(--neutral-100)] mb-1.5" />
                                <p className="text-sm text-[var(--neutral-200)]">Feedback steht noch aus.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB: ENTWICKLUNG                                              */}
      {/* ============================================================ */}
      {activeTab === 'entwicklung' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Linke Spalte */}
          <div className="col-span-2 space-y-6">
            {/* Radar */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">Kompetenz-Profil</h2>
              <p className="text-xs text-[var(--neutral-100)] mb-4">Selbst- vs. Fremdeinschätzung im Vergleich</p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="#EBECF0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6B778C' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: '#7A869A' }} tickCount={6} />
                    <Radar name="Vorheriger Zyklus" dataKey="Vorher" stroke="#B3BAC5" fill="#DFE1E6" fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Selbsteinschätzung" dataKey="Selbsteinschätzung" stroke="#14919B" fill="#14919B" fillOpacity={0.2} strokeWidth={2} strokeDasharray="6 3" />
                    <Radar name="Fremdeinschätzung (Aktuell)" dataKey="Fremdeinschätzung" stroke="#02464B" fill="#02464B" fillOpacity={0.15} strokeWidth={2.5} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-[#02464B] to-[#0A7075] rounded-xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">AI-Analyse: Selbst- vs. Fremdeinschätzung</h3>
                  <p className="text-sm text-white/90 leading-relaxed">{developmentData.aiComparisonInsight}</p>
                </div>
              </div>
            </div>

            {/* Kompetenz-Details */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">Kompetenz-Details</h2>
              <p className="text-xs text-[var(--neutral-100)] mb-4">Vergleich von Selbst- und Fremdeinschätzung pro Kompetenz</p>
              <div className="flex items-center gap-4 mb-3 px-1">
                <div className="w-44 text-xs font-medium text-[var(--neutral-100)] uppercase tracking-wide">Kompetenz</div>
                <div className="flex-1 text-xs font-medium text-[var(--neutral-100)] uppercase tracking-wide">Bewertung</div>
                <div className="w-20 text-xs font-medium text-[var(--neutral-100)] uppercase tracking-wide text-center">Werte</div>
                <div className="w-28 text-xs font-medium text-[var(--neutral-100)] uppercase tracking-wide text-center">Differenz</div>
              </div>
              <div className="space-y-3">
                {sortedCompetencies.map((comp) => {
                  const diff = comp.current - comp.selfAssessment;
                  const change = comp.current - comp.previous;
                  return (
                    <div key={comp.name} className="rounded-lg border border-[var(--neutral-20)] p-3 hover:border-[var(--neutral-40)] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-44">
                          <span className="text-sm font-medium text-[var(--neutral-800)]">{comp.name}</span>
                          <div className={`flex items-center gap-0.5 mt-0.5 text-[10px] font-medium ${change > 0 ? 'text-[var(--success)]' : change < 0 ? 'text-[var(--danger)]' : 'text-[var(--neutral-100)]'}`}>
                            {change > 0 ? <ArrowUpRight size={10} /> : change < 0 ? <ArrowDownRight size={10} /> : null}
                            {change > 0 ? '+' : ''}{change.toFixed(1)} vs. Vorzyklus
                          </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--neutral-100)] w-14 flex-shrink-0">Selbst</span>
                            <div className="flex-1 h-2.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(comp.selfAssessment / comp.max) * 100}%`, backgroundColor: '#14919B' }} />
                            </div>
                            <span className="text-xs font-medium text-[#14919B] w-8 text-right">{comp.selfAssessment}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--neutral-100)] w-14 flex-shrink-0">Fremd</span>
                            <div className="flex-1 h-2.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(comp.current / comp.max) * 100}%`, backgroundColor: '#02464B' }} />
                            </div>
                            <span className="text-xs font-medium text-[#02464B] w-8 text-right">{comp.current}</span>
                          </div>
                        </div>
                        <div className="w-20 text-center">
                          <span className="text-sm font-semibold text-[var(--neutral-800)]">{comp.current}</span>
                          <span className="text-xs text-[var(--neutral-100)]">/{comp.max}</span>
                        </div>
                        <div className="w-28 text-center">
                          {diff > 0 && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#E3FCEF] text-[#00875A]"><ArrowUpRight size={11} />+{diff.toFixed(1)} unterschätzt</span>}
                          {diff < 0 && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#FFF7E6] text-[#FF8B00]"><ArrowDownRight size={11} />{diff.toFixed(1)} überschätzt</span>}
                          {diff === 0 && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[var(--neutral-20)] text-[var(--neutral-200)]">Übereinstimmung</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entwicklungs-Timeline */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Entwicklungs-Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--neutral-30)]" />
                <div className="space-y-4">
                  {developmentData.timeline.map((entry, i) => {
                    const cm = devColorMap[entry.type] || devColorMap.feedback;
                    return (
                      <div key={i} className="flex gap-4 relative">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                          style={{ backgroundColor: cm.bg, color: cm.text }}
                        >
                          {devIconMap[entry.type]}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--neutral-800)]">{entry.event}</span>
                            <span className="text-xs text-[var(--neutral-100)]">{entry.date}</span>
                          </div>
                          {entry.details && (
                            <p className="text-xs text-[var(--neutral-200)] mt-1">{entry.details}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rechte Spalte */}
          <div className="space-y-6">
            {/* AI Empfehlungen */}
            <div className="bg-gradient-to-br from-[#0A7075] to-[#14919B] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} />
                <h3 className="font-semibold text-sm">AI-Empfehlungen</h3>
              </div>
              <div className="flex items-start gap-2 bg-white/10 rounded-lg p-2.5 mb-4">
                <Info size={14} className="text-white/80 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/80 leading-relaxed">Wähle Empfehlungen aus, an denen du Interesse hast. HR wird informiert.</p>
              </div>
              <div className="space-y-3">
                {developmentData.recommendations.map((rec) => {
                  const pc = priorityConfig[rec.priority];
                  const isInterested = interests[rec.id];
                  return (
                    <div key={rec.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: pc.bg, color: pc.color }}>{pc.label}</span>
                        <span className="text-xs text-white/60">{rec.category}</span>
                      </div>
                      <div className="text-sm font-medium text-white">{rec.title}</div>
                      <p className="text-xs text-white/70 mt-1">{rec.description}</p>
                      <button
                        onClick={() => setInterests((prev) => ({ ...prev, [rec.id]: !prev[rec.id] }))}
                        className={`mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isInterested ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-white/70 border border-white/15 hover:bg-white/10 hover:text-white'}`}
                      >
                        {isInterested ? <CheckCircle2 size={13} className="text-[#36B37E]" /> : <Circle size={13} />}
                        {isInterested ? 'Interesse bekundet' : 'Interesse bekunden'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stärken */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award size={18} className="text-[var(--success)]" />
                <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Stärken</h3>
              </div>
              <div className="space-y-2">
                {developmentData.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-2 flex-shrink-0" />
                    <span className="text-sm text-[var(--neutral-200)]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entwicklungsfelder */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-[var(--warning)]" />
                <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Entwicklungsfelder</h3>
              </div>
              <div className="space-y-2">
                {developmentData.developmentAreas.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-2 flex-shrink-0" />
                    <span className="text-sm text-[var(--neutral-200)]">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
