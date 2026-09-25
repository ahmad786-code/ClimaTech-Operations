import React, { useState } from 'react';
import { Job } from '../types';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  FileCheck, 
  Building, 
  MapPin, 
  Calendar, 
  UserCheck, 
  PenTool,
  ShieldAlert
} from 'lucide-react';

interface PVModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSignSuccess: () => void;
}

export const PVModal: React.FC<PVModalProps> = ({
  job,
  isOpen,
  onClose,
  onSignSuccess,
}) => {
  const [signatureName, setSignatureName] = useState(job.client.split(' ')[0] || 'Reprezentant Client');
  const [isSigned, setIsSigned] = useState(job.status === 'Finalizat');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSign = () => {
    setIsSigned(true);
    onSignSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Top Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">
              Proces-Verbal de Recepție Tehnică la Terminarea Lucrărilor
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable PV Sheet Content */}
        <div className="p-6 space-y-4 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Header of official document */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                SC CLIMATECH OPERATIONS SRL
              </h2>
              <p className="text-[11px] text-slate-500">
                Departament Montaj Instalații Sanitare, Termice, HVAC & Ventilare
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                CUI: RO38491024 · Reg. Com.: J40/1298/2018 · Sediu: București
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                NR. PV: {job.code}/REC
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Data: 25.09.2026</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 text-[13px]">
              Obiectul Lucrării: {job.title}
            </div>
            <div className="text-slate-600">
              <span className="font-semibold">Beneficiar:</span> {job.client}
            </div>
            <div className="text-slate-600">
              <span className="font-semibold">Adresă Amplasament:</span> {job.address}
            </div>
            <div className="text-slate-600">
              <span className="font-semibold">Specialitate Executată:</span> {job.category}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              1. Date Tehnice & Proba de Presiune
            </h4>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-[11px]">
              <div>
                <span className="text-slate-500">Echipament / Marcă:</span>{' '}
                <span className="font-semibold">{job.systemSpecs.brand || 'Conform proiect'}</span>
              </div>
              <div>
                <span className="text-slate-500">Capacitate / Model:</span>{' '}
                <span className="font-semibold">{job.systemSpecs.capacity || job.systemSpecs.model || 'Standard'}</span>
              </div>
              <div>
                <span className="text-slate-500">Proba de Presiune Azot/Apă:</span>{' '}
                <span className="font-semibold text-emerald-700">
                  {job.systemSpecs.pressureTested ? `EFECTUATĂ (${job.systemSpecs.testPressureBar || 38} BAR)` : 'În curs'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Durată Menținere Presiune:</span>{' '}
                <span className="font-semibold">45 min (Stabilitate conf. SR EN 378)</span>
              </div>
            </div>
          </div>

          {/* Materials & Warranty Confirmation */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              2. Declarație de Conformitate & Garanție
            </h4>
            <p className="text-slate-600 text-[11px]">
              Comisia de recepție formată din reprezentantul executantului ({job.leadTechnician}) și beneficiar constată că instalațiile menționate mai sus au fost executate în conformitate cu normativele tehnice I13, I9 și cerințele producătorului. Nu s-au constatat pierderi de agent termic sau frigorific. Garanția de execuție este de 24 luni de la data semnării.
            </p>
          </div>

          {/* Signatures block */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Executant: ClimaTech</span>
              <p className="text-[11px] text-slate-600">{job.leadTechnician}</p>
              <div className="mt-3 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Semnat Electronic (Șef Șantier)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Beneficiar:</span>
              <p className="text-[11px] text-slate-600">{signatureName}</p>
              {isSigned ? (
                <div className="mt-3 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recepționat & Semnat pe Tabletă</span>
                </div>
              ) : (
                <button
                  onClick={handleSign}
                  className="mt-2 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Semnează Recepția</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 px-5 py-3 border-t flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 text-xs font-semibold"
          >
            Închide
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printează / PDF</span>
            </button>
            {!isSigned && (
              <button
                onClick={handleSign}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmă Recepția</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
