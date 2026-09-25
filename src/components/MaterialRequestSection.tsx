import React, { useState } from 'react';
import { MaterialItem, MaterialRequest } from '../types';
import { PRESET_MATERIAL_OPTIONS } from '../data/initialData';
import { 
  Package, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Truck, 
  ListPlus,
  Trash2
} from 'lucide-react';

interface MaterialRequestSectionProps {
  jobId: string;
  jobTitle: string;
  leadTechnician: string;
  existingRequests: MaterialRequest[];
  onSubmitRequest: (request: MaterialRequest) => void;
}

export const MaterialRequestSection: React.FC<MaterialRequestSectionProps> = ({
  jobId,
  jobTitle,
  leadTechnician,
  existingRequests,
  onSubmitRequest,
}) => {
  // Quantities for preset items
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Țeavă Cupru 22mm (m)': 10,
    'Fitinguri Presare 3/4': 6,
    'Freon R32 (kg)': 0,
    'Izolație Armaflex': 12,
    'Supapă Siguranță': 0,
    'Consolă Metalică Unitate Exterioară': 0,
  });

  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Critic'>('Normal');
  const [notes, setNotes] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState<number>(1);
  const [customItemUnit, setCustomItemUnit] = useState('buc');
  const [customItems, setCustomItems] = useState<{ name: string; quantity: number; unit: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIncrement = (name: string) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }));
  };

  const handleDecrement = (name: string) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) - 1),
    }));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    setCustomItems((prev) => [
      ...prev,
      {
        name: customItemName.trim(),
        quantity: Math.max(1, customItemQty),
        unit: customItemUnit,
      },
    ]);
    setCustomItemName('');
    setCustomItemQty(1);
  };

  const handleRemoveCustomItem = (index: number) => {
    setCustomItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Compile active selected items
  const activePresetItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([name, qty]) => {
      const preset = PRESET_MATERIAL_OPTIONS.find((p) => p.name === name);
      return {
        name,
        quantity: qty,
        unit: preset ? preset.defaultUnit : 'buc',
      };
    });

  const allSelectedItems = [...activePresetItems, ...customItems];

  const handleSendToOffice = () => {
    if (allSelectedItems.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `Astăzi, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newRequest: MaterialRequest = {
        id: `req-${Date.now().toString().slice(-4)}`,
        jobId,
        jobTitle,
        leadTechnician,
        team: 'Echipa pe Teren',
        items: allSelectedItems,
        urgency,
        notes: notes.trim() || 'Comandă transmisă direct din aplicația tehnicianului.',
        requestedAt: timeStr,
        status: 'În așteptare',
      };

      onSubmitRequest(newRequest);
      setIsSubmitting(false);

      // Reset counters
      setQuantities({
        'Țeavă Cupru 22mm (m)': 0,
        'Fitinguri Presare 3/4': 0,
        'Freon R32 (kg)': 0,
        'Izolație Armaflex': 0,
        'Supapă Siguranță': 0,
        'Consolă Metalică Unitate Exterioară': 0,
      });
      setCustomItems([]);
      setNotes('');
    }, 600);
  };

  const filteredRequests = existingRequests.filter((r) => r.jobId === jobId);

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Necesar Materiale & Piese de Schimb
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {allSelectedItems.length} articole selectate
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Selectați cantitățile necesare pentru intervenție. Cererea ajunge instant la gestionarul de depozit și la conducere.
        </p>

        {/* Preset Items Counters Grid */}
        <div className="space-y-2.5">
          {PRESET_MATERIAL_OPTIONS.slice(0, 6).map((preset) => {
            const currentQty = quantities[preset.name] || 0;
            return (
              <div
                key={preset.name}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  currentQty > 0
                    ? 'bg-slate-800/90 border-blue-500/40 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold truncate text-slate-100">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Unitate: <span className="font-mono text-slate-300">{preset.defaultUnit}</span> · {preset.category}
                  </div>
                </div>

                {/* Counter Stepper with minimum 44px hitboxes */}
                <div className="flex items-center gap-2 shrink-0 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => handleDecrement(preset.name)}
                    disabled={currentQty === 0}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 flex items-center justify-center transition-colors min-h-[32px] min-w-[32px]"
                    title="Scade cantitate"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center text-xs font-bold font-mono text-white tabular-nums">
                    {currentQty}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleIncrement(preset.name)}
                    className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors min-h-[32px] min-w-[32px]"
                    title="Adaugă cantitate"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Item Form */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <form onSubmit={handleAddCustomItem} className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
              <ListPlus className="w-3.5 h-3.5 text-blue-400" />
              <span>Adaugă alt articol / piesă specifică:</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 sm:col-span-7">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Denumire piesă / model..."
                  className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  value={customItemQty}
                  onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                  className="w-full px-2 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-3 sm:col-span-3 flex gap-1">
                <select
                  value={customItemUnit}
                  onChange={(e) => setCustomItemUnit(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                >
                  <option value="buc">buc</option>
                  <option value="m">m</option>
                  <option value="kg">kg</option>
                  <option value="set">set</option>
                  <option value="l">litri</option>
                </select>
                <button
                  type="submit"
                  disabled={!customItemName.trim()}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-blue-400 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
                  title="Adaugă în listă"
                >
                  +
                </button>
              </div>
            </div>
          </form>

          {/* Custom Items Added List */}
          {customItems.length > 0 && (
            <div className="mt-2.5 space-y-1.5">
              {customItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-blue-950/40 border border-blue-900/40 text-xs text-blue-200"
                >
                  <span className="truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => handleRemoveCustomItem(idx)}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Urgency & Notes */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Grad de Urgență:</span>
            <div className="flex gap-1.5">
              {(['Normal', 'Urgent', 'Critic'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    urgency === lvl
                      ? lvl === 'Critic'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : lvl === 'Urgent'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mențiuni speciale pentru magazie (ex: livrare la etajul 3, cheia este la pază)..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendToOffice}
            disabled={allSelectedItems.length === 0 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Se transmite către depozit & conducere...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  Trimite Necesar la Birou ({allSelectedItems.length} articole)
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History of Sent Requests for this Job */}
      {filteredRequests.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Cereri Trimise Anterior pe Acest Șantier</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredRequests.length} cereri
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-semibold">{req.id}</span>
                    <span className="text-slate-400 font-normal">· {req.requestedAt}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'Aprobat'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : req.status === 'Comandat de la furnizor'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-slate-300 space-y-0.5 pl-2 border-l-2 border-slate-800">
                  {req.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-slate-400">{it.name}</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {it.quantity} {it.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {req.notes && (
                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    Nota: "{req.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
