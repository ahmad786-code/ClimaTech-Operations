import React, { useState } from 'react';
import { Job, MaterialRequest, ActivityItem, TechnicianShift } from '../types';
import { 
  Building2, 
  Users, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Check, 
  ExternalLink, 
  Filter, 
  Flame, 
  Wind, 
  Droplet, 
  FileCheck, 
  Search, 
  ShoppingBag,
  Battery,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ManagementViewProps {
  jobs: Job[];
  materialRequests: MaterialRequest[];
  activityFeed: ActivityItem[];
  technicianShifts: TechnicianShift[];
  onApproveRequest: (requestId: string) => void;
  onOrderFromSupplier: (requestId: string) => void;
  onSelectJob: (jobId: string) => void;
  onOpenPVModal: (job: Job) => void;
}

export const ManagementView: React.FC<ManagementViewProps> = ({
  jobs,
  materialRequests,
  activityFeed,
  technicianShifts,
  onApproveRequest,
  onOrderFromSupplier,
  onSelectJob,
  onOpenPVModal,
}) => {
  const [activityFilter, setActivityFilter] = useState<'all' | 'materials' | 'status' | 'photos'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Metrics
  const activeSitesCount = jobs.filter((j) => j.status === 'În lucru' || j.status === 'Am ajuns pe șantier').length + 2; // +2 other ongoing contract sites
  const totalFieldTechs = 8;
  const pendingRequestsCount = materialRequests.filter((r) => r.status === 'În așteptare').length;
  const completedTodayCount = jobs.filter((j) => j.status === 'Finalizat').length + 2; // +2 completed this morning

  // Filtered Activity Items
  const filteredActivities = activityFeed.filter((act) => {
    if (activityFilter === 'materials') return act.type === 'material_request';
    if (activityFilter === 'status') return act.type === 'status_change';
    if (activityFilter === 'photos') return act.type === 'photo_upload';
    return true;
  });

  // Filtered Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-3">
      
      {/* 1. STAT CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Stat 1: Șantiere Active */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Șantiere Active
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {activeSitesCount}
            </span>
            <span className="text-xs text-blue-400 font-medium">București & Ilfov</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>VRF, Termice, Sanitare & Ventilație</span>
          </div>
        </div>

        {/* Stat 2: Tehnicieni pe Teren */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tehnicieni pe Teren
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {totalFieldTechs}
            </span>
            <span className="text-xs text-emerald-400 font-medium">4 Echipe Active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Toate echipele au făcut check-in SSM
          </div>
        </div>

        {/* Stat 3: Cereri Materiale Noi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cereri Materiale Noi
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
              {pendingRequestsCount}
            </span>
            <span className="text-xs text-amber-400/90 font-medium">
              {pendingRequestsCount > 0 ? 'Necesită Aprobare' : 'Totul procesat'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Cupru, Freon R32 & fitinguri presare
          </div>
        </div>

        {/* Stat 4: Lucrări Finalizate Azi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lucrări Finalizate Azi
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {completedTodayCount}
            </span>
            <span className="text-xs text-emerald-300/80 font-medium">PV Semnate</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Probe presiune & etanșeitate validate
          </div>
        </div>

      </div>

      {/* 2. MAIN 2-COLUMN DASHBOARD (Pending Material Requests & Live Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PENDING MATERIAL REQUESTS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Cereri de Materiale din Teren</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Articole solicitate direct de către șefii de șantier în timpul montajului
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                {pendingRequestsCount} în așteptare
              </span>
            </div>

            {/* Requests Cards List */}
            <div className="mt-4 space-y-3">
              {materialRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Nu există cereri active de materiale în acest moment.
                </div>
              ) : (
                materialRequests.map((req) => {
                  const isPending = req.status === 'În așteptare';
                  const isApproved = req.status === 'Aprobat';
                  const isOrdered = req.status === 'Comandat de la furnizor';

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isPending
                          ? 'bg-slate-950/80 border-amber-500/30 ring-1 ring-amber-500/10'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-90'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              {req.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              · {req.team} ({req.leadTechnician})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                req.urgency === 'Critic'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : req.urgency === 'Urgent'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                            {req.jobTitle}
                          </h4>
                        </div>

                        {/* Status Tag */}
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${
                            isApproved
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : isOrdered
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="my-2.5 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1 text-xs">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Articole cerute:
                        </div>
                        {req.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-200">
                            <span>• {item.name}</span>
                            <span className="font-mono font-bold text-amber-300">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notes from technician */}
                      {req.notes && (
                        <p className="text-xs text-slate-400 italic mb-3">
                          "{req.notes}"
                        </p>
                      )}

                      {/* Interactive Decision Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-500 font-mono">
                          Transmis: {req.requestedAt}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOrderFromSupplier(req.id)}
                            disabled={isOrdered}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              isOrdered
                                ? 'bg-blue-900/30 text-blue-400 border-blue-800 cursor-default'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isOrdered ? 'Comandat Furnizor' : 'Comandă de la Furnizor'}</span>
                          </button>

                          <button
                            onClick={() => onApproveRequest(req.id)}
                            disabled={isApproved}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                              isApproved
                                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800 cursor-default'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 active:scale-[0.98]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isApproved ? 'Aprobat din Depozit' : 'Aprobă Cererea'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SHIFT & ATTENDANCE SUMMARY TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Pontaj & Prezență Echipe în Teren</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitorizare în timp real mașini de intervenție și ore lucrate
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                GPS Telematic Activ
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-3">Tehnician</th>
                    <th className="py-2 pr-3">Șantier Curent</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Autoutilitară</th>
                    <th className="py-2 pr-3 text-right">Ore Pontate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {technicianShifts.map((tech) => (
                    <tr key={tech.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 pr-3 font-semibold text-white whitespace-nowrap">
                        {tech.name}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {tech.role}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-300 whitespace-nowrap">
                        {tech.currentSite}
                      </td>
                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tech.status === 'Pe șantier'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : tech.status === 'În deplasare'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          {tech.status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {tech.vehicle}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono font-bold text-white tabular-nums">
                        {tech.workingHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE ACTIVITY FEED (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Flux Activitate în Timp Real</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actualizări de la tehnicieni, poze și modificări de status
                </p>
              </div>
            </div>

            {/* Quick Filter Segmented Buttons */}
            <div className="mt-3 flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActivityFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activityFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Toate ({activityFeed.length})
              </button>
              <button
                onClick={() => setActivityFilter('materials')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activityFilter === 'materials'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Materiale
              </button>
              <button
                onClick={() => setActivityFilter('status')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activityFilter === 'status'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setActivityFilter('photos')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activityFilter === 'photos'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Poze
              </button>
            </div>

            {/* Live Feed Items */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-[11px] ${
                      act.type === 'photo_upload'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                        : act.type === 'material_request'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        : act.type === 'approval'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                    }`}
                  >
                    {act.type === 'photo_upload' && '📸'}
                    {act.type === 'material_request' && '📦'}
                    {act.type === 'approval' && '✓'}
                    {act.type === 'status_change' && '⚡'}
                    {act.type === 'check_in' && '⏱️'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-white truncate">
                        {act.technician}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {act.timestamp}
                      </span>
                    </div>

                    <div className="text-[11px] text-blue-400 font-semibold mb-1 truncate">
                      {act.jobTitle}
                    </div>

                    <p className="text-slate-300 leading-snug">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conformitate & Siguranță Tehnică</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toate intervențiile frigorifice respectă normele F-Gas cu privire la recuperarea și încărcarea agenților frigorifici (R32 / R410A). Probele de presiune se arhivează automat în dosarul tehnic.
            </p>
          </div>
        </div>

      </div>

      {/* 3. ALL SITES OVERVIEW / JOBS DIRECTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Toate Șantierele & Lucrările Active în Sistem
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Accesați dosarele tehnice, pozele de recepție sau generați PV
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută client, adresă..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">Toate Specialitățile</option>
              <option value="Climatizare VRF">Climatizare VRF</option>
              <option value="Termice & Pardoseală">Termice & Pardoseală</option>
              <option value="Ventilație & Filtrare">Ventilație & Filtrare</option>
            </select>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {job.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'Finalizat'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : job.status === 'În lucru'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                  {job.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  Beneficiar: <span className="text-slate-200">{job.client}</span>
                </p>

                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {job.address}
                </p>

                {/* Cover thumbnail */}
                <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800/80 relative">
                  <img
                    src={job.coverImage}
                    alt={job.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono">
                    {job.photos.length} poze
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenPVModal(job)}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Vezi PV</span>
                </button>

                <button
                  onClick={() => onSelectJob(job.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Deschide în Șantier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
