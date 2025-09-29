import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  includeTimestamp?: boolean;
  format?: 'pdf' | 'excel' | 'csv';
  orientation?: 'portrait' | 'landscape';
}

export interface TableData {
  headers: string[];
  rows: any[][];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// PDF Export Functions
export class PDFExporter {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private primaryColor: string = '#3B82F6';
  private secondaryColor: string = '#8B5CF6';

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.doc = new jsPDF(orientation);
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  addHeader(title: string, subtitle?: string, logo?: string) {
    // Add logo if provided
    if (logo) {
      this.doc.addImage(logo, 'PNG', this.margin, this.currentY, 40, 15);
      this.currentY += 20;
    }

    // Title
    this.doc.setFontSize(24);
    this.doc.setTextColor(33, 37, 41);
    this.doc.text(title, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 10;

    // Subtitle
    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(108, 117, 125);
      this.doc.text(subtitle, this.pageWidth / 2, this.currentY, { align: 'center' });
      this.currentY += 10;
    }

    // Add separator line
    this.doc.setDrawColor(220, 220, 220);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  addSummaryCards(data: { label: string; value: string | number; change?: string }[]) {
    const cardWidth = (this.pageWidth - this.margin * 2 - 10 * (data.length - 1)) / data.length;
    const cardHeight = 30;
    let x = this.margin;

    data.forEach((item) => {
      // Card background
      this.doc.setFillColor(248, 250, 252);
      this.doc.roundedRect(x, this.currentY, cardWidth, cardHeight, 3, 3, 'F');

      // Label
      this.doc.setFontSize(10);
      this.doc.setTextColor(108, 117, 125);
      this.doc.text(item.label, x + 5, this.currentY + 10);

      // Value
      this.doc.setFontSize(16);
      this.doc.setTextColor(33, 37, 41);
      this.doc.text(String(item.value), x + 5, this.currentY + 20);

      // Change indicator
      if (item.change) {
        const isPositive = item.change.startsWith('+');
        this.doc.setFontSize(10);
        this.doc.setTextColor(isPositive ? 34 : 220, isPositive ? 197 : 38, isPositive ? 94 : 38);
        this.doc.text(item.change, x + cardWidth - 15, this.currentY + 10);
      }

      x += cardWidth + 10;
    });

    this.currentY += cardHeight + 15;
  }

  addTable(tableData: TableData, title?: string) {
    if (title) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(33, 37, 41);
      this.doc.text(title, this.margin, this.currentY);
      this.currentY += 10;
    }

    this.doc.autoTable({
      head: [tableData.headers],
      body: tableData.rows,
      startY: this.currentY,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [33, 37, 41],
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: this.margin, right: this.margin }
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  addChart(title: string, description?: string) {
    // Note: For actual chart rendering, you'd need to convert chart to image first
    // This is a placeholder for chart area
    const chartHeight = 60;

    if (title) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(33, 37, 41);
      this.doc.text(title, this.margin, this.currentY);
      this.currentY += 7;
    }

    if (description) {
      this.doc.setFontSize(10);
      this.doc.setTextColor(108, 117, 125);
      this.doc.text(description, this.margin, this.currentY);
      this.currentY += 7;
    }

    // Placeholder chart area
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin * 2,
      chartHeight,
      3,
      3,
      'F'
    );

    // Add sample chart visualization
    this.doc.setDrawColor(59, 130, 246);
    this.doc.setLineWidth(2);
    const startX = this.margin + 10;
    const endX = this.pageWidth - this.margin - 10;
    const midY = this.currentY + chartHeight / 2;

    // Sample line chart
    this.doc.line(startX, midY + 10, startX + 30, midY - 5);
    this.doc.line(startX + 30, midY - 5, startX + 60, midY + 15);
    this.doc.line(startX + 60, midY + 15, startX + 90, midY - 10);
    this.doc.line(startX + 90, midY - 10, startX + 120, midY);

    this.currentY += chartHeight + 15;
  }

  addFooter() {
    const footerY = this.pageHeight - 15;

    // Add page number
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.setTextColor(108, 117, 125);
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        footerY,
        { align: 'center' }
      );

      // Add generation timestamp
      const timestamp = format(new Date(), 'dd MMM yyyy, HH:mm');
      this.doc.text(
        `Generated: ${timestamp}`,
        this.margin,
        footerY
      );

      // Add branding
      this.doc.text(
        'LaxmiOne NBFC',
        this.pageWidth - this.margin,
        footerY,
        { align: 'right' }
      );
    }
  }

  save(filename: string) {
    this.addFooter();
    this.doc.save(filename);
  }

  getBlob(): Blob {
    this.addFooter();
    return this.doc.output('blob');
  }
}

// Excel Export Functions
export class ExcelExporter {
  private workbook: XLSX.WorkBook;
  private worksheets: Map<string, XLSX.WorkSheet>;

  constructor() {
    this.workbook = XLSX.utils.book_new();
    this.worksheets = new Map();
  }

  addWorksheet(name: string, data: any[][], headers?: string[]) {
    const worksheetData = headers ? [headers, ...data] : data;
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply styling to headers
    if (headers) {
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellRef]) continue;

        worksheet[cellRef].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '3B82F6' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }

      // Set column widths
      const colWidths = headers.map(header => ({ wch: Math.max(header.length + 2, 15) }));
      worksheet['!cols'] = colWidths;
    }

    this.worksheets.set(name, worksheet);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, name);
  }

  addSummarySheet(title: string, summaryData: { [key: string]: any }) {
    const data: any[][] = [];

    // Add title
    data.push([title]);
    data.push([]); // Empty row

    // Add summary data
    Object.entries(summaryData).forEach(([key, value]) => {
      data.push([key, value]);
    });

    data.push([]); // Empty row
    data.push(['Generated on', format(new Date(), 'dd MMM yyyy, HH:mm')]);

    this.addWorksheet('Summary', data);
  }

  addTableSheet(
    name: string,
    tableData: TableData,
    options?: {
      autoFilter?: boolean;
      freeze?: { row?: number; col?: number };
    }
  ) {
    this.addWorksheet(name, tableData.rows, tableData.headers);

    if (options?.autoFilter) {
      const worksheet = this.worksheets.get(name);
      if (worksheet) {
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
      }
    }

    if (options?.freeze) {
      const worksheet = this.worksheets.get(name);
      if (worksheet) {
        worksheet['!freeze'] = {
          xSplit: options.freeze.col || 0,
          ySplit: options.freeze.row || 1,
          topLeftCell: 'A2',
          activePane: 'bottomRight',
          state: 'frozen'
        };
      }
    }
  }

  save(filename: string) {
    const wbout = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

  private s2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
}

// CSV Export Function
export function exportToCSV(data: any[][], filename: string, headers?: string[]) {
  const csvData = headers ? [headers, ...data] : data;

  const csvContent = csvData
    .map(row =>
      row
        .map(cell => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell || '');
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

// Unified Export Function
export async function exportData(
  data: any,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `export_${format(new Date(), 'yyyyMMdd_HHmmss')}`,
    title = 'Data Export',
    subtitle,
    format = 'excel',
    orientation = 'portrait',
    includeTimestamp = true
  } = options;

  const finalFilename = includeTimestamp
    ? `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}`
    : filename;

  switch (format) {
    case 'pdf':
      const pdfExporter = new PDFExporter(orientation);
      pdfExporter.addHeader(title, subtitle);

      if (data.summary) {
        pdfExporter.addSummaryCards(data.summary);
      }

      if (data.table) {
        pdfExporter.addTable(data.table, data.tableTitle);
      }

      if (data.chart) {
        pdfExporter.addChart(data.chartTitle || 'Chart', data.chartDescription);
      }

      pdfExporter.save(`${finalFilename}.pdf`);
      break;

    case 'excel':
      const excelExporter = new ExcelExporter();

      if (data.summary) {
        excelExporter.addSummarySheet(title, data.summary);
      }

      if (data.tables) {
        data.tables.forEach((table: any) => {
          excelExporter.addTableSheet(
            table.name,
            table.data,
            { autoFilter: true, freeze: { row: 1 } }
          );
        });
      } else if (data.table) {
        excelExporter.addTableSheet(
          'Data',
          data.table,
          { autoFilter: true, freeze: { row: 1 } }
        );
      }

      excelExporter.save(`${finalFilename}.xlsx`);
      break;

    case 'csv':
      if (data.table) {
        exportToCSV(data.table.rows, `${finalFilename}.csv`, data.table.headers);
      }
      break;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Hook for exporting dashboard data
export function useExport() {
  const exportDashboard = async (
    dashboardData: any,
    format: 'pdf' | 'excel' | 'csv' = 'excel'
  ) => {
    try {
      await exportData(dashboardData, {
        format,
        title: 'Dashboard Report',
        subtitle: `Generated from LaxmiOne NBFC`,
        includeTimestamp: true
      });

      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error };
    }
  };

  return { exportDashboard };
}