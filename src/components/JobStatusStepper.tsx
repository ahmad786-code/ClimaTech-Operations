import React from 'react';
import { JobStatus } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  PauseCircle, 
  MapPin, 
  Sparkles
} from 'lucide-react';

interface JobStatusStepperProps {
  currentStatus: JobStatus;
  onStatusChange: (newStatus: JobStatus) => void;
}

interface StepItem {
  id: JobStatus;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBg: string;
  activeBorder: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: 'Am ajuns pe șantier',
    label: 'Am ajuns pe șantier',
    shortLabel: 'La locație',
    icon: MapPin,
    accentColor: 'text-amber-400',
    activeBg: 'bg-amber-500/20 text-amber-300',
    activeBorder: 'border-amber-500/50',
    description: 'Verificare SSM, acces în spațiu tehnic și pregătire scule',
  },
  {
    id: 'În lucru',
    label: 'În lucru',
    shortLabel: 'În lucru',
    icon: PlayCircle,
    accentColor: 'text-blue-400',
    activeBg: 'bg-blue-600 text-white',
    activeBorder: 'border-blue-500',
    description: 'Montaj circuite, presare fitinguri, conexiuni electrice & frigorifice',
  },
  {
    id: 'Pauză / Necesar Piese',
    label: 'Pauză / Necesar Piese',
    shortLabel: 'Pauză / Piese',
    icon: PauseCircle,
    accentColor: 'text-orange-400',
    activeBg: 'bg-orange-500/20 text-orange-300',
    activeBorder: 'border-orange-500/50',
    description: 'Așteptare piese suplimentare sau aprobare de la birou',
  },
  {
    id: 'Finalizat',
    label: 'Finalizat',
    shortLabel: 'Finalizat',
    icon: CheckCircle2,
    accentColor: 'text-emerald-400',
    activeBg: 'bg-emerald-600 text-white',
    activeBorder: 'border-emerald-500',
    description: 'Proba de etanșeitate efectuată, zonă curățată, PV semnat',
  },
];

export const JobStatusStepper: React.FC<JobStatusStepperProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStatus);
  const activeStep = STEPS[currentStepIndex] || STEPS[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status Intervenție
          </span>
          <span className="text-xs text-slate-500">· One-Tap Update</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-slate-200">{currentStatus}</span>
        </div>
      </div>

      {/* Stepper Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = currentStatus === step.id;
          const isCompleted = idx < currentStepIndex && currentStatus !== 'Pauză / Necesar Piese';

          return (
            <button
              key={step.id}
              onClick={() => onStatusChange(step.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 min-h-[58px] active:scale-[0.98] ${
                isSelected
                  ? `${step.activeBg} ${step.activeBorder} shadow-lg shadow-black/30 font-semibold ring-1 ring-white/20`
                  : isCompleted
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-current' : step.accentColor}`} />
                <span className="text-xs tracking-tight line-clamp-1">
                  {step.shortLabel}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 opacity-90 hidden sm:block truncate max-w-full">
                Pasul {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Context info for current step */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-slate-300 truncate">{activeStep.description}</span>
        </span>
        <span className="text-[11px] text-emerald-400 shrink-0 ml-2 font-mono">
          ✓ Biroul Notificat
        </span>
      </div>
    </div>
  );
};
