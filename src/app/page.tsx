'use client';

import React, { useState, useMemo } from 'react';
import { useRole } from '@/components/common/RoleContext';
import Link from 'next/link';
import {
  GitPullRequestDraft,
  Users,
  CheckCircle2,
  Clock,
  MessageSquareText,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Star,
  Sparkles,
  User,
  Mail,
  AlertTriangle,
  Ticket,
  ShieldCheck,
  BookOpen,
  ThumbsUp,
  FileText,
  RefreshCw,
  Award,
  Eye,
  Check,
  UserPlus,
  Layers,
} from 'lucide-react';
import employees from '@/data/employees.json';
import processes from '@/data/processes.json';
import feedback from '@/data/feedback.json';
import aiWarnings from '@/data/ai-warnings.json';
import highPotentials from '@/data/high-potentials.json';
import skillsData from '@/data/skills.json';
import peerFeedback from '@/data/peer-feedback.json';

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor, color }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--neutral-800)]">{value}</div>
          <div className="text-xs text-[var(--neutral-100)]">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ProcessTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    onboarding: { label: 'Onboarding', color: '#02464B', bg: '#E0F0F1' },
    'high-potential': { label: 'High Potential', color: '#0A7075', bg: '#E6F3F3' },
    'peer-feedback': { label: 'Peer Feedback', color: '#00875A', bg: '#E3FCEF' },
    'performance-improvement': { label: 'Performance', color: '#FF5630', bg: '#FFEBE6' },
    custom: { label: 'Custom', color: '#6B778C', bg: '#F4F5F7' },
  };
  const c = config[type] || config.custom;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    critical: { label: 'Kritisch', color: '#CC1100', bg: '#FFEBE6' },
    warning: { label: 'Warnung', color: '#FF8B00', bg: '#FFF7E6' },
    info: { label: 'Info', color: '#0A7075', bg: '#E6F3F3' },
  };
  const c = map[severity] || map.info;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Skill-Gaps Teaser (used on HR Dashboard)
// ---------------------------------------------------------------------------

function SkillGapsTeaser() {
  const topSkillGaps = useMemo(() => {
    const distribution = skillsData.skills.map((skill) => {
      const entries: number[] = [];
      skillsData.employeeSkills.forEach((es) => {
        const found = es.skills.find((s) => s.skillId === skill.id);
        if (found) entries.push(found.level);
      });
      const personCount = entries.length;
      const avgLevel =
        entries.length > 0
          ? entries.reduce((a, b) => a + b, 0) / entries.length
          : 0;
      return {
        id: skill.id,
        name: skill.name,
        personCount,
        avgLevel: Math.round(avgLevel * 10) / 10,
      };
    });
    return distribution
      .sort((a, b) => a.personCount - b.personCount)
      .slice(0, 4);
  }, []);

  const getBadge = (avgLevel: number, personCount: number) => {
    if (avgLevel < 3.0 || personCount <= 1)
      return { label: 'Kritisch', color: '#CC1100', bg: '#FFEBE6' };
    return { label: 'Ausbaufaehig', color: '#FF8B00', bg: '#FFF7E6' };
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FFEBE6] text-[#FF5630] flex items-center justify-center">
          <Layers size={16} />
        </div>
        <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
          Top Skill-Gaps
        </h2>
        <Link
          href="/skills"
          className="ml-auto text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
        >
          Skilluebersicht <ArrowRight size={14} />
        </Link>
      </div>
      <div className="space-y-3">
        {topSkillGaps.map((gap) => {
          const badge = getBadge(gap.avgLevel, gap.personCount);
          return (
            <div
              key={gap.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--neutral-800)]">
                  {gap.name}
                </div>
                <div className="text-xs text-[var(--neutral-100)]">
                  {gap.personCount} {gap.personCount === 1 ? 'Person' : 'Personen'} — Ø Level {gap.avgLevel}
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0"
                style={{ backgroundColor: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HR Dashboard
// ---------------------------------------------------------------------------

function HRDashboard() {
  const activeProcesses = processes.filter((p) => p.status === 'active');
  const pendingFeedback = feedback.filter((f) => f.status === 'pending');

  // Feedback approval queue: completed feedback that HR hasn't "approved" yet
  // We simulate this by treating completed feedback as needing HR approval
  const feedbackForApproval = feedback.filter((f) => f.status === 'completed');

  // Action-sent toast state
  const [sentActions, setSentActions] = useState<Record<string, string>>({});

  const handleAction = (warningId: string, actionLabel: string) => {
    setSentActions((prev) => ({ ...prev, [warningId]: actionLabel }));
    setTimeout(() => {
      setSentActions((prev) => {
        const next = { ...prev };
        delete next[warningId];
        return next;
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
          Willkommen zurueck, Marina
        </h1>
        <p className="text-[var(--neutral-200)] mt-1">
          Hier ist deine HR-Uebersicht fuer heute.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<GitPullRequestDraft size={20} />}
          label="Aktive Prozesse"
          value={activeProcesses.length.toString()}
          color="var(--primary)"
          bgColor="var(--primary-light)"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Offenes Feedback"
          value={pendingFeedback.length.toString()}
          color="var(--warning)"
          bgColor="#FFF7E6"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Abgeschlossen"
          value={processes
            .filter((p) => p.status === 'completed')
            .length.toString()}
          color="var(--success)"
          bgColor="#E3FCEF"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Mitarbeiter"
          value={employees.length.toString()}
          color="var(--secondary)"
          bgColor="var(--secondary-light)"
        />
      </div>

      {/* Row 1: AI Warnings + High Potentials */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Warnings Panel */}
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FFEBE6] text-[#FF5630] flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
              FeeBee Alerts
            </h2>
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFEBE6] text-[#FF5630]">
              {aiWarnings.filter((w) => !w.resolved).length} offen
            </span>
          </div>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {aiWarnings
              .filter((w) => !w.resolved)
              .map((warning) => {
                const employee = employees.find(
                  (e) => e.id === warning.employeeId
                );
                const isSent = sentActions[warning.id];
                return (
                  <div
                    key={warning.id}
                    className="p-4 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {employee?.avatar || '??'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[var(--neutral-800)]">
                            {employee?.name}
                          </span>
                          <SeverityBadge severity={warning.severity} />
                        </div>
                        <p className="text-xs text-[var(--neutral-200)] leading-relaxed mb-2">
                          {warning.message}
                        </p>
                        <p className="text-xs text-[var(--neutral-100)] italic mb-3">
                          Empfehlung: {warning.suggestedAction}
                        </p>
                        <div className="flex items-center gap-2">
                          {isSent ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E3FCEF] text-[#00875A] text-xs font-medium">
                              <Check size={12} />
                              {isSent}
                            </span>
                          ) : (
                            <>
                              {(warning.actionType === 'email' ||
                                warning.actionType === 'meeting') && (
                                <button
                                  onClick={() =>
                                    handleAction(warning.id, 'E-Mail gesendet')
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#02464B] to-[#0A7075] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                                >
                                  <Mail size={12} />
                                  E-Mail senden
                                </button>
                              )}
                              {(warning.actionType === 'jira' ||
                                warning.actionType === 'meeting') && (
                                <button
                                  onClick={() =>
                                    handleAction(
                                      warning.id,
                                      'Jira-Ticket erstellt'
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--neutral-30)] text-[var(--neutral-800)] text-xs font-medium hover:bg-[#013438] hover:text-white hover:border-[#013438] transition-colors"
                                >
                                  <Ticket size={12} />
                                  Jira-Ticket
                                </button>
                              )}
                            </>
                          )}
                          <span className="ml-auto text-[10px] text-[var(--neutral-100)]">
                            {warning.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* High Potentials Panel */}
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center">
              <Award size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
              Talent-Radar
            </h2>
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-[#E6F3F3] text-[#0A7075]">
              Erkannte Entwicklungspotenziale
            </span>
          </div>
          <div className="space-y-4">
            {highPotentials.map((hp) => {
              const employee = employees.find(
                (e) => e.id === hp.employeeId
              );
              return (
                <div
                  key={hp.employeeId}
                  className="p-4 rounded-lg border border-[var(--neutral-30)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-sm font-medium">
                      {employee?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[var(--neutral-800)]">
                        {employee?.name}
                      </div>
                      <div className="text-xs text-[var(--neutral-100)]">
                        {employee?.role} -- {employee?.department}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-lg font-bold text-[var(--neutral-800)]">
                        {hp.score}
                      </span>
                      <span className="text-xs text-[var(--neutral-100)]">
                        /5
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {hp.indicators.map((indicator, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-[var(--neutral-200)]"
                      >
                        <ShieldCheck
                          size={12}
                          className="mt-0.5 flex-shrink-0 text-[#0A7075]"
                        />
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#E6F3F3] text-xs text-[#02464B]">
                    <span className="font-medium">Empfehlung: </span>
                    {hp.recommendation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Active Processes + Sidebar (Quick Actions, AI Insights) */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
              Aktive Feedback-Prozesse
            </h2>
            <Link
              href="/processes"
              className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {activeProcesses.map((process) => {
              const target = employees.find(
                (e) => e.id === process.targetEmployee
              );
              const progress = Math.round(
                (process.completedCount / process.totalCount) * 100
              );
              return (
                <Link
                  key={process.id}
                  href={`/processes/${process.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-sm font-medium">
                    {target?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[var(--neutral-800)]">
                      {process.title}
                    </div>
                    <div className="text-xs text-[var(--neutral-100)] mt-0.5">
                      {process.completedCount}/{process.totalCount} Feedback
                      erhalten
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-[var(--neutral-200)] mb-1">
                      <span>Fortschritt</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <ProcessTypeBadge type={process.type} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">
              Schnellaktionen
            </h3>
            <div className="space-y-2">
              <Link
                href="/processes/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                  <GitPullRequestDraft size={16} />
                </div>
                Neuen Prozess starten
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--secondary-light)] text-[var(--secondary)] flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                AI-Assistenten fragen
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E3FCEF] text-[var(--success)] flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                Analytics ansehen
              </Link>
              <Link
                href="/templates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E0F0F1] text-[#02464B] flex items-center justify-center">
                  <FileText size={16} />
                </div>
                Vorlagen verwalten
              </Link>
              <Link
                href="/cyclic"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center">
                  <RefreshCw size={16} />
                </div>
                Zyklisches Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Feedback Approval Queue + Development Interests */}
      <div className="grid grid-cols-2 gap-6">
        {/* Feedback Approval Queue */}
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FFF7E6] text-[var(--warning)] flex items-center justify-center">
              <Eye size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
              Feedback-Freigaben
            </h2>
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF7E6] text-[var(--warning)]">
              {feedbackForApproval.length} ausstehend
            </span>
          </div>
          <p className="text-xs text-[var(--neutral-100)] mb-4">
            Feedback muss von HR freigegeben werden, bevor es fuer den
            Mitarbeiter sichtbar ist.
          </p>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {feedbackForApproval.map((fb) => {
              const fromEmp = employees.find(
                (e) => e.id === fb.fromEmployee
              );
              const toEmp = employees.find((e) => e.id === fb.toEmployee);
              const proc = processes.find((p) => p.id === fb.processId);
              return (
                <Link
                  key={fb.id}
                  href={`/processes/${fb.processId}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] hover:shadow-sm transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {fromEmp?.avatar || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--neutral-800)] truncate">
                      {fromEmp?.name}{' '}
                      <span className="font-normal text-[var(--neutral-100)]">
                        an
                      </span>{' '}
                      {toEmp?.name}
                    </div>
                    <div className="text-xs text-[var(--neutral-100)] truncate">
                      {proc?.title} -- {fb.date}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[var(--neutral-100)] flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Skill-Gaps Teaser */}
        <SkillGapsTeaser />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Employee Dashboard
// ---------------------------------------------------------------------------

function EmployeeDashboard() {
  const myFeedbackReceived = feedback.filter(
    (f) => f.toEmployee === 'emp-001' && f.status === 'completed'
  );

  // Proactive peer feedback received
  const proactiveFeedbackReceived = peerFeedback.filter(
    (pf) =>
      pf.toEmployee === 'emp-001' &&
      pf.type === 'proactive' &&
      pf.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
          Willkommen zurueck, Anna
        </h1>
        <p className="text-[var(--neutral-200)] mt-1">
          Hier ist dein persoenliches Feedback-Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<MessageSquareText size={20} />}
          label="Offene Anfragen"
          value="0"
          color="var(--warning)"
          bgColor="#FFF7E6"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Feedback erhalten"
          value={myFeedbackReceived.length.toString()}
          color="var(--success)"
          bgColor="#E3FCEF"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Gesamt-Score"
          value="4.6"
          color="var(--primary)"
          bgColor="var(--primary-light)"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Open Feedback Requests */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">
              Offene Feedback-Anfragen
            </h2>
            <div className="text-center py-8 text-[var(--neutral-100)]">
              <CheckCircle2
                size={40}
                className="mx-auto mb-2 text-[var(--success)]"
              />
              <p>Keine offenen Anfragen - alles erledigt!</p>
            </div>
          </div>

          {/* Proactive Peer Feedback Received */}
          {proactiveFeedbackReceived.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E3FCEF] text-[#00875A] flex items-center justify-center">
                    <ThumbsUp size={16} />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
                    Proaktives Feedback erhalten
                  </h2>
                </div>
                <Link
                  href="/peer-feedback"
                  className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  Alle ansehen <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {proactiveFeedbackReceived.map((pf) => {
                  const fromEmp = employees.find(
                    (e) => e.id === pf.fromEmployee
                  );
                  const textFeedback = pf.feedback.find(
                    (f) => 'text' in f && f.text
                  );
                  return (
                    <div
                      key={pf.id}
                      className="p-4 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white flex items-center justify-center text-xs font-medium">
                          {fromEmp?.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[var(--neutral-800)]">
                            {fromEmp?.name}
                          </div>
                          <div className="text-xs text-[var(--neutral-100)]">
                            {pf.date}
                          </div>
                        </div>
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E3FCEF] text-[#00875A]">
                          Proaktiv
                        </span>
                      </div>
                      {pf.message && (
                        <p className="text-xs text-[var(--neutral-200)] mb-2 italic">
                          &quot;{pf.message}&quot;
                        </p>
                      )}
                      {textFeedback && 'text' in textFeedback && (
                        <p className="text-sm text-[var(--neutral-800)] leading-relaxed">
                          {textFeedback.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recently Received Feedback */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
                Zuletzt erhaltenes Feedback
              </h2>
              <Link
                href="/development"
                className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                Entwicklung ansehen <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {myFeedbackReceived.slice(0, 3).map((fb) => {
                const process = processes.find(
                  (p) => p.id === fb.processId
                );
                return (
                  <div
                    key={fb.id}
                    className="p-4 rounded-lg border border-[var(--neutral-30)]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs font-medium">
                        <User size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Anonymes Feedback
                        </div>
                        <div className="text-xs text-[var(--neutral-100)]">
                          {process?.title} -- {fb.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                      {fb.answers
                        .filter((a) => a.rating)
                        .slice(0, 3)
                        .map((a, i) => (
                          <div key={i} className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={
                                  star <= (a.rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-[var(--neutral-40)]'
                                }
                              />
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Assistant Card */}
          <div className="bg-gradient-to-br from-[#0A7075] to-[#14919B] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} />
              <h3 className="font-semibold text-sm">AI-Assistent</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Frag mich nach deiner Entwicklung, Feedback-Trends oder
              Empfehlungen.
            </p>
            <Link
              href="/chat"
              className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-center transition-colors"
            >
              Chat starten
            </Link>
          </div>

          {/* Quick Actions for Employee */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">
              Schnellaktionen
            </h3>
            <div className="space-y-2">
              <Link
                href="/peer-feedback"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E3FCEF] text-[#00875A] flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                Peer Feedback
              </Link>
              <Link
                href="/development"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                Meine Entwicklung
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-20)] transition-colors text-sm text-[var(--neutral-800)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--secondary-light)] text-[var(--secondary)] flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                AI-Assistenten fragen
              </Link>
            </div>
          </div>

          {/* Top Competencies */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">
              Meine Top-Kompetenzen
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Problemloesung', score: 4.9 },
                { name: 'Technische Expertise', score: 4.8 },
                { name: 'Kommunikation', score: 4.6 },
                { name: 'Teamwork', score: 4.5 },
              ].map((comp) => (
                <div key={comp.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--neutral-200)]">
                      {comp.name}
                    </span>
                    <span className="font-medium text-[var(--neutral-800)]">
                      {comp.score}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full"
                      style={{ width: `${(comp.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/development"
              className="block text-center text-sm text-[var(--primary)] hover:underline mt-4"
            >
              Alle Kompetenzen ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { role } = useRole();
  return role === 'hr' ? <HRDashboard /> : <EmployeeDashboard />;
}
