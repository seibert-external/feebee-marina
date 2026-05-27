'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Pause,
  LogOut,
  Archive,
  UserCheck,
  Zap,
  Star,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Shield,
  BarChart2,
  Lightbulb,
  Award,
} from 'lucide-react';
import personalakten from '@/data/personalakte.json';
import employees from '@/data/employees.json';
import processes from '@/data/processes.json';
import feedback from '@/data/feedback.json';
import skillsData from '@/data/skills.json';
import developmentRaw from '@/data/development.json';

// development.json is a single object for emp-001 — wrap it
const developmentData = [developmentRaw];

// ── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; step: number }> = {
  preboarding: { label: 'Preboarding',        color: '#5243AA', bg: '#EAE6FF', icon: <Clock size={14} />,       step: 0 },
  onboarding:  { label: 'Aktiv / Onboarding', color: '#FF8B00', bg: '#FFF7E6', icon: <UserCheck size={14} />,   step: 1 },
  aktiv:       { label: 'Aktiv',              color: '#00875A', bg: '#E3FCEF', icon: <CheckCircle2 size={14} />, step: 2 },
  ruhend:      { label: 'Ruhend',             color: '#6B778C', bg: '#F4F5F7', icon: <Pause size={14} />,        step: 2 },
  offboarding: { label: 'Offboarding',        color: '#DE350B', bg: '#FFEBE6', icon: <LogOut size={14} />,       step: 3 },
  archiv:      { label: 'Archiv',             color: '#42526E', bg: '#EBECF0', icon: <Archive size={14} />,      step: 4 },
};

const timelineTypeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  start:           { label: 'Eintritt',          color: '#00875A', bg: '#E3FCEF', icon: <Star size={14} /> },
  preboarding:     { label: 'Preboarding',        color: '#5243AA', bg: '#EAE6FF', icon: <Clock size={14} /> },
  automation:      { label: 'Automation',         color: '#0052CC', bg: '#DEEBFF', icon: <Zap size={14} /> },
  milestone:       { label: 'Meilenstein',        color: '#FF8B00', bg: '#FFF7E6', icon: <Star size={14} /> },
  gehalt:          { label: 'Gehaltsanpassung',   color: '#00875A', bg: '#E3FCEF', icon: <TrendingUp size={14} /> },
  funktionswechsel:{ label: 'Funktionswechsel',   color: '#5243AA', bg: '#EAE6FF', icon: <TrendingUp size={14} /> },
  feedback:        { label: 'Feedback',            color: '#0052CC', bg: '#DEEBFF', icon: <MessageSquare size={14} /> },
  vorfall:         { label: 'Vorfall',             color: '#DE350B', bg: '#FFEBE6', icon: <AlertTriangle size={14} /> },
  sonstiges:       { label: 'Sonstiges',           color: '#6B778C', bg: '#F4F5F7', icon: <FileText size={14} /> },
};

const diszTypConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  leistungsgespraech: { label: 'Leistungsgespräch', color: '#FF8B00', bg: '#FFF7E6', dot: '#FF8B00' },
  verwarnung:         { label: 'Verwarnung',         color: '#DE350B', bg: '#FFEBE6', dot: '#DE350B' },
  abmahnung:          { label: 'Abmahnung',          color: '#BF2600', bg: '#FFEBE6', dot: '#BF2600' },
  pip:                { label: 'Performance Plan',   color: '#5243AA', bg: '#EAE6FF', dot: '#5243AA' },
  sonstiges:          { label: 'Sonstiges',           color: '#6B778C', bg: '#F4F5F7', dot: '#6B778C' },
};

const statusSteps = ['Preboarding', 'Onboarding', 'Aktiv', 'Offboarding', 'Archiv'];

const skillLevelLabel: Record<number, string> = { 1: 'Grundkenntnisse', 2: 'Anwender', 3: 'Fortgeschritten', 4: 'Experte', 5: 'Meister' };

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'daten' | 'entwicklung' | 'disziplinarisch';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'daten',           label: 'Rahmenbedingungen & Ereignisse', icon: <FileText size={15} /> },
  { id: 'entwicklung',     label: 'Feedback, Entwicklung & Skills', icon: <TrendingUp size={15} /> },
  { id: 'disziplinarisch', label: 'Disziplinarische Ereignisse',    icon: <Shield size={15} /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PersonalakteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pa = personalakten.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState<Tab>('daten');
  const [showAllTimeline, setShowAllTimeline] = useState(false);

  if (!pa) {
    return <div className="text-center py-20 text-[var(--neutral-100)]">Personalakte nicht gefunden.</div>;
  }

  const emp          = employees.find((e) => e.id === pa.employeeId);
  const fuehrung     = employees.find((e) => e.id === pa.fuehrungskraft);
  const lotse        = employees.find((e) => e.id === pa.fachLotse);
  const sc           = statusConfig[pa.status] || statusConfig.aktiv;
  const currentStep  = sc.step;

  // Tab 2 data
  const empProcesses    = processes.filter((p) => p.targetEmployee === pa.employeeId);
  const empFeedback     = feedback.filter((f) => f.toEmployee === pa.employeeId && f.status === 'completed');
  const devData         = developmentData.find((d) => d.employeeId === pa.employeeId) ?? null;
  const empSkillEntry   = skillsData.employeeSkills.find((es) => es.employeeId === pa.employeeId);
  const empSkills       = empSkillEntry
    ? empSkillEntry.skills.map((s) => ({
        ...s,
        skill: skillsData.skills.find((sk) => sk.id === s.skillId),
      }))
    : [];

  // Tab 3 data
  const diszEreignisse = (pa.disziplinarischeEreignisse ?? []) as Array<{
    id: string; date: string; typ: string; titel: string; beschreibung: string;
    vereinbarungen: string; hrVerantwortlich: string; erledigt: boolean; linkedTicket: string;
  }>;

  // Timeline
  const sortedTimeline = [...pa.timeline].reverse();
  const visibleTimeline = showAllTimeline ? sortedTimeline : sortedTimeline.slice(0, 5);

  const upcomingAutomations = ('upcomingAutomations' in pa
    ? pa.upcomingAutomations as Array<{ id: string; dueDate: string; title: string; description: string; status: string }>
    : []);

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/personalakte" className="inline-flex items-center gap-1.5 text-sm text-[var(--neutral-200)] hover:text-[var(--neutral-800)] transition-colors">
        <ArrowLeft size={16} />
        Alle Personalakten
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {emp?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--neutral-800)]">{emp?.name} – Personalakte</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                {sc.icon}{sc.label}
              </span>
              {pa.status === 'ruhend' && 'ruhendGrund' in pa && (
                <span className="text-xs bg-[#F4F5F7] text-[#6B778C] px-2.5 py-1 rounded-full">
                  {pa.ruhendGrund as string}{' '}{'ruhendBis' in pa ? `bis ${pa.ruhendBis as string}` : ''}
                </span>
              )}
              {diszEreignisse.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFEBE6] text-[#DE350B]">
                  <Shield size={11} />
                  {diszEreignisse.length} disziplinarische{diszEreignisse.length === 1 ? 'r Eintrag' : ' Einträge'}
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--neutral-200)] mb-4">{emp?.role} · {emp?.department}</div>

            {/* Status Workflow */}
            <div className="flex items-center gap-0">
              {statusSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isCurrent ? 'bg-[var(--primary)] text-white' : isDone ? 'bg-[#E3FCEF] text-[#00875A]' : 'bg-[var(--neutral-20)] text-[var(--neutral-100)]'
                    }`}>
                      {isDone && <CheckCircle2 size={11} />}
                      {step}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div className={`h-px w-4 flex-shrink-0 ${idx < currentStep ? 'bg-[#00875A]' : 'bg-[var(--neutral-30)]'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--neutral-30)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDiszTab = tab.id === 'disziplinarisch';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                isActive
                  ? isDiszTab
                    ? 'border-[#DE350B] text-[#DE350B]'
                    : 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--neutral-100)] hover:text-[var(--neutral-800)]'
              }`}
            >
              {tab.icon}
              {tab.label}
              {isDiszTab && diszEreignisse.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBE6] text-[#DE350B]">
                  {diszEreignisse.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Rahmenbedingungen & Ereignisse ────────────────────────────── */}
      {activeTab === 'daten' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-1 space-y-4">
            {/* Basisdaten */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4">Basisdaten</h2>
              <dl className="space-y-3">
                {[
                  { label: 'Unternehmen',       value: pa.unternehmenszugehoerigkeit },
                  { label: 'Startdatum',         value: pa.startDate },
                  { label: 'Enddatum',           value: pa.endDate ?? '–' },
                  { label: 'Anstellungsart',     value: pa.anstellungsart },
                  { label: 'Vertrag',            value: pa.vertrag },
                  { label: 'Führungskraft',      value: fuehrung?.name ?? '–' },
                  { label: 'Fachlicher Lotse',   value: lotse?.name ?? '–' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[11px] text-[var(--neutral-100)] uppercase tracking-wide mb-0.5">{label}</dt>
                    <dd className="text-sm text-[var(--neutral-800)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Tickets */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4">Verlinkte Tickets</h2>
              <div className="space-y-2">
                {[
                  { label: 'AV-Ticket',   value: pa.avTicket },
                  { label: 'Job-Ticket',  value: pa.jobTicket },
                  { label: 'Studi-Ticket',value: pa.studiTicket },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-[var(--neutral-20)] last:border-0">
                    <span className="text-xs text-[var(--neutral-100)]">{label}</span>
                    {value ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] bg-[#E0F0F1] px-2 py-0.5 rounded">
                        <FileText size={11} />{value}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--neutral-100)]">–</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Automations */}
            {upcomingAutomations.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                  <Zap size={15} className="text-[#0052CC]" />
                  Geplante Automationen
                </h2>
                <div className="space-y-3">
                  {upcomingAutomations.map((ua) => (
                    <div key={ua.id} className="rounded-lg bg-[#F8F9FA] p-3">
                      <div className="flex items-start gap-2">
                        <Calendar size={13} className="text-[var(--neutral-100)] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-[var(--neutral-800)]">{ua.title}</div>
                          <div className="text-[11px] text-[var(--neutral-100)] mt-0.5">{ua.description}</div>
                          <div className="text-[11px] text-[var(--primary)] mt-1 font-medium">Fällig: {ua.dueDate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Timeline */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-5 flex items-center gap-2">
                <Clock size={15} className="text-[var(--neutral-100)]" />
                Timeline des Arbeitsverhältnisses
              </h2>
              <div className="relative">
                <div className="absolute left-[17px] top-0 bottom-0 w-px bg-[var(--neutral-30)]" />
                <div className="space-y-5">
                  {visibleTimeline.map((event) => {
                    const tc = timelineTypeConfig[event.type] || timelineTypeConfig.sonstiges;
                    return (
                      <div key={event.id} className="relative flex gap-4">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white z-10" style={{ backgroundColor: tc.bg, color: tc.color }}>
                          {tc.icon}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-[var(--neutral-800)]">{event.title}</span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: tc.bg, color: tc.color }}>{tc.label}</span>
                              {event.automated && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#DEEBFF] text-[#0052CC]">
                                  <Zap size={9} />Automatisiert
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[var(--neutral-100)] whitespace-nowrap flex-shrink-0">{event.date}</span>
                          </div>
                          <p className="text-xs text-[var(--neutral-200)] leading-relaxed">{event.description}</p>
                          {'linkedTicket' in event && event.linkedTicket && (
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium">
                              <ExternalLink size={10} />{event.linkedTicket as string}
                            </div>
                          )}
                          {'linkedProcess' in event && event.linkedProcess && (
                            <Link href={`/processes/${event.linkedProcess as string}`} className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium hover:underline">
                              <MessageSquare size={10} />Zum Feedbackprozess
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {pa.timeline.length > 5 && (
                  <button onClick={() => setShowAllTimeline(!showAllTimeline)} className="mt-4 flex items-center gap-1.5 text-xs text-[var(--primary)] font-medium hover:underline ml-10">
                    {showAllTimeline ? <><ChevronUp size={14} />Weniger anzeigen</> : <><ChevronDown size={14} />Alle {pa.timeline.length} Einträge anzeigen</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Feedback, Entwicklung & Skills ────────────────────────────── */}
      {activeTab === 'entwicklung' && (
        <div className="space-y-5">
          {/* Feedback-Prozesse */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
            <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 flex items-center gap-2">
              <MessageSquare size={15} className="text-[var(--neutral-100)]" />
              Feedback-Prozesse
            </h2>
            {empProcesses.length === 0 ? (
              <p className="text-sm text-[var(--neutral-100)]">Noch keine Feedback-Prozesse vorhanden.</p>
            ) : (
              <div className="space-y-3">
                {empProcesses.map((proc) => {
                  const progress = Math.round((proc.completedCount / proc.totalCount) * 100);
                  const relFeedback = empFeedback.filter((f) => f.processId === proc.id);
                  const avgScore = relFeedback.length
                    ? relFeedback.reduce((s, f) => s + (f.collaborationScore ?? 0), 0) / relFeedback.length
                    : null;
                  return (
                    <div key={proc.id} className="rounded-lg border border-[var(--neutral-30)] p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-sm font-medium text-[var(--neutral-800)]">{proc.title}</div>
                          <div className="text-xs text-[var(--neutral-100)] mt-0.5">{proc.startDate} – {proc.endDate}</div>
                        </div>
                        {avgScore !== null && (
                          <div className="flex-shrink-0 text-center">
                            <div className="text-xl font-bold text-[var(--primary)]">{avgScore.toFixed(1)}</div>
                            <div className="text-[10px] text-[var(--neutral-100)]">Ø Score</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-[var(--neutral-100)] whitespace-nowrap">{proc.completedCount}/{proc.totalCount} eingegangen</span>
                      </div>
                      {proc.aiSummary && (
                        <div className="rounded-lg bg-[#F0FBF5] border border-[#B3EFD3] p-3 text-xs text-[var(--neutral-800)] leading-relaxed">
                          <span className="font-medium text-[#00875A]">AI-Zusammenfassung: </span>
                          {proc.aiSummary}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Kompetenzen */}
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                <BarChart2 size={15} className="text-[var(--neutral-100)]" />
                Kompetenzprofil
              </h2>
              {devData ? (
                <div className="space-y-3">
                  {devData.competencies.map((comp) => (
                    <div key={comp.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--neutral-800)]">{comp.name}</span>
                        <span className="text-xs font-semibold text-[var(--primary)]">{comp.current}/{comp.max}</span>
                      </div>
                      <div className="relative h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--neutral-30)] rounded-full" style={{ width: `${(comp.previous / comp.max) * 100}%` }} />
                        <div className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full" style={{ width: `${(comp.current / comp.max) * 100}%` }} />
                      </div>
                      <div className="text-[10px] text-[var(--neutral-100)] mt-0.5">
                        Selbstbild: {comp.selfAssessment} · Vorjahr: {comp.previous}
                      </div>
                    </div>
                  ))}
                  {devData.aiComparisonInsight && (
                    <div className="mt-3 rounded-lg bg-[#F0FBF5] border border-[#B3EFD3] p-3 text-xs text-[var(--neutral-800)] leading-relaxed">
                      <span className="font-medium text-[#00875A]">AI-Einschätzung: </span>
                      {devData.aiComparisonInsight}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--neutral-100)]">Noch keine Kompetenzdaten vorhanden.</p>
              )}
            </div>

            {/* Skills + Entwicklungsempfehlungen */}
            <div className="space-y-4">
              {/* Skills */}
              <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                  <BookOpen size={15} className="text-[var(--neutral-100)]" />
                  Skills
                </h2>
                {empSkills.length === 0 ? (
                  <p className="text-sm text-[var(--neutral-100)]">Noch keine Skills hinterlegt.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {empSkills.map((s) => (
                      <div key={s.skillId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F4F5F7] group relative">
                        <span className="text-xs font-medium text-[var(--neutral-800)]">{s.skill?.name}</span>
                        <span className="flex">
                          {[1,2,3,4,5].map((dot) => (
                            <span key={dot} className={`w-1.5 h-1.5 rounded-full mx-0.5 ${dot <= s.level ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-30)]'}`} />
                          ))}
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[var(--neutral-800)] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {skillLevelLabel[s.level]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Entwicklungsempfehlungen */}
              {devData && devData.recommendations && (
                <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                  <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 flex items-center gap-2">
                    <Lightbulb size={15} className="text-[var(--neutral-100)]" />
                    Entwicklungsempfehlungen
                  </h2>
                  <div className="space-y-2.5">
                    {devData.recommendations.map((rec) => {
                      const priorityColor = rec.priority === 'high' ? '#DE350B' : rec.priority === 'medium' ? '#FF8B00' : '#6B778C';
                      const priorityBg   = rec.priority === 'high' ? '#FFEBE6' : rec.priority === 'medium' ? '#FFF7E6' : '#F4F5F7';
                      return (
                        <div key={rec.id} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F9FA]">
                          <Target size={14} className="flex-shrink-0 mt-0.5" style={{ color: priorityColor }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-medium text-[var(--neutral-800)]">{rec.title}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: priorityBg, color: priorityColor }}>
                                {rec.priority === 'high' ? 'Hoch' : rec.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--neutral-200)] leading-relaxed">{rec.description}</p>
                          </div>
                          {rec.interested && (
                            <Award size={13} className="flex-shrink-0 text-[#FF8B00] mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stärken & Entwicklungsfelder */}
          {devData && (
            <div className="grid grid-cols-2 gap-5">
              {'strengths' in devData && Array.isArray(devData.strengths) && devData.strengths.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                  <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#00875A]" />
                    Stärken
                  </h2>
                  <ul className="space-y-2">
                    {(devData.strengths as string[]).map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[var(--neutral-800)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {'developmentAreas' in devData && Array.isArray(devData.developmentAreas) && devData.developmentAreas.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                  <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-2">
                    <TrendingUp size={15} className="text-[#FF8B00]" />
                    Entwicklungsfelder
                  </h2>
                  <ul className="space-y-2">
                    {(devData.developmentAreas as string[]).map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[var(--neutral-800)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8B00] flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: Disziplinarische Ereignisse ───────────────────────────────── */}
      {activeTab === 'disziplinarisch' && (
        <div className="space-y-4">
          {diszEreignisse.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-12 text-center">
              <Shield size={32} className="mx-auto text-[var(--neutral-30)] mb-3" />
              <p className="text-sm text-[var(--neutral-100)]">Keine disziplinarischen Einträge vorhanden.</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                {(['leistungsgespraech', 'verwarnung', 'abmahnung'] as const).map((typ) => {
                  const count = diszEreignisse.filter((d) => d.typ === typ).length;
                  const cfg = diszTypConfig[typ];
                  return (
                    <div key={typ} className="bg-white rounded-xl border border-[var(--neutral-30)] p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[var(--neutral-800)]">{count}</div>
                        <div className="text-[11px] text-[var(--neutral-100)]">{cfg.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Entries */}
              <div className="space-y-4">
                {diszEreignisse.map((d) => {
                  const cfg = diszTypConfig[d.typ] || diszTypConfig.sonstiges;
                  const hrPerson = employees.find((e) => e.id === d.hrVerantwortlich);
                  return (
                    <div key={d.id} className="bg-white rounded-xl border border-[var(--neutral-30)] overflow-hidden">
                      {/* Color bar */}
                      <div className="h-1" style={{ backgroundColor: cfg.dot }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                              <Shield size={11} />
                              {cfg.label}
                            </span>
                            <h3 className="text-sm font-semibold text-[var(--neutral-800)] mt-0.5">{d.titel}</h3>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {d.erledigt ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#E3FCEF] text-[#00875A]">
                                <CheckCircle2 size={11} />Abgeschlossen
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#FFF7E6] text-[#FF8B00]">
                                <Clock size={11} />Offen
                              </span>
                            )}
                            <span className="text-xs text-[var(--neutral-100)]">{d.date}</span>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--neutral-800)] leading-relaxed mb-3">{d.beschreibung}</p>

                        {d.vereinbarungen && (
                          <div className="rounded-lg bg-[#F4F5F7] p-3 mb-3">
                            <div className="text-[11px] font-semibold text-[var(--neutral-100)] uppercase tracking-wide mb-1">Vereinbarungen / Auflagen</div>
                            <p className="text-xs text-[var(--neutral-800)] leading-relaxed">{d.vereinbarungen}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-[var(--neutral-100)]">
                          {hrPerson && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-[#E0F0F1] text-[#02464B] flex items-center justify-center text-[9px] font-bold">
                                {hrPerson.avatar}
                              </div>
                              <span>HR: {hrPerson.name}</span>
                            </div>
                          )}
                          {d.linkedTicket && (
                            <div className="inline-flex items-center gap-1 text-[var(--primary)] font-medium">
                              <ExternalLink size={10} />{d.linkedTicket}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
