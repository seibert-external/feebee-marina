'use client';

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  BarChart3,
  Layers,
} from 'lucide-react';

const sentimentData = [
  { month: 'Apr', score: 3.6 },
  { month: 'Mai', score: 3.7 },
  { month: 'Jun', score: 3.9 },
  { month: 'Jul', score: 3.8 },
  { month: 'Aug', score: 4.0 },
  { month: 'Sep', score: 4.1 },
  { month: 'Okt', score: 4.1 },
];

const completionData = [
  { department: 'Engineering', rate: 78 },
  { department: 'Design', rate: 92 },
  { department: 'Product', rate: 85 },
  { department: 'Marketing', rate: 70 },
  { department: 'HR', rate: 100 },
];

const feedbackTrends = [
  { month: 'Mai', gegeben: 12, erhalten: 10 },
  { month: 'Jun', gegeben: 18, erhalten: 15 },
  { month: 'Jul', gegeben: 22, erhalten: 20 },
  { month: 'Aug', gegeben: 15, erhalten: 18 },
  { month: 'Sep', gegeben: 25, erhalten: 22 },
  { month: 'Okt', gegeben: 20, erhalten: 24 },
];

const topStrengths = [
  { skill: 'Teamwork', count: 45 },
  { skill: 'Kommunikation', count: 38 },
  { skill: 'Fachkompetenz', count: 35 },
  { skill: 'Innovation', count: 28 },
  { skill: 'Zuverlässigkeit', count: 25 },
];

const processDistribution = [
  { name: 'Peer Feedback', value: 40 },
  { name: 'Onboarding', value: 25 },
  { name: 'High Potential', value: 20 },
  { name: 'Performance', value: 15 },
];

const COLORS = ['#02464B', '#0A7075', '#00875A', '#FF5630'];
// Skills Distribution Data
const skillsByTeam = [
  { skill: 'Kommunikation', Engineering: 3.8, Design: 4.5, Product: 4.2, Marketing: 4.6, HR: 4.4 },
  { skill: 'Fachkompetenz', Engineering: 4.7, Design: 4.3, Product: 4.0, Marketing: 3.8, HR: 4.1 },
  { skill: 'Leadership', Engineering: 3.5, Design: 3.2, Product: 4.1, Marketing: 3.6, HR: 4.3 },
  { skill: 'Innovation', Engineering: 4.2, Design: 4.6, Product: 4.3, Marketing: 3.4, HR: 3.0 },
  { skill: 'Teamwork', Engineering: 4.0, Design: 4.4, Product: 4.5, Marketing: 4.1, HR: 4.6 },
  { skill: 'Problemlösung', Engineering: 4.5, Design: 3.9, Product: 4.2, Marketing: 3.3, HR: 3.5 },
];

const skillsByRole = [
  { role: 'Developer', Kommunikation: 3.6, Fachkompetenz: 4.8, Leadership: 3.2, Innovation: 4.3, Teamwork: 4.1, Problemlösung: 4.6 },
  { role: 'Designer', Kommunikation: 4.5, Fachkompetenz: 4.3, Leadership: 3.4, Innovation: 4.7, Teamwork: 4.4, Problemlösung: 3.9 },
  { role: 'Manager', Kommunikation: 4.4, Fachkompetenz: 3.9, Leadership: 4.5, Innovation: 3.6, Teamwork: 4.3, Problemlösung: 4.1 },
  { role: 'HR', Kommunikation: 4.6, Fachkompetenz: 4.1, Leadership: 4.3, Innovation: 3.0, Teamwork: 4.6, Problemlösung: 3.5 },
];

const companySkillRadar = [
  { skill: 'Kommunikation', score: 4.1, target: 4.5 },
  { skill: 'Fachkompetenz', score: 4.2, target: 4.3 },
  { skill: 'Leadership', score: 3.7, target: 4.0 },
  { skill: 'Innovation', score: 3.9, target: 4.2 },
  { skill: 'Teamwork', score: 4.3, target: 4.4 },
  { skill: 'Problemlösung', score: 4.0, target: 4.3 },
  { skill: 'Eigenständigkeit', score: 3.8, target: 4.0 },
  { skill: 'Zeitmanagement', score: 3.6, target: 4.0 },
];

const skillGaps = [
  { skill: 'Leadership', gap: -0.3, team: 'Engineering', detail: 'Entwickler zeigen Potenzial, aber wenig Führungsmöglichkeiten' },
  { skill: 'Innovation', gap: -0.3, team: 'Marketing', detail: 'Kreatives Potenzial nicht voll ausgeschöpft' },
  { skill: 'Zeitmanagement', gap: -0.4, team: 'Unternehmensweit', detail: 'Regelmäßiges Thema in Feedback-Zyklen' },
  { skill: 'Kommunikation', gap: -0.4, team: 'Engineering', detail: 'Cross-Team-Kommunikation verbessern' },
];

const aiInsights = [
  {
    type: 'positive',
    icon: <ThumbsUp size={16} />,
    text: 'Team-Zufriedenheit ist 3 Monate in Folge gestiegen. Besonders positiv: Zusammenarbeit zwischen Engineering und Design.',
  },
  {
    type: 'warning',
    icon: <AlertTriangle size={16} />,
    text: 'Work-Life-Balance Bewertungen im Engineering leicht rückläufig. Empfehlung: Team-Retrospektive durchführen.',
  },
  {
    type: 'positive',
    icon: <TrendingUp size={16} />,
    text: 'Feedback-Kultur verbessert sich: 30% mehr Feedback gegeben als im Vorquartal.',
  },
  {
    type: 'info',
    icon: <Users size={16} />,
    text: 'Anna Müller zeigt konstant überdurchschnittliche Bewertungen in Leadership - Empfehlung für Beförderung prüfen.',
  },
  {
    type: 'warning',
    icon: <AlertTriangle size={16} />,
    text: 'Marketing-Team hat die niedrigste Completion Rate (70%). Mehr Follow-ups empfohlen.',
  },
];

type SkillViewType = 'company' | 'team' | 'role';

export default function AnalyticsPage() {
  const [skillView, setSkillView] = useState<SkillViewType>('company');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Analytics Dashboard</h1>
        <p className="text-[var(--neutral-200)] mt-1">Übersicht über Feedback-Trends, Stimmung und Team-Entwicklung.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp size={20} />} label="Team-Sentiment" value="4.1" subtext="+0.3 vs. Q2" positive color="var(--success)" bg="#E3FCEF" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completion Rate" value="82%" subtext="Ø aller Prozesse" color="var(--primary)" bg="var(--primary-light)" />
        <StatCard icon={<Users size={20} />} label="Aktive Teilnehmer" value="24" subtext="Dieses Quartal" color="var(--secondary)" bg="var(--secondary-light)" />
        <StatCard icon={<BarChart3 size={20} />} label="Feedback gegeben" value="112" subtext="+30% vs. Vorquartal" positive color="var(--success)" bg="#E3FCEF" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main charts */}
        <div className="col-span-2 space-y-6">
          {/* Sentiment Trend */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Team-Sentiment Trend</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentData}>
                  <defs>
                    <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#02464B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#02464B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B778C' }} />
                  <YAxis domain={[3, 5]} tick={{ fontSize: 12, fill: '#6B778C' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #EBECF0', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#02464B" fill="url(#sentimentGrad)" strokeWidth={2} name="Sentiment Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Distribution Section */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[var(--primary)]" />
                <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Skills-Verteilung</h2>
              </div>
              <div className="flex gap-1 bg-[var(--neutral-10)] rounded-lg p-1">
                {[
                  { key: 'company' as SkillViewType, label: 'Unternehmen' },
                  { key: 'team' as SkillViewType, label: 'Team' },
                  { key: 'role' as SkillViewType, label: 'Rolle' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSkillView(tab.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      skillView === tab.key
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--neutral-200)] hover:text-[var(--neutral-800)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Company-wide Radar */}
            {skillView === 'company' && (
              <div>
                <p className="text-xs text-[var(--neutral-100)] mb-4">Unternehmensweite Kompetenz-Durchschnitte vs. Zielwerte</p>
                <div className="h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={companySkillRadar} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#EBECF0" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#6B778C' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: '#7A869A' }} tickCount={6} />
                      <Radar name="Zielwert" dataKey="target" stroke="#B3BAC5" fill="#DFE1E6" fillOpacity={0.3} strokeWidth={2} strokeDasharray="6 3" />
                      <Radar name="Aktuell" dataKey="score" stroke="#02464B" fill="#02464B" fillOpacity={0.15} strokeWidth={2.5} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Team View - Grouped Bar */}
            {skillView === 'team' && (
              <div>
                <p className="text-xs text-[var(--neutral-100)] mb-4">Kompetenz-Vergleich nach Abteilung</p>
                <div className="h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillsByTeam} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                      <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#6B778C' }} />
                      <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: '#6B778C' }} width={100} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBECF0', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="Engineering" fill="#02464B" radius={[0, 2, 2, 0]} barSize={6} />
                      <Bar dataKey="Design" fill="#0A7075" radius={[0, 2, 2, 0]} barSize={6} />
                      <Bar dataKey="Product" fill="#14919B" radius={[0, 2, 2, 0]} barSize={6} />
                      <Bar dataKey="Marketing" fill="#00875A" radius={[0, 2, 2, 0]} barSize={6} />
                      <Bar dataKey="HR" fill="#FF8B00" radius={[0, 2, 2, 0]} barSize={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Role View - Table */}
            {skillView === 'role' && (
              <div>
                <p className="text-xs text-[var(--neutral-100)] mb-4">Kompetenz-Matrix nach Rolle</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--neutral-30)]">
                        <th className="text-left py-2 px-3 text-[var(--neutral-200)] font-medium">Rolle</th>
                        {['Kommunikation', 'Fachkompetenz', 'Leadership', 'Innovation', 'Teamwork', 'Problemlösung'].map((s) => (
                          <th key={s} className="text-center py-2 px-2 text-[var(--neutral-200)] font-medium">{s}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {skillsByRole.map((row) => (
                        <tr key={row.role} className="border-b border-[var(--neutral-20)] last:border-0">
                          <td className="py-3 px-3 font-medium text-[var(--neutral-800)]">{row.role}</td>
                          {['Kommunikation', 'Fachkompetenz', 'Leadership', 'Innovation', 'Teamwork', 'Problemlösung'].map((skill) => {
                            const val = row[skill as keyof typeof row] as number;
                            const color = val >= 4.5 ? '#00875A' : val >= 4.0 ? '#02464B' : val >= 3.5 ? '#FF8B00' : '#FF5630';
                            return (
                              <td key={skill} className="text-center py-3 px-2">
                                <span
                                  className="inline-block px-2 py-1 rounded-md text-xs font-medium"
                                  style={{ backgroundColor: `${color}15`, color }}
                                >
                                  {val.toFixed(1)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Volume */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Feedback-Volumen</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedbackTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B778C' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B778C' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBECF0', fontSize: '12px' }} />
                  <Legend />
                  <Bar dataKey="gegeben" fill="#02464B" radius={[4, 4, 0, 0]} name="Gegeben" />
                  <Bar dataKey="erhalten" fill="#0A7075" radius={[4, 4, 0, 0]} name="Erhalten" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Completion by Department */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Completion Rate nach Abteilung</h2>
            <div className="space-y-3">
              {completionData.sort((a, b) => b.rate - a.rate).map((dept) => (
                <div key={dept.department} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-[var(--neutral-200)]">{dept.department}</div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${dept.rate}%`,
                          backgroundColor: dept.rate >= 90 ? 'var(--success)' : dept.rate >= 75 ? 'var(--primary)' : 'var(--warning)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-[var(--neutral-800)]">{dept.rate}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[#02464B] to-[#0A7075] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} />
              <h3 className="font-semibold text-sm">AI-erkannte Trends</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3 flex items-start gap-2">
                  <div className={`mt-0.5 flex-shrink-0 ${
                    insight.type === 'positive' ? 'text-green-300' :
                    insight.type === 'warning' ? 'text-yellow-300' :
                    'text-blue-300'
                  }`}>
                    {insight.icon}
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-[var(--warning)]" />
              <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Skill-Gaps</h3>
            </div>
            <p className="text-xs text-[var(--neutral-100)] mb-3">Bereiche mit dem größten Abstand zum Zielwert</p>
            <div className="space-y-3">
              {skillGaps.map((gap, i) => (
                <div key={i} className="p-3 rounded-lg border border-[var(--neutral-30)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--neutral-800)]">{gap.skill}</span>
                    <span className="text-xs font-medium text-[var(--danger)]">{gap.gap.toFixed(1)}</span>
                  </div>
                  <div className="text-[10px] text-[var(--neutral-100)] mb-1.5">{gap.team}</div>
                  <p className="text-xs text-[var(--neutral-200)]">{gap.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Distribution */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-4">Prozesstyp-Verteilung</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {processDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBECF0', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {processDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[var(--neutral-200)]">{item.name}</span>
                  <span className="ml-auto font-medium text-[var(--neutral-800)]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Strengths */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Top Stärken (Team)</h3>
            <div className="space-y-2">
              {topStrengths.map((s, i) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--neutral-100)] w-4">{i + 1}.</span>
                  <span className="text-sm text-[var(--neutral-200)] flex-1">{s.skill}</span>
                  <div className="w-16 h-1.5 bg-[var(--neutral-20)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${(s.count / 50) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[var(--neutral-100)] w-8 text-right">{s.count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, positive, color, bg }: {
  icon: React.ReactNode; label: string; value: string; subtext: string;
  positive?: boolean; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg, color }}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--neutral-800)]">{value}</div>
          <div className="text-xs text-[var(--neutral-100)]">{label}</div>
          {subtext && (
            <div className={`text-xs mt-0.5 ${positive ? 'text-[var(--success)]' : 'text-[var(--neutral-100)]'}`}>
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
