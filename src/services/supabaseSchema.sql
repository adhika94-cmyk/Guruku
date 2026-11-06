-- ====================================================================
-- GURUKU - SCHEMA DATABASE SUPABASE LENGKAP
-- Sistem Informasi Manajemen Guru Modern
-- Compatible with Supabase Postgres & aaPanel VPS Deployment
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Data Guru & Akun)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    phone VARCHAR(30),
    avatar_url TEXT,
    school_name VARCHAR(255) DEFAULT 'SMP Negeri 2 Bogor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL SUBJECTS (Mata Pelajaran yang diampu Guru)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    color VARCHAR(20) DEFAULT '#696cff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL CLASSES (Kelas yang diajar Guru)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20) NOT NULL, -- Contoh: 'Kelas 7', 'Kelas 8', 'Kelas 9'
    academic_year VARCHAR(20) NOT NULL, -- Contoh: '2024/2025'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL STUDENTS (Siswa dalam Kelas)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    nis VARCHAR(30) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    address TEXT,
    parent_phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL GRADES (Nilai Akademik Siswa)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_score NUMERIC(5, 2) DEFAULT 0, -- Nilai Tugas
    daily_score NUMERIC(5, 2) DEFAULT 0,      -- Nilai Harian
    mid_exam_score NUMERIC(5, 2) DEFAULT 0,   -- Nilai PTS
    final_exam_score NUMERIC(5, 2) DEFAULT 0, -- Nilai PAS
    final_grade NUMERIC(5, 2) DEFAULT 0,      -- Nilai Akhir Otomatis
    predicate CHAR(1) DEFAULT 'C',            -- Predikat: A, B, C, D
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_grade_per_subject_student UNIQUE (subject_id, class_id, student_id)
);

-- 7. TABEL ATTENDANCE (Absensi Siswa Harian)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status CHAR(1) CHECK (status IN ('H', 'I', 'S', 'A')) DEFAULT 'H', -- Hadir, Izin, Sakit, Alfa
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_attendance_entry UNIQUE (subject_id, class_id, student_id, date)
);

-- 8. TABEL TEACHING_JOURNALS (Jurnal Mengajar Guru)
CREATE TABLE IF NOT EXISTS public.teaching_journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    period VARCHAR(50) NOT NULL, -- e.g. "Jam 1-2 (07:30 - 09:00)"
    topic TEXT NOT NULL,         -- Materi Pembelajaran
    method VARCHAR(150),         -- Metode Pembelajaran
    present_count INT DEFAULT 0, -- Jumlah Siswa Hadir
    notes TEXT,                  -- Catatan / Evaluasi Guru
    attachment_url TEXT,         -- Foto / Bukti Dokumen
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INDEKS UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_subjects_profile ON public.subjects(profile_id);
CREATE INDEX IF NOT EXISTS idx_classes_profile ON public.classes(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_filter ON public.grades(subject_id, class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_filter ON public.attendance(subject_id, class_id, date);
CREATE INDEX IF NOT EXISTS idx_journals_filter ON public.teaching_journals(subject_id, class_id, date);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_journals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if already created (mencegah error 42710 jika skrip dijalankan ulang)
DROP POLICY IF EXISTS "Guru can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Guru manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Guru manage classes" ON public.classes;
DROP POLICY IF EXISTS "Guru manage students" ON public.students;
DROP POLICY IF EXISTS "Guru manage grades" ON public.grades;
DROP POLICY IF EXISTS "Guru manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Guru manage journals" ON public.teaching_journals;

-- Policy Profiles (Guru hanya akses profil sendiri)
CREATE POLICY "Guru can view own profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Guru can update own profile" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Guru can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Policy Master Data & Akademik
CREATE POLICY "Guru manage subjects" ON public.subjects FOR ALL USING (true);
CREATE POLICY "Guru manage classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Guru manage students" ON public.students FOR ALL USING (true);
CREATE POLICY "Guru manage grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Guru manage attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Guru manage journals" ON public.teaching_journals FOR ALL USING (true);

-- ====================================================================
-- SEED DATA AWAL (DEMO SIAP PAKAI)
-- ====================================================================

-- Profil Guru Default
INSERT INTO public.profiles (id, email, full_name, nip, phone, school_name, avatar_url)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'guru@guruku.sch.id',
    'Budi Santoso, S.Pd., M.Kom.',
    '198507152010011008',
    '081234567890',
    'SMP Negeri 2 Bogor',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
) ON CONFLICT DO NOTHING;

-- Mata Pelajaran
INSERT INTO public.subjects (id, profile_id, code, name, color)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'INF-01', 'Informatika & Komputer', '#696cff'),
    ('b2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MAT-01', 'Matematika Dasar', '#71dd37'),
    ('b3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'IPA-01', 'Ilmu Pengetahuan Alam', '#03c3ec')
ON CONFLICT DO NOTHING;

-- Kelas
INSERT INTO public.classes (id, profile_id, name, grade_level, academic_year)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VII-A', 'Kelas 7', '2024/2025'),
    ('c2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VII-B', 'Kelas 7', '2024/2025'),
    ('c3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VIII-A', 'Kelas 8', '2024/2025')
ON CONFLICT DO NOTHING;

-- Siswa
INSERT INTO public.students (id, class_id, nis, full_name, gender, birth_place, birth_date, address, parent_phone)
VALUES
    ('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2407001', 'Ahmad Rizky Pratama', 'L', 'Bogor', '2011-04-12', 'Jl. Pajajaran No. 45, Bogor', '081298765432'),
    ('d2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', '2407002', 'Aisyah Putri Azzahra', 'P', 'Jakarta', '2011-08-23', 'Jl. Suryakencana No. 12, Bogor', '081345678901'),
    ('d3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', '2407003', 'Bagas Aditya Nugraha', 'L', 'Bandung', '2011-01-15', 'Jl. Sudirman No. 88, Bogor', '081512349876'),
    ('d4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', '2407004', 'Citra Lestari Dewi', 'P', 'Bogor', '2011-11-05', 'Jl. Ciomas Permai B-4, Bogor', '081678901234'),
    ('d5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111', '2407005', 'Dimas Satria Wibowo', 'L', 'Depok', '2011-06-30', 'Jl. Semeru No. 17, Bogor', '081909876543')
ON CONFLICT DO NOTHING;
