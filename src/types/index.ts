export interface Profile {
  id: string;
  email: string;
  full_name: string;
  nip: string;
  phone: string;
  avatar_url: string;
  school_name: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color?: string;
  created_at?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade_level: string;
  academic_year: string;
  created_at?: string;
}

export interface Student {
  id: string;
  class_id: string;
  nis: string;
  full_name: string;
  gender: 'L' | 'P';
  birth_place: string;
  birth_date: string;
  address: string;
  parent_phone: string;
  created_at?: string;
}

export interface Grade {
  id: string;
  subject_id: string;
  class_id: string;
  student_id: string;
  assignment_score: number; // Nilai Tugas
  daily_score: number;      // Nilai Harian
  mid_exam_score: number;   // Nilai PTS
  final_exam_score: number; // Nilai PAS
  final_grade: number;      // Nilai Akhir
  predicate: 'A' | 'B' | 'C' | 'D';
  notes?: string;
  updated_at?: string;
}

export interface Attendance {
  id: string;
  subject_id: string;
  class_id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: 'H' | 'I' | 'S' | 'A'; // Hadir, Izin, Sakit, Alfa
  notes?: string;
}

export interface TeachingJournal {
  id: string;
  subject_id: string;
  class_id: string;
  date: string; // YYYY-MM-DD
  period: string; // e.g. "Jam 1-2 (07:30 - 09:00)"
  topic: string; // Materi Pembelajaran
  method: string; // Metode Pembelajaran
  present_count: number;
  notes?: string;
  attachment_url?: string;
  created_at?: string;
}
