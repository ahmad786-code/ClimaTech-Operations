import React, { useState, useRef } from 'react';
import { PhotoRecord } from '../types';
import { 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  X, 
  ZoomIn, 
  MapPin, 
  Clock, 
  UserCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

interface PhotoUploadSectionProps {
  photos: PhotoRecord[];
  onAddPhoto: (photo: PhotoRecord) => void;
  leadTechnician: string;
  jobAddress: string;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  photos,
  onAddPhoto,
  leadTechnician,
  jobAddress,
}) => {
  const [selectedType, setSelectedType] = useState<'before' | 'after'>('after');
  const [caption, setCaption] = useState('');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [inspectPhoto, setInspectPhoto] = useState<PhotoRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const beforePhotos = photos.filter((p) => p.type === 'before');
  const afterPhotos = photos.filter((p) => p.type === 'after');

  // Quick preset shots frequently used by HVAC technicians
  const photoPresets = [
    {
      title: 'Proba de Presiune Azot (Manometru 38 bar)',
      url: '/src/assets/images/hvac_vrf_rooftop_1790330824912.jpg',
      type: 'after' as const,
    },
    {
      title: 'Distribuitor Încălzire Pardoseală & PEX',
      url: '/src/assets/images/floor_heating_manifold_1790330844569.jpg',
      type: 'after' as const,
    },
    {
      title: 'Canalizare & Goluri Tehnice Neizolate',
      url: '/src/assets/images/plumbing_before_rough_1790330879129.jpg',
      type: 'before' as const,
    },
    {
      title: 'Tubulatură Spirală & Filtru F7 Montat',
      url: '/src/assets/images/hvac_vent_duct_1790330863139.jpg',
      type: 'after' as const,
    },
  ];

  const handleSimulateCapture = (presetUrl?: string, presetCaption?: string) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `Astăzi, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newPhoto: PhotoRecord = {
        id: `p-${Date.now()}`,
        type: selectedType,
        url: presetUrl || (selectedType === 'before' ? '/src/assets/images/plumbing_before_rough_1790330879129.jpg' : '/src/assets/images/hvac_vrf_rooftop_1790330824912.jpg'),
        caption: presetCaption || caption || (selectedType === 'before' ? 'Constatare inițială șantier' : 'Lucrare executată conform normativului'),
        timestamp: timeStr,
        technicianName: leadTechnician,
      };

      onAddPhoto(newPhoto);
      setIsSimulatingUpload(false);
      setCaption('');
    }, 700);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSimulatingUpload(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const now = new Date();
        const timeStr = `Astăzi, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        onAddPhoto({
          id: `p-${Date.now()}`,
          type: selectedType,
          url: reader.result as string,
          caption: caption || `${file.name.substring(0, 20)} - Poză șantier`,
          timestamp: timeStr,
          technicianName: leadTechnician,
        });
        setIsSimulatingUpload(false);
        setCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Trigger Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              <span>Documentare Foto Șantier</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pozele se sincronizează automat în timp real cu dosarul de la sediu
            </p>
          </div>

          {/* Type Selector (Înainte / După) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-stretch sm:self-auto">
            <button
              onClick={() => setSelectedType('before')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedType === 'before'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Înainte de Lucrare
            </button>
            <button
              onClick={() => setSelectedType('after')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedType === 'after'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              După Lucrare
            </button>
          </div>
        </div>

        {/* Caption Input */}
        <div className="mb-3">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Descriere poză (ex: Proba etanșeitate 38 bar, traseu etaj 2)..."
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Main Simulated Phone Camera Button */}
          <button
            onClick={() => handleSimulateCapture()}
            disabled={isSimulatingUpload}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all min-h-[44px]"
          >
            {isSimulatingUpload ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Se încarcă poza pe server...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Adaugă Poză de pe Telefon</span>
              </>
            )}
          </button>

          {/* Native File Pick / Gallery upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors min-h-[44px]"
            title="Alege fișier din galeria telefonului"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Din Galerie</span>
          </button>
        </div>

        {/* Quick presets row */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium text-slate-400">Presetări rapide de pe șantier:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {photoPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateCapture(preset.url, preset.title)}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 transition-colors truncate max-w-[280px]"
              >
                + {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Before & After Photo Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SECTION: ÎNAINTE DE INTERVENȚIE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Înainte de Intervenție
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {beforePhotos.length} {beforePhotos.length === 1 ? 'poză' : 'poze'}
            </span>
          </div>

          {beforePhotos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-center">
              <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 font-medium">Nicio poză încărcată pentru faza inițială</p>
              <button
                onClick={() => {
                  setSelectedType('before');
                  handleSimulateCapture(photoPresets[2].url, 'Constatare terasă tehnică și trasee');
                }}
                className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                + Încarcă poză de constatare
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {beforePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    {/* Timestamp & Tech Watermark Overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 border border-amber-500/30">
                      <span>FAZA: ÎNAINTE</span>
                    </div>

                    <button
                      onClick={() => setInspectPhoto(photo)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                      title="Mărește poza"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">
                        {photo.caption}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-300 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {photo.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          {photo.technicianName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION: DUPĂ INTERVENȚIE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                După Intervenție (Final / Montaj)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {afterPhotos.length} {afterPhotos.length === 1 ? 'poză' : 'poze'}
            </span>
          </div>

          {afterPhotos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-center">
              <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 font-medium">Nicio poză de finalizare adăugată</p>
              <button
                onClick={() => {
                  setSelectedType('after');
                  handleSimulateCapture(photoPresets[0].url, 'Montaj finalizat & probă de presiune');
                }}
                className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                + Încarcă poză de recepție
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {afterPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* Badge Overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                      <span>FAZA: DUPĂ</span>
                    </div>

                    <button
                      onClick={() => setInspectPhoto(photo)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                      title="Mărește poza"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">
                        {photo.caption}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-300 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {photo.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          {photo.technicianName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Lightbox for Zoom inspection */}
      {inspectPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 text-white">
              <span className="text-xs font-bold text-slate-300">
                Detaliu Foto Șantier ({inspectPhoto.type === 'before' ? 'Înainte' : 'După Intervenție'})
              </span>
              <button
                onClick={() => setInspectPhoto(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[4/3] bg-black">
              <img
                src={inspectPhoto.url}
                alt={inspectPhoto.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-950 text-white space-y-1.5">
              <p className="text-sm font-semibold">{inspectPhoto.caption}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {jobAddress}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {inspectPhoto.timestamp}
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {inspectPhoto.technicianName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
