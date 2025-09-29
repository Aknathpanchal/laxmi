"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Paperclip, Search, Plus,
  Phone, Mail, Clock, CheckCircle, AlertCircle,
  User, Bot, ChevronDown, X, Filter, Star,
  HelpCircle, FileText, Loader2, Mic, MicOff
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { supportService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  lastUpdate: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender: "user" | "agent" | "bot";
  senderName?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: boolean;
}

export default function SupportPage() {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: ""
  });

  const categories = [
    { value: "general", label: "General Query" },
    { value: "loan", label: "Loan Related" },
    { value: "payment", label: "Payment Issues" },
    { value: "kyc", label: "KYC Verification" },
    { value: "technical", label: "Technical Support" },
    { value: "complaint", label: "Complaint" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" }
  ];

  useEffect(() => {
    fetchSupportData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSupportData = async () => {
    try {
      setIsLoading(true);

      // Fetch tickets and FAQs
      const [ticketsRes, faqsRes] = await Promise.allSettled([
        supportService.getTickets(),
        supportService.getFAQs()
      ]);

      // Process tickets
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.success && ticketsRes.value.data) {
        setTickets(ticketsRes.value.data.tickets);
      } else {
        // Mock tickets
        setTickets([
          {
            id: "1",
            ticketNumber: "TKT001",
            subject: "Unable to make payment",
            category: "payment",
            priority: "high",
            status: "open",
            createdAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            messages: [
              {
                id: "1",
                sender: "user",
                message: "I'm trying to pay my EMI but the payment is failing",
                timestamp: new Date().toISOString()
              },
              {
                id: "2",
                sender: "agent",
                senderName: "Support Agent",
                message: "I understand you're having trouble with your payment. Let me help you with that. Can you please share the error message you're seeing?",
                timestamp: new Date().toISOString()
              }
            ]
          }
        ]);
      }

      // Process FAQs
      if (faqsRes.status === 'fulfilled' && faqsRes.value.success && faqsRes.value.data) {
        setFAQs(faqsRes.value.data);
      } else {
        // Mock FAQs
        setFAQs([
          {
            id: "1",
            question: "How do I apply for a loan?",
            answer: "You can apply for a loan by clicking on the 'Apply Now' button on our homepage. Fill in the application form with your personal and employment details, upload required documents, and submit. You'll receive instant approval decision.",
            category: "loan",
            helpful: true
          },
          {
            id: "2",
            question: "What documents are required for KYC?",
            answer: "For KYC verification, you need to provide: 1) PAN Card, 2) Aadhaar Card, 3) Selfie with document, 4) Bank Statement (last 3 months), 5) Salary Slip (if salaried).",
            category: "kyc",
            helpful: true
          },
          {
            id: "3",
            question: "How can I track my loan application?",
            answer: "You can track your loan application by logging into your account and visiting the 'Track Application' section. You'll see real-time status updates of your application.",
            category: "loan",
            helpful: true
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch support data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) return;

    setIsSending(true);
    try {
      const response = await supportService.createTicket({
        subject: newTicket.subject,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority
      });

      if (response.success && response.data) {
        const ticket: Ticket = {
          ...response.data,
          messages: [
            {
              id: "1",
              sender: "user",
              message: newTicket.description,
              timestamp: new Date().toISOString()
            }
          ]
        };
        setTickets([ticket, ...tickets]);
        setSelectedTicket(ticket);
        setIsCreatingTicket(false);
        setNewTicket({
          subject: "",
          category: "general",
          priority: "medium",
          description: ""
        });
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedTicket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    });
    setMessage("");
    setIsSending(true);

    try {
      await supportService.sendMessage(selectedTicket.id, message);

      // Simulate agent response after 2 seconds
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          senderName: "Support Agent",
          message: "Thank you for your message. I'm looking into this for you.",
          timestamp: new Date().toISOString()
        };

        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, agentMessage]
        } : null);
      }, 2000);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFAQRating = async (faqId: string, helpful: boolean) => {
    try {
      await supportService.rateFAQ(faqId, helpful);
      setFAQs(prev => prev.map(faq =>
        faq.id === faqId ? { ...faq, helpful } : faq
      ));
    } catch (error) {
      console.error("Failed to rate FAQ:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priorities.find(p => p.value === priority);
    return p?.color || "bg-gray-100 text-gray-800";
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">Get help with your queries and issues</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Phone className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">1800-123-4567</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-sm text-gray-600">support@laxmione.com</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Working Hours</p>
                <p className="text-sm text-gray-600">Mon-Sat 9AM-7PM</p>
              </div>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "tickets"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Support Tickets
                </button>
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "faq"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  FAQs
                </button>
                <button
                  onClick={() => setActiveTab("live-chat")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "live-chat"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Live Chat
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Tickets Tab */}
              {activeTab === "tickets" && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Tickets List */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Your Tickets</h3>
                      <button
                        onClick={() => setIsCreatingTicket(true)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tickets.length === 0 ? (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No support tickets yet</p>
                          <button
                            onClick={() => setIsCreatingTicket(true)}
                            className="mt-3 text-blue-600 hover:text-blue-700"
                          >
                            Create your first ticket
                          </button>
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <motion.div
                            key={ticket.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedTicket?.id === ticket.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {ticket.subject}
                              </h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                getStatusColor(ticket.status)
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">#{ticket.ticketNumber}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                getPriorityColor(ticket.priority)
                              }`}>
                                {ticket.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(ticket.lastUpdate).toLocaleDateString()}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2">
                    {selectedTicket ? (
                      <div className="flex flex-col h-[600px]">
                        {/* Chat Header */}
                        <div className="border-b border-gray-200 pb-4 mb-4">
                          <h3 className="font-semibold text-gray-900">{selectedTicket.subject}</h3>
                          <p className="text-sm text-gray-600">Ticket #{selectedTicket.ticketNumber}</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                          {selectedTicket.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-[70%] ${
                                msg.sender === "user"
                                  ? "bg-blue-600 text-white rounded-l-lg rounded-br-lg"
                                  : "bg-gray-100 text-gray-900 rounded-r-lg rounded-bl-lg"
                              } p-3`}>
                                {msg.sender !== "user" && (
                                  <p className="text-xs font-medium mb-1 opacity-75">
                                    {msg.senderName || "Support Agent"}
                                  </p>
                                )}
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${
                                  msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                                }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                              <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                              placeholder="Type your message..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!message.trim() || isSending}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Send className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[600px] text-center">
                        <div>
                          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Select a ticket to view conversation
                          </h3>
                          <p className="text-gray-600">
                            Choose a ticket from the list or create a new one
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === "faq" && (
                <div>
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative max-w-xl mx-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4">
                    {faqs
                      .filter(faq =>
                        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((faq) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-start space-x-3">
                            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                              <p className="text-gray-600 mb-4">{faq.answer}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Was this helpful?</span>
                                <button
                                  onClick={() => handleFAQRating(faq.id, true)}
                                  className={`p-1 rounded ${
                                    faq.helpful ? "text-green-600" : "text-gray-400 hover:text-green-600"
                                  }`}
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleFAQRating(faq.id, false)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Live Chat Tab */}
              {activeTab === "live-chat" && (
                <div className="text-center py-12">
                  <Bot className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h2>
                  <p className="text-gray-600 mb-6">Get instant help from our AI-powered assistant</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Start Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Ticket Modal */}
        <AnimatePresence>
          {isCreatingTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsCreatingTicket(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreatingTicket(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    disabled={!newTicket.subject || !newTicket.description || isSending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSending ? "Creating..." : "Create Ticket"}
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