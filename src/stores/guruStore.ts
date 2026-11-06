import { defineStore } from 'pinia';
import {
  Profile,
  Subject,
  ClassRoom,
  Student,
  Grade,
  Attendance,
  TeachingJournal
} from '../types';
import {
  initialProfile,
  initialSubjects,
  initialClasses,
  initialStudents,
  initialGrades,
  initialAttendance,
  initialJournals
} from '../services/sampleData';
import { getSupabaseClient } from '../services/supabase';

const LS_PROFILE_KEY = 'guruku_profile_v1';
const LS_SUBJECTS_KEY = 'guruku_subjects_v1';
const LS_CLASSES_KEY = 'guruku_classes_v1';
const LS_STUDENTS_KEY = 'guruku_students_v1';
const LS_GRADES_KEY = 'guruku_grades_v1';
const LS_ATTENDANCE_KEY = 'guruku_attendance_v1';
const LS_JOURNALS_KEY = 'guruku_journals_v1';
const LS_AUTH_KEY = 'guruku_auth_v1';
const LS_THEME_KEY = 'guruku_theme_v1';

export const useGuruStore = defineStore('guru', {
  state: () => {
    // Theme setup
    const savedTheme = localStorage.getItem(LS_THEME_KEY);
    const isDark = savedTheme === 'dark';

    // Auth setup
    const savedAuth = localStorage.getItem(LS_AUTH_KEY);
    let isLoggedIn = true; // default true for instant preview, can be toggled
    let sessionUser: { email: string; name: string } | null = { email: initialProfile.email, name: initialProfile.full_name };

    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        isLoggedIn = parsed.isLoggedIn;
        sessionUser = parsed.user || sessionUser;
      } catch (e) {
        console.error(e);
      }
    }

    return {
      profile: (JSON.parse(localStorage.getItem(LS_PROFILE_KEY) || 'null') as Profile) || initialProfile,
      subjects: (JSON.parse(localStorage.getItem(LS_SUBJECTS_KEY) || 'null') as Subject[]) || initialSubjects,
      classes: (JSON.parse(localStorage.getItem(LS_CLASSES_KEY) || 'null') as ClassRoom[]) || initialClasses,
      students: (JSON.parse(localStorage.getItem(LS_STUDENTS_KEY) || 'null') as Student[]) || initialStudents,
      grades: (JSON.parse(localStorage.getItem(LS_GRADES_KEY) || 'null') as Grade[]) || initialGrades,
      attendance: (JSON.parse(localStorage.getItem(LS_ATTENDANCE_KEY) || 'null') as Attendance[]) || initialAttendance,
      teachingJournals: (JSON.parse(localStorage.getItem(LS_JOURNALS_KEY) || 'null') as TeachingJournal[]) || initialJournals,
      
      isLoggedIn,
      sessionUser,
      darkMode: isDark,
      sidebarMobileOpen: false,
      searchQuery: '',
      loading: false
    };
  },

  getters: {
    totalSubjects: (state) => state.subjects.length,
    totalClasses: (state) => state.classes.length,
    totalStudents: (state) => state.students.length,
    totalJournals: (state) => state.teachingJournals.length,

    getSubjectById: (state) => (id: string) => {
      return state.subjects.find((s) => s.id === id);
    },

    getClassById: (state) => (id: string) => {
      return state.classes.find((c) => c.id === id);
    },

    getStudentsByClass: (state) => (classId: string) => {
      if (!classId) return state.students;
      return state.students.filter((s) => s.class_id === classId);
    },

    getGradesByFilter: (state) => (subjectId: string, classId: string) => {
      return state.grades.filter(
        (g) => g.subject_id === subjectId && g.class_id === classId
      );
    },

    getAttendanceByFilter: (state) => (subjectId: string, classId: string, date: string) => {
      return state.attendance.filter(
        (a) => a.subject_id === subjectId && a.class_id === classId && a.date === date
      );
    }
  },

  actions: {
    initTheme() {
      if (this.darkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.body.classList.remove('dark-mode');
      }
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem(LS_THEME_KEY, this.darkMode ? 'dark' : 'light');
      this.initTheme();
    },

    toggleSidebarMobile() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen;
    },

    closeSidebarMobile() {
      this.sidebarMobileOpen = false;
    },

    saveAllToLocal() {
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(this.profile));
      localStorage.setItem(LS_SUBJECTS_KEY, JSON.stringify(this.subjects));
      localStorage.setItem(LS_CLASSES_KEY, JSON.stringify(this.classes));
      localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(this.students));
      localStorage.setItem(LS_GRADES_KEY, JSON.stringify(this.grades));
      localStorage.setItem(LS_ATTENDANCE_KEY, JSON.stringify(this.attendance));
      localStorage.setItem(LS_JOURNALS_KEY, JSON.stringify(this.teachingJournals));
    },

    // --- AUTHENTICATION ---
    async login(email: string, pass: string, remember: boolean = true) {
      this.loading = true;
      try {
        const client = getSupabaseClient();
        if (client) {
          try {
            const { data, error } = await client.auth.signInWithPassword({
              email,
              password: pass
            });
            if (!error && data?.user) {
              this.isLoggedIn = true;
              this.sessionUser = { email: data.user.email || email, name: this.profile.full_name };
              if (remember) {
                localStorage.setItem(LS_AUTH_KEY, JSON.stringify({ isLoggedIn: true, user: this.sessionUser }));
              }
              this.loading = false;
              return { success: true, message: 'Login via Supabase Auth berhasil!' };
            }
          } catch (supaErr) {
            console.warn('Supabase auth attempt fallback to local:', supaErr);
          }
        }

        // Demo / Local Auth validation (any password or demo)
        this.isLoggedIn = true;
        this.sessionUser = { email, name: this.profile.full_name };
        if (remember) {
          localStorage.setItem(LS_AUTH_KEY, JSON.stringify({ isLoggedIn: true, user: this.sessionUser }));
        }
        this.loading = false;
        return { success: true, message: 'Selamat datang di GuruKu Portal Guru!' };
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(email: string) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.auth.resetPasswordForEmail(email);
        } catch (e) {
          console.warn('Supabase reset request failed, simulated email sent:', e);
        }
      }
      return { success: true, message: `Instruksi reset password telah dikirim ke alamat ${email}` };
    },

    logout() {
      this.isLoggedIn = false;
      this.sessionUser = null;
      localStorage.removeItem(LS_AUTH_KEY);
      const client = getSupabaseClient();
      if (client) {
        client.auth.signOut().catch(console.error);
      }
    },

    updateProfile(updated: Partial<Profile>) {
      this.profile = { ...this.profile, ...updated };
      this.saveAllToLocal();
      
      const client = getSupabaseClient();
      if (client) {
        client.from('profiles').upsert([this.profile]).then();
      }
    },

    // --- SUBJECTS CRUD ---
    addSubject(subject: Omit<Subject, 'id'>) {
      const newSubject: Subject = {
        ...subject,
        id: 'sub-' + Date.now().toString(36)
      };
      this.subjects.push(newSubject);
      this.saveAllToLocal();
      return newSubject;
    },

    updateSubject(id: string, updated: Partial<Subject>) {
      const idx = this.subjects.findIndex((s) => s.id === id);
      if (idx !== -1) {
        this.subjects[idx] = { ...this.subjects[idx], ...updated };
        this.saveAllToLocal();
      }
    },

    deleteSubject(id: string) {
      this.subjects = this.subjects.filter((s) => s.id !== id);
      this.grades = this.grades.filter((g) => g.subject_id !== id);
      this.attendance = this.attendance.filter((a) => a.subject_id !== id);
      this.teachingJournals = this.teachingJournals.filter((j) => j.subject_id !== id);
      this.saveAllToLocal();
    },

    // --- CLASSES CRUD ---
    addClass(cls: Omit<ClassRoom, 'id'>) {
      const newClass: ClassRoom = {
        ...cls,
        id: 'cls-' + Date.now().toString(36)
      };
      this.classes.push(newClass);
      this.saveAllToLocal();
      return newClass;
    },

    updateClass(id: string, updated: Partial<ClassRoom>) {
      const idx = this.classes.findIndex((c) => c.id === id);
      if (idx !== -1) {
        this.classes[idx] = { ...this.classes[idx], ...updated };
        this.saveAllToLocal();
      }
    },

    deleteClass(id: string) {
      this.classes = this.classes.filter((c) => c.id !== id);
      this.students = this.students.filter((s) => s.class_id !== id);
      this.grades = this.grades.filter((g) => g.class_id !== id);
      this.attendance = this.attendance.filter((a) => a.class_id !== id);
      this.teachingJournals = this.teachingJournals.filter((j) => j.class_id !== id);
      this.saveAllToLocal();
    },

    // --- STUDENTS CRUD ---
    addStudent(std: Omit<Student, 'id'>) {
      const newStudent: Student = {
        ...std,
        id: 'std-' + Date.now().toString(36)
      };
      this.students.push(newStudent);
      this.saveAllToLocal();
      return newStudent;
    },

    updateStudent(id: string, updated: Partial<Student>) {
      const idx = this.students.findIndex((s) => s.id === id);
      if (idx !== -1) {
        this.students[idx] = { ...this.students[idx], ...updated };
        this.saveAllToLocal();
      }
    },

    deleteStudent(id: string) {
      this.students = this.students.filter((s) => s.id !== id);
      this.grades = this.grades.filter((g) => g.student_id !== id);
      this.attendance = this.attendance.filter((a) => a.student_id !== id);
      this.saveAllToLocal();
    },

    // --- GRADES MANAGEMENT & FORMULAS ---
    calculateGrade(tugas: number, harian: number, pts: number, pas: number) {
      // Bobot standar: 20% Tugas, 20% Harian, 30% PTS, 30% PAS
      const finalVal = (tugas * 0.20) + (harian * 0.20) + (pts * 0.30) + (pas * 0.30);
      const rounded = Math.round(finalVal * 10) / 10;
      
      let predicate: 'A' | 'B' | 'C' | 'D' = 'D';
      if (rounded >= 88) predicate = 'A';
      else if (rounded >= 78) predicate = 'B';
      else if (rounded >= 65) predicate = 'C';
      else predicate = 'D';

      return { finalGrade: rounded, predicate };
    },

    saveGrade(data: Omit<Grade, 'id' | 'final_grade' | 'predicate'>) {
      const { finalGrade, predicate } = this.calculateGrade(
        Number(data.assignment_score) || 0,
        Number(data.daily_score) || 0,
        Number(data.mid_exam_score) || 0,
        Number(data.final_exam_score) || 0
      );

      const existingIdx = this.grades.findIndex(
        (g) => g.subject_id === data.subject_id &&
               g.class_id === data.class_id &&
               g.student_id === data.student_id
      );

      if (existingIdx !== -1) {
        this.grades[existingIdx] = {
          ...this.grades[existingIdx],
          ...data,
          final_grade: finalGrade,
          predicate,
          updated_at: new Date().toISOString()
        };
      } else {
        const newGrade: Grade = {
          id: 'grd-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          ...data,
          final_grade: finalGrade,
          predicate,
          updated_at: new Date().toISOString()
        };
        this.grades.push(newGrade);
      }
      this.saveAllToLocal();
    },

    // --- ATTENDANCE MANAGEMENT ---
    saveAttendanceEntry(entry: Omit<Attendance, 'id'>) {
      const existingIdx = this.attendance.findIndex(
        (a) => a.subject_id === entry.subject_id &&
               a.class_id === entry.class_id &&
               a.student_id === entry.student_id &&
               a.date === entry.date
      );

      if (existingIdx !== -1) {
        this.attendance[existingIdx] = {
          ...this.attendance[existingIdx],
          ...entry
        };
      } else {
        const newAtt: Attendance = {
          id: 'att-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          ...entry
        };
        this.attendance.push(newAtt);
      }
      this.saveAllToLocal();
    },

    batchMarkAllPresent(subjectId: string, classId: string, date: string) {
      const studentsInClass = this.getStudentsByClass(classId);
      studentsInClass.forEach((st) => {
        this.saveAttendanceEntry({
          subject_id: subjectId,
          class_id: classId,
          student_id: st.id,
          date,
          status: 'H',
          notes: 'Hadir'
        });
      });
    },

    // --- TEACHING JOURNALS CRUD ---
    addJournal(journal: Omit<TeachingJournal, 'id' | 'created_at'>) {
      const newJournal: TeachingJournal = {
        ...journal,
        id: 'jrn-' + Date.now().toString(36),
        created_at: new Date().toISOString()
      };
      this.teachingJournals.unshift(newJournal);
      this.saveAllToLocal();
      return newJournal;
    },

    updateJournal(id: string, updated: Partial<TeachingJournal>) {
      const idx = this.teachingJournals.findIndex((j) => j.id === id);
      if (idx !== -1) {
        this.teachingJournals[idx] = { ...this.teachingJournals[idx], ...updated };
        this.saveAllToLocal();
      }
    },

    deleteJournal(id: string) {
      this.teachingJournals = this.teachingJournals.filter((j) => j.id !== id);
      this.saveAllToLocal();
    },

    // Reset to demo data
    resetToDemoData() {
      this.profile = { ...initialProfile };
      this.subjects = [...initialSubjects];
      this.classes = [...initialClasses];
      this.students = [...initialStudents];
      this.grades = [...initialGrades];
      this.attendance = [...initialAttendance];
      this.teachingJournals = [...initialJournals];
      this.saveAllToLocal();
    }
  }
});
