'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, User, Bell, TrendingUp, Calendar, Clock,
  Download, Plus, IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, ArrowUpRight, Wallet,
  Calculator, Eye, EyeOff, RefreshCw, Gift, History, Activity,
  FileSpreadsheet, FileCsv, Printer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDashboard } from '@/hooks/useDashboardData';
import { useAnalytics, useDashboardAnalytics } from '@/contexts/AnalyticsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ExportButton, QuickExportButtons } from '@/components/ui/ExportButton';
import { PDFExporter, ExcelExporter, exportToCSV } from '@/lib/export-utils';
// UserLayout is already applied by ConditionalLayout based on user role
import { DashboardLoading, CardSkeleton, TableSkeleton } from '@/components/ui/LoadingStates';
import { DashboardErrorBoundary, ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import { format } from 'date-fns';

function UserDashboardExportContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading, error, refetch } = useUserDashboard({ refreshInterval: 30000 });
  const { trackPageView, trackAction } = useAnalytics();
  const { trackDashboardLoad, trackWidgetInteraction } = useDashboardAnalytics('user');
  const { addNotification } = useNotifications();

  // Track page view and dashboard load
  useEffect(() => {
    const startTime = performance.now();

    if (!loading) {
      const loadTime = performance.now() - startTime;
      trackDashboardLoad(loadTime);
      trackPageView('/user/export', 'User Dashboard - Export Demo');
    }
  }, [loading]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'USER')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Prepare data for export
  const prepareExportData = (format: string) => {
    if (!data) return null;

    const { profile, loans, financials, rewards, recentTransactions } = data;

    // Summary data
    const summaryData = {
      'Customer Name': profile.name,
      'Customer ID': profile.customerId,
      'Credit Score': profile.creditScore,
      'Available Credit': `₹${profile.availableCredit.toLocaleString()}`,
      'Monthly EMI': `₹${financials.monthlyEMI.toLocaleString()}`,
      'Total Outstanding': `₹${financials.totalOutstanding.toLocaleString()}`,
      'Reward Points': rewards.totalPoints,
      'Member Since': format(new Date(profile.memberSince), 'dd MMM yyyy')
    };

    // Summary cards for PDF
    const summaryCards = [
      { label: 'Available Credit', value: `₹${profile.availableCredit.toLocaleString()}`, change: '+2.5%' },
      { label: 'Monthly EMI', value: `₹${financials.monthlyEMI.toLocaleString()}` },
      { label: 'Reward Points', value: rewards.totalPoints },
      { label: 'Credit Score', value: profile.creditScore }
    ];

    // Active loans table
    const loansTable = {
      headers: ['Loan Type', 'Amount', 'EMI', 'Next Due', 'Status', 'Progress'],
      rows: loans.active.map((loan: any) => [
        loan.type,
        `₹${loan.amount.toLocaleString()}`,
        `₹${loan.emi.toLocaleString()}`,
        format(new Date(loan.nextDueDate), 'dd MMM yyyy'),
        loan.status,
        `${((loan.completedMonths / loan.tenure) * 100).toFixed(0)}%`
      ])
    };

    // Recent transactions table
    const transactionsTable = {
      headers: ['Date', 'Type', 'Description', 'Amount', 'Status'],
      rows: recentTransactions.map((txn: any) => [
        format(new Date(txn.date), 'dd MMM yyyy'),
        txn.type,
        txn.description || txn.loanId,
        `₹${txn.amount.toLocaleString()}`,
        txn.status
      ])
    };

    if (format === 'pdf') {
      return {
        summary: summaryCards,
        table: loansTable,
        tableTitle: 'Active Loans'
      };
    }

    if (format === 'excel') {
      return {
        summary: summaryData,
        tables: [
          { name: 'Active Loans', data: loansTable },
          { name: 'Recent Transactions', data: transactionsTable }
        ]
      };
    }

    if (format === 'csv') {
      return {
        table: transactionsTable
      };
    }

    return {
      summary: summaryData,
      table: loansTable
    };
  };

  // Custom export handlers
  const handleCustomPDFExport = async () => {
    if (!data) return;

    const pdfExporter = new PDFExporter('portrait');

    // Add header
    pdfExporter.addHeader(
      'LaxmiOne Customer Dashboard Report',
      `Generated for ${data.profile.name} on ${format(new Date(), 'dd MMM yyyy')}`
    );

    // Add summary cards
    pdfExporter.addSummaryCards([
      { label: 'Available Credit', value: `₹${data.profile.availableCredit.toLocaleString()}`, change: '+2.5%' },
      { label: 'Monthly EMI', value: `₹${data.financials.monthlyEMI.toLocaleString()}` },
      { label: 'Reward Points', value: data.rewards.totalPoints },
      { label: 'Credit Score', value: data.profile.creditScore }
    ]);

    // Add loans table
    if (data.loans.active.length > 0) {
      const loansTable = {
        headers: ['Loan Type', 'Amount', 'EMI', 'Status'],
        rows: data.loans.active.map((loan: any) => [
          loan.type,
          `₹${loan.amount.toLocaleString()}`,
          `₹${loan.emi.toLocaleString()}`,
          loan.status
        ])
      };
      pdfExporter.addTable(loansTable, 'Active Loans');
    }

    // Add chart placeholder
    pdfExporter.addChart('Payment History', 'Last 6 months payment trend');

    // Save the PDF
    pdfExporter.save(`dashboard_report_${format(new Date(), 'yyyyMMdd')}.pdf`);

    addNotification({
      type: 'SUCCESS',
      title: 'PDF Generated',
      message: 'Your dashboard report has been downloaded',
      priority: 'LOW'
    });

    trackAction('export_pdf', 'download');
  };

  const handleCustomExcelExport = async () => {
    if (!data) return;

    const excelExporter = new ExcelExporter();

    // Add summary sheet
    excelExporter.addSummarySheet('Dashboard Summary', {
      'Customer Name': data.profile.name,
      'Customer ID': data.profile.customerId,
      'Credit Score': data.profile.creditScore,
      'Available Credit': `₹${data.profile.availableCredit.toLocaleString()}`,
      'Monthly EMI': `₹${data.financials.monthlyEMI.toLocaleString()}`,
      'Total Outstanding': `₹${data.financials.totalOutstanding.toLocaleString()}`,
      'Reward Points': data.rewards.totalPoints,
      'Member Since': format(new Date(data.profile.memberSince), 'dd MMM yyyy')
    });

    // Add loans sheet
    if (data.loans.active.length > 0) {
      const loansData = data.loans.active.map((loan: any) => [
        loan.id,
        loan.type,
        loan.amount,
        loan.emi,
        format(new Date(loan.nextDueDate), 'dd MMM yyyy'),
        loan.status,
        loan.completedMonths,
        loan.tenure
      ]);

      excelExporter.addTableSheet(
        'Active Loans',
        {
          headers: ['Loan ID', 'Type', 'Amount', 'EMI', 'Next Due Date', 'Status', 'Months Paid', 'Total Months'],
          rows: loansData
        },
        { autoFilter: true, freeze: { row: 1 } }
      );
    }

    // Add transactions sheet
    if (data.recentTransactions.length > 0) {
      const transactionData = data.recentTransactions.map((txn: any) => [
        format(new Date(txn.date), 'dd MMM yyyy'),
        txn.type,
        txn.description || txn.loanId,
        txn.amount,
        txn.status
      ]);

      excelExporter.addTableSheet(
        'Recent Transactions',
        {
          headers: ['Date', 'Type', 'Description', 'Amount', 'Status'],
          rows: transactionData
        },
        { autoFilter: true, freeze: { row: 1 } }
      );
    }

    // Save the Excel file
    excelExporter.save(`dashboard_data_${format(new Date(), 'yyyyMMdd')}.xlsx`);

    addNotification({
      type: 'SUCCESS',
      title: 'Excel Generated',
      message: 'Your dashboard data has been exported',
      priority: 'LOW'
    });

    trackAction('export_excel', 'download');
  };

  // Show loading state
  if (authLoading || loading) {
    return <DashboardLoading role="USER" message="Loading dashboard with export features..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Dashboard</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <DashboardLoading role="USER" />;
  }

  const { profile, loans, financials, rewards, notifications, quickActions, recentTransactions } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header with Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.name}!</h1>
            <p className="text-blue-100">Dashboard with Export Features</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Quick export buttons */}
            <QuickExportButtons
              data={prepareExportData('excel')}
              filename="dashboard_quick"
            />

            {/* Main export dropdown */}
            <ExportButton
              data={prepareExportData('pdf')}
              filename="dashboard_report"
              title="Dashboard Report"
              preprocessData={prepareExportData}
              onExport={(format) => trackAction(`export_${format}`, 'download')}
            />
          </div>
        </div>
      </motion.div>

      {/* Export Demo Section */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Export Options Demo</h2>
        <p className="text-slate-400 mb-6">
          Export your dashboard data in multiple formats with custom styling and formatting.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomPDFExport}
            className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg hover:border-red-500/40 transition-all"
          >
            <FileText className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-medium text-white mb-1">PDF Report</h3>
            <p className="text-xs text-slate-400">
              Professional formatted report with charts and tables
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomExcelExport}
            className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-all"
          >
            <FileSpreadsheet className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-medium text-white mb-1">Excel Workbook</h3>
            <p className="text-xs text-slate-400">
              Multi-sheet workbook with filters and formatting
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (data.recentTransactions.length > 0) {
                const csvData = data.recentTransactions.map((txn: any) => [
                  format(new Date(txn.date), 'dd MMM yyyy'),
                  txn.type,
                  txn.description || txn.loanId,
                  txn.amount,
                  txn.status
                ]);
                exportToCSV(
                  csvData,
                  `transactions_${format(new Date(), 'yyyyMMdd')}.csv`,
                  ['Date', 'Type', 'Description', 'Amount', 'Status']
                );
                addNotification({
                  type: 'SUCCESS',
                  title: 'CSV Exported',
                  message: 'Transaction data exported',
                  priority: 'LOW'
                });
              }
            }}
            className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-all"
          >
            <FileCsv className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-medium text-white mb-1">CSV Data</h3>
            <p className="text-xs text-slate-400">
              Raw data export for spreadsheet applications
            </p>
          </motion.button>
        </div>
      </div>

      {/* Quick Stats with Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 p-6 rounded-xl relative"
          >
            <ExportButton
              data={{
                summary: {
                  'Available Credit': `₹${profile.availableCredit.toLocaleString()}`,
                  'Last Updated': format(new Date(), 'dd MMM yyyy HH:mm')
                }
              }}
              filename="credit_summary"
              variant="icon"
              className="absolute top-4 right-4"
              formats={['pdf']}
            />
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-green-500">+2.5%</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Available Credit</p>
            <p className="text-2xl font-bold text-white">₹{profile.availableCredit.toLocaleString()}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-blue-500">Active</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-white">₹{financials.monthlyEMI.toLocaleString()}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Gift className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-yellow-500">Gold</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Reward Points</p>
            <p className="text-2xl font-bold text-white">{rewards.totalPoints}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs text-emerald-500">Excellent</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Credit Score</p>
            <p className="text-2xl font-bold text-white">{profile.creditScore}</p>
          </motion.div>
        </ComponentErrorBoundary>
      </div>

      {/* Active Loans with Export */}
      <ComponentErrorBoundary>
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Active Loans</h2>
            <div className="flex items-center space-x-2">
              <ExportButton
                data={{
                  table: {
                    headers: ['Loan Type', 'Amount', 'EMI', 'Status'],
                    rows: loans.active.map((loan: any) => [
                      loan.type,
                      `₹${loan.amount.toLocaleString()}`,
                      `₹${loan.emi.toLocaleString()}`,
                      loan.status
                    ])
                  }
                }}
                filename="active_loans"
                variant="button"
                formats={['excel', 'csv']}
              />
              <button
                onClick={() => router.push('/user/loans')}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          {loans.active.length > 0 ? (
            <div className="space-y-4">
              {loans.active.map((loan: any) => (
                <div
                  key={loan.id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                  onClick={() => router.push(`/user/loans/${loan.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{loan.type}</h3>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Loan Amount</p>
                      <p className="font-medium text-white">₹{loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">EMI</p>
                      <p className="font-medium text-white">₹{loan.emi.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Next Due</p>
                      <p className="font-medium text-white">
                        {format(new Date(loan.nextDueDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Progress</p>
                      <div className="mt-1">
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(loan.completedMonths / loan.tenure) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No active loans</p>
            </div>
          )}
        </div>
      </ComponentErrorBoundary>
    </div>
  );
}

export default function UserDashboardExport() {
  return (
    <DashboardErrorBoundary>
      <>
        <UserDashboardExportContent />
      </>
    </DashboardErrorBoundary>
  );
}