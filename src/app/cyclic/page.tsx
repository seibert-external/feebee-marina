'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  Plus,
  Users,
  Calendar,
  Bell,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
} from 'lucide-react';
import cyclicData from '@/data/cyclic-feedback.json';
import employees from '@/data/employees.json';
import templates from '@/data/templates.json';

export default function CyclicFeedbackPage() {
  const [showNew, setShowNew] = useState(false);
  const config = cyclicData[0];
  const memberNames = config.members.map((id) => employees.find((e) => e.id === id));

  const currentQuarter = 'Okt';
  const currentRotation = config.rotationSchedule.filter((r) => r.month === currentQuarter);

  // Toggleable settings state
  const [criticalAlert, setCriticalAlert] = useState(config.criticalFeedbackAlert);
  const [yearReport, setYearReport] = useState(config.yearEndReport);
  const [visibility, setVisibility] = useState(true);

  // New cycle form state
  const [newSaved, setNewSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Zyklisches Team-Feedback</h1>
          <p className="text-[var(--neutral-200)] mt-1">Automatische Feedback-Rotation im Team konfigurieren.</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
        >
          {showNew ? <X size={16} /> : <Plus size={16} />}
          {showNew ? 'Abbrechen' : 'Neuen Zyklus erstellen'}
        </button>
      </div>

      {/* New Cycle Form */}
      {showNew && (
        <div className={`bg-white rounded-xl border-2 ${newSaved ? 'border-[var(--success)]' : 'border-[var(--primary)]'} p-6 space-y-4`}>
          {newSaved ? (
            <div className="text-center py-6">
              <CheckCircle2 size={40} className="mx-auto mb-3 text-[var(--success)]" />
              <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">Zyklus erstellt!</h2>
              <p className="text-sm text-[var(--neutral-200)] mb-4">Der neue Feedback-Zyklus wurde erfolgreich konfiguriert.</p>
              <button onClick={() => { setShowNew(false); setNewSaved(false); }} className="px-5 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438]">
                Zur Übersicht
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-[var(--primary)]" />
                <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Neuen Feedback-Zyklus erstellen</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--neutral-200)] mb-1 block">Team-Name</label>
                  <input type="text" placeholder="z.B. Design Team" className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[var(--neutral-200)] mb-1 block">Frequenz</label>
                  <select className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none bg-white">
                    <option value="quarterly">Vierteljährlich</option>
                    <option value="monthly">Monatlich</option>
                    <option value="yearly">Jährlich</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--neutral-200)] mb-1 block">Vorlage</label>
                <select className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none bg-white">
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--neutral-200)] mb-2 block">Team-Mitglieder auswählen</label>
                <div className="flex flex-wrap gap-2">
                  {employees.filter((e) => e.id !== 'emp-008').map((emp) => (
                    <label key={emp.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--neutral-10)] rounded-lg border border-[var(--neutral-30)] cursor-pointer hover:border-[var(--primary)] transition-colors">
                      <input type="checkbox" className="rounded border-[var(--neutral-40)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                      <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-medium">
                        {emp.avatar}
                      </div>
                      <span className="text-xs text-[var(--neutral-800)]">{emp.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowNew(false)} className="text-sm text-[var(--neutral-200)]">Abbrechen</button>
                <button onClick={() => setNewSaved(true)} className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors">
                  <Save size={14} />
                  Zyklus erstellen
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Active Config */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <RefreshCw size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--neutral-800)]">{config.teamName}</h2>
              <div className="flex items-center gap-3 text-xs text-[var(--neutral-100)]">
                <span className="flex items-center gap-1"><Users size={12} /> {config.members.length} Mitglieder</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {config.frequency === 'quarterly' ? 'Vierteljährlich' : config.frequency === 'monthly' ? 'Monatlich' : 'Jährlich'}</span>
                <span className="flex items-center gap-1"><FileText size={12} /> {templates.find((t) => t.id === config.templateId)?.name}</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.active ? 'bg-[#E3FCEF] text-[var(--success)]' : 'bg-[var(--neutral-20)] text-[var(--neutral-100)]'}`}>
            <div className={`w-2 h-2 rounded-full ${config.active ? 'bg-[var(--success)]' : 'bg-[var(--neutral-100)]'}`} />
            {config.active ? 'Aktiv' : 'Pausiert'}
          </div>
        </div>

        {/* Members */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">Team-Mitglieder</h3>
          <div className="flex flex-wrap gap-2">
            {memberNames.map((emp) => emp && (
              <div key={emp.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--neutral-10)] rounded-lg border border-[var(--neutral-30)]">
                <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">
                  {emp.avatar}
                </div>
                <div>
                  <div className="text-xs font-medium text-[var(--neutral-800)]">{emp.name}</div>
                  <div className="text-[10px] text-[var(--neutral-100)]">{emp.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Rotation */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">Aktuelle Rotation (Q4 - {currentQuarter})</h3>
          <div className="space-y-2">
            {currentRotation.map((r, i) => {
              const from = employees.find((e) => e.id === r.from);
              const to = employees.find((e) => e.id === r.to);
              const isCompleted = i < 2;
              return (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${isCompleted ? 'border-[var(--success)] bg-[#E3FCEF]/30' : 'border-[var(--neutral-30)]'}`}>
                  <div className="flex items-center gap-2 w-40">
                    <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">
                      {from?.avatar}
                    </div>
                    <span className="text-sm text-[var(--neutral-800)]">{from?.name}</span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--neutral-100)]" />
                  <div className="flex items-center gap-2 w-40">
                    <div className="w-7 h-7 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs font-medium">
                      {to?.avatar}
                    </div>
                    <span className="text-sm text-[var(--neutral-800)]">{to?.name}</span>
                  </div>
                  <div className="ml-auto">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs text-[var(--success)]"><CheckCircle2 size={12} /> Abgeschlossen</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[var(--warning)]"><Calendar size={12} /> Ausstehend</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="border-t border-[var(--neutral-30)] pt-6">
          <h3 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">Einstellungen</h3>
          <div className="space-y-3">
            <button
              onClick={() => setCriticalAlert(!criticalAlert)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--neutral-10)] hover:bg-[var(--neutral-20)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[var(--danger)]" />
                <div className="text-left">
                  <div className="text-sm font-medium text-[var(--neutral-800)]">Kritisches Feedback Alert</div>
                  <div className="text-xs text-[var(--neutral-100)]">HR wird bei kritischem Feedback (≤2/5) benachrichtigt</div>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${criticalAlert ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-40)]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${criticalAlert ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
            <button
              onClick={() => setYearReport(!yearReport)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--neutral-10)] hover:bg-[var(--neutral-20)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-[var(--secondary)]" />
                <div className="text-left">
                  <div className="text-sm font-medium text-[var(--neutral-800)]">AI Jahresbericht</div>
                  <div className="text-xs text-[var(--neutral-100)]">KI erstellt am Jahresende einen Feedback-Bericht für MA und HR</div>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${yearReport ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-40)]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${yearReport ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
            <button
              onClick={() => setVisibility(!visibility)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--neutral-10)] hover:bg-[var(--neutral-20)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[var(--primary)]" />
                <div className="text-left">
                  <div className="text-sm font-medium text-[var(--neutral-800)]">Mitarbeiter-Sichtbarkeit</div>
                  <div className="text-xs text-[var(--neutral-100)]">Feedback-Geber kann wählen: direkt teilen oder HR-Prüfung</div>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${visibility ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-40)]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${visibility ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI Year-End Preview */}
      <div className="bg-gradient-to-br from-[#02464B] to-[#0A7075] rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} />
          <h3 className="font-semibold text-sm">AI Jahresbericht-Vorschau (Q1-Q3 2024)</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-xs font-medium text-white/60 mb-2">Team-Stärken</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li>• Zusammenarbeit und Teamwork (4.3/5)</li>
              <li>• Technische Expertise steigend</li>
              <li>• Wissenstransfer funktioniert gut</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-xs font-medium text-white/60 mb-2">Entwicklungsfelder</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li>• Work-Life-Balance beobachten</li>
              <li>• Delegation im Management</li>
              <li>• Feedback-Kultur weiter stärken</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-yellow-300" />
            <span className="text-xs font-medium text-white/80">Aufmerksamkeit</span>
          </div>
          <p className="text-xs text-white/70">1 kritisches Feedback erkannt in Q3 (Julia Fischer &rarr; Lisa Schmidt Zusammenarbeit). HR wurde informiert.</p>
        </div>
      </div>

      {/* Rotation Matrix */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <h3 className="text-sm font-semibold text-[var(--neutral-800)] mb-4">Jahres-Rotationsplan</h3>
        <p className="text-xs text-[var(--neutral-100)] mb-4">Jede*r gibt jede*m im Team einmal pro Jahr Kurzfeedback. Rotation wird automatisch verteilt.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--neutral-30)]">
                <th className="text-left py-2 px-3 text-[var(--neutral-200)]">Quartal</th>
                {memberNames.map((emp) => emp && (
                  <th key={emp.id} className="text-center py-2 px-3 text-[var(--neutral-200)]">{emp.name.split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Jan', 'Apr', 'Jul', 'Okt'].map((quarter) => {
                const rotation = config.rotationSchedule.filter((r) => r.month === quarter);
                return (
                  <tr key={quarter} className="border-b border-[var(--neutral-30)] last:border-0">
                    <td className="py-2 px-3 font-medium text-[var(--neutral-800)]">Q{['Jan', 'Apr', 'Jul', 'Okt'].indexOf(quarter) + 1} ({quarter})</td>
                    {config.members.map((memberId) => {
                      const feedbackTo = rotation.find((r) => r.from === memberId);
                      const toEmp = employees.find((e) => e.id === feedbackTo?.to);
                      return (
                        <td key={memberId} className="text-center py-2 px-3">
                          <span className="text-[var(--neutral-200)]">→ {toEmp?.name.split(' ')[0]}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
