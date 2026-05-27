'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Mail,
  Calendar,
  Star,
  Eye,
  EyeOff,
  Shield,
  Check,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Users,
  MessageSquare,
} from 'lucide-react';
import processes from '@/data/processes.json';
import employees from '@/data/employees.json';
import feedbackData from '@/data/feedback.json';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Entwurf', color: '#6B778C', bg: '#F4F5F7' },
  active: { label: 'Aktiv', color: '#02464B', bg: '#E0F0F1' },
  completed: { label: 'Abgeschlossen', color: '#00875A', bg: '#E3FCEF' },
  cancelled: { label: 'Abgebrochen', color: '#FF5630', bg: '#FFEBE6' },
};

function getAiAssessment(fb: typeof feedbackData[number], allProcessFeedback: typeof feedbackData) {
  const completedInProcess = allProcessFeedback.filter((f) => f.status === 'completed');
  if (completedInProcess.length === 0) return null;

  // Calculate average rating for this feedback
  const fbRatings = fb.answers.filter((a) => a.rating).map((a) => a.rating!);
  const fbAvg = fbRatings.length > 0 ? fbRatings.reduce((sum, r) => sum + r, 0) / fbRatings.length : 0;

  // Calculate average rating across all feedback in this process
  const allRatings = completedInProcess.flatMap((f) => f.answers.filter((a) => a.rating).map((a) => a.rating!));
  const processAvg = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length : 0;

  // Count positive vs negative
  const positiveCount = allRatings.filter((r) => r >= 4).length;
  const negativeCount = allRatings.filter((r) => r <= 2).length;

  // Sentiment comparison
  let sentimentComparison: string;
  const diff = fbAvg - processAvg;
  if (diff < -0.5) {
    sentimentComparison = 'Dieses Feedback ist negativer als der Durchschnitt im Prozess.';
  } else if (diff > 0.5) {
    sentimentComparison = 'Dieses Feedback ist positiver als der Durchschnitt im Prozess.';
  } else {
    sentimentComparison = 'Dieses Feedback liegt im Durchschnitt des Prozesses.';
  }

  const collaborationScore = (fb as Record<string, unknown>).collaborationScore as number | null;
  let collaborationText: string;
  if (collaborationScore && collaborationScore >= 4) {
    collaborationText = 'Enge Zusammenarbeit — Feedbackgeber arbeitet intensiv mit der Zielperson.';
  } else if (collaborationScore && collaborationScore >= 2) {
    collaborationText = 'Gelegentliche Zusammenarbeit — Feedbackgeber hat regelmaessigen Kontakt.';
  } else if (collaborationScore) {
    collaborationText = 'Seltene Zusammenarbeit — Feedbackgeber hat wenig direkten Kontakt.';
  } else {
    collaborationText = 'Keine Angabe zur Zusammenarbeit-Intensitaet.';
  }

  return {
    fbAvg: fbAvg.toFixed(1),
    processAvg: processAvg.toFixed(1),
    sentimentComparison,
    positiveCount,
    negativeCount,
    totalRatings: allRatings.length,
    collaborationScore,
    collaborationText,
    isNegative: diff < -0.5,
    isPositive: diff > 0.5,
  };
}

export default function ProcessDetailPage() {
  const params = useParams();
  const process = processes.find((p) => p.id === params.id);

  const completedFeedback = feedbackData.filter((f) => f.processId === process?.id && f.status === 'completed');
  const [approved, setApproved] = useState<Set<string>>(new Set());

  if (!process) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--neutral-200)]">Prozess nicht gefunden.</p>
        <Link href="/processes" className="text-[var(--primary)] hover:underline text-sm mt-2 block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const target = employees.find((e) => e.id === process.targetEmployee);
  const processFeedback = feedbackData.filter((f) => f.processId === process.id);
  const progress = Math.round((process.completedCount / process.totalCount) * 100);
  const sc = statusConfig[process.status] || statusConfig.draft;

  const handleApprove = (fbId: string) => {
    setApproved((prev) => new Set(prev).add(fbId));
  };

  const handleApproveAll = () => {
    const allIds = new Set(completedFeedback.map((f) => f.id));
    setApproved(allIds);
  };

  const pendingApprovalCount = completedFeedback.filter((f) => !approved.has(f.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/processes" className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--neutral-800)]">{process.title}</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
              {sc.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-[var(--neutral-200)]">
            <span className="flex items-center gap-1"><Calendar size={14} /> {process.startDate} — {process.endDate}</span>
            <span className="flex items-center gap-1"><User size={14} /> {target?.name}</span>
          </div>
        </div>
        {process.status === 'active' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors">
            <Mail size={14} />
            Erinnerung senden
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Fortschritt</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--neutral-200)]">Gesamtfortschritt</span>
                  <span className="font-medium text-[var(--neutral-800)]">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-[var(--neutral-800)]">{process.completedCount}</div>
                <div className="text-xs text-[var(--neutral-100)]">von {process.totalCount}</div>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-3">
              {processFeedback.map((fb) => {
                const emp = employees.find((e) => e.id === fb.fromEmployee);
                const isApproved = approved.has(fb.id);
                return (
                  <div key={fb.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--neutral-30)]">
                    <div className="w-9 h-9 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs font-medium">
                      {emp?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--neutral-800)]">{emp?.name}</div>
                      <div className="text-xs text-[var(--neutral-100)]">{emp?.role}</div>
                    </div>
                    {fb.status === 'completed' ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                          <CheckCircle2 size={14} />
                          Abgegeben · {fb.date}
                        </div>
                        {isApproved ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-[#E3FCEF] text-[#00875A]">
                            <Eye size={10} /> Sichtbar
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-[#FFF7E6] text-[#FF8B00]">
                            <EyeOff size={10} /> Gesperrt
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--warning)]">
                        <Clock size={14} />
                        Ausstehend
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Approval Section */}
          {completedFeedback.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-[var(--primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Feedback-Freigabe</h2>
                  {pendingApprovalCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FFF7E6] text-[#FF8B00]">
                      {pendingApprovalCount} ausstehend
                    </span>
                  )}
                </div>
                {pendingApprovalCount > 0 && (
                  <button
                    onClick={handleApproveAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#02464B] to-[#0A7075] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Check size={12} />
                    Alle freigeben
                  </button>
                )}
              </div>

              <div className="bg-[var(--neutral-10)] rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertTriangle size={14} className="text-[var(--warning)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--neutral-200)]">
                  Feedback ist erst nach HR-Freigabe für den Mitarbeiter sichtbar. Prüfen Sie das Feedback und geben Sie es einzeln oder gesammelt frei.
                </p>
              </div>

              <div className="space-y-4">
                {completedFeedback.map((fb) => {
                  const emp = employees.find((e) => e.id === fb.fromEmployee);
                  const isApproved = approved.has(fb.id);
                  const hasCritical = fb.answers.some((a) => a.rating && a.rating <= 2);
                  const aiAssessment = getAiAssessment(fb, processFeedback);
                  const hrReason = (fb as Record<string, unknown>).hrSharingReason as string | undefined;
                  return (
                    <div key={fb.id} className={`p-4 rounded-lg border transition-all ${isApproved ? 'border-[var(--success)] bg-[#E3FCEF]/20' : hasCritical ? 'border-[var(--danger)] bg-[#FFEBE6]/20' : 'border-[var(--neutral-30)]'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs">
                          {emp?.avatar}
                        </div>
                        <span className="text-sm font-medium text-[var(--neutral-800)]">{emp?.name}</span>
                        <span className="text-xs text-[var(--neutral-100)]">· {fb.date}</span>
                        {hasCritical && !isApproved && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FFEBE6] text-[var(--danger)]">
                            <AlertTriangle size={10} />
                            Kritisches Feedback
                          </span>
                        )}
                        <div className="ml-auto">
                          {isApproved ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E3FCEF] text-[#00875A]">
                              <Eye size={12} />
                              Freigegeben
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApprove(fb.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--primary)] text-white hover:bg-[#013438] transition-colors"
                            >
                              <Check size={12} />
                              Freigeben
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {fb.answers.filter((a) => a.rating).map((a, i) => {
                          const question = process.questions.find((q) => q.id === a.questionId);
                          return (
                            <div key={i} className="text-xs">
                              <div className="text-[var(--neutral-100)] mb-1">{question?.text || question?.category}</div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={12} className={s <= (a.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {fb.answers.filter((a) => a.text).map((a, i) => (
                        <div key={i} className="mt-2 text-sm text-[var(--neutral-200)] bg-[var(--neutral-10)] p-3 rounded-lg">
                          &ldquo;{a.text}&rdquo;
                        </div>
                      ))}

                      {/* FeeBee AI-Einschätzung */}
                      {aiAssessment && (
                        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-[#02464B]/5 to-[#0A7075]/5 border border-[#0A7075]/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-[#0A7075]" />
                            <span className="text-xs font-semibold text-[#02464B]">FeeBee AI-Einschaetzung</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-xs text-[var(--neutral-200)]">
                              {aiAssessment.isNegative ? (
                                <TrendingDown size={12} className="mt-0.5 flex-shrink-0 text-[#FF5630]" />
                              ) : aiAssessment.isPositive ? (
                                <TrendingUp size={12} className="mt-0.5 flex-shrink-0 text-[#00875A]" />
                              ) : (
                                <TrendingUp size={12} className="mt-0.5 flex-shrink-0 text-[#0A7075]" />
                              )}
                              <span>{aiAssessment.sentimentComparison} (Schnitt: {aiAssessment.fbAvg} vs. Prozess: {aiAssessment.processAvg})</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-[var(--neutral-200)]">
                              <Star size={12} className="mt-0.5 flex-shrink-0 text-[#0A7075]" />
                              <span>Verhaeltnis im Prozess: {aiAssessment.positiveCount} positive vs. {aiAssessment.negativeCount} negative Bewertungen (von {aiAssessment.totalRatings} gesamt)</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-[var(--neutral-200)]">
                              <Users size={12} className="mt-0.5 flex-shrink-0 text-[#0A7075]" />
                              <span>
                                {aiAssessment.collaborationText}
                                {aiAssessment.collaborationScore && (
                                  <span className="ml-1 font-medium">({aiAssessment.collaborationScore}/5)</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* HR-Sharing-Grund */}
                      {hrReason && hrReason.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-[#FFF7E6] border border-[#FFE4B5]">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={12} className="mt-0.5 flex-shrink-0 text-[#FF8B00]" />
                            <div>
                              <span className="text-[10px] font-semibold text-[#FF8B00] uppercase tracking-wide">Grund fuer HR-Weiterleitung</span>
                              <p className="text-xs text-[var(--neutral-200)] mt-1">&ldquo;{hrReason}&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Target Employee */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Ziel-Mitarbeiter</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                {target?.avatar}
              </div>
              <div>
                <div className="font-medium text-sm text-[var(--neutral-800)]">{target?.name}</div>
                <div className="text-xs text-[var(--neutral-100)]">{target?.role}</div>
                <div className="text-xs text-[var(--neutral-100)]">{target?.department}</div>
              </div>
            </div>
          </div>

          {/* Approval Status Summary */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Freigabe-Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--neutral-200)]">Eingegangen</span>
                <span className="text-sm font-medium text-[var(--neutral-800)]">{completedFeedback.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--neutral-200)] flex items-center gap-1"><Eye size={12} className="text-[var(--success)]" /> Freigegeben</span>
                <span className="text-sm font-medium text-[var(--success)]">{approved.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--neutral-200)] flex items-center gap-1"><EyeOff size={12} className="text-[var(--warning)]" /> Ausstehend</span>
                <span className="text-sm font-medium text-[var(--warning)]">{pendingApprovalCount}</span>
              </div>
              <div className="w-full h-2 bg-[var(--neutral-20)] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--success)] rounded-full transition-all"
                  style={{ width: completedFeedback.length > 0 ? `${(approved.size / completedFeedback.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {process.aiSummary && (
            <div className="bg-gradient-to-br from-[#0A7075] to-[#14919B] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} />
                <h3 className="font-semibold text-sm">AI-Zusammenfassung</h3>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{process.aiSummary}</p>
            </div>
          )}

          {/* Questions */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Fragebogen</h3>
            <div className="space-y-2">
              {process.questions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--neutral-100)] mt-0.5">{i + 1}.</span>
                  <span className="text-[var(--neutral-200)]">{q.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
