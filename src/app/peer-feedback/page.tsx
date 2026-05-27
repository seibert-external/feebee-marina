'use client';

import React, { useState } from 'react';
import {
  Send,
  MessageSquarePlus,
  ThumbsUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import employees from '@/data/employees.json';
import peerFeedback from '@/data/peer-feedback.json';

type Tab = 'give' | 'request' | 'received';

export default function PeerFeedbackPage() {
  const [tab, setTab] = useState<Tab>('give');
  const [showProactiveForm, setShowProactiveForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [shareDirectly, setShareDirectly] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const myProactive = peerFeedback.filter((pf) => pf.fromEmployee === 'emp-001' && pf.type === 'proactive');
  const myRequests = peerFeedback.filter((pf) => pf.fromEmployee === 'emp-001' && pf.type === 'request');
  const receivedFeedback = peerFeedback.filter((pf) => pf.toEmployee === 'emp-001' && pf.status === 'completed' && pf.shareDirectly);
  const pendingRequests = peerFeedback.filter((pf) => pf.toEmployee === 'emp-001' && pf.status === 'pending');

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-[#E3FCEF] text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)] mb-2">Feedback gesendet!</h1>
        <p className="text-[var(--neutral-200)] mb-6">Dein Feedback wurde erfolgreich übermittelt.</p>
        <button
          onClick={() => { setSubmitted(false); setShowProactiveForm(false); setShowRequestForm(false); }}
          className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Peer Feedback</h1>
          <p className="text-[var(--neutral-200)] mt-1">Gib spontan Feedback oder fordere Feedback von Kolleg*innen an.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowProactiveForm(true); setShowRequestForm(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--success)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ThumbsUp size={14} />
            Feedback geben
          </button>
          <button
            onClick={() => { setShowRequestForm(true); setShowProactiveForm(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
          >
            <MessageSquarePlus size={14} />
            Feedback anfragen
          </button>
        </div>
      </div>

      {/* Proactive Feedback Form */}
      {showProactiveForm && (
        <div className="bg-white rounded-xl border-2 border-[var(--success)] p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp size={18} className="text-[var(--success)]" />
            <h2 className="font-semibold text-[var(--neutral-800)]">Proaktives Feedback geben</h2>
            <span className="text-xs text-[var(--neutral-100)]">z.B. &quot;Dieses Projekt lief richtig gut!&quot;</span>
          </div>
          <div>
            <label className="text-xs text-[var(--neutral-200)] mb-1 block">An wen?</label>
            <div className="flex flex-wrap gap-2">
              {employees.filter((e) => e.id !== 'emp-001' && e.id !== 'emp-008').map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    selectedEmployee === emp.id ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">
                    {emp.avatar}
                  </div>
                  {emp.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--neutral-200)] mb-1 block">Was ist dir positiv aufgefallen?</label>
            <textarea rows={3} placeholder="z.B. Dein Code-Review war extrem hilfreich im Sprint..." className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--neutral-200)] mb-1 block">Kontext (Projekt, Meeting, etc.)</label>
            <input type="text" placeholder="z.B. Microservice-Migration Sprint 42" className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--neutral-200)]">Gesamtbewertung:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--neutral-10)] border border-[var(--neutral-30)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareDirectly(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  shareDirectly ? 'bg-[var(--primary)] text-white' : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
                }`}
              >
                <Eye size={12} />
                Direkt teilen
              </button>
              <button
                onClick={() => setShareDirectly(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !shareDirectly ? 'bg-[var(--warning)] text-white' : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
                }`}
              >
                <EyeOff size={12} />
                HR einbeziehen
              </button>
            </div>
            <span className="text-[10px] text-[var(--neutral-100)]">
              {shareDirectly ? 'Feedback wird direkt mit der Person geteilt' : 'HR prüft das Feedback zuerst'}
            </span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setShowProactiveForm(false)} className="text-sm text-[var(--neutral-200)]">Abbrechen</button>
            <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 px-5 py-2 bg-[var(--success)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Send size={14} />
              Feedback senden
            </button>
          </div>
        </div>
      )}

      {/* Request Feedback Form */}
      {showRequestForm && (
        <div className="bg-white rounded-xl border-2 border-[var(--primary)] p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquarePlus size={18} className="text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--neutral-800)]">Kurzfeedback anfragen</h2>
          </div>
          <div>
            <label className="text-xs text-[var(--neutral-200)] mb-1 block">Von wem?</label>
            <div className="flex flex-wrap gap-2">
              {employees.filter((e) => e.id !== 'emp-001' && e.id !== 'emp-008').map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    selectedEmployee === emp.id ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--neutral-30)]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">
                    {emp.avatar}
                  </div>
                  {emp.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--neutral-200)] mb-1 block">Nachricht (optional)</label>
            <input type="text" placeholder="z.B. Könntest du mir Feedback zu unserer Zusammenarbeit im Projekt geben?" className="w-full px-3 py-2 border border-[var(--neutral-30)] rounded-lg text-sm focus:border-[var(--primary)] focus:outline-none" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setShowRequestForm(false)} className="text-sm text-[var(--neutral-200)]">Abbrechen</button>
            <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438]">
              <Send size={14} />
              Anfrage senden
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg border border-[var(--neutral-30)] p-1 w-fit">
        {([
          { id: 'give' as Tab, label: 'Gegebenes Feedback', count: myProactive.length },
          { id: 'request' as Tab, label: 'Meine Anfragen', count: myRequests.length },
          { id: 'received' as Tab, label: 'Erhaltenes Feedback', count: receivedFeedback.length + pendingRequests.length },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--neutral-200)] hover:bg-[var(--neutral-20)]'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {tab === 'give' && myProactive.map((pf) => {
          const to = employees.find((e) => e.id === pf.toEmployee);
          return (
            <div key={pf.id} className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                  {to?.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--neutral-800)]">Feedback an {to?.name}</div>
                  <div className="text-xs text-[var(--neutral-100)]">{pf.date} · {pf.shareDirectly ? 'Direkt geteilt' : 'Über HR'}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--success)]">
                  <CheckCircle2 size={14} />
                  Gesendet
                </div>
              </div>
              {pf.feedback?.filter((f) => f.text).map((f, i) => (
                <p key={i} className="text-sm text-[var(--neutral-200)] bg-[var(--neutral-10)] p-3 rounded-lg mb-2">&ldquo;{f.text}&rdquo;</p>
              ))}
            </div>
          );
        })}

        {tab === 'request' && myRequests.map((pf) => {
          const to = employees.find((e) => e.id === pf.toEmployee);
          return (
            <div key={pf.id} className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center text-sm font-medium">
                  {to?.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--neutral-800)]">Anfrage an {to?.name}</div>
                  <div className="text-xs text-[var(--neutral-100)]">{pf.date}</div>
                  {pf.message && <p className="text-xs text-[var(--neutral-200)] mt-1">&ldquo;{pf.message}&rdquo;</p>}
                </div>
                {pf.status === 'pending' ? (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--warning)]">
                    <Clock size={14} />
                    Ausstehend
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                    <CheckCircle2 size={14} />
                    Erhalten
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {tab === 'received' && (
          <>
            {pendingRequests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[var(--neutral-800)] mb-2">Offene Anfragen an dich</h3>
                {pendingRequests.map((pf) => {
                  const from = employees.find((e) => e.id === pf.fromEmployee);
                  return (
                    <div key={pf.id} className="bg-white rounded-xl border-2 border-[var(--warning)] p-5 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                          {from?.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--neutral-800)]">{from?.name} bittet um Feedback</div>
                          {pf.message && <p className="text-xs text-[var(--neutral-200)] mt-0.5">&ldquo;{pf.message}&rdquo;</p>}
                        </div>
                        <button
                          onClick={() => { setShowProactiveForm(true); setSelectedEmployee(pf.fromEmployee); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-xs font-medium hover:bg-[#013438]"
                        >
                          Feedback geben <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {receivedFeedback.map((pf) => {
              const from = employees.find((e) => e.id === pf.fromEmployee);
              return (
                <div key={pf.id} className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-sm font-medium">
                      {from?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--neutral-800)]">Feedback von {from?.name}</div>
                      <div className="text-xs text-[var(--neutral-100)]">{pf.date}</div>
                    </div>
                    {pf.feedback?.find((f) => f.rating) && (
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= (pf.feedback?.find((f) => f.rating)?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />
                        ))}
                      </div>
                    )}
                  </div>
                  {pf.feedback?.filter((f) => f.text).map((f, i) => (
                    <p key={i} className="text-sm text-[var(--neutral-200)] bg-[var(--neutral-10)] p-3 rounded-lg mb-2">&ldquo;{f.text}&rdquo;</p>
                  ))}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
