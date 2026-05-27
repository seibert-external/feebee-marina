'use client';

import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts';
import Link from 'next/link';
import {
  Award,
  Target,
  MessageSquare,
  GraduationCap,
  Flag,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Circle,
  Info,
  ArrowRight,
} from 'lucide-react';
import developmentData from '@/data/development.json';

const iconMap: Record<string, React.ReactNode> = {
  feedback: <MessageSquare size={16} />,
  training: <GraduationCap size={16} />,
  milestone: <Flag size={16} />,
  goal: <Target size={16} />,
};

const colorMap: Record<string, { bg: string; text: string }> = {
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

export default function DevelopmentPage() {
  const data = developmentData;

  // State for recommendation interest toggles
  const [interests, setInterests] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.recommendations.forEach((rec) => {
      initial[rec.id] = rec.interested;
    });
    return initial;
  });

  const toggleInterest = (id: string) => {
    setInterests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Radar chart data with three series
  const radarData = data.competencies.map((c) => ({
    subject: c.name,
    Fremdeinschätzung: c.current,
    Selbsteinschätzung: c.selfAssessment,
    Vorher: c.previous,
    fullMark: c.max,
  }));

  // Sorted competencies for the details table
  const sortedCompetencies = [...data.competencies].sort((a, b) => b.current - a.current);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Meine Entwicklung</h1>
          <p className="text-[var(--neutral-200)] mt-1">Dein persönlicher Entwicklungsfortschritt basierend auf Feedback.</p>
        </div>
        <Link
          href="/journey"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--neutral-30)] text-sm text-[var(--neutral-200)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors flex-shrink-0"
        >
          Meine Journey
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Radar + AI Insight + Competencies + Timeline */}
        <div className="col-span-2 space-y-6">
          {/* Radar Chart: Self vs External Assessment */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">Kompetenz-Profil</h2>
            <p className="text-xs text-[var(--neutral-100)] mb-4">Selbst- vs. Fremdeinschätzung im Vergleich</p>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#EBECF0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: '#6B778C' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tick={{ fontSize: 10, fill: '#7A869A' }}
                    tickCount={6}
                  />
                  <Radar
                    name="Vorheriger Zyklus"
                    dataKey="Vorher"
                    stroke="#B3BAC5"
                    fill="#DFE1E6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Selbsteinschätzung"
                    dataKey="Selbsteinschätzung"
                    stroke="#14919B"
                    fill="#14919B"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    strokeDasharray="6 3"
                  />
                  <Radar
                    name="Fremdeinschätzung (Aktuell)"
                    dataKey="Fremdeinschätzung"
                    stroke="#02464B"
                    fill="#02464B"
                    fillOpacity={0.15}
                    strokeWidth={2.5}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Comparison Insight */}
          <div className="bg-gradient-to-r from-[#02464B] to-[#0A7075] rounded-xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  AI-Analyse: Selbst- vs. Fremdeinschätzung
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {data.aiComparisonInsight}
                </p>
              </div>
            </div>
          </div>

          {/* Competency Details Table */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">Kompetenz-Details</h2>
            <p className="text-xs text-[var(--neutral-100)] mb-4">Vergleich von Selbsteinschätzung und Fremdeinschätzung pro Kompetenz</p>

            {/* Table header */}
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
                const isUnderestimated = diff > 0;
                const isOverestimated = diff < 0;

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
                        {/* Self-assessment bar */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[var(--neutral-100)] w-14 flex-shrink-0">Selbst</span>
                          <div className="flex-1 h-2.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(comp.selfAssessment / comp.max) * 100}%`,
                                backgroundColor: '#14919B',
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#14919B] w-8 text-right">{comp.selfAssessment}</span>
                        </div>
                        {/* External (current) bar */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[var(--neutral-100)] w-14 flex-shrink-0">Fremd</span>
                          <div className="flex-1 h-2.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(comp.current / comp.max) * 100}%`,
                                backgroundColor: '#02464B',
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#02464B] w-8 text-right">{comp.current}</span>
                        </div>
                      </div>

                      {/* Numeric values column */}
                      <div className="w-20 text-center">
                        <span className="text-sm font-semibold text-[var(--neutral-800)]">{comp.current}</span>
                        <span className="text-xs text-[var(--neutral-100)]">/{comp.max}</span>
                      </div>

                      {/* Difference indicator */}
                      <div className="w-28 text-center">
                        {isUnderestimated && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#E3FCEF] text-[#00875A]">
                            <ArrowUpRight size={11} />
                            +{diff.toFixed(1)} unterschätzt
                          </span>
                        )}
                        {isOverestimated && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#FFF7E6] text-[#FF8B00]">
                            <ArrowDownRight size={11} />
                            {diff.toFixed(1)} überschätzt
                          </span>
                        )}
                        {!isUnderestimated && !isOverestimated && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[var(--neutral-20)] text-[var(--neutral-200)]">
                            Übereinstimmung
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[var(--neutral-20)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#14919B' }} />
                <span className="text-xs text-[var(--neutral-200)]">Selbsteinschätzung</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#02464B' }} />
                <span className="text-xs text-[var(--neutral-200)]">Fremdeinschätzung (Aktuell)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5 text-[11px] text-[#00875A]"><ArrowUpRight size={10} /> unterschätzt</span>
                <span className="text-[var(--neutral-100)] text-xs mx-1">|</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] text-[#FF8B00]"><ArrowDownRight size={10} /> überschätzt</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Entwicklungs-Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--neutral-30)]" />
              <div className="space-y-4">
                {data.timeline.map((entry, i) => {
                  const cm = colorMap[entry.type] || colorMap.feedback;
                  return (
                    <div key={i} className="flex gap-4 relative">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                        style={{ backgroundColor: cm.bg, color: cm.text }}
                      >
                        {iconMap[entry.type]}
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

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-[#0A7075] to-[#14919B] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} />
              <h3 className="font-semibold text-sm">AI-Empfehlungen</h3>
            </div>
            {/* Interest info note */}
            <div className="flex items-start gap-2 bg-white/10 rounded-lg p-2.5 mb-4">
              <Info size={14} className="text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/80 leading-relaxed">
                Wähle Empfehlungen aus, an denen du Interesse hast. HR wird informiert.
              </p>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((rec) => {
                const pc = priorityConfig[rec.priority];
                const isInterested = interests[rec.id];
                return (
                  <div key={rec.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: pc.bg, color: pc.color }}>
                        {pc.label}
                      </span>
                      <span className="text-xs text-white/60">{rec.category}</span>
                    </div>
                    <div className="text-sm font-medium text-white">{rec.title}</div>
                    <p className="text-xs text-white/70 mt-1">{rec.description}</p>
                    {/* Interest toggle button */}
                    <button
                      onClick={() => toggleInterest(rec.id)}
                      className={`mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isInterested
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/5 text-white/70 border border-white/15 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {isInterested ? (
                        <CheckCircle2 size={13} className="text-[#36B37E]" />
                      ) : (
                        <Circle size={13} />
                      )}
                      {isInterested ? 'Interesse bekundet' : 'Interesse bekunden'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-[var(--success)]" />
              <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Stärken</h3>
            </div>
            <div className="space-y-2">
              {data.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-2 flex-shrink-0" />
                  <span className="text-sm text-[var(--neutral-200)]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Development Areas */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-[var(--warning)]" />
              <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Entwicklungsfelder</h3>
            </div>
            <div className="space-y-2">
              {data.developmentAreas.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-2 flex-shrink-0" />
                  <span className="text-sm text-[var(--neutral-200)]">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
