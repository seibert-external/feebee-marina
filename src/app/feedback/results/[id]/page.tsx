'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, User } from 'lucide-react';
import feedbackData from '@/data/feedback.json';
import processes from '@/data/processes.json';

export default function FeedbackResultsPage() {
  const params = useParams();
  const fb = feedbackData.find((f) => f.id === params.id);

  if (!fb) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--neutral-200)]">Feedback nicht gefunden.</p>
        <Link href="/feedback" className="text-[var(--primary)] hover:underline text-sm mt-2 block">Zurück</Link>
      </div>
    );
  }

  const process = processes.find((p) => p.id === fb.processId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/feedback" className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Feedback-Details</h1>
          <p className="text-[var(--neutral-200)] mt-0.5 text-sm">{process?.title} · {fb.date}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--neutral-30)]">
          <div className="w-10 h-10 rounded-full bg-[var(--neutral-20)] text-[var(--neutral-200)] flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--neutral-800)]">Anonymes Feedback</div>
            <div className="text-xs text-[var(--neutral-100)]">Erhalten am {fb.date}</div>
          </div>
        </div>

        <div className="space-y-6">
          {fb.answers.map((answer, i) => {
            const question = process?.questions.find((q) => q.id === answer.questionId);
            return (
              <div key={i} className="pb-4 border-b border-[var(--neutral-30)] last:border-0 last:pb-0">
                <div className="text-sm font-medium text-[var(--neutral-800)] mb-2">
                  {question?.text || `Frage ${i + 1}`}
                </div>
                {answer.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={20} className={s <= answer.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--neutral-40)]'} />
                    ))}
                    <span className="ml-2 text-sm text-[var(--neutral-200)]">{answer.rating}/5</span>
                  </div>
                )}
                {answer.text && (
                  <p className="text-sm text-[var(--neutral-200)] bg-[var(--neutral-10)] p-4 rounded-lg mt-2">
                    &ldquo;{answer.text}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
