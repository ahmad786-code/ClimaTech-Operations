export type JobStatus = 'Programat' | 'Am ajuns pe șantier' | 'În lucru' | 'Pauză / Necesar Piese' | 'Finalizat';

export type SystemCategory = 'Climatizare VRF' | 'Termice & Pardoseală' | 'Instalații Sanitare' | 'Ventilație & Filtrare';

export interface PhotoRecord {
  id: string;
  type: 'before' | 'after';
  url: string;
  caption: string;
  timestamp: string;
  technicianName: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Tevi & Cupru' | 'Fitinguri & Supape' | 'Freon & Chimicale' | 'Izolatii' | 'Filtre & Grile' | 'Altele';
}

export interface Job {
  id: string;
  code: string; // e.g. "CT-2026-081"
  title: string;
  category: SystemCategory;
  client: string;
  clientPhone: string;
  address: string;
  status: JobStatus;
  leadTechnician: string;
  teamMembers: string[];
  vehicle: string;
  timeWindow: string;
  checkInTime?: string;
  coverImage: string;
  photos: PhotoRecord[];
  materials: MaterialItem[];
  dailyNotes: string[];
  systemSpecs: {
    brand?: string;
    model?: string;
    capacity?: string;
    refrigerant?: string;
    pressureTested?: boolean;
    testPressureBar?: number;
  };
}

export interface MaterialRequest {
  id: string;
  jobId: string;
  jobTitle: string;
  leadTechnician: string;
  team: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  urgency: 'Normal' | 'Urgent' | 'Critic';
  notes: string;
  requestedAt: string;
  status: 'În așteptare' | 'Aprobat' | 'Comandat de la furnizor' | 'Livrat pe șantier';
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'status_change' | 'photo_upload' | 'material_request' | 'approval' | 'check_in';
  technician: string;
  jobTitle: string;
  description: string;
}

export interface TechnicianShift {
  id: string;
  name: string;
  role: string;
  currentSite: string;
  status: 'Pe șantier' | 'În deplasare' | 'Pauză masă' | 'Finalizat tură';
  checkInTime: string;
  workingHours: string;
  vehicle: string;
  batteryLevel: number;
}
