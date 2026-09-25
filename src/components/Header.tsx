import React from 'react';
import { 
  Smartphone, 
  Building2, 
  PhoneCall, 
  Wifi, 
  Wrench, 
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentRole: 'technician' | 'management';
  onRoleChange: (role: 'technician' | 'management') => void;
  mobileFrameMode: boolean;
  onToggleMobileFrame: () => void;
  onCallDispatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  mobileFrameMode,
  onToggleMobileFrame,
  onCallDispatch,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark & Discipline */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-900/40 text-white">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white truncate font-display">
                  ClimaTech Operations
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dispecerat Activ
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                Instalații Sanitare · Termice · Climatizare & Ventilare
              </p>
            </div>
          </div>

          {/* Zone 2: Role Switcher Segmented Control */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onRoleChange('technician')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap min-h-[36px] ${
                currentRole === 'technician'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Comută pe interfața mobilă a tehnicianului pe teren"
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>📱 Tehnician pe Șantier</span>
            </button>
            <button
              onClick={() => onRoleChange('management')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap min-h-[36px] ${
                currentRole === 'management'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Comută pe panoul de comandă și dispecerat birou"
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>🏢 Birou / Management</span>
            </button>
          </div>

          {/* Zone 3: Quick Action Affordances */}
          <div className="flex items-center gap-2 shrink-0">
            {currentRole === 'technician' && (
              <button
                onClick={onToggleMobileFrame}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors whitespace-nowrap"
                title={mobileFrameMode ? "Afișează lățime completă" : "Simulează ecran telefon mobil 390px"}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{mobileFrameMode ? "Vizualizare Fluidă" : "Simulare Telefon"}</span>
              </button>
            )}

            <button
              onClick={onCallDispatch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors text-xs font-medium whitespace-nowrap min-h-[36px]"
              title="Apelează Dispeceratul Central ClimaTech"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dispecerat:</span>
              <span className="font-semibold tabular-nums">021 9410</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
