'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Edit3, Copy, Trash2, Sparkles, Search, CheckCircle2 } from 'lucide-react';
import templates from '@/data/templates.json';

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  onboarding: { label: 'Onboarding', color: '#02464B', bg: '#E0F0F1' },
  'high-potential': { label: 'High Potential', color: '#0A7075', bg: '#E6F3F3' },
  'peer-feedback': { label: 'Peer Feedback', color: '#00875A', bg: '#E3FCEF' },
  'performance-improvement': { label: 'Performance', color: '#FF5630', bg: '#FFEBE6' },
  'self-assessment': { label: 'Selbsteinschätzung', color: '#FF8B00', bg: '#FFF7E6' },
  'short-feedback': { label: 'Kurzfeedback', color: '#02464B', bg: '#E0F0F1' },
  proactive: { label: 'Proaktiv', color: '#00875A', bg: '#E3FCEF' },
  custom: { label: 'Custom', color: '#6B778C', bg: '#F4F5F7' },
};

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [duplicated, setDuplicated] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  const filtered = templates
    .filter((t) => !deleted.has(t.id))
    .filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );

  const handleDuplicate = (id: string) => {
    setDuplicated(id);
    setTimeout(() => setDuplicated(null), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Vorlage "${name}" wirklich löschen?`)) {
      setDeleted((prev) => new Set(prev).add(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Feedback-Vorlagen</h1>
          <p className="text-[var(--neutral-200)] mt-1">Erstelle und verwalte Fragebogen-Vorlagen für alle Feedback-Prozesse.</p>
        </div>
        <Link
          href="/templates/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
        >
          <Plus size={16} />
          Neue Vorlage
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Vorlagen suchen..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-sm border border-[var(--neutral-30)] focus:border-[var(--primary)] focus:outline-none"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((template) => {
          const tc = typeLabels[template.type] || typeLabels.custom;
          return (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <Link href={`/templates/${template.id}`} className="block">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--neutral-800)]">{template.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: tc.bg, color: tc.color }}>
                        {tc.label}
                      </span>
                    </div>
                  </div>
                  {template.aiSuggestionsEnabled && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] text-[10px] font-medium">
                      <Sparkles size={10} />
                      AI
                    </div>
                  )}
                </div>

                <p className="text-xs text-[var(--neutral-200)] mb-3">{template.description}</p>

                <div className="flex items-center gap-2 text-xs text-[var(--neutral-100)] mb-4">
                  <span>{template.questions.length} Fragen</span>
                  <span>·</span>
                  <span>Aktualisiert: {template.updatedAt}</span>
                </div>
              </Link>

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--neutral-30)]">
                <Link
                  href={`/templates/${template.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
                >
                  <Edit3 size={12} />
                  Bearbeiten
                </Link>
                <button
                  onClick={() => handleDuplicate(template.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--neutral-200)] hover:bg-[var(--neutral-20)] rounded-lg transition-colors"
                >
                  {duplicated === template.id ? (
                    <><CheckCircle2 size={12} className="text-[var(--success)]" /> Dupliziert!</>
                  ) : (
                    <><Copy size={12} /> Duplizieren</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(template.id, template.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--danger)] hover:bg-[#FFEBE6] rounded-lg transition-colors ml-auto"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
