'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  UserPlus,
  Calendar,
  Sparkles,
  ClipboardList,
  Users,
  Zap,
  Plus,
  Trash2,
  User,
  ToggleLeft,
  ToggleRight,
  FileText,
} from 'lucide-react';
import employees from '@/data/employees.json';
import templates from '@/data/templates.json';

const processTypes = [
  { id: 'onboarding', label: 'Onboarding', description: 'Feedback für neue Mitarbeiter in der Einarbeitungsphase', icon: '🚀', color: '#02464B', bg: '#E0F0F1' },
  { id: 'high-potential', label: 'High Potential', description: '360°-Review für Mitarbeiter mit Führungspotenzial', icon: '⭐', color: '#0A7075', bg: '#E6F3F3' },
  { id: 'peer-feedback', label: 'Peer Feedback', description: 'Gegenseitiges Feedback im Team', icon: '🤝', color: '#00875A', bg: '#E3FCEF' },
  { id: 'performance-improvement', label: 'Performance Improvement', description: 'Strukturiertes Feedback für Leistungsverbesserung', icon: '📈', color: '#FF5630', bg: '#FFEBE6' },
  { id: 'custom', label: 'Custom', description: 'Individuellen Feedback-Prozess erstellen', icon: '⚙️', color: '#6B778C', bg: '#F4F5F7' },
];

const aiSuggestedQuestions = [
  { text: 'Im letzten CheckIn wurde Eigenständigkeit als Entwicklungsfeld identifiziert. Wie hat sich das seitdem entwickelt?', type: 'rating', basis: 'Onboarding CheckIn 1: Eigenständigkeit 3/5' },
  { text: 'Wie hat sich die Kommunikation im Team seit dem letzten Feedback-Zyklus verändert?', type: 'rating', basis: 'Peer Feedback Q3: Kommunikation als Verbesserungsfeld' },
  { text: 'Welche konkreten Fortschritte bei der Code-Qualität konnten Sie beobachten?', type: 'text', basis: 'Vorheriges Feedback: Code-Reviews könnten gründlicher werden' },
];

export default function NewProcessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [includeSelfAssessment, setIncludeSelfAssessment] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customQuestions, setCustomQuestions] = useState<{ text: string; type: string; aiSuggested?: boolean; basis?: string }[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isMultiStage, setIsMultiStage] = useState(false);

  const steps = [
    { label: 'Typ wählen', icon: <ClipboardList size={16} /> },
    { label: 'Mitarbeiter', icon: <UserPlus size={16} /> },
    { label: 'Teilnehmer', icon: <Users size={16} /> },
    { label: 'Fragebogen', icon: <FileText size={16} /> },
    { label: 'Selbsteinschätzung', icon: <User size={16} /> },
    { label: 'AI & Zeitplan', icon: <Sparkles size={16} /> },
  ];

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const matchingTemplates = templates.filter((t) => t.type === selectedType || selectedType === 'custom');
  const activeTemplate = templates.find((t) => t.id === selectedTemplate);
  const activeQuestions: { text: string; type: string; aiSuggested?: boolean; basis?: string }[] = customQuestions.length > 0 ? customQuestions : (activeTemplate?.questions.map((q) => ({ text: q.text, type: q.type })) || []);

  const loadTemplateQuestions = (tplId: string) => {
    setSelectedTemplate(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setCustomQuestions(tpl.questions.map((q) => ({ text: q.text, type: q.type })));
    }
  };

  const addAiQuestion = (q: typeof aiSuggestedQuestions[0]) => {
    setCustomQuestions([...activeQuestions, { text: q.text, type: q.type, aiSuggested: true, basis: q.basis }]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/processes" className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Neuen Feedback-Prozess starten</h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">Folge dem Assistenten Schritt für Schritt.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i < step ? 'bg-[var(--success)] text-white' : i === step ? 'bg-[var(--primary)] text-white' : 'bg-[var(--neutral-20)] text-[var(--neutral-100)]'
                }`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs ${i === step ? 'font-medium text-[var(--neutral-800)]' : 'text-[var(--neutral-100)]'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[var(--success)]' : 'bg-[var(--neutral-30)]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="min-h-[300px]">
          {/* Step 0: Type */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {processTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setSelectedTemplate(''); setCustomQuestions([]); }}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    selectedType === type.id ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-sm text-[var(--neutral-800)]">{type.label}</div>
                  <div className="text-xs text-[var(--neutral-200)] mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Employee */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--neutral-200)]">Für welchen Mitarbeiter soll Feedback gesammelt werden?</p>
              <div className="grid grid-cols-2 gap-3">
                {employees.filter((e) => e.role !== 'HR Business Partner').map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedEmployee === emp.id ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                      {emp.avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[var(--neutral-800)]">{emp.name}</div>
                      <div className="text-xs text-[var(--neutral-100)]">{emp.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedType === 'onboarding' && (
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--neutral-10)] border border-[var(--neutral-30)] cursor-pointer">
                  <input type="checkbox" checked={isMultiStage} onChange={() => setIsMultiStage(!isMultiStage)} className="w-4 h-4" />
                  <div>
                    <span className="text-sm font-medium text-[var(--neutral-800)]">Mehrstufiger Prozess (30/60/90 Tage)</span>
                    <p className="text-xs text-[var(--neutral-100)]">AI bezieht sich bei späteren CheckIns auf vorherige Ergebnisse</p>
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Step 2: Participants */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--neutral-200)]">Wer soll Feedback geben?</p>
              <div className="grid grid-cols-2 gap-3">
                {employees.filter((e) => e.id !== selectedEmployee).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => toggleParticipant(emp.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedParticipants.includes(emp.id) ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedParticipants.includes(emp.id) ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--neutral-40)]'
                    }`}>
                      {selectedParticipants.includes(emp.id) && <Check size={12} className="text-white" />}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-xs font-medium">
                      {emp.avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[var(--neutral-800)]">{emp.name}</div>
                      <div className="text-xs text-[var(--neutral-100)]">{emp.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--neutral-100)]">{selectedParticipants.length} Teilnehmer ausgewählt</p>
            </div>
          )}

          {/* Step 3: Questionnaire with template selection and customization */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--neutral-200)]">Vorlage wählen und anpassen</p>
                <button
                  onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    showAiSuggestions ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--secondary-light)] text-[var(--secondary)]'
                  }`}
                >
                  <Sparkles size={12} />
                  AI-Vorschläge {showAiSuggestions ? 'ausblenden' : 'anzeigen'}
                </button>
              </div>

              {/* Template Selection */}
              <div className="flex flex-wrap gap-2 mb-4">
                {matchingTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplateQuestions(tpl.id)}
                    className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                      selectedTemplate === tpl.id ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]' : 'border-[var(--neutral-30)] text-[var(--neutral-200)] hover:border-[var(--neutral-40)]'
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>

              {/* Questions (editable) */}
              <div className="space-y-2">
                {activeQuestions.map((q, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${q.aiSuggested ? 'border-[var(--secondary)] bg-[var(--secondary-light)]' : 'border-[var(--neutral-30)] bg-[var(--neutral-10)]'}`}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${
                      q.type === 'rating' ? 'bg-[#E0F0F1] text-[#02464B]' :
                      q.type === 'competency' ? 'bg-[#E6F3F3] text-[#0A7075]' :
                      'bg-[#E3FCEF] text-[#00875A]'
                    }`}>
                      {q.type === 'rating' ? 'Bewertung' : q.type === 'competency' ? 'Kompetenz' : 'Freitext'}
                    </span>
                    <input
                      type="text"
                      defaultValue={q.text}
                      className="flex-1 text-sm text-[var(--neutral-800)] bg-transparent border-none focus:outline-none"
                    />
                    {q.aiSuggested && <Sparkles size={12} className="text-[var(--secondary)] flex-shrink-0" />}
                    <button onClick={() => setCustomQuestions(activeQuestions.filter((_, j) => j !== i))} className="text-[var(--neutral-100)] hover:text-[var(--danger)] flex-shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setCustomQuestions([...activeQuestions, { text: '', type: 'rating' }])}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
                >
                  <Plus size={12} />
                  Eigene Frage hinzufügen
                </button>
              </div>

              {/* AI Suggestions Panel */}
              {showAiSuggestions && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} />
                    <span className="text-xs font-semibold">AI-Vorschläge basierend auf vorherigem Feedback</span>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestedQuestions.map((q, i) => (
                      <div key={i} className="bg-white/10 rounded-lg p-3">
                        <p className="text-sm text-white/90 mb-1">{q.text}</p>
                        <p className="text-[10px] text-white/50 italic mb-2">Basis: {q.basis}</p>
                        <button
                          onClick={() => addAiQuestion(q)}
                          className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                        >
                          + Zum Fragebogen hinzufügen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Self-Assessment */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--neutral-30)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7E6] text-[#FF8B00] flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--neutral-800)]">Selbsteinschätzung einbeziehen</div>
                    <div className="text-xs text-[var(--neutral-100)]">Der Mitarbeiter füllt eine eigene Einschätzung aus. AI vergleicht Selbst- und Fremdeinschätzung.</div>
                  </div>
                </div>
                <button onClick={() => setIncludeSelfAssessment(!includeSelfAssessment)}>
                  {includeSelfAssessment ? (
                    <ToggleRight size={28} className="text-[var(--primary)]" />
                  ) : (
                    <ToggleLeft size={28} className="text-[var(--neutral-100)]" />
                  )}
                </button>
              </div>

              {includeSelfAssessment && (
                <>
                  <div className="p-5 rounded-xl border border-[var(--neutral-30)]">
                    <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Vorlage für Selbsteinschätzung</h3>
                    <p className="text-xs text-[var(--neutral-100)] mb-3">Wähle eine angepasste Vorlage für die Selbsteinschätzung:</p>
                    <div className="space-y-2">
                      {templates.filter((t) => t.type === 'self-assessment').map((tpl) => (
                        <div key={tpl.id} className="p-3 rounded-lg border-2 border-[var(--primary)] bg-[var(--primary-light)]">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium text-[var(--neutral-800)]">{tpl.name}</span>
                              <span className="text-xs text-[var(--neutral-100)] ml-2">{tpl.questions.length} Fragen</span>
                            </div>
                            <Check size={16} className="text-[var(--primary)]" />
                          </div>
                          <div className="mt-2 space-y-1">
                            {tpl.questions.slice(0, 3).map((q, i) => (
                              <div key={i} className="text-xs text-[var(--neutral-200)]">• {q.text}</div>
                            ))}
                            {tpl.questions.length > 3 && (
                              <div className="text-xs text-[var(--neutral-100)]">...und {tpl.questions.length - 3} weitere</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#0A7075] to-[#14919B] text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} />
                      <span className="text-xs font-semibold">AI-Empfehlungen für Selbsteinschätzung</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Die KI wird nach Abschluss automatisch Selbst- und Fremdeinschätzung vergleichen und einen detaillierten Abgleich erstellen.
                      Bereiche mit großer Diskrepanz werden hervorgehoben und HR erhält konkrete Gesprächsempfehlungen.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5: AI & Schedule */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-[var(--neutral-30)] space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--primary)]" />
                  <h3 className="font-semibold text-sm text-[var(--neutral-800)]">Zeitplan</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--neutral-200)] mb-1 block">Startdatum</label>
                    <input type="date" defaultValue="2025-01-15" className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--neutral-200)] mb-1 block">Enddatum</label>
                    <input type="date" defaultValue="2025-03-15" className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[var(--neutral-30)] space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[var(--secondary)]" />
                  <h3 className="font-semibold text-sm text-[var(--neutral-800)]">AI-Funktionen</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Automatische Auswertung', desc: 'AI fasst Feedback zusammen und erkennt Muster' },
                    { label: 'Trend-Analyse', desc: 'Vergleich mit vorherigen Feedback-Zyklen' },
                    { label: 'Entwicklungsempfehlungen', desc: 'Personalisierte Vorschläge basierend auf Feedback' },
                    { label: 'AI-gestütztes Feedback', desc: 'Chatbot hilft Teilnehmern beim Formulieren' },
                    { label: 'Kritisches Feedback Alert', desc: 'HR wird bei kritischem Feedback automatisch benachrichtigt' },
                    { label: 'Selbst-/Fremdeinschätzungsabgleich', desc: 'AI analysiert Unterschiede zwischen Selbst- und Fremdeinschätzung' },
                  ].map((feature) => (
                    <label key={feature.label} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 w-4 h-4 rounded border-[var(--neutral-40)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <div>
                        <div className="text-sm font-medium text-[var(--neutral-800)]">{feature.label}</div>
                        <div className="text-xs text-[var(--neutral-100)]">{feature.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Feedback Approval */}
              <div className="p-5 rounded-xl border border-[var(--neutral-30)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFEBE6] text-[var(--danger)] flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--neutral-800)]">HR-Freigabe vor Mitarbeiter-Sichtbarkeit</div>
                      <div className="text-xs text-[var(--neutral-100)]">Feedback ist für den Mitarbeiter erst sichtbar, wenn von HR freigegeben</div>
                    </div>
                  </div>
                  <ToggleRight size={28} className="text-[var(--primary)]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--neutral-30)]">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              step === 0 ? 'invisible' : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
            }`}
          >
            <ArrowLeft size={14} />
            Zurück
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
            >
              Weiter
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => router.push('/processes')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--success)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              <Zap size={14} />
              Prozess starten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
