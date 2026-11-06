import { Profile, Subject, ClassRoom, Student, Grade, Attendance, TeachingJournal } from '../types';

export const initialProfile: Profile = {
  id: 'prof-01',
  email: 'smpnegeri2bgr@gmail.com',
  full_name: 'Drs. H. Hendra Wijaya, M.Pd.',
  nip: '197805122003121004',
  phone: '081287654321',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  school_name: 'SMP Negeri 2 Kota Bogor'
};

export const initialSubjects: Subject[] = [
  { id: 'sub-01', code: 'INF-07', name: 'Informatika & TIK', color: '#696cff' },
  { id: 'sub-02', code: 'MAT-07', name: 'Matematika Dasar', color: '#71dd37' },
  { id: 'sub-03', code: 'IPA-08', name: 'Ilmu Pengetahuan Alam', color: '#03c3ec' },
  { id: 'sub-04', code: 'KOD-08', name: 'Algoritma & Pemrograman', color: '#ffab00' }
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls-01', name: 'VII-A', grade_level: 'Kelas 7', academic_year: '2024/2025' },
  { id: 'cls-02', name: 'VII-B', grade_level: 'Kelas 7', academic_year: '2024/2025' },
  { id: 'cls-03', name: 'VIII-A', grade_level: 'Kelas 8', academic_year: '2024/2025' },
  { id: 'cls-04', name: 'VIII-B', grade_level: 'Kelas 8', academic_year: '2024/2025' }
];

export const initialStudents: Student[] = [
  // Kelas VII-A
  {
    id: 'std-01',
    class_id: 'cls-01',
    nis: '2407001',
    full_name: 'Ahmad Rizky Pratama',
    gender: 'L',
    birth_place: 'Bogor',
    birth_date: '2011-04-12',
    address: 'Jl. Pajajaran No. 45, Baranangsiang, Bogor',
    parent_phone: '081298765432'
  },
  {
    id: 'std-02',
    class_id: 'cls-01',
    nis: '2407002',
    full_name: 'Aisyah Putri Azzahra',
    gender: 'P',
    birth_place: 'Jakarta',
    birth_date: '2011-08-23',
    address: 'Jl. Surya Kencana No. 12, Bogor Tengah',
    parent_phone: '081345678901'
  },
  {
    id: 'std-03',
    class_id: 'cls-01',
    nis: '2407003',
    full_name: 'Bagas Aditya Nugraha',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '2011-01-15',
    address: 'Jl. Sudirman No. 88, Pabaton, Bogor',
    parent_phone: '081512349876'
  },
  {
    id: 'std-04',
    class_id: 'cls-01',
    nis: '2407004',
    full_name: 'Citra Lestari Dewi',
    gender: 'P',
    birth_place: 'Bogor',
    birth_date: '2011-11-05',
    address: 'Komp. Ciomas Permai Blok B4 No. 7, Bogor',
    parent_phone: '081678901234'
  },
  {
    id: 'std-05',
    class_id: 'cls-01',
    nis: '2407005',
    full_name: 'Dimas Satria Wibowo',
    gender: 'L',
    birth_place: 'Depok',
    birth_date: '2011-06-30',
    address: 'Jl. Semeru No. 17, Menteng, Bogor',
    parent_phone: '081909876543'
  },
  {
    id: 'std-06',
    class_id: 'cls-01',
    nis: '2407006',
    full_name: 'Fathir Muhammad Ramadhan',
    gender: 'L',
    birth_place: 'Bogor',
    birth_date: '2011-09-19',
    address: 'Jl. Bangbarung Raya No. 22, Bantarjati, Bogor',
    parent_phone: '081765432109'
  },
  // Kelas VII-B
  {
    id: 'std-07',
    class_id: 'cls-02',
    nis: '2407007',
    full_name: 'Gita Permata Sari',
    gender: 'P',
    birth_place: 'Sukabumi',
    birth_date: '2011-03-08',
    address: 'Jl. Pahlawan No. 104, Empang, Bogor',
    parent_phone: '081233445566'
  },
  {
    id: 'std-08',
    class_id: 'cls-02',
    nis: '2407008',
    full_name: 'Hafiz Al-Faruq',
    gender: 'L',
    birth_place: 'Bogor',
    birth_date: '2011-07-21',
    address: 'Jl. KH. Sholeh Iskandar No. 5, Kedungbadak',
    parent_phone: '081377889900'
  },
  {
    id: 'std-09',
    class_id: 'cls-02',
    nis: '2407009',
    full_name: 'Indah Kusuma Wardani',
    gender: 'P',
    birth_place: 'Tangerang',
    birth_date: '2011-02-14',
    address: 'Jl. Pandu Raya No. 49, Tegal Gundil, Bogor',
    parent_phone: '085612345678'
  },
  // Kelas VIII-A
  {
    id: 'std-10',
    class_id: 'cls-03',
    nis: '2308001',
    full_name: 'Jonathan Kevin Wijaya',
    gender: 'L',
    birth_place: 'Jakarta',
    birth_date: '2010-05-18',
    address: 'Jl. Dr. Sumeru No. 62, Bogor Barat',
    parent_phone: '081809871234'
  },
  {
    id: 'std-11',
    class_id: 'cls-03',
    nis: '2308002',
    full_name: 'Kirana Maulida',
    gender: 'P',
    birth_place: 'Bogor',
    birth_date: '2010-10-11',
    address: 'Jl. Lodaya No. 14, Babakan, Bogor Tengah',
    parent_phone: '081299887766'
  },
  {
    id: 'std-12',
    class_id: 'cls-03',
    nis: '2308003',
    full_name: 'Lukman Hakim Siregar',
    gender: 'L',
    birth_place: 'Medan',
    birth_date: '2010-12-03',
    address: 'Jl. R.E. Martadinata No. 35, Bogor',
    parent_phone: '081388776655'
  }
];

export const initialGrades: Grade[] = [
  {
    id: 'grd-01',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-01',
    assignment_score: 88,
    daily_score: 85,
    mid_exam_score: 90,
    final_exam_score: 92,
    final_grade: 89.2,
    predicate: 'A',
    notes: 'Pemahaman materi informatika sangat baik.'
  },
  {
    id: 'grd-02',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-02',
    assignment_score: 92,
    daily_score: 90,
    mid_exam_score: 94,
    final_exam_score: 95,
    final_grade: 93.1,
    predicate: 'A',
    notes: 'Sangat teliti dan aktif dalam praktik komputer.'
  },
  {
    id: 'grd-03',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-03',
    assignment_score: 75,
    daily_score: 80,
    mid_exam_score: 78,
    final_exam_score: 82,
    final_grade: 79.0,
    predicate: 'B',
    notes: 'Perlu latihan lebih pada materi logika komputasi.'
  },
  {
    id: 'grd-04',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-04',
    assignment_score: 84,
    daily_score: 82,
    mid_exam_score: 86,
    final_exam_score: 88,
    final_grade: 85.4,
    predicate: 'B',
    notes: 'Kreativitas tinggi dalam tugas desain media digital.'
  },
  {
    id: 'grd-05',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-05',
    assignment_score: 70,
    daily_score: 72,
    mid_exam_score: 68,
    final_exam_score: 74,
    final_grade: 71.0,
    predicate: 'C',
    notes: 'Tingkatkan ketepatan pengumpulan tugas mandiri.'
  },
  {
    id: 'grd-06',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    student_id: 'std-06',
    assignment_score: 86,
    daily_score: 88,
    mid_exam_score: 85,
    final_exam_score: 89,
    final_grade: 87.0,
    predicate: 'B',
    notes: 'Bagus, antusias saat praktikum lab.'
  }
];

export const initialAttendance: Attendance[] = [
  { id: 'att-01', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-01', date: '2026-11-05', status: 'H', notes: 'Hadir tepat waktu' },
  { id: 'att-02', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-02', date: '2026-11-05', status: 'H', notes: 'Hadir' },
  { id: 'att-03', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-03', date: '2026-11-05', status: 'S', notes: 'Surat dokter terlampir' },
  { id: 'att-04', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-04', date: '2026-11-05', status: 'H', notes: 'Hadir' },
  { id: 'att-05', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-05', date: '2026-11-05', status: 'I', notes: 'Acara keluarga' },
  { id: 'att-06', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-06', date: '2026-11-05', status: 'H', notes: 'Hadir' },

  { id: 'att-07', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-01', date: '2026-11-04', status: 'H' },
  { id: 'att-08', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-02', date: '2026-11-04', status: 'H' },
  { id: 'att-09', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-03', date: '2026-11-04', status: 'H' },
  { id: 'att-10', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-04', date: '2026-11-04', status: 'H' },
  { id: 'att-11', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-05', date: '2026-11-04', status: 'H' },
  { id: 'att-12', subject_id: 'sub-01', class_id: 'cls-01', student_id: 'std-06', date: '2026-11-04', status: 'H' }
];

export const initialJournals: TeachingJournal[] = [
  {
    id: 'jrn-01',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    date: '2026-11-05',
    period: 'Jam ke-1 s/d 2 (07:30 - 09:00)',
    topic: 'Pengenalan Algoritma Dasar & Flowchart Logika',
    method: 'Problem Based Learning & Diskusi Kelompok',
    present_count: 5,
    notes: 'Siswa antusias menyusun diagram alir pengambilan keputusan logika IF-ELSE.',
    attachment_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    created_at: '2026-11-05T09:15:00Z'
  },
  {
    id: 'jrn-02',
    subject_id: 'sub-02',
    class_id: 'cls-02',
    date: '2026-11-04',
    period: 'Jam ke-3 s/d 4 (09:15 - 10:45)',
    topic: 'Operasi Hitung Aljabar dan Persamaan Linier',
    method: 'Ceramah Interaktif & Latihan Mandiri',
    present_count: 6,
    notes: 'Beberapa siswa masih bingung memindahkan suku aljabar antar ruas, diadakan tutor sebaya.',
    attachment_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80',
    created_at: '2026-11-04T11:00:00Z'
  },
  {
    id: 'jrn-03',
    subject_id: 'sub-01',
    class_id: 'cls-01',
    date: '2026-10-30',
    period: 'Jam ke-5 s/d 6 (11:00 - 12:30)',
    topic: 'Struktur Perangkat Keras Komputer dan Fungsinya',
    method: 'Demonstrasi Hardware di Lab Komputer',
    present_count: 6,
    notes: 'Praktik identifikasi RAM, CPU, Motherboard, dan Storage berjalan tertib.',
    attachment_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80',
    created_at: '2026-10-30T13:00:00Z'
  }
];
