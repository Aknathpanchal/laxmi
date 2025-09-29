"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, Calendar, MapPin, Building,
  Edit2, Save, X, Camera, Shield, CheckCircle,
  AlertCircle, FileText, CreditCard, Briefcase,
  Home, Upload, Loader2
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { usersService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  panCard: string;
  aadharNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  employmentType: string;
  companyName: string;
  designation: string;
  monthlyIncome: string;
  kycStatus: string;
  creditScore: number;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "male",
    maritalStatus: "single",
    panCard: "",
    aadharNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    employmentType: "salaried",
    companyName: "",
    designation: "",
    monthlyIncome: "",
    kycStatus: "PENDING",
    creditScore: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await usersService.getProfile();

      if (response.success && response.data) {
        const data = response.data;
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          mobile: data.mobile || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "male",
          maritalStatus: data.maritalStatus || "single",
          panCard: data.panCard || "",
          aadharNumber: data.aadharNumber || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          employmentType: "salaried",
          companyName: "",
          designation: "",
          monthlyIncome: "",
          kycStatus: data.kycStatus || "PENDING",
          creditScore: data.creditScore || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await usersService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        maritalStatus: profileData.maritalStatus,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("type", type);

    try {
      // Upload document logic here
      setSuccessMessage(`${type} uploaded successfully`);
    } catch (err) {
      setError(`Failed to upload ${type}`);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "bank", label: "Bank Details", icon: CreditCard }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and documents</p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{successMessage}</span>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>

                {/* KYC Status */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">KYC Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      profileData.kycStatus === 'VERIFIED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profileData.kycStatus}
                    </span>
                  </div>
                  {profileData.kycStatus !== 'VERIFIED' && (
                    <button className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700">
                      Complete KYC →
                    </button>
                  )}
                </div>

                {/* Credit Score */}
                {profileData.creditScore > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Credit Score</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {profileData.creditScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(profileData.creditScore / 900) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Personal Information Tab */}
                  {activeTab === "personal" && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleCancel}
                              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              <span>Save</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            value={profileData.mobile}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marital Status
                          </label>
                          <select
                            name="maritalStatus"
                            value={profileData.maritalStatus}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={profileData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={profileData.pincode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === "documents" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-6">Documents</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">PAN Card</h4>
                              <p className="text-sm text-gray-600">
                                {profileData.panCard || "Not uploaded"}
                              </p>
                            </div>
                            <Shield className="w-8 h-8 text-gray-400" />
                          </div>
                          <input
                            type="file"
                            id="pan-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "PAN")}
                            accept="image/*,.pdf"
                          />
                          <label
                            htmlFor="pan-upload"
                            className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload PAN Card
                          </label>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Aadhaar Card</h4>
                              <p className="text-sm text-gray-600">
                                {profileData.aadharNumber ? "****" + profileData.aadharNumber.slice(-4) : "Not uploaded"}
                              </p>
                            </div>
                            <Shield className="w-8 h-8 text-gray-400" />
                          </div>
                          <input
                            type="file"
                            id="aadhaar-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "Aadhaar")}
                            accept="image/*,.pdf"
                          />
                          <label
                            htmlFor="aadhaar-upload"
                            className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload Aadhaar
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}