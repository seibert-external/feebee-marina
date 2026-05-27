'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Send, Sparkles, Users } from 'lucide-react';
import feedback from '@/data/feedback.json';
import processes from '@/data/processes.json';
import employees from '@/data/employees.json';

export default function GiveFeedbackPage() {
  const params = useParams();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [collaborationScore, setCollaborationScore] = useState<number | null>(null);
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [selfAssessment, setSelfAssessment] = useState('');

  const fb = feedback.find((f) => f.id === params.id);
  if (!fb) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--neutral-200)]">Feedback-Anfrage nicht gefunden.</p>
        <Link href="/feedback" className="text-[var(--primary)] hover:underline text-sm mt-2 block">Zurück</Link>
      </div>
    );
  }

  const process = processes.find((p) => p.id === fb.processId);
  const target = employees.find((e) => e.id === fb.toEmployee);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-[#E3FCEF] text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={28} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)] mb-2">Feedback abgesendet!</h1>
        <p className="text-[var(--neutral-200)] mb-6">Vielen Dank für dein Feedback. Es wurde erfolgreich übermittelt.</p>
        <Link href="/feedback" className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/feedback" className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Feedback geben</h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">{process?.title}</p>
        </div>
      </div>

      {/* Target */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
          {target?.avatar}
        </div>
        <div>
          <div className="font-medium text-[var(--neutral-800)]">Feedback für {target?.name}</div>
          <div className="text-sm text-[var(--neutral-100)]">{target?.role} · {target?.department}</div>
        </div>
        <div className="ml-auto">
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A7075] to-[#14919B] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} />
            Mit AI-Assistenten ausfüllen
          </Link>
        </div>
      </div>

      {/* Collaboration Score */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-start gap-2 mb-3">
          <Users size={18} className="text-[var(--primary)] mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[var(--neutral-800)]">
              Wie intensiv arbeitest du mit dieser Person zusammen? <span className="text-[var(--danger)]">*</span>
            </div>
            <p className="text-xs text-[var(--neutral-100)] mt-1">Pflichtfeld — hilft bei der Einordnung deines Feedbacks.</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {([
            { value: 1, label: 'Kaum / selten' },
            { value: 2, label: 'Gelegentlich' },
            { value: 3, label: 'Regelmaessig' },
            { value: 4, label: 'Haeufig / eng' },
            { value: 5, label: 'Sehr eng / taeglich' },
          ] as const).map((option) => (
            <button
              key={option.value}
              onClick={() => setCollaborationScore(option.value)}
              className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                collaborationScore === option.value
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--neutral-30)] hover:border-[var(--primary)] text-[var(--neutral-200)]'
              }`}
            >
              <div className="text-lg font-bold">{option.value}</div>
              <div className="text-[10px] mt-0.5 leading-tight">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 space-y-6">
        {process?.questions.map((q, index) => (
          <div key={q.id} className="pb-6 border-b border-[var(--neutral-30)] last:border-0 last:pb-0">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-sm font-medium text-[var(--neutral-100)]">{index + 1}.</span>
              <div>
                <div className="text-sm font-medium text-[var(--neutral-800)]">{q.text}</div>
                {q.category && (
                  <span className="text-xs text-[var(--neutral-100)]">Kategorie: {q.category}</span>
                )}
              </div>
              {q.required && <span className="text-[var(--danger)] text-xs">*</span>}
            </div>

            {(q.type === 'rating' || q.type === 'competency') && (
              <div className="flex items-center gap-2 ml-5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRatings((prev) => ({ ...prev, [q.id]: value }))}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`transition-colors ${
                        value <= (ratings[q.id] || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-[var(--neutral-40)] hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                {ratings[q.id] && (
                  <span className="ml-2 text-sm text-[var(--neutral-200)]">{ratings[q.id]}/5</span>
                )}
              </div>
            )}

            {q.type === 'text' && (
              <textarea
                value={texts[q.id] || ''}
                onChange={(e) => setTexts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Dein Feedback hier eingeben..."
                rows={3}
                className="w-full ml-5 mt-1 px-4 py-3 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none resize-none"
              />
            )}
          </div>
        ))}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-30)]">
          <Link href="/feedback" className="text-sm text-[var(--neutral-200)] hover:text-[var(--neutral-800)]">
            Abbrechen
          </Link>
          <button
            onClick={() => {
              if (!collaborationScore) {
                alert('Bitte gib an, wie intensiv du mit dieser Person zusammenarbeitest.');
                return;
              }
              setSubmitted(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
          >
            <Send size={14} />
            Feedback absenden
          </button>
        </div>
      </div>

      {/* Selbsteinschätzung (optional) */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Star size={18} className="text-[#0A7075]" />
          <h2 className="text-sm font-semibold text-[var(--neutral-800)]">Eigene Einschaetzung</h2>
          <span className="text-xs text-[var(--neutral-100)]">(optional)</span>
        </div>
        <p className="text-xs text-[var(--neutral-100)] mb-4">
          Wie schaetzt du deine eigene Leistung ein? Diese Angabe ist freiwillig und wird nur intern verwendet.
        </p>

        <div className="mb-4">
          <div className="text-xs font-medium text-[var(--neutral-200)] mb-2">Gesamt-Einschaetzung</div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setSelfRating(selfRating === value ? null : value)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    value <= (selfRating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-[var(--neutral-40)] hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
            {selfRating && (
              <span className="ml-2 text-sm text-[var(--neutral-200)]">{selfRating}/5</span>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-[var(--neutral-200)] mb-2">Wie schaetzt du deine eigene Leistung ein?</div>
          <textarea
            value={selfAssessment}
            onChange={(e) => setSelfAssessment(e.target.value)}
            placeholder="Optionale Selbsteinschaetzung..."
            rows={3}
            className="w-full px-4 py-3 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
