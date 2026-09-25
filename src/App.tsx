import React, { useState } from 'react';
import { 
  Job, 
  JobStatus, 
  PhotoRecord, 
  MaterialRequest, 
  ActivityItem, 
  TechnicianShift 
} from './types';
import { 
  INITIAL_JOBS, 
  INITIAL_REQUESTS, 
  INITIAL_ACTIVITIES, 
  INITIAL_SHIFTS 
} from './data/initialData';
import { Header } from './components/Header';
import { TechnicianView } from './components/TechnicianView';
import { ManagementView } from './components/ManagementView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { PVModal } from './components/PVModal';
import { 
  Wrench, 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  Clock, 
  X,
  Phone
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'technician' | 'management'>('technician');
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);
  const [activeJobId, setActiveJobId] = useState<string>('job-1');

  // Application Data States
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(INITIAL_REQUESTS);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [technicianShifts, setTechnicianShifts] = useState<TechnicianShift[]>(INITIAL_SHIFTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pvModalJob, setPvModalJob] = useState<Job | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Helper for adding notifications
  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to log activities in real-time feed
  const logActivity = (
    type: ActivityItem['type'],
    technician: string,
    jobTitle: string,
    description: string
  ) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp,
      type,
      technician,
      jobTitle,
      description,
    };
    setActivityFeed((prev) => [newActivity, ...prev]);
  };

  // Handler: Status Stepper Update
  const handleUpdateJobStatus = (jobId: string, newStatus: JobStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );

    const targetJob = jobs.find((j) => j.id === jobId);
    const jobTitle = targetJob?.title || 'Șantier';
    const techName = targetJob?.leadTechnician || 'Tehnician';

    logActivity(
      'status_change',
      techName,
      jobTitle,
      `Status actualizat în "${newStatus}". Notificare transmisă dispeceratului.`
    );

    showToast(
      'success',
      'Status Șantier Actualizat',
      `Intervenția este marcată acum ca: "${newStatus}".`
    );

    // If marked as finalizat, update shift status if needed
    if (newStatus === 'Finalizat') {
      showToast(
        'info',
        'Lucrare Finalizată',
        'Puteți genera Procesul Verbal de Recepție pentru semnătura clientului.'
      );
    }
  };

  // Handler: Add Photo
  const handleAddPhoto = (jobId: string, photo: PhotoRecord) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            photos: [photo, ...job.photos],
          };
        }
        return job;
      })
    );

    const targetJob = jobs.find((j) => j.id === jobId);
    logActivity(
      'photo_upload',
      photo.technicianName,
      targetJob?.title || 'Șantier',
      `Poză nouă încărcată (${photo.type === 'before' ? 'Înainte' : 'După Intervenție'}): "${photo.caption}".`
    );

    showToast(
      'success',
      'Poză Salvată cu Succes',
      `Fotografia a fost atașată dosarului tehnic și sincronizată cu biroul.`
    );
  };

  // Handler: Submit Material Request
  const handleSubmitMaterialRequest = (newRequest: MaterialRequest) => {
    setMaterialRequests((prev) => [newRequest, ...prev]);

    logActivity(
      'material_request',
      newRequest.leadTechnician,
      newRequest.jobTitle,
      `Cerere de piese transmisă (${newRequest.items.length} articole): ${newRequest.items.map((i) => `${i.quantity} ${i.unit} ${i.name}`).join(', ')}.`
    );

    showToast(
      'success',
      'Necesar Materiale Transmis',
      `Cererea cu ${newRequest.items.length} articole a fost înregistrată la depozit și birou.`
    );
  };

  // Handler: Add Daily Technical Note
  const handleAddNote = (jobId: string, note: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            dailyNotes: [note, ...job.dailyNotes],
          };
        }
        return job;
      })
    );

    const targetJob = jobs.find((j) => j.id === jobId);
    logActivity(
      'status_change',
      targetJob?.leadTechnician || 'Tehnician',
      targetJob?.title || 'Șantier',
      `Notă adăugată în jurnalul tehnic: "${note}".`
    );

    showToast('success', 'Notă Salvată', 'Înregistrarea a fost salvată în raportul zilnic de execuție.');
  };

  // Management Handlers: Approve Request
  const handleApproveRequest = (requestId: string) => {
    const req = materialRequests.find((r) => r.id === requestId);
    if (!req) return;

    setMaterialRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Aprobat' } : r))
    );

    logActivity(
      'approval',
      'Inginer Șef Dispecerat',
      req.jobTitle,
      `Cererea ${requestId} a fost APROBATĂ. Piesele sunt pregătite pentru eliberare la depozitul central.`
    );

    showToast(
      'success',
      'Cerere de Materiale Aprobată',
      `Comanda ${requestId} a fost aprobată. Tehnicianul a fost notificat pe teren.`
    );
  };

  // Management Handlers: Order from Supplier
  const handleOrderFromSupplier = (requestId: string) => {
    const req = materialRequests.find((r) => r.id === requestId);
    if (!req) return;

    setMaterialRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Comandat de la furnizor' } : r))
    );

    logActivity(
      'material_request',
      'Achiziții Birou',
      req.jobTitle,
      `Comanda externă plasată către furnizor pentru cererea ${requestId}. Livrare estimată în 2 ore.`
    );

    showToast(
      'info',
      'Comandă Plasată la Furnizor',
      `S-a transmis comanda pentru piesele solicitate pe șantier.`
    );
  };

  // Select job and switch to technician view if called from office
  const handleSelectJobFromOffice = (jobId: string) => {
    setActiveJobId(jobId);
    setCurrentRole('technician');
    showToast('info', 'Șantier Selectat', 'Comutat pe vizualizarea mobilă a tehnicianului.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        mobileFrameMode={mobileFrameMode}
        onToggleMobileFrame={() => setMobileFrameMode(!mobileFrameMode)}
        onCallDispatch={() => setIsCallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-6 py-4">
        {currentRole === 'technician' ? (
          <TechnicianView
            jobs={jobs}
            activeJobId={activeJobId}
            onSelectJob={setActiveJobId}
            onUpdateJobStatus={handleUpdateJobStatus}
            onAddPhoto={handleAddPhoto}
            onSubmitMaterialRequest={handleSubmitMaterialRequest}
            onAddNote={handleAddNote}
            existingRequests={materialRequests}
            mobileFrameMode={mobileFrameMode}
            onOpenPVModal={(job) => setPvModalJob(job)}
          />
        ) : (
          <ManagementView
            jobs={jobs}
            materialRequests={materialRequests}
            activityFeed={activityFeed}
            technicianShifts={technicianShifts}
            onApproveRequest={handleApproveRequest}
            onOrderFromSupplier={handleOrderFromSupplier}
            onSelectJob={handleSelectJobFromOffice}
            onOpenPVModal={(job) => setPvModalJob(job)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-4 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">ClimaTech Operations</span>
            <span>·</span>
            <span>Instalații Sanitare, Termice, Climatizare VRF & Ventilare</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Dispecerat Central: 021 9410</span>
            <span>·</span>
            <span>București & Ilfov</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Sistem Online v2.4</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Proces-Verbal Modal */}
      {pvModalJob && (
        <PVModal
          job={pvModalJob}
          isOpen={!!pvModalJob}
          onClose={() => setPvModalJob(null)}
          onSignSuccess={() => {
            showToast(
              'success',
              'PV Recepție Semnat',
              'Documentul a fost salvat și transmis către client și contabilitate.'
            );
          }}
        />
      )}

      {/* Quick Dispatch Call Modal */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full mx-auto flex items-center justify-center">
              <PhoneCall className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dispecerat ClimaTech 24/7</h3>
              <p className="text-xs text-slate-400 mt-1">
                Linie directă pentru asistență tehnică, aprovizionare urgentă și intervenții
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-lg font-bold text-emerald-300">
              021 9410 / +40 722 000 941
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCallModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Anulează
              </button>
              <a
                href="tel:0219410"
                onClick={() => setIsCallModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Apelează Acum</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
