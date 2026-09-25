import React, { useState } from 'react';
import { Job, JobStatus, PhotoRecord, MaterialRequest } from '../types';
import { JobStatusStepper } from './JobStatusStepper';
import { PhotoUploadSection } from './PhotoUploadSection';
import { MaterialRequestSection } from './MaterialRequestSection';
import { DailyReportSection } from './DailyReportSection';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  Users, 
  Truck, 
  Flame, 
  Wind, 
  Droplet, 
  Sparkles,
  FileCheck
} from 'lucide-react';

interface TechnicianViewProps {
  jobs: Job[];
  activeJobId: string;
  onSelectJob: (jobId: string) => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
  onAddPhoto: (jobId: string, photo: PhotoRecord) => void;
  onSubmitMaterialRequest: (request: MaterialRequest) => void;
  onAddNote: (jobId: string, note: string) => void;
  existingRequests: MaterialRequest[];
  mobileFrameMode: boolean;
  onOpenPVModal: (job: Job) => void;
}

export const TechnicianView: React.FC<TechnicianViewProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onUpdateJobStatus,
  onAddPhoto,
  onSubmitMaterialRequest,
  onAddNote,
  existingRequests,
  mobileFrameMode,
  onOpenPVModal,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'photos' | 'materials' | 'notes'>('status');
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(13680); // 3h 48m in seconds

  const currentJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  const formatShiftTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Climatizare VRF':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'Termice & Pardoseală':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Ventilație & Filtrare':
        return <Wind className="w-4 h-4 text-emerald-400" />;
      case 'Instalații Sanitare':
      default:
        return <Droplet className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'În lucru':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Am ajuns pe șantier':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Finalizat':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Pauză / Necesar Piese':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Programat':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const content = (
    <div className="space-y-4">
      {/* Top Field Tech Banner / Check-in Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Andrei Ionescu</span>
              <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded font-mono">Șef Lucrare</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-slate-500" />
                B-104-CLT
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-emerald-400" />
                Pontaj: <strong className="text-emerald-300 tabular-nums">{formatShiftTime(shiftSeconds)}</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCheckedIn(!isCheckedIn)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isCheckedIn
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isCheckedIn ? '✓ Pontat Activ' : 'Începe Pontaj'}
        </button>
      </div>

      {/* JOBS LIST / QUICK CARDS SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Șantiere Alocate Astăzi ({jobs.length})
          </h2>
          <span className="text-[11px] text-slate-500">
            Selectează pentru detalii & unelte
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {jobs.map((job) => {
            const isSelected = job.id === currentJob.id;
            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`group relative rounded-2xl border p-3.5 cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900/95 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800/90 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1 rounded-md bg-slate-800">
                        {getCategoryIcon(job.category)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {job.code}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                      {job.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {job.timeWindow}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Sub-bar with photo & material counts */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium truncate">
                    Client: {job.client}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 font-mono">
                      📸 {job.photos.length} poze
                    </span>
                    <span className="text-slate-400 font-mono">
                      📦 {job.materials.length} piese
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED JOB DETAILED WORKSPACE */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        
        {/* Job Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-900/50">
                {currentJob.code}
              </span>
              <span className="text-xs text-slate-400">
                {currentJob.category}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              {currentJob.title}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{currentJob.address}</span>
            </p>
          </div>

          {/* Quick Communication Actions (Phone & GPS) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${currentJob.clientPhone}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 min-h-[40px] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sună Client</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(currentJob.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 min-h-[40px] transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Navigare Waze/Maps</span>
            </a>
          </div>
        </div>

        {/* 4 INTERACTIVE DETAIL TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'status'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📋 Status & Detalii</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'photos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📸 Poze ({currentJob.photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'materials'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📦 Piese & Necesar</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📝 Raport & Note</span>
          </button>
        </div>

        {/* TAB 1: STATUS STEPPER & TECHNICAL OVERVIEW */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <JobStatusStepper
              currentStatus={currentJob.status}
              onStatusChange={(newStatus) => onUpdateJobStatus(currentJob.id, newStatus)}
            />

            {/* Technical Specs & Equipment Card */}
            <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Specificații Sistem & Echipamente
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {currentJob.systemSpecs.pressureTested ? '✓ Presiune Testată' : 'Test Presiune Necesar'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Echipament / Brand:</span>
                  <span className="font-semibold text-slate-200">{currentJob.systemSpecs.brand || 'Daikin / Viessmann'}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Model & Serie:</span>
                  <span className="font-semibold text-slate-200">{currentJob.systemSpecs.model || 'Conform Proiect'}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Capacitate Tehnică:</span>
                  <span className="font-semibold text-slate-200">{currentJob.systemSpecs.capacity || 'Standard'}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Agent Frigorific / Presiune:</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {currentJob.systemSpecs.refrigerant || 'N/A'} {currentJob.systemSpecs.testPressureBar ? `(${currentJob.systemSpecs.testPressureBar} bar)` : ''}
                  </span>
                </div>
              </div>

              {/* Team on Site */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Echipă: {currentJob.teamMembers.join(' · ')}</span>
                </div>
                <button
                  onClick={() => onOpenPVModal(currentJob)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
                >
                  Vezi PV Recepție
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BEFORE / AFTER PHOTOS */}
        {activeTab === 'photos' && (
          <PhotoUploadSection
            photos={currentJob.photos}
            onAddPhoto={(photo) => onAddPhoto(currentJob.id, photo)}
            leadTechnician={currentJob.leadTechnician}
            jobAddress={currentJob.address}
          />
        )}

        {/* TAB 3: MATERIALS & FIELD REQUESTS */}
        {activeTab === 'materials' && (
          <MaterialRequestSection
            jobId={currentJob.id}
            jobTitle={currentJob.title}
            leadTechnician={currentJob.leadTechnician}
            existingRequests={existingRequests}
            onSubmitRequest={onSubmitMaterialRequest}
          />
        )}

        {/* TAB 4: DAILY REPORT & NOTES */}
        {activeTab === 'notes' && (
          <DailyReportSection
            notes={currentJob.dailyNotes}
            onAddNote={(note) => onAddNote(currentJob.id, note)}
            leadTechnician={currentJob.leadTechnician}
            onOpenPVModal={() => onOpenPVModal(currentJob)}
          />
        )}

      </div>
    </div>
  );

  // If simulated mobile frame mode is enabled on desktop, wrap in realistic smartphone bezel
  if (mobileFrameMode) {
    return (
      <div className="py-4 flex justify-center items-start">
        <div className="w-full max-w-[420px] bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden p-3.5 relative ring-1 ring-slate-800">
          {/* Mobile phone speaker & camera notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
            <span className="w-8 h-1 bg-slate-700 rounded-full"></span>
          </div>

          <div className="max-h-[82vh] overflow-y-auto pr-1">
            {content}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="w-32 h-1 bg-slate-600/50 rounded-full mx-auto mt-3"></div>
        </div>
      </div>
    );
  }

  // Otherwise, clean responsive full container
  return (
    <div className="max-w-4xl mx-auto py-2">
      {content}
    </div>
  );
};
