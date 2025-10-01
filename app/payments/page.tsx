"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CreditCard, Wallet, Smartphone, Building, Globe,
  CheckCircle, AlertCircle, Clock, ArrowRight,
  Shield, Lock, Info, Calendar, DollarSign,
  TrendingUp, FileText, Download, Filter,
  ChevronRight, X, Loader2, RefreshCw
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
// import { paymentsService, loansService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface PaymentMethod {
  id: string;
  type: "upi" | "netbanking" | "debit_card" | "credit_card" | "wallet";
  name: string;
  icon: any;
  details?: string;
  isDefault?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: "success" | "pending" | "failed";
  description: string;
  referenceNumber: string;
}

interface EMIDue {
  loanId: string;
  loanType: string;
  emiNumber: number;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  penaltyAmount?: number;
}

export default function PaymentsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pay-emi");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState<EMIDue | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [emiDues, setEmiDues] = useState<EMIDue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    { id: "upi", type: "upi", name: "UPI", icon: Smartphone, details: "Pay using any UPI app" },
    { id: "netbanking", type: "netbanking", name: "Net Banking", icon: Building, details: "All major banks supported" },
    { id: "debit", type: "debit_card", name: "Debit Card", icon: CreditCard, details: "Visa, Mastercard, Rupay" },
    { id: "credit", type: "credit_card", name: "Credit Card", icon: CreditCard, details: "Visa, Mastercard, Amex" },
    { id: "wallet", type: "wallet", name: "Wallet", icon: Wallet, details: "Paytm, PhonePe, etc." }
  ];

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);

      // // Fetch EMI schedule and transaction history
      // const [loansRes, transactionsRes] = await Promise.allSettled([
      //   loansService.getMyLoans(),
      //   paymentsService.getTransactionHistory()
      // ]);

      // // Process EMI dues from loans
      // if (loansRes.status === 'fulfilled' && loansRes.value.success && loansRes.value.data) {
      //   const dues: EMIDue[] = loansRes.value.data
      //     .filter((loan: any) => loan.status === 'ACTIVE' || loan.status === 'DISBURSED')
      //     .map((loan: any) => ({
      //       loanId: loan.id,
      //       loanType: loan.loanType || 'Personal Loan',
      //       emiNumber: 1,
      //       amount: loan.emi || 0,
      //       dueDate: loan.nextPaymentDate || new Date().toISOString(),
      //       status: 'pending' as const
      //     }));
      //   setEmiDues(dues);
      // } else {
      //   // Mock data
      //   setEmiDues([
      //     {
      //       loanId: "LN001",
      //       loanType: "Personal Loan",
      //       emiNumber: 5,
      //       amount: 15420,
      //       dueDate: "2024-12-05",
      //       status: "pending"
      //     },
      //     {
      //       loanId: "LN002",
      //       loanType: "Emergency Fund",
      //       emiNumber: 3,
      //       amount: 5200,
      //       dueDate: "2024-12-08",
      //       status: "overdue",
      //       penaltyAmount: 500
      //     }
      //   ]);
      // }

      // // Process transactions
      // if (transactionsRes.status === 'fulfilled' && transactionsRes.value.success && transactionsRes.value.data) {
      //   setTransactions(transactionsRes.value.data.transactions.map((tx: any) => ({
      //     id: tx.id,
      //     date: tx.createdAt,
      //     amount: tx.amount,
      //     type: tx.purpose || 'EMI Payment',
      //     status: tx.status.toLowerCase() as any,
      //     description: tx.purpose || 'EMI Payment',
      //     referenceNumber: tx.transactionId || tx.id
      //   })));
      // } else {
      //   // Mock transactions
      //   setTransactions([
      //     {
      //       id: "TXN001",
      //       date: "2024-11-05",
      //       amount: 15420,
      //       type: "EMI Payment",
      //       status: "success",
      //       description: "EMI #4 - Personal Loan",
      //       referenceNumber: "PAY123456789"
      //     },
      //     {
      //       id: "TXN002",
      //       date: "2024-10-05",
      //       amount: 15420,
      //       type: "EMI Payment",
      //       status: "success",
      //       description: "EMI #3 - Personal Loan",
      //       referenceNumber: "PAY123456788"
      //     }
      //   ]);
      // }
    } catch (err) {
      console.error("Failed to fetch payment data:", err);
      setError("Failed to load payment information");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedEMI || !selectedPaymentMethod) return;

    setIsProcessing(true);
    setError(null);

    try {
      // // Initiate payment
      // const response = await paymentsService.initiatePayment({
      //   amount: selectedEMI.amount + (selectedEMI.penaltyAmount || 0),
      //   purpose: 'loan_repayment',
      //   loanId: selectedEMI.loanId,
      //   description: `EMI Payment #${selectedEMI.emiNumber}`,
      //   paymentMethod: selectedPaymentMethod as any
      // });

      // if (response.success && response.data) {
      //   // Handle Razorpay payment
      //   if (response.data.razorpayOrderId) {
      //     // In production, open Razorpay checkout
      //     console.log("Razorpay Order ID:", response.data.razorpayOrderId);

      //     // Simulate payment success
      //     setTimeout(() => {
      //       setShowReceipt(true);
      //       setIsProcessing(false);
      //     }, 2000);
      //   }
      // } else {
      //   setError(response.error || "Payment initiation failed");
      //   setIsProcessing(false);
      // }
    } catch (err: any) {
      setError(err.message || "Payment processing failed");
      setIsProcessing(false);
    }
  };

  const downloadReceipt = async (transactionId: string) => {
    try {
      // const blob = await paymentsService.getPaymentReceipt(transactionId);
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `receipt-${transactionId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-2">Manage your loan payments and transactions</p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("pay-emi")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "pay-emi"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pay EMI
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "history"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Payment History
                </button>
                <button
                  onClick={() => setActiveTab("autopay")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "autopay"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Auto Pay
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Pay EMI Tab */}
              {activeTab === "pay-emi" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Upcoming EMIs</h2>

                  {emiDues.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900">All EMIs Paid!</h3>
                      <p className="text-gray-600 mt-2">You have no pending EMI payments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {emiDues.map((emi) => (
                        <motion.div
                          key={emi.loanId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-6 ${
                            selectedEMI?.loanId === emi.loanId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <input
                                  type="radio"
                                  name="emi"
                                  checked={selectedEMI?.loanId === emi.loanId}
                                  onChange={() => setSelectedEMI(emi)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {emi.loanType} - EMI #{emi.emiNumber}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Loan ID: {emi.loanId}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Due Date</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatDate(emi.dueDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">EMI Amount</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(emi.amount)}
                                  </p>
                                </div>
                                {emi.penaltyAmount && (
                                  <div>
                                    <p className="text-sm text-gray-600">Late Fee</p>
                                    <p className="font-semibold text-red-600">
                                      {formatCurrency(emi.penaltyAmount)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total Due</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(emi.amount + (emi.penaltyAmount || 0))}
                              </p>
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                                emi.status === "overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {emi.status === "overdue" ? "Overdue" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {selectedEMI && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>

                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {paymentMethods.map((method) => (
                          <motion.div
                            key={method.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedPaymentMethod === method.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <method.icon className="w-6 h-6 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">{method.name}</p>
                                <p className="text-xs text-gray-600">{method.details}</p>
                              </div>
                            </div>
                            {selectedPaymentMethod === method.id && (
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Security Info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">
                            Your payment information is secured with 256-bit encryption
                          </span>
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button
                        onClick={handlePayment}
                        disabled={!selectedPaymentMethod || isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>
                              Pay {formatCurrency(selectedEMI.amount + (selectedEMI.penaltyAmount || 0))}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Payment History Tab */}
              {activeTab === "history" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Reference</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {transaction.referenceNumber}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                transaction.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => downloadReceipt(transaction.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Auto Pay Tab */}
              {activeTab === "autopay" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Auto Pay Setup</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Never miss an EMI payment
                        </h3>
                        <p className="text-blue-700 text-sm mb-4">
                          Set up auto-debit to automatically pay your EMIs on the due date.
                          You can pause or cancel anytime.
                        </p>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Set Up Auto Pay
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Benefits of Auto Pay</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Never Miss a Payment</h4>
                        <p className="text-sm text-gray-600">
                          Automatic deduction ensures timely payments
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Improve Credit Score</h4>
                        <p className="text-sm text-gray-600">
                          Consistent payments boost your credit rating
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <Shield className="w-8 h-8 text-purple-500 mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Safe & Secure</h4>
                        <p className="text-sm text-gray-600">
                          Bank-grade security for all transactions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Success Modal */}
        <AnimatePresence>
          {showReceipt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your EMI payment has been processed successfully.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold">
                      {selectedEMI && formatCurrency(selectedEMI.amount + (selectedEMI.penaltyAmount || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-semibold">PAY{Date.now()}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download Receipt
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}