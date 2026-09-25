import React, { useState } from 'react';
import { 
  FileText, 
  Tag, 
  Save, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Printer, 
  ShieldCheck,
  FileSignature
} from 'lucide-react';

interface DailyReportSectionProps {
  notes: string[];
  onAddNote: (newNote: string) => void;
  leadTechnician: string;
  onOpenPVModal: () => void;
}

const PRESET_TAGS = [
  'Lucrare recepționată de beneficiar',
  'Proba de presiune efectuată (38 bar)',
  'Așteptăm echipament extra',
  'Traseu frigorific izolat & matisat',
  'Conexiune electrică tablou HVAC finalizată',
  'Vidare traseu frigorific sub 500 microni',
];

export const DailyReportSection: React.FC<DailyReportSectionProps> = ({
  notes,
  onAddNote,
  leadTechnician,
  onOpenPVModal,
}) => {
  const [currentNote, setCurrentNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyTag = (tagText: string) => {
    if (currentNote.includes(tagText)) return;
    setCurrentNote((prev) => (prev ? `${prev}. ${tagText}` : tagText));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      onAddNote(currentNote.trim());
      setCurrentNote('');
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Editor Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Raport Tehnic Zilnic & Jurnal Șantier
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {leadTechnician}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Introduceți constatările tehnice, probele funcționale și eventualele blocaje de pe șantier.
        </p>

        {/* Quick Preset Tags */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
            <Tag className="w-3 h-3 text-blue-400" />
            <span>Presetări rapide cu 1-tap:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TAGS.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTag(tag)}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={3}
            placeholder="Scrieți nota tehnică sau constatările intervenției..."
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={!currentNote.trim() || isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all min-h-[44px]"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Se salvează în dosar...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvează Note în Raport</span>
                </>
              )}
            </button>

            {/* Official Document Generator Button */}
            <button
              type="button"
              onClick={onOpenPVModal}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition-colors min-h-[44px]"
              title="Generează Proces Verbal de Recepție a Lucrărilor"
            >
              <FileSignature className="w-4 h-4 text-emerald-400" />
              <span>Generare PV Recepție</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historical Notes Feed */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Jurnal de Note Înregistrate</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {notes.length} înregistrări
          </span>
        </div>

        {notes.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            Nu există note înregistrate încă pe acest șantier.
          </p>
        ) : (
          <div className="space-y-2.5">
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs"
              >
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Înregistrare #{idx + 1}
                  </span>
                  <span className="font-mono text-slate-500">Sincronizat sediu</span>
                </div>
                <p className="text-slate-200 leading-relaxed pl-1">
                  {note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
