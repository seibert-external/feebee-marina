'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquareText, CheckCircle2, Clock, ArrowRight, Star } from 'lucide-react';
import feedback from '@/data/feedback.json';
import processes from '@/data/processes.json';
import employees from '@/data/employees.json';

export default function FeedbackPage() {
  // Employee view - show feedback to give and received feedback
  const myPendingFeedback = feedback.filter((f) => f.fromEmployee === 'emp-001' && f.status === 'pending');
  const myCompletedFeedback = feedback.filter((f) => f.fromEmployee === 'emp-001' && f.status === 'completed');
  const receivedFeedback = feedback.filter((f) => f.toEmployee === 'emp-001' && f.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Mein Feedback</h1>
        <p className="text-[var(--neutral-200)] mt-1">Feedback geben und erhaltenes Feedback einsehen.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF7E6] text-[var(--warning)] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">{myPendingFeedback.length}</div>
              <div className="text-xs text-[var(--neutral-100)]">Offen</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E3FCEF] text-[var(--success)] flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">{myCompletedFeedback.length}</div>
              <div className="text-xs text-[var(--neutral-100)]">Gegeben</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <MessageSquareText size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--neutral-800)]">{receivedFeedback.length}</div>
              <div className="text-xs text-[var(--neutral-100)]">Erhalten</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">Offene Anfragen</h2>
          {myPendingFeedback.length === 0 ? (
            <div className="text-center py-8 text-[var(--neutral-100)]">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-[var(--success)]" />
              <p className="text-sm">Alles erledigt!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPendingFeedback.map((fb) => {
                const process = processes.find((p) => p.id === fb.processId);
                const target = employees.find((e) => e.id === fb.toEmployee);
                return (
                  <Link
                    key={fb.id}
                    href={`/feedback/give/${fb.id}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-sm font-medium">
                      {target?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[var(--neutral-800)]">Feedback für {target?.name}</div>
                      <div className="text-xs text-[var(--neutral-100)]">{process?.title}</div>
                    </div>
                    <ArrowRight size={16} className="text-[var(--neutral-100)]" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Received */}
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Erhaltenes Feedback</h2>
            <Link href="/development" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              Entwicklung <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {receivedFeedback.map((fb) => {
              const process = processes.find((p) => p.id === fb.processId);
              return (
                <Link
                  key={fb.id}
                  href={`/feedback/results/${fb.id}`}
                  className="block p-4 rounded-lg border border-[var(--neutral-30)] hover:border-[var(--primary)] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-[var(--neutral-800)]">Anonymes Feedback</div>
                    <span className="text-xs text-[var(--neutral-100)]">{fb.date}</span>
                  </div>
                  <div className="text-xs text-[var(--neutral-100)] mb-2">{process?.title}</div>
                  <div className="flex gap-3">
                    {fb.answers.filter((a) => a.rating).slice(0, 4).map((a, i) => (
                      <div key={i} className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} className={s <= (a.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />
                        ))}
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
