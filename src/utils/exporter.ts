import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportTableToExcel(data: Record<string, any>[], fileName: string, sheetName: string = 'Data'): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function exportTableToPDF(options: {
  title: string;
  subtitle?: string;
  teacherName?: string;
  nip?: string;
  headers: string[];
  rows: (string | number)[][];
  fileName: string;
  orientation?: 'portrait' | 'landscape';
}): void {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(105, 108, 255); // Sneat primary
  doc.text('GURUKU - PORTAL MANAJEMEN GURU', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text(options.title, pageWidth / 2, 22, { align: 'center' });

  if (options.subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(options.subtitle, pageWidth / 2, 28, { align: 'center' });
  }

  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 32, pageWidth - 14, 32);

  // Table using jspdf-autotable
  autoTable(doc, {
    startY: 36,
    head: [options.headers],
    body: options.rows,
    theme: 'grid',
    headStyles: {
      fillColor: [105, 108, 255],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 249, 252]
    }
  });

  // Footer Signature if teacher specified
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : 180;
  
  if (finalY < doc.internal.pageSize.getHeight() - 40 && options.teacherName) {
    const rightAlignX = pageWidth - 60;
    const todayStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Bogor, ${todayStr}`, rightAlignX, finalY);
    doc.text('Guru Mata Pelajaran,', rightAlignX, finalY + 5);

    doc.setFontSize(10);
    doc.text(options.teacherName, rightAlignX, finalY + 25);
    if (options.nip) {
      doc.setFontSize(8.5);
      doc.text(`NIP. ${options.nip}`, rightAlignX, finalY + 30);
    }
  }

  doc.save(`${options.fileName}.pdf`);
}
