'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  Mail,
  Briefcase,
  Building2,
  CalendarDays,
  Users,
  Compass,
  Heart,
  Sparkles,
  UserCheck,
  Check,
} from 'lucide-react';
import employees from '@/data/employees.json';

const departments = [
  'Engineering',
  'Design',
  'Product',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
];

const steps = [
  { label: 'Persönliche Infos', icon: <User size={15} /> },
  { label: 'Onboarding-Team', icon: <Users size={15} /> },
  { label: 'Zusammenfassung', icon: <CheckCircle2 size={15} /> },
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  isDone
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                    : isActive
                    ? 'border-[var(--primary)] text-[var(--primary)] bg-white'
                    : 'border-[var(--neutral-30)] text-[var(--neutral-100)] bg-white'
                }`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  isActive ? 'text-[var(--neutral-800)]' : 'text-[var(--neutral-100)]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 min-w-[40px] ${
                  isDone ? 'bg-[var(--primary)]' : 'bg-[var(--neutral-30)]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function NewEmployeePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState('');

  // Step 2
  const [fachLotse, setFachLotse] = useState('');
  const [kulturLotse, setKulturLotse] = useState('');
  const [deciderGroup, setDeciderGroup] = useState<string[]>([]);
  const [personal, setPersonal] = useState('emp-008'); // Marina als Default

  const toggleDecider = (id: string) => {
    setDeciderGroup((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const step1Valid = firstName && lastName && email && role && department && startDate;
  const step2Valid = fachLotse && kulturLotse && deciderGroup.length > 0 && personal;

  const initials = getInitials(firstName || 'N', lastName || 'N');

  const getEmp = (id: string) => employees.find((e) => e.id === id);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#E3FCEF] text-[#00875A] flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          Onboarding gestartet!
        </h2>
        <p className="text-[var(--neutral-200)]">
          <strong>{firstName} {lastName}</strong> wurde angelegt und das Onboarding wurde gestartet.
          Das Onboarding-Team wurde automatisch benachrichtigt.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#013438] transition-colors"
          >
            Zum Onboarding-Überblick
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setFirstName(''); setLastName(''); setEmail(''); setRole('');
              setDepartment(''); setStartDate('');
              setFachLotse(''); setKulturLotse(''); setDeciderGroup([]); setPersonal('emp-008');
            }}
            className="px-4 py-2.5 border border-[var(--neutral-30)] text-[var(--neutral-800)] rounded-lg text-sm font-medium hover:bg-[var(--neutral-20)] transition-colors"
          >
            Weiteren Mitarbeiter anlegen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/onboarding"
          className="p-2 hover:bg-[var(--neutral-20)] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[var(--neutral-200)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Neuen Mitarbeiter anlegen</h1>
          <p className="text-sm text-[var(--neutral-200)] mt-0.5">
            Mitarbeiterprofil erstellen und Onboarding direkt starten
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
        <StepIndicator current={step} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STEP 1: Persönliche Informationen                                    */}
      {/* ------------------------------------------------------------------ */}
      {step === 0 && (
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Persönliche Informationen</h2>

          {/* Avatar Preview */}
          {(firstName || lastName) && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--primary-light)]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-lg font-bold">
                {initials}
              </div>
              <div>
                <div className="font-semibold text-[var(--neutral-800)]">
                  {firstName} {lastName}
                </div>
                {role && <div className="text-sm text-[var(--neutral-200)]">{role}{department ? ` · ${department}` : ''}</div>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Vorname */}
            <div>
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                Vorname *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="z. B. Sarah"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* Nachname */}
            <div>
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                Nachname *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="z. B. Müller"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* E-Mail */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                E-Mail *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.mueller@seibert.group"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* Rolle */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                Position / Rolle *
              </label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="z. B. Junior Frontend Developer"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* Abteilung */}
            <div>
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                Abteilung *
              </label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none bg-white text-[var(--neutral-800)]"
                >
                  <option value="">Abteilung wählen</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Startdatum */}
            <div>
              <label className="block text-xs font-semibold text-[var(--neutral-800)] mb-1.5 uppercase tracking-wider">
                Startdatum *
              </label>
              <div className="relative">
                <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-100)]" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* KI-Hinweis */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#02464B] to-[#0A7075] text-white">
            <Sparkles size={16} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90 leading-relaxed">
              Das Onboarding wird automatisch mit allen 8 Standardphasen gestartet. IFC-Fragebogen werden nach 5 und 13 Wochen automatisch versendet.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 2: Onboarding-Team                                              */}
      {/* ------------------------------------------------------------------ */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Onboarding-Team zuweisen</h2>
          <p className="text-sm text-[var(--neutral-200)] -mt-3">
            Wer begleitet <strong>{firstName} {lastName}</strong> beim Onboarding?
          </p>

          {/* Fachlicher Lotse */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--neutral-800)] mb-2 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-full bg-[#E6F3F3] text-[#0A7075] flex items-center justify-center">
                <Compass size={11} />
              </div>
              Fachlicher Lotse *
            </label>
            <p className="text-xs text-[var(--neutral-100)] mb-3">
              Begleitet fachlich und erklärt Prozesse, Tools und Strukturen.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {employees.filter((e) => e.id !== 'emp-008').map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setFachLotse(emp.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                    fachLotse === emp.id
                      ? 'border-[#0A7075] bg-[#E6F3F3]'
                      : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0A7075] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--neutral-800)] truncate">{emp.name}</div>
                    <div className="text-[10px] text-[var(--neutral-100)] truncate">{emp.role}</div>
                  </div>
                  {fachLotse === emp.id && <CheckCircle2 size={16} className="text-[#0A7075] ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Kultureller Lotse */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--neutral-800)] mb-2 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-full bg-[#E0F0F1] text-[#02464B] flex items-center justify-center">
                <Heart size={11} />
              </div>
              Kultureller Lotse *
            </label>
            <p className="text-xs text-[var(--neutral-100)] mb-3">
              Begleitet kulturell, checkt Wohlbefinden und ist Ansprechperson bei Fragen zur Seibert-Kultur.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {employees.filter((e) => e.id !== 'emp-008').map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setKulturLotse(emp.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                    kulturLotse === emp.id
                      ? 'border-[#02464B] bg-[#E0F0F1]'
                      : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#02464B] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--neutral-800)] truncate">{emp.name}</div>
                    <div className="text-[10px] text-[var(--neutral-100)] truncate">{emp.role}</div>
                  </div>
                  {kulturLotse === emp.id && <CheckCircle2 size={16} className="text-[#02464B] ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Decider Group */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--neutral-800)] mb-2 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-full bg-[#FFF7E6] text-[#FF8B00] flex items-center justify-center">
                <Users size={11} />
              </div>
              Decider Group *
            </label>
            <p className="text-xs text-[var(--neutral-100)] mb-3">
              Gibt Feedback zu Zielen und Meilensteinen. Mehrfachauswahl möglich.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {employees.filter((e) => e.id !== 'emp-008').map((emp) => {
                const selected = deciderGroup.includes(emp.id);
                return (
                  <button
                    key={emp.id}
                    onClick={() => toggleDecider(emp.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      selected
                        ? 'border-[#FF8B00] bg-[#FFF7E6]'
                        : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF8B00] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {emp.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--neutral-800)] truncate">{emp.name}</div>
                      <div className="text-[10px] text-[var(--neutral-100)] truncate">{emp.role}</div>
                    </div>
                    {selected && <CheckCircle2 size={16} className="text-[#FF8B00] ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            {deciderGroup.length > 0 && (
              <div className="mt-2 text-xs text-[#FF8B00] font-medium">
                {deciderGroup.length} Person{deciderGroup.length > 1 ? 'en' : ''} ausgewählt
              </div>
            )}
          </div>

          {/* HR Verantwortlich */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--neutral-800)] mb-2 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-full bg-[#F4F5F7] text-[#6B778C] flex items-center justify-center">
                <UserCheck size={11} />
              </div>
              HR-Verantwortliche/r *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {employees.filter((e) => e.department === 'Human Resources').map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setPersonal(emp.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                    personal === emp.id
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                      : 'border-[var(--neutral-30)] hover:border-[var(--neutral-40)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--neutral-800)] truncate">{emp.name}</div>
                    <div className="text-[10px] text-[var(--neutral-100)] truncate">{emp.role}</div>
                  </div>
                  {personal === emp.id && <CheckCircle2 size={16} className="text-[var(--primary)] ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 3: Zusammenfassung                                              */}
      {/* ------------------------------------------------------------------ */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Mitarbeiter-Card */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
            <h2 className="text-sm font-semibold text-[var(--neutral-800)] mb-4 uppercase tracking-wider text-xs">
              Neuer Mitarbeiter
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#02464B] to-[#0A7075] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[var(--neutral-800)]">{firstName} {lastName}</div>
                <div className="text-sm text-[var(--neutral-200)]">{role}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                    <Building2 size={11} /> {department}
                  </span>
                  <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                    <CalendarDays size={11} /> Start: {startDate}
                  </span>
                  <span className="text-xs text-[var(--neutral-100)] flex items-center gap-1">
                    <Mail size={11} /> {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team-Card */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
            <h2 className="text-xs font-semibold text-[var(--neutral-800)] mb-4 uppercase tracking-wider">
              Onboarding-Team
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Fachlicher Lotse */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E6F3F3]/50 border border-[#E6F3F3]">
                <div className="w-9 h-9 rounded-full bg-[#0A7075] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getEmp(fachLotse)?.avatar}
                </div>
                <div>
                  <div className="text-[10px] text-[#0A7075] font-semibold uppercase tracking-wider">Fachl. Lotse</div>
                  <div className="text-sm font-medium text-[var(--neutral-800)]">{getEmp(fachLotse)?.name}</div>
                </div>
              </div>
              {/* Kultureller Lotse */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E0F0F1]/50 border border-[#E0F0F1]">
                <div className="w-9 h-9 rounded-full bg-[#02464B] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getEmp(kulturLotse)?.avatar}
                </div>
                <div>
                  <div className="text-[10px] text-[#02464B] font-semibold uppercase tracking-wider">Kult. Lotse</div>
                  <div className="text-sm font-medium text-[var(--neutral-800)]">{getEmp(kulturLotse)?.name}</div>
                </div>
              </div>
              {/* Decider Group */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#FFF7E6]/50 border border-[#FFF7E6] col-span-2">
                <div className="w-9 h-9 rounded-full bg-[#FF8B00] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  DG
                </div>
                <div>
                  <div className="text-[10px] text-[#FF8B00] font-semibold uppercase tracking-wider mb-1">Decider Group</div>
                  <div className="flex flex-wrap gap-1.5">
                    {deciderGroup.map((id) => (
                      <span key={id} className="px-2 py-0.5 rounded-full text-xs bg-[#FFF7E6] text-[#FF8B00] border border-[#FFCC88] font-medium">
                        {getEmp(id)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* HR */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--primary-light)]/50 border border-[var(--primary-light)] col-span-2">
                <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getEmp(personal)?.avatar}
                </div>
                <div>
                  <div className="text-[10px] text-[var(--primary)] font-semibold uppercase tracking-wider">HR-Verantwortlich</div>
                  <div className="text-sm font-medium text-[var(--neutral-800)]">{getEmp(personal)?.name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* IFC-Automation-Vorschau */}
          <div className="bg-white rounded-xl border border-[var(--neutral-30)] p-5">
            <h2 className="text-xs font-semibold text-[var(--neutral-800)] mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={13} className="text-[var(--primary)]" />
              Automatische IFC-Trigger
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '1. IFC-Fragebogen', weeks: 5 },
                { label: '2. IFC-Fragebogen', weeks: 13 },
              ].map((ifc) => {
                const triggerDate = startDate
                  ? new Date(new Date(startDate).getTime() + ifc.weeks * 7 * 24 * 60 * 60 * 1000)
                      .toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : '—';
                return (
                  <div key={ifc.label} className="p-3 rounded-lg bg-[var(--neutral-10)] border border-[var(--neutral-30)]">
                    <div className="text-xs font-medium text-[var(--neutral-800)]">{ifc.label}</div>
                    <div className="text-xs text-[var(--neutral-100)] mt-0.5">nach {ifc.weeks} Wochen</div>
                    <div className="text-xs font-semibold text-[var(--primary)] mt-1">{triggerDate}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--neutral-30)] text-sm font-medium text-[var(--neutral-800)] hover:bg-[var(--neutral-20)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 ? !step1Valid : !step2Valid}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[#013438] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Weiter
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 size={16} />
            Onboarding starten
          </button>
        )}
      </div>
    </div>
  );
}
