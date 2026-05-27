'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Save,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import templates from '@/data/templates.json';

const aiSuggestedQuestions = [
  { text: 'Basierend auf dem letzten Feedback: Wie hat sich die Kommunikation seit Q2 entwickelt?', type: 'rating', category: 'Kommunikation', basedOn: 'Peer Feedback Q3: Kommunikation wurde als Entwicklungsfeld genannt' },
  { text: 'Im vorherigen CheckIn wurde Eigenständigkeit als Entwicklungsfeld identifiziert. Wie schätzen Sie die Verbesserung ein?', type: 'rating', category: 'Selbstständigkeit', basedOn: 'Onboarding CheckIn 1: Eigenständigkeit 3/5' },
  { text: 'Welche konkreten Fortschritte sehen Sie seit dem letzten Feedback-Zyklus?', type: 'text', category: 'Entwicklung', basedOn: 'Vorheriger Zyklus: Verbesserungspotenzial bei Code-Quality' },
];

export default function TemplateEditorPage() {
  const params = useParams();
  const template = templates.find((t) => t.id === params.id);
  const [aiEnabled, setAiEnabled] = useState(template?.aiSuggestionsEnabled ?? false);
  const [questions, setQuestions] = useState<Array<{ id: string; text: string; type: string; category: string; required: boolean; aiSuggested?: boolean; basedOnPrevious?: string }>>(template?.questions || []);
  const [saved, setSaved] = useState(false);

  if (!template && params.id !== 'new') {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--neutral-200)]">Vorlage nicht gefunden.</p>
        <Link href="/templates" className="text-[var(--primary)] hover:underline text-sm mt-2 block">Zurück</Link>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addAiQuestion = (q: typeof aiSuggestedQuestions[0]) => {
    setQuestions([...questions, {
      id: `q-ai-${Date.now()}`,
      text: q.text,
      type: q.type as 'rating' | 'text' | 'competency',
      category: q.category,
      required: true,
      aiSuggested: true,
      basedOnPrevious: q.basedOn,
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/templates" className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
            {params.id === 'new' ? 'Neue Vorlage' : template?.name}
          </h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">
            {params.id === 'new' ? 'Erstelle eine neue Fragebogen-Vorlage' : 'Vorlage bearbeiten'}
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-[var(--success)] text-white' : 'bg-[var(--primary)] text-white hover:bg-[#013438]'
          }`}
        >
          <Save size={14} />
          {saved ? 'Gespeichert!' : 'Speichern'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="col-span-2 space-y-4">
          {/* Template info */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 space-y-4">
            <div>
              <label className="text-xs text-[var(--neutral-200)] mb-1 block">Vorlagenname</label>
              <input
                type="text"
                defaultValue={template?.name || ''}
                placeholder="z.B. Onboarding Feedback 90 Tage"
                className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--neutral-200)] mb-1 block">Beschreibung</label>
              <textarea
                defaultValue={template?.description || ''}
                placeholder="Beschreibung der Vorlage..."
                rows={2}
                className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--neutral-200)] mb-1 block">Typ</label>
                <select
                  defaultValue={template?.type || ''}
                  className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none bg-white"
                >
                  <option value="onboarding">Onboarding</option>
                  <option value="high-potential">High Potential</option>
                  <option value="peer-feedback">Peer Feedback</option>
                  <option value="performance-improvement">Performance Improvement</option>
                  <option value="self-assessment">Selbsteinschätzung</option>
                  <option value="short-feedback">Kurzfeedback</option>
                  <option value="proactive">Proaktives Feedback</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-[var(--neutral-30)] hover:bg-[var(--neutral-20)] transition-colors"
                >
                  {aiEnabled ? (
                    <ToggleRight size={20} className="text-[var(--primary)]" />
                  ) : (
                    <ToggleLeft size={20} className="text-[var(--neutral-100)]" />
                  )}
                  <Sparkles size={14} className={aiEnabled ? 'text-[var(--primary)]' : 'text-[var(--neutral-100)]'} />
                  AI-Vorschläge
                </button>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Fragen ({questions.length})</h2>
              <button
                onClick={() => setQuestions([...questions, { id: `q-new-${Date.now()}`, text: '', type: 'rating', category: '', required: true }])}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
              >
                <Plus size={14} />
                Frage hinzufügen
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={q.id || i}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                    q.aiSuggested ? 'border-[var(--secondary)] bg-[var(--secondary-light)]' : 'border-[var(--neutral-30)]'
                  }`}
                >
                  <GripVertical size={16} className="text-[var(--neutral-40)] mt-2 cursor-grab flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      defaultValue={q.text}
                      placeholder="Frage eingeben..."
                      className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <select
                        defaultValue={q.type}
                        className="px-2 py-1 border border-[var(--neutral-30)] rounded text-xs bg-white"
                      >
                        <option value="rating">Bewertung (1-5)</option>
                        <option value="text">Freitext</option>
                        <option value="competency">Kompetenz</option>
                      </select>
                      <input
                        type="text"
                        defaultValue={q.category || ''}
                        placeholder="Kategorie"
                        className="px-2 py-1 border border-[var(--neutral-30)] rounded text-xs w-32"
                      />
                      {q.aiSuggested && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--secondary)] font-medium">
                          <Sparkles size={10} />
                          AI-Vorschlag
                        </span>
                      )}
                      {q.basedOnPrevious && (
                        <span className="text-[10px] text-[var(--neutral-100)] italic truncate max-w-[200px]" title={q.basedOnPrevious}>
                          Basis: {q.basedOnPrevious}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeQuestion(i)}
                    className="p-1.5 text-[var(--neutral-100)] hover:text-[var(--danger)] hover:bg-[#FFEBE6] rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar - AI Suggestions */}
        <div className="space-y-6">
          {aiEnabled && (
            <div className="bg-gradient-to-br from-[#0A7075] to-[#14919B] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} />
                <h3 className="font-semibold text-sm">AI-Fragenvorschläge</h3>
              </div>
              <p className="text-xs text-white/70 mb-4">
                Basierend auf vorherigem Feedback und dem gewählten Prozesstyp:
              </p>
              <div className="space-y-3">
                {aiSuggestedQuestions.map((q, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-white/90 mb-2">{q.text}</p>
                    <p className="text-[10px] text-white/50 mb-2 italic">
                      Basis: {q.basedOn}
                    </p>
                    <button
                      onClick={() => addAiQuestion(q)}
                      className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      + Hinzufügen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Vorschau</h3>
            <p className="text-xs text-[var(--neutral-100)] mb-3">So sieht der Fragebogen für Teilnehmer aus:</p>
            <button
              onClick={() => alert(`Vorschau für "${template?.name || 'Neue Vorlage'}" mit ${questions.length} Fragen wird geöffnet.\n\nIn der finalen Version öffnet sich hier eine interaktive Fragebogen-Vorschau.`)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
            >
              <Eye size={14} />
              Vorschau öffnen
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
            <h3 className="font-semibold text-sm text-[var(--neutral-800)] mb-3">Tipps</h3>
            <ul className="space-y-2 text-xs text-[var(--neutral-200)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)] mt-0.5">•</span>
                Aktiviere AI-Vorschläge, um Fragen basierend auf vorherigem Feedback zu erhalten
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)] mt-0.5">•</span>
                Mische Bewertungen, Kompetenzen und Freitext für aussagekräftiges Feedback
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)] mt-0.5">•</span>
                Bei mehrstufigen Prozessen: AI lernt aus vorherigen Stufen und schlägt Follow-up-Fragen vor
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
