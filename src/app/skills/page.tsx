'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Sparkles, AlertTriangle, ChevronDown, Users, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import employees from '@/data/employees.json';
import skillsData from '@/data/skills.json';
import developmentInterests from '@/data/development-interests.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TeamFilter = 'all' | 'Engineering' | 'Design' | 'HR';

// ---------------------------------------------------------------------------
// Skills Overview Page
// ---------------------------------------------------------------------------

export default function SkillsPage() {
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // All unique roles for dropdown
  const allRoles = useMemo(
    () => Array.from(new Set(employees.map((e) => e.role))).sort(),
    []
  );

  // Map department labels for display
  const departmentLabel = (dept: string) =>
    dept === 'Human Resources' ? 'HR' : dept;

  // Filtered employee IDs
  const filteredEmployeeIds = useMemo(() => {
    return employees
      .filter((e) => {
        if (teamFilter !== 'all' && departmentLabel(e.department) !== teamFilter) return false;
        if (roleFilter !== 'all' && e.role !== roleFilter) return false;
        return true;
      })
      .map((e) => e.id);
  }, [teamFilter, roleFilter]);

  // Compute skill distribution data
  const skillDistribution = useMemo(() => {
    return skillsData.skills
      .map((skill) => {
        const entries: number[] = [];
        skillsData.employeeSkills.forEach((es) => {
          if (!filteredEmployeeIds.includes(es.employeeId)) return;
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
          category: skill.category,
          personCount,
          avgLevel: Math.round(avgLevel * 10) / 10,
        };
      })
      .sort((a, b) => b.personCount - a.personCount);
  }, [filteredEmployeeIds]);

  // Color for bar based on avgLevel and personCount
  const getBarColor = (avgLevel: number, personCount: number) => {
    if (avgLevel >= 3.5 && personCount >= 3) return '#00875A';
    if (avgLevel < 3.0 || personCount <= 1) return '#FF5630';
    return '#FFAB00';
  };

  // Filtered development interests
  const filteredInterests = useMemo(() => {
    return developmentInterests.filter((di) =>
      filteredEmployeeIds.includes(di.employeeId)
    );
  }, [filteredEmployeeIds]);

  // Group interests by category
  const interestsByCategory = useMemo(() => {
    const groups: Record<string, typeof developmentInterests> = {};
    filteredInterests.forEach((di) => {
      if (!groups[di.category]) groups[di.category] = [];
      groups[di.category].push(di);
    });
    return groups;
  }, [filteredInterests]);

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    requested: { label: 'Angefragt', color: '#FF8B00', bg: '#FFF7E6' },
    approved: { label: 'Genehmigt', color: '#00875A', bg: '#E3FCEF' },
    'in-progress': { label: 'In Arbeit', color: '#0A7075', bg: '#E6F3F3' },
  };

  const teamPills: { key: TeamFilter; label: string }[] = [
    { key: 'all', label: 'Alle Teams' },
    { key: 'Engineering', label: 'Engineering' },
    { key: 'Design', label: 'Design' },
    { key: 'HR', label: 'HR' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
              Skilluebersicht
            </h1>
            <p className="text-[var(--neutral-200)] text-sm">
              Skill-Profil des Unternehmens — Verteilung, Gaps und Entwicklungswuensche
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          {teamPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setTeamFilter(pill.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                teamFilter === pill.key
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--neutral-20)] text-[var(--neutral-200)] hover:bg-[var(--neutral-30)]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-[var(--neutral-30)]" />
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-[var(--neutral-20)] border border-[var(--neutral-30)] rounded-lg px-3 py-1.5 pr-8 text-sm text-[var(--neutral-800)] cursor-pointer hover:bg-[var(--neutral-30)] transition-colors"
          >
            <option value="all">Alle Rollen</option>
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--neutral-100)] pointer-events-none"
          />
        </div>
        <span className="ml-auto text-xs text-[var(--neutral-100)]">
          {filteredEmployeeIds.length} Mitarbeiter ausgewaehlt
        </span>
      </div>

      {/* Section 1: Skill Distribution Chart */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
            <BarChart3 size={16} />
          </div>
          <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
            Skill-Verteilung
          </h2>
        </div>
        <p className="text-xs text-[var(--neutral-100)] mb-4 ml-10">
          Anzahl Mitarbeiter pro Skill, farbcodiert nach Abdeckungsgrad
        </p>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 ml-10">
          <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
            <div className="w-3 h-3 rounded-sm bg-[#00875A]" />
            Gut abgedeckt
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
            <div className="w-3 h-3 rounded-sm bg-[#FFAB00]" />
            Ausbaufaehig
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-200)]">
            <div className="w-3 h-3 rounded-sm bg-[#FF5630]" />
            Skill-Gap
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillDistribution}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 8]}
                tick={{ fontSize: 12, fill: '#6B778C' }}
                tickLine={false}
                axisLine={{ stroke: '#EBECF0' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12, fill: '#6B778C' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #EBECF0',
                  fontSize: '12px',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, _name: any, props: any) => [
                  `${value} Personen (Ø Level: ${props.payload.avgLevel})`,
                  'Abdeckung',
                ]}
              />
              <Bar dataKey="personCount" radius={[0, 4, 4, 0]} barSize={18}>
                {skillDistribution.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={getBarColor(entry.avgLevel, entry.personCount)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detail Grid */}
        <div className="mt-6 border-t border-[var(--neutral-30)] pt-4">
          <div className="grid grid-cols-4 gap-3">
            {skillDistribution.map((skill) => {
              const color = getBarColor(skill.avgLevel, skill.personCount);
              return (
                <div
                  key={skill.id}
                  className="p-3 rounded-lg border border-[var(--neutral-30)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-[var(--neutral-800)] truncate">
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--neutral-200)]">
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {skill.personCount}
                    </span>
                    <span>Ø {skill.avgLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2+3: Development Wishes & AI Matching */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
            Entwicklungswuensche & AI-Expert-Matching
          </h2>
        </div>
        <p className="text-xs text-[var(--neutral-100)] mb-5 ml-10">
          FeeBee analysiert interne Experten fuer jeden Entwicklungswunsch
        </p>

        {Object.keys(interestsByCategory).length === 0 ? (
          <div className="text-center py-8 text-[var(--neutral-100)] text-sm">
            Keine Entwicklungswuensche fuer die aktuelle Filterauswahl.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(interestsByCategory).map(([category, interests]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-100)] mb-3">
                  {category}
                </h3>
                <div className="space-y-3">
                  {interests.map((di) => {
                    const employee = employees.find((e) => e.id === di.employeeId);
                    const sc = statusConfig[di.status] || statusConfig.requested;
                    const matching = skillsData.aiExpertMatching.find(
                      (m) => m.developmentInterestId === di.recommendationId
                    );

                    return (
                      <div
                        key={di.recommendationId}
                        className="border border-[var(--neutral-30)] rounded-lg overflow-hidden"
                      >
                        {/* Interest Row */}
                        <div className="flex items-center gap-3 p-4">
                          <div className="w-9 h-9 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {employee?.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[var(--neutral-800)]">
                              {di.title}
                            </div>
                            <div className="text-xs text-[var(--neutral-100)]">
                              {employee?.name} — {employee?.role}
                            </div>
                          </div>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
                            style={{ backgroundColor: sc.bg, color: sc.color }}
                          >
                            {sc.label}
                          </span>
                        </div>

                        {/* AI Matching Panel */}
                        <div className="bg-[#F8FFFE] border-t border-[var(--neutral-30)] px-4 py-3">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <Sparkles size={12} className="text-[#0A7075]" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A7075]">
                              FeeBee AI-Matching
                            </span>
                          </div>

                          {matching && matching.experts.length > 0 ? (
                            <div className="space-y-2">
                              {matching.experts.map((expert) => {
                                const expertEmp = employees.find(
                                  (e) => e.id === expert.expertId
                                );
                                return (
                                  <div
                                    key={expert.expertId}
                                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[var(--neutral-30)]"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                                      {expertEmp?.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-[var(--neutral-800)]">
                                        {expertEmp?.name}
                                      </div>
                                      <div className="text-[11px] text-[var(--neutral-100)]">
                                        {expertEmp?.role}
                                      </div>
                                      <div className="text-xs text-[var(--neutral-200)] mt-1 leading-relaxed">
                                        {expert.reason}
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0 w-16 text-right">
                                      <div className="text-sm font-bold text-[var(--primary)]">
                                        {expert.matchScore}%
                                      </div>
                                      <div className="w-full h-1.5 bg-[var(--neutral-20)] rounded-full mt-1 overflow-hidden">
                                        <div
                                          className="h-full bg-[var(--primary)] rounded-full"
                                          style={{ width: `${expert.matchScore}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFEBE6] border border-[#FFD2CC]">
                              <AlertTriangle size={14} className="text-[#FF5630] flex-shrink-0" />
                              <span className="text-xs text-[#CC1100]">
                                Kein interner Experte vorhanden — externer Workshop oder Neueinstellung empfohlen
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
