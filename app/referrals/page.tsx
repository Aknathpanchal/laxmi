'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiUsers, FiGift, FiShare2, FiCopy, FiCheck,
  FiDollarSign, FiTrendingUp, FiAward, FiTarget,
  FiMail, FiMessageCircle, FiSmartphone, FiLink,
  FiChevronRight, FiInfo, FiClock, FiCheckCircle,
  FiUser, FiCalendar, FiPercent, FiStar
} from 'react-icons/fi';
import {
  FaWhatsapp, FaFacebook, FaTwitter, FaTelegram,
  FaLinkedin, FaInstagram
} from 'react-icons/fa';
import { useAuth } from '@/lib/contexts/AuthContext';
// import { userService } from '@/lib/api/user.service';

interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'invited' | 'registered' | 'applied' | 'approved';
  inviteDate: string;
  joinDate?: string;
  loanAmount?: number;
  rewardEarned?: number;
}

interface RewardTier {
  level: number;
  name: string;
  minReferrals: number;
  rewardPerReferral: number;
  bonus: number;
  benefits: string[];
  color: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  earnings: number;
  avatar?: string;
}

export default function ReferralsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState('LAXMI2024XYZ');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMethod, setInviteMethod] = useState('email');
  const [inviteData, setInviteData] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const rewardTiers: RewardTier[] = [
    {
      level: 1,
      name: 'Bronze',
      minReferrals: 0,
      rewardPerReferral: 500,
      bonus: 0,
      benefits: ['₹500 per successful referral', 'Monthly reward updates'],
      color: 'orange'
    },
    {
      level: 2,
      name: 'Silver',
      minReferrals: 5,
      rewardPerReferral: 750,
      bonus: 2500,
      benefits: ['₹750 per successful referral', '₹2,500 milestone bonus', 'Priority support'],
      color: 'gray'
    },
    {
      level: 3,
      name: 'Gold',
      minReferrals: 10,
      rewardPerReferral: 1000,
      bonus: 5000,
      benefits: ['₹1,000 per successful referral', '₹5,000 milestone bonus', 'Exclusive offers', 'VIP support'],
      color: 'yellow'
    },
    {
      level: 4,
      name: 'Platinum',
      minReferrals: 20,
      rewardPerReferral: 1500,
      bonus: 15000,
      benefits: ['₹1,500 per successful referral', '₹15,000 milestone bonus', 'Premium benefits', 'Dedicated manager'],
      color: 'purple'
    }
  ];

  const mockReferrals: Referral[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      status: 'approved',
      inviteDate: '2024-01-10',
      joinDate: '2024-01-12',
      loanAmount: 300000,
      rewardEarned: 1000
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      status: 'applied',
      inviteDate: '2024-01-15',
      joinDate: '2024-01-18',
      loanAmount: 500000
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 76543 21098',
      status: 'registered',
      inviteDate: '2024-01-20',
      joinDate: '2024-01-22'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      phone: '+91 65432 10987',
      status: 'invited',
      inviteDate: '2024-01-25'
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Vikram Singh', referrals: 25, earnings: 37500 },
    { rank: 2, name: 'Anita Desai', referrals: 18, earnings: 18000 },
    { rank: 3, name: 'Rajesh Verma', referrals: 15, earnings: 15000 },
    { rank: 4, name: user?.fullName || 'You', referrals: 12, earnings: 12000 },
    { rank: 5, name: 'Meera Joshi', referrals: 10, earnings: 10000 }
  ];

  useEffect(() => {
    setReferralLink(`https://laxmione.com/refer/${referralCode}`);
    fetchReferrals();
  }, [referralCode]);

  const fetchReferrals = async () => {
    try {
      // Fetch actual referrals from API
      setReferrals(mockReferrals);
    } catch (error) {
      setReferrals(mockReferrals);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Join LaxmiOne and get instant personal loans! Use my referral code: ${referralCode}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(referralLink);

    const shareUrls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      instagram: '#' // Instagram doesn't support direct URL sharing
    };

    if (shareUrls[platform] && shareUrls[platform] !== '#') {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleSendInvite = () => {
    // Send invite logic here
    console.log('Sending invite:', inviteMethod, inviteData);
    setShowInviteModal(false);
    setInviteData({ email: '', phone: '', message: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'invited':
        return 'bg-blue-100 text-blue-700';
      case 'registered':
        return 'bg-yellow-100 text-yellow-700';
      case 'applied':
        return 'bg-purple-100 text-purple-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'invited':
        return FiMail;
      case 'registered':
        return FiUser;
      case 'applied':
        return FiClock;
      case 'approved':
        return FiCheckCircle;
      default:
        return FiInfo;
    }
  };

  const getCurrentTier = () => {
    const successfulReferrals = referrals.filter(r => r.status === 'approved').length;
    return rewardTiers.reduce((prev, current) =>
      successfulReferrals >= current.minReferrals ? current : prev
    );
  };

  const currentTier = getCurrentTier();
  const successfulReferrals = referrals.filter(r => r.status === 'approved').length;
  const totalEarnings = referrals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + (r.rewardEarned || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-600 mt-2">Earn rewards by referring friends and family</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Referrals</p>
            <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Successful</p>
            <p className="text-2xl font-bold text-green-600">{successfulReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiAward className={`w-8 h-8 text-${currentTier.color}-600`} />
            </div>
            <p className="text-sm text-gray-600">Current Tier</p>
            <p className="text-2xl font-bold text-gray-900">{currentTier.name}</p>
          </motion.div>
        </div>

        {/* Referral Code & Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold mb-2">Share & Earn</h2>
              <p className="opacity-90">Share your unique referral code and earn rewards for every successful referral</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{referralCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <FiShare2 className="inline mr-2" />
                Invite Friends
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm opacity-90 mb-3">Share on social media:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                <FaTelegram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <FiLink className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referrals List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>

              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No referrals yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start inviting friends to earn rewards!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map(referral => {
                    const StatusIcon = getStatusIcon(referral.status);
                    return (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{referral.name}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(referral.status)}`}>
                                <StatusIcon className="inline w-3 h-3 mr-1" />
                                {referral.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FiMail className="w-4 h-4" />
                                {referral.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <FiSmartphone className="w-4 h-4" />
                                {referral.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                Invited: {new Date(referral.inviteDate).toLocaleDateString()}
                              </div>
                              {referral.joinDate && (
                                <div className="flex items-center gap-1">
                                  <FiCheckCircle className="w-4 h-4" />
                                  Joined: {new Date(referral.joinDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                          {referral.rewardEarned && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Reward</p>
                              <p className="text-lg font-bold text-green-600">₹{referral.rewardEarned}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Reward Tiers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Reward Tiers</h3>
              <div className="space-y-3">
                {rewardTiers.map((tier, index) => {
                  const isCurrentTier = tier.level === currentTier.level;
                  const isUnlocked = successfulReferrals >= tier.minReferrals;

                  return (
                    <div
                      key={tier.level}
                      className={`border rounded-lg p-3 ${
                        isCurrentTier ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      } ${!isUnlocked && 'opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiAward className={`w-5 h-5 text-${tier.color}-600`} />
                          <span className="font-medium">{tier.name}</span>
                          {isCurrentTier && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                              Current
                            </span>
                          )}
                        </div>
                        {!isUnlocked && (
                          <FiLock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {tier.minReferrals}+ referrals • ₹{tier.rewardPerReferral}/referral
                      </p>
                      {tier.bonus > 0 && (
                        <p className="text-sm font-medium text-green-600">
                          +₹{tier.bonus.toLocaleString()} bonus
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-2 rounded ${
                      entry.name === (user?.fullName || 'You') ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{entry.name}</p>
                        <p className="text-xs text-gray-600">{entry.referrals} referrals</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">₹{entry.earnings.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Invite Friends</h3>

                <div className="flex gap-2 mb-4">
                  {['email', 'sms', 'whatsapp'].map(method => (
                    <button
                      key={method}
                      onClick={() => setInviteMethod(method)}
                      className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                        inviteMethod === method
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>

                {inviteMethod === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="friend@example.com"
                      />
                    </div>
                  </div>
                )}

                {inviteMethod === 'sms' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={inviteData.phone}
                        onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                )}

                {inviteMethod === 'whatsapp' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={inviteData.phone}
                        onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add a personal message..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvite}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Invite
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}