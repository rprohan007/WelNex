import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { WelNexLogo } from '../common/WelNexLogo';
import { useAuth, isEmailAuthorizedAdmin } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  Users,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  Building2,
  LogOut,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Upload,
  AlertCircle,
  FileSpreadsheet,
  UserCheck,
  MessageSquare,
  Eye,
  Radio,
  Calendar,
  Zap,
  FileText
} from 'lucide-react';
import { marketDataService } from '../../services/marketDataService';
import rawInvestments from '../../data/investmentsData.json';
import type { Topic, SubTopic, DifficultyLevel, ChapterResource } from '../../types/academy';
import type { InvestmentItem, WaitlistLead } from '../../types';
import {
  getWaitlistLeads,
  updateWaitlistLeadStatus,
  deleteWaitlistLead,
  exportWaitlistToCSV
} from '../../data/waitlistData';
import {
  getContactInquiries,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiriesToCSV,
  type ContactInquiry,
  type InquiryStatus
} from '../../data/inquiriesData';
import {
  fetchInvestmentsFromSupabase,
  upsertInvestmentToSupabase,
  deleteInvestmentFromSupabase
} from '../../services/investmentsService';
import {
  fetchAcademyDataFromSupabase,
  upsertAcademyTopicToSupabase,
  deleteAcademyTopicFromSupabase,
  upsertAcademyChapterToSupabase,
  deleteAcademyChapterFromSupabase,
  safeSaveAcademyTopicsToLocalStorage
} from '../../services/academyService';
import { saveDocumentToIndexedDB } from '../../services/indexedDbStorage';
import {
  fetchWaitlistLeadsFromSupabase,
  updateWaitlistLeadStatusInSupabase,
  deleteWaitlistLeadFromSupabase
} from '../../services/waitlistService';
import {
  fetchContactInquiriesFromSupabase,
  updateInquiryStatusInSupabase,
  deleteInquiryFromSupabase
} from '../../services/inquiriesService';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

interface AdminCMSPortalProps {
  onBackToHome: () => void;
  onOpenExplore?: () => void;
}

interface TeamAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Senior Editor' | 'Investment Analyst' | 'Compliance Officer' | 'Viewer';
  permissions: string[];
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

const DEFAULT_ADMINS: TeamAdmin[] = [];
const LEGACY_MOCK_ADMIN_IDS = new Set(['admin-02', 'admin-03', 'admin-04']);

export const AdminCMSPortal: React.FC<AdminCMSPortalProps> = ({
  onBackToHome,
  onOpenExplore
}) => {
  const { user, isAuthorizedAdmin, signInWithGoogle, openAuthModal } = useAuth();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('welnex_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState<string>('rprohan06@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••••••');
  const [loginError, setLoginError] = useState<string>('');

  // Active Tab: listings, academy, waitlist, inquiries, rbac
  const [activeTab, setActiveTab] = useState<'listings' | 'academy' | 'waitlist' | 'inquiries' | 'rbac'>('listings');

  // INQUIRIES CMS STATE
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => getContactInquiries());
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'All' | InquiryStatus>('All');
  const [viewingInquiry, setViewingInquiry] = useState<ContactInquiry | null>(null);

  // TEAM RBAC STATE
  const [teamAdmins, setTeamAdmins] = useState<TeamAdmin[]>(() => {
    try {
      const stored = localStorage.getItem('welnex_admin_team');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(a => a && a.id && !LEGACY_MOCK_ADMIN_IDS.has(a.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('welnex_admin_team', JSON.stringify(cleaned));
          }
          return cleaned;
        }
        return [];
      }
      return DEFAULT_ADMINS;
    } catch {
      return DEFAULT_ADMINS;
    }
  });
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<TeamAdmin['role']>('Investment Analyst');

  // WAITLIST CMS STATE
  const [waitlistLeads, setWaitlistLeads] = useState<WaitlistLead[]>(() => getWaitlistLeads());
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [waitlistProfileFilter, setWaitlistProfileFilter] = useState('All');
  const [waitlistStatusFilter, setWaitlistStatusFilter] = useState('All');

  // INVESTMENTS CMS STATE
  const [investments, setInvestments] = useState<InvestmentItem[]>(() => {
    try {
      const stored = localStorage.getItem('welnex_custom_investments');
      return stored ? JSON.parse(stored) : (rawInvestments as unknown as InvestmentItem[]);
    } catch {
      return rawInvestments as unknown as InvestmentItem[];
    }
  });
  const [investmentSearch, setInvestmentSearch] = useState('');
  const [investmentCategoryFilter, setInvestmentCategoryFilter] = useState('All');
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentItem | null>(null);

  // Investment Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>('REIT');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formAccessModel, setFormAccessModel] = useState<'Direct Public' | 'Verified Partner'>('Direct Public');
  const [formSponsor, setFormSponsor] = useState('');
  const [formMinInvestment, setFormMinInvestment] = useState('');
  const [formYield, setFormYield] = useState('');
  const [formRisk, setFormRisk] = useState<InvestmentItem['riskLevel']>('Moderate');
  const [formTenure, setFormTenure] = useState('');
  const [formLiquidity, setFormLiquidity] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRegulatoryBody, setFormRegulatoryBody] = useState('SEBI');
  const [formPhotoUrls, setFormPhotoUrls] = useState<string>('');
  const [formAssetLocations, setFormAssetLocations] = useState<string>('');
  // Dynamic Custom Fields & Gallery Photos (Prompt Requirement 1)
  const [formCustomFields, setFormCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);

  // Dual-Mode Pricing Architecture Form State (Prompt Requirement 4)
  const [formPriceMode, setFormPriceMode] = useState<'LIVE_MARKET' | 'PERIODIC_NAV'>('LIVE_MARKET');
  const [formSymbolTicker, setFormSymbolTicker] = useState('');
  const [formCurrentPrice, setFormCurrentPrice] = useState('388.50');
  const [formPriceChange24h, setFormPriceChange24h] = useState('0.00');
  const [formPriceChangePercent24h, setFormPriceChangePercent24h] = useState('0.00');
  const [formYieldPayoutFrequency, setFormYieldPayoutFrequency] = useState<string>('Quarterly');
  const [formLastValuationPeriod, setFormLastValuationPeriod] = useState('Q3 2026');

  // ACADEMY CMS STATE
  const [academyTopics, setAcademyTopics] = useState<Topic[]>(() => {
    try {
      const stored = localStorage.getItem('welnex_custom_academy_topics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(academyTopics[0]?.id || null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [activeParentTopicId, setActiveParentTopicId] = useState<string>('');

  // Topic Form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCategory, setTopicCategory] = useState('REITs');
  const [topicDescription, setTopicDescription] = useState('');

  // Chapter Form
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDifficulty, setChapterDifficulty] = useState<DifficultyLevel>('Beginner');
  const [chapterDuration, setChapterDuration] = useState('8 mins');
  const [chapterContent, setChapterContent] = useState('');
  const [chapterQuizQuestion, setChapterQuizQuestion] = useState('');
  const [chapterQuizOptions, setChapterQuizOptions] = useState('Option A, Option B, Option C, Option D');
  const [chapterQuizCorrectIndex, setChapterQuizCorrectIndex] = useState(0);
  const [chapterQuizExplanation, setChapterQuizExplanation] = useState('');

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('welnex_admin_team', JSON.stringify(teamAdmins));
    } catch {
      // ignore
    }
  }, [teamAdmins]);

  useEffect(() => {
    try {
      localStorage.setItem('welnex_custom_investments', JSON.stringify(investments));
    } catch {
      // ignore
    }
  }, [investments]);

  useEffect(() => {
    safeSaveAcademyTopicsToLocalStorage(academyTopics);
  }, [academyTopics]);

  // Load fresh data from Supabase
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseData = async () => {
      try {
        const [liveInvs, liveTopics, liveWaitlist, liveInquiries] = await Promise.all([
          fetchInvestmentsFromSupabase(),
          fetchAcademyDataFromSupabase(),
          fetchWaitlistLeadsFromSupabase(),
          fetchContactInquiriesFromSupabase()
        ]);
        if (!isMounted) return;
        if (liveInvs && liveInvs.length > 0) setInvestments(liveInvs);
        if (Array.isArray(liveTopics)) {
          setAcademyTopics(liveTopics);
        }
        if (Array.isArray(liveWaitlist)) setWaitlistLeads(liveWaitlist);
        if (Array.isArray(liveInquiries)) setInquiries(liveInquiries);
      } catch (err) {
        console.warn('[AdminCMS] Live Supabase load fallback:', err);
      }
    };
    loadSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.toLowerCase().trim();
    if (isEmailAuthorizedAdmin(email)) {
      signInWithGoogle(email, email.split('@')[0]);
      setIsAuthenticated(true);
      localStorage.setItem('welnex_admin_auth', 'true');
      setLoginError('');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
      setLoginError('Access restricted. Only authorized administrators can enter.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('welnex_admin_auth');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // RBAC Actions
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) return;

    const newAdmin: TeamAdmin = {
      id: `admin-${Date.now()}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      permissions: newAdminRole === 'Super Admin' ? ['All Permissions', 'System RBAC'] : ['Module Access', 'Editor'],
      status: 'Active',
      lastActive: 'Just now'
    };

    const updated = [...teamAdmins, newAdmin];
    setTeamAdmins(updated);
    try {
      localStorage.setItem('welnex_admin_team', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save admin to localStorage:', err);
    }
    setNewAdminName('');
    setNewAdminEmail('');
    setIsAddAdminModalOpen(false);
  };

  const handleDeleteAdmin = (id: string, email: string) => {
    if (email === 'rprohan06@gmail.com') {
      alert('Super Admin (rprohan06@gmail.com) cannot be deleted.');
      return;
    }
    if (confirm(`Revoke admin privileges for ${email}?`)) {
      const updated = teamAdmins.filter(a => a.id !== id);
      setTeamAdmins(updated);
      try {
        localStorage.setItem('welnex_admin_team', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to delete admin from localStorage:', err);
      }
    }
  };

  // Dynamic Custom Fields helpers (Prompt Requirement 1)
  const handleAddCustomField = () => {
    setFormCustomFields(prev => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveCustomField = (index: number) => {
    setFormCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (index: number, key: 'label' | 'value', val: string) => {
    setFormCustomFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  // Image Upload helper (PNG/JPG/WEBP)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormGalleryImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Waitlist Handlers
  const handleWaitlistStatusChange = async (id: string, status: WaitlistLead['status']) => {
    const updated = updateWaitlistLeadStatus(id, status);
    setWaitlistLeads(updated);
    await updateWaitlistLeadStatusInSupabase(id, status);
  };

  const handleWaitlistDelete = async (id: string, name: string) => {
    if (confirm(`Remove waitlist signup for ${name}?`)) {
      const updated = deleteWaitlistLead(id);
      setWaitlistLeads(updated);
      await deleteWaitlistLeadFromSupabase(id);
    }
  };

  // Chapter Resource Attachments Helpers (Prompt Requirement 2)
  const [chapterResources, setChapterResources] = useState<ChapterResource[]>([]);
  const [chapterDocumentUrl, setChapterDocumentUrl] = useState<string>('');
  const [chapterSlidesUrl, setChapterSlidesUrl] = useState<string>('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [manualResTitle, setManualResTitle] = useState('');
  const [manualResType, setManualResType] = useState<'pdf' | 'ppt' | 'pptx'>('pdf');
  const [manualResUrl, setManualResUrl] = useState('');

  const handleFileUploadResource = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileType: 'pdf' | 'ppt' | 'pptx' = ext === 'ppt' ? 'ppt' : ext === 'pptx' ? 'pptx' : 'pdf';
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = (uploadEvent.target?.result as string) || '';
      const resId = `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

      // Store binary payload immediately in IndexedDB to bypass localStorage limits
      saveDocumentToIndexedDB(resId, result);

      const newRes: ChapterResource = {
        id: resId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileType,
        fileUrl: result, // Base64 data string kept in memory for instant feedback
        fileSize: sizeInMb,
        description: `Official ${fileType.toUpperCase()} reference document for this chapter.`
      };
      setChapterResources(prev => [...prev, newRes]);
      if (fileType === 'pdf') {
        setChapterDocumentUrl(result);
      } else {
        setChapterSlidesUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddManualResource = () => {
    if (!manualResTitle || !manualResUrl) return;
    const newRes: ChapterResource = {
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: manualResTitle,
      fileType: manualResType,
      fileUrl: manualResUrl,
      fileSize: '1.5 MB',
      description: `Curated ${manualResType.toUpperCase()} slides for chapter review.`
    };
    setChapterResources(prev => [...prev, newRes]);
    if (manualResType === 'pdf') {
      setChapterDocumentUrl(manualResUrl);
    } else {
      setChapterSlidesUrl(manualResUrl);
    }
    setManualResTitle('');
    setManualResUrl('');
  };

  const handleRemoveResource = (id: string) => {
    setChapterResources(prev => {
      const filtered = prev.filter(r => r.id !== id);
      const remainingDoc = filtered.find(r => r.fileType === 'pdf')?.fileUrl || '';
      const remainingSlide = filtered.find(r => r.fileType !== 'pdf')?.fileUrl || '';
      setChapterDocumentUrl(remainingDoc);
      setChapterSlidesUrl(remainingSlide);
      return filtered;
    });
  };

  // Investment CRUD Actions
  const handleOpenAddInvestment = () => {
    setEditingInvestment(null);
    setFormName('');
    setFormCategory('REIT');
    setFormSubCategory('Commercial Real Estate');
    setFormAccessModel('Direct Public');
    setFormSponsor('');
    setFormMinInvestment('₹350');
    setFormYield('7.50% p.a.');
    setFormRisk('Moderate');
    setFormTenure('Perpetual');
    setFormLiquidity('High (Daily Exchange Traded)');
    setFormDescription('');
    setFormRegulatoryBody('SEBI');
    setFormPriceMode('LIVE_MARKET');
    setFormSymbolTicker('NEWASSET');
    setFormCurrentPrice('350.00');
    setFormPriceChange24h('0.00');
    setFormPriceChangePercent24h('0.00');
    setFormYieldPayoutFrequency('Quarterly');
    setFormLastValuationPeriod('Q3 2026');
    setFormPhotoUrls('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
    setFormAssetLocations('Express Towers, Nariman Point; Embassy GolfLinks, Bengaluru');
    setFormCustomFields([
      { label: 'Occupancy Rate', value: '94.5%' },
      { label: 'WALE', value: '6.2 Years' }
    ]);
    setFormGalleryImages([]);
    setIsInvestmentModalOpen(true);
  };

  const handleOpenEditInvestment = (inv: InvestmentItem) => {
    setEditingInvestment(inv);
    setFormName(inv.name);
    setFormCategory(inv.category);
    setFormSubCategory(inv.subCategory);
    setFormAccessModel(inv.accessModel || 'Direct Public');
    setFormSponsor(inv.sponsor || '');
    setFormMinInvestment(inv.minInvestment);
    setFormYield(inv.indicativeYield);
    setFormRisk(inv.riskLevel);
    setFormTenure(inv.tenure);
    setFormLiquidity(inv.liquidityProfile || 'High (Exchange Traded)');
    setFormDescription(inv.overview || '');
    setFormRegulatoryBody(inv.regulatoryBody || 'SEBI');
    setFormPriceMode(inv.priceMode || (['REIT', 'InvIT'].includes(inv.category) ? 'LIVE_MARKET' : 'PERIODIC_NAV'));
    setFormSymbolTicker(inv.symbolTicker || inv.symbol || '');
    setFormCurrentPrice(inv.currentPrice !== undefined ? String(inv.currentPrice) : (inv.minInvestmentNumeric ? String(inv.minInvestmentNumeric) : '350.00'));
    setFormPriceChange24h(inv.priceChange24h !== undefined ? String(inv.priceChange24h) : '0.00');
    setFormPriceChangePercent24h(inv.priceChangePercent24h !== undefined ? String(inv.priceChangePercent24h) : '0.00');
    setFormYieldPayoutFrequency(inv.yieldPayoutFrequency || inv.distributionFrequency || 'Quarterly');
    setFormLastValuationPeriod(inv.lastValuationPeriod || 'Q3 2026');
    setFormPhotoUrls(inv.underlyingAssets ? inv.underlyingAssets.map(a => a.imageUrl).filter(Boolean).join(', ') : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
    setFormAssetLocations(inv.underlyingAssets ? inv.underlyingAssets.map(a => a.name).join(', ') : '');
    setFormCustomFields(inv.customFields && inv.customFields.length > 0 ? [...inv.customFields] : [
      { label: 'Occupancy Rate', value: '94.5%' },
      { label: 'WALE', value: '6.2 Years' }
    ]);
    setFormGalleryImages(inv.galleryImages ? [...inv.galleryImages] : []);
    setIsInvestmentModalOpen(true);
  };

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const parsedPhotos = formPhotoUrls
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedProperties = formAssetLocations
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const generatedUnderlyingAssets = parsedProperties.map((p, idx) => ({
      id: `asset-${Date.now()}-${idx}`,
      name: p,
      location: 'India',
      type: formCategory,
      areaOrScale: 'Institutional Scale',
      tenantsOrDetails: 'Grade-A Tenants & Covenants',
      imageUrl: parsedPhotos[idx] || parsedPhotos[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    }));

    const numericMinTicket = parseInt(formMinInvestment.replace(/[^0-9]/g, '')) || 1000;
    const parsedCurrentPrice = parseFloat(formCurrentPrice) || numericMinTicket || 0;
    const parsedChange24h = parseFloat(formPriceChange24h) || 0;
    const parsedChangePct = parseFloat(formPriceChangePercent24h) || 0;
    const formattedTicker = (formSymbolTicker.trim() || formName.slice(0, 8)).toUpperCase();

    let targetItem: InvestmentItem;

    if (editingInvestment) {
      // Update existing
      targetItem = {
        ...editingInvestment,
        name: formName,
        category: formCategory,
        subCategory: formSubCategory,
        tagline: formSubCategory,
        accessModel: formAccessModel,
        sponsor: formSponsor,
        symbol: formattedTicker,
        symbolTicker: formattedTicker,
        priceMode: formPriceMode,
        currentPrice: parsedCurrentPrice,
        priceChange24h: parsedChange24h,
        priceChangePercent24h: parsedChangePct,
        yieldPayoutFrequency: formYieldPayoutFrequency,
        distributionFrequency: formYieldPayoutFrequency,
        lastValuationPeriod: formPriceMode === 'PERIODIC_NAV' ? formLastValuationPeriod : undefined,
        lastPriceUpdate: new Date().toISOString(),
        minInvestment: formMinInvestment,
        minInvestmentNumeric: numericMinTicket,
        indicativeYield: formYield,
        riskLevel: formRisk,
        tenure: formTenure,
        lockInPeriod: formTenure,
        liquidityProfile: formLiquidity,
        overview: formDescription,
        regulatoryBody: formRegulatoryBody,
        underlyingAssets: generatedUnderlyingAssets.length > 0 ? generatedUnderlyingAssets : editingInvestment.underlyingAssets,
        customFields: formCustomFields,
        galleryImages: formGalleryImages
      };

      setInvestments(prev => prev.map(inv => inv.id === editingInvestment.id ? targetItem : inv));
    } else {
      // Create new
      targetItem = {
        id: `inv-${Date.now()}`,
        name: formName,
        sponsor: formSponsor || 'Institutional Sponsor',
        priorityTier: 'Priority 1',
        category: formCategory,
        subCategory: formSubCategory,
        tagline: formSubCategory,
        accessModel: formAccessModel,
        symbol: formattedTicker,
        symbolTicker: formattedTicker,
        priceMode: formPriceMode,
        currentPrice: parsedCurrentPrice,
        priceChange24h: parsedChange24h,
        priceChangePercent24h: parsedChangePct,
        yieldPayoutFrequency: formYieldPayoutFrequency,
        distributionFrequency: formYieldPayoutFrequency,
        lastValuationPeriod: formPriceMode === 'PERIODIC_NAV' ? formLastValuationPeriod : undefined,
        lastPriceUpdate: new Date().toISOString(),
        sebiRegulated: formRegulatoryBody.includes('SEBI'),
        regulatoryBadge: formRegulatoryBody.includes('SEBI') ? 'SEBI Regulated' : 'RBI Regulated',
        regulatoryBody: formRegulatoryBody,
        indicativeYield: formYield,
        yieldType: 'Pre-Tax Indicative Distribution',
        minInvestment: formMinInvestment,
        minInvestmentNumeric: numericMinTicket,
        tenure: formTenure,
        lockInPeriod: formTenure,
        riskLevel: formRisk,
        portfolioScale: 'Institutional Grade',
        overview: formDescription,
        strategy: 'Income generation and capital preservation',
        underlyingAssets: generatedUnderlyingAssets.length > 0 ? generatedUnderlyingAssets : [
          {
            id: 'asset-1',
            name: 'Primary Asset Center',
            location: 'Mumbai / Bengaluru',
            type: formCategory,
            areaOrScale: '500,000 sq ft',
            tenantsOrDetails: 'Grade-A Tenants',
            imageUrl: parsedPhotos[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
          }
        ],
        sponsorProfile: {
          name: formSponsor || 'Asset Manager',
          background: 'Institutional sponsor with proven track record',
          trackRecord: '10+ Years in Market',
          institutionalBackers: ['Global Sovereign Investors']
        },
        riskFactors: [
          {
            title: 'Market Yield Risk',
            description: 'Subject to macro interest rate shifts and tenancy occupancy',
            severity: 'Moderate'
          }
        ],
        liquidityProfile: formLiquidity,
        taxImplications: 'Distributions categorized into Return of Capital, Interest, and Dividends per Finance Act.',
        officialLinks: {},
        tags: [formCategory, formSubCategory],
        customFields: formCustomFields,
        galleryImages: formGalleryImages
      };
      setInvestments([targetItem, ...investments]);
    }

    // Sync price override to market data engine
    if (formattedTicker) {
      marketDataService.updateAssetPriceOverride(
        formattedTicker,
        parsedCurrentPrice,
        parsedChange24h,
        parsedChangePct
      );
    }

    setIsInvestmentModalOpen(false);
    // Execute direct upsert database operation into Supabase
    await upsertInvestmentToSupabase(targetItem);
  };

  const handleDeleteInvestment = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete listing "${name}"?`)) {
      setInvestments(prev => prev.filter(inv => inv.id !== id));
      await deleteInvestmentFromSupabase(id);
    }
  };

  // Academy Actions
  const handleOpenAddTopic = () => {
    setTopicTitle('');
    setTopicCategory('REITs');
    setTopicDescription('');
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle) return;

    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: topicTitle,
      slug: topicTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: topicCategory,
      description: topicDescription,
      order: academyTopics.length + 1,
      subTopics: []
    };

    setAcademyTopics([...academyTopics, newTopic]);
    setIsTopicModalOpen(false);
    setExpandedTopicId(newTopic.id);
    // Execute direct insert/upsert into Supabase
    await upsertAcademyTopicToSupabase(newTopic);
  };

  const handleOpenAddChapter = (topicId: string) => {
    setActiveParentTopicId(topicId);
    setEditingChapterId(null);
    setChapterTitle('');
    setChapterDifficulty('Beginner');
    setChapterDuration('8 mins');
    setChapterContent('');
    setChapterQuizQuestion('');
    setChapterQuizOptions('Option A, Option B, Option C, Option D');
    setChapterQuizCorrectIndex(0);
    setChapterQuizExplanation('');
    setChapterResources([]);
    setChapterDocumentUrl('');
    setChapterSlidesUrl('');
    setManualResTitle('');
    setManualResUrl('');
    setIsChapterModalOpen(true);
  };

  const handleOpenEditChapter = (topicId: string, sub: SubTopic) => {
    setActiveParentTopicId(topicId);
    setEditingChapterId(sub.id);
    setChapterTitle(sub.title);
    setChapterDifficulty(sub.difficulty);
    setChapterDuration(sub.estimatedReadingTime);
    setChapterContent(sub.contentSections?.[0]?.paragraphs?.[0] || sub.summary || '');
    setChapterQuizQuestion(sub.quizQuestions?.[0]?.question || '');
    setChapterQuizOptions(sub.quizQuestions?.[0]?.options?.join(', ') || 'Option A, Option B, Option C, Option D');
    setChapterQuizCorrectIndex(sub.quizQuestions?.[0]?.correctOptionIndex || 0);
    setChapterQuizExplanation(sub.quizQuestions?.[0]?.explanation || '');

    const existingResources: ChapterResource[] = Array.isArray(sub.resources) ? [...sub.resources] : [];
    if (sub.documentUrl && !existingResources.some(r => r.fileUrl === sub.documentUrl)) {
      existingResources.unshift({
        id: `res-doc-${sub.id}`,
        title: `${sub.title} PDF Document`,
        fileType: 'pdf',
        fileUrl: sub.documentUrl,
        fileSize: 'Curriculum PDF',
        description: 'Attached official PDF document.'
      });
    }
    if (sub.slidesUrl && !existingResources.some(r => r.fileUrl === sub.slidesUrl)) {
      existingResources.push({
        id: `res-slides-${sub.id}`,
        title: `${sub.title} Slides`,
        fileType: 'ppt',
        fileUrl: sub.slidesUrl,
        fileSize: 'Slide Deck',
        description: 'Attached presentation slides.'
      });
    }

    setChapterResources(existingResources);
    setChapterDocumentUrl(sub.documentUrl || '');
    setChapterSlidesUrl(sub.slidesUrl || '');
    setManualResTitle('');
    setManualResUrl('');
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle || !activeParentTopicId) return;

    const parsedOptions = chapterQuizOptions.split(',').map(s => s.trim()).filter(Boolean);
    const durationMins = parseInt(chapterDuration.replace(/[^0-9]/g, '')) || 8;

    const docUrl = chapterDocumentUrl || chapterResources.find(r => r.fileType === 'pdf')?.fileUrl || undefined;
    const sldUrl = chapterSlidesUrl || chapterResources.find(r => r.fileType !== 'pdf')?.fileUrl || undefined;
    const targetChapterId = editingChapterId || `subtopic-${Date.now()}`;

    // Consolidate attachments into resources array for database persistence
    const finalResources: ChapterResource[] = [...chapterResources];
    if (docUrl && !finalResources.some(r => r.fileUrl === docUrl)) {
      finalResources.unshift({
        id: `res-doc-${targetChapterId}`,
        title: `${chapterTitle} Document`,
        fileType: 'pdf',
        fileUrl: docUrl,
        fileSize: 'Curriculum PDF',
        description: 'Official chapter PDF curriculum and technical notes.'
      });
    }
    if (sldUrl && !finalResources.some(r => r.fileUrl === sldUrl)) {
      finalResources.push({
        id: `res-slides-${targetChapterId}`,
        title: `${chapterTitle} Slides`,
        fileType: 'ppt',
        fileUrl: sldUrl,
        fileSize: 'Slide Deck',
        description: 'Visual slide deck and lecture materials.'
      });
    }

    const newSubTopic: SubTopic = {
      id: targetChapterId,
      topicId: activeParentTopicId,
      title: chapterTitle,
      slug: chapterTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      difficulty: chapterDifficulty,
      estimatedReadingTime: chapterDuration,
      durationMinutes: durationMins,
      summary: chapterContent.slice(0, 160) || 'Comprehensive lesson overview.',
      order: 1,
      contentSections: [
        {
          id: `sec-${Date.now()}-1`,
          heading: 'Curriculum Overview',
          paragraphs: [chapterContent || 'Educational content deconstructing alternative investment mechanics.']
        }
      ],
      quizQuestions: chapterQuizQuestion ? [
        {
          id: `quiz-${Date.now()}`,
          question: chapterQuizQuestion,
          options: parsedOptions.length > 0 ? parsedOptions : ['Option A', 'Option B', 'Option C'],
          correctOptionIndex: chapterQuizCorrectIndex,
          explanation: chapterQuizExplanation || 'Explanation verified according to institutional SEBI rules.'
        }
      ] : undefined,
      resources: finalResources.length > 0 ? finalResources : undefined,
      documentUrl: docUrl,
      slidesUrl: sldUrl
    };

    if (docUrl && docUrl.startsWith('data:')) {
      saveDocumentToIndexedDB(`doc_${targetChapterId}`, docUrl);
    }
    if (sldUrl && sldUrl.startsWith('data:')) {
      saveDocumentToIndexedDB(`slides_${targetChapterId}`, sldUrl);
    }

    const updatedTopics = academyTopics.map(topic => {
      if (topic.id === activeParentTopicId) {
        const existingSubs = Array.isArray(topic.subTopics) ? topic.subTopics : [];
        const existingIdx = existingSubs.findIndex(st => st.id === targetChapterId);
        const updatedSubs = existingIdx >= 0
          ? existingSubs.map((st, i) => (i === existingIdx ? newSubTopic : st))
          : [...existingSubs, newSubTopic];
        return {
          ...topic,
          subTopics: updatedSubs
        };
      }
      return topic;
    });

    setAcademyTopics(updatedTopics);
    safeSaveAcademyTopicsToLocalStorage(updatedTopics);

    setIsChapterModalOpen(false);
    // Execute direct insert/upsert into Supabase (with safe schema/payload handling)
    await upsertAcademyChapterToSupabase(newSubTopic);
  };

  const handleDeleteChapter = async (topicId: string, subTopicId: string) => {
    if (confirm('Delete this chapter from curriculum?')) {
      const updatedTopics = academyTopics.map(topic => {
        if (topic.id === topicId) {
          const filtered = topic.subTopics.filter(st => st.id !== subTopicId);
          return {
            ...topic,
            subTopics: filtered
          };
        }
        return topic;
      });
      setAcademyTopics(updatedTopics);
      safeSaveAcademyTopicsToLocalStorage(updatedTopics);
      await deleteAcademyChapterFromSupabase(subTopicId);
    }
  };

  const handleDeleteTopic = async (topicId: string, title: string) => {
    if (confirm(`Delete entire topic "${title}" and all its chapters?`)) {
      const filtered = academyTopics.filter(t => t.id !== topicId);
      setAcademyTopics(filtered);
      safeSaveAcademyTopicsToLocalStorage(filtered);
      await deleteAcademyTopicFromSupabase(topicId);
    }
  };

  // Filtered Investments
  const filteredInvestments = investments.filter(inv => {
    const matchesCat = investmentCategoryFilter === 'All' || inv.category === investmentCategoryFilter;
    const matchesSearch = inv.name.toLowerCase().includes(investmentSearch.toLowerCase()) ||
      inv.subCategory.toLowerCase().includes(investmentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Check if current user is an authorized admin
  const isUserAdmin = user ? isAuthorizedAdmin(user.primaryEmailAddress.emailAddress) : false;
  const effectiveAuth = isAuthenticated || isUserAdmin;

  // If user is logged in with an unauthorized email, block with Access Restricted screen
  if (user && !isUserAdmin && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border border-champagne-500/50 shadow-glass-xl p-8 relative text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto border border-amber-500/30">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-display font-black text-espresso-950">
            Access Restricted (RBAC)
          </h2>
          <p className="text-xs text-espresso-700 leading-relaxed">
            You are currently authenticated as <span className="font-mono font-bold text-espresso-950">{user.primaryEmailAddress.emailAddress}</span>. This email does not have administrative privileges for the WelNex CMS.
          </p>
          <div className="p-3.5 rounded-2xl bg-sand-100 border border-champagne-500/40 text-left text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-espresso-500 block">Required Authorization</span>
            <span className="font-bold text-copper-700 block">Super Admin: rprohan06@gmail.com</span>
            <span className="text-espresso-600 block text-[11px]">Or an authorized team email registered in Team RBAC.</span>
          </div>
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={openAuthModal}
              className="w-full text-xs font-bold"
            >
              Sign In with Authorized Admin Account
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackToHome}
              className="w-full text-xs font-semibold"
            >
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER LOGIN CARD IF NOT AUTHENTICATED
  if (!effectiveAuth) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/85 backdrop-blur-xl border border-champagne-500/50 shadow-glass-xl p-8 relative">
          
          <div className="text-center mb-6">
            <div className="inline-flex justify-center mb-4">
              <WelNexLogo size="lg" showTagline={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-copper-500/15 text-copper-700 border border-copper-500/30 text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5 text-copper-600" />
              <span>Restricted Admin Portal (Phase 6)</span>
            </div>
            <h2 className="text-2xl font-display font-black text-espresso-950">
              WelNex Platform CMS
            </h2>
            <p className="text-xs text-espresso-600 mt-1.5">
              Secure administrative access for verified WelNex platform administrators.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 text-xs mb-4 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-espresso-800 mb-1.5">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-500/40 bg-sand-50/80 text-espresso-950 text-sm font-medium focus:outline-none focus:border-copper-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso-800 mb-1.5">
                Master Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-500/40 bg-sand-50/80 text-espresso-950 text-sm font-medium focus:outline-none focus:border-copper-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md shadow-copper-500/25 cursor-pointer mt-2"
            >
              Sign In to Super Admin Dashboard
            </Button>
          </form>

          <div className="pt-6 mt-6 border-t border-champagne-500/30 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-espresso-600 hover:text-copper-600 transition-colors cursor-pointer font-medium"
            >
              ← Return to WelNex Public Website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN CMS PORTAL
  return (
    <div className="min-h-screen bg-sand text-espresso-950 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* CMS TOP BAR */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-champagne-500/40 p-6 shadow-glass-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-copper-500/15 border border-copper-500/30 flex items-center justify-center text-copper-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-extrabold text-espresso-950">
                  WelNex Admin CMS Portal
                </h1>
                <Badge variant="copper" size="xs">
                  Super Admin Session
                </Badge>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                  }`}
                  title={
                    isSupabaseConfigured
                      ? 'Connected to live Supabase PostgreSQL backend'
                      : 'Running in resilient local cache mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to sync to live database.'
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {isSupabaseConfigured ? 'Supabase Live' : 'Supabase Local Cache'}
                </span>
              </div>
              <p className="text-xs text-espresso-600 mt-0.5 font-mono">
                Logged in as: <strong className="text-copper-700 font-bold">rprohan06@gmail.com</strong> (All Privileges Active)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackToHome}
              className="text-xs font-semibold cursor-pointer"
            >
              Exit to Platform
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-3.5 h-3.5" />}
              className="text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* 4 CMS TAB SWITCHERS */}
        <div className="flex items-center gap-2 border-b border-champagne-500/30 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'listings'
                ? 'bg-copper-500 text-white shadow-sm'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Investment Listings CMS ({investments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'academy'
                ? 'bg-copper-500 text-white shadow-sm'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Academy Module CMS ({academyTopics.length} Topics)</span>
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'waitlist'
                ? 'bg-copper-500 text-white shadow-sm'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Waitlist Subscriptions ({waitlistLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-copper-500 text-white shadow-sm'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Inquiries ({inquiries.length})</span>
            {inquiries.filter(i => i.status === 'Unread').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'rbac'
                ? 'bg-copper-500 text-white shadow-sm'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & RBAC Management ({teamAdmins.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: FEATURE B — INVESTMENT LISTINGS CMS */}
        {/* ========================================================================= */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            
            {/* Header with Search and Create Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                  <input
                    type="text"
                    placeholder="Search listings or sponsors..."
                    value={investmentSearch}
                    onChange={(e) => setInvestmentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-champagne-500/40 bg-white/80 text-xs text-espresso-950 focus:outline-none focus:border-copper-500"
                  />
                </div>

                <select
                  value={investmentCategoryFilter}
                  onChange={(e) => setInvestmentCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-champagne-500/40 bg-white/80 text-xs text-espresso-800 font-medium focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="REIT">REITs</option>
                  <option value="InvIT">InvITs</option>
                  <option value="Debt">Bonds & SDIs</option>
                  <option value="Gold">Precious Metals</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {onOpenExplore && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onOpenExplore}
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    View Public Catalogue
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddInvestment}
                  icon={<Plus className="w-4 h-4" />}
                  className="text-xs font-bold shadow-sm shadow-copper-500/20"
                >
                  Create New Investment Listing
                </Button>
              </div>
            </div>

            {/* Listings Glass Table */}
            <GlassCard variant="elevated" className="rounded-3xl border border-champagne-500/40 bg-white/80 p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-champagne-500/30 bg-sand-100/90 text-espresso-800 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Investment Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Pricing Feed</th>
                      <th className="py-3.5 px-4">Current Price / NAV</th>
                      <th className="py-3.5 px-4">Yield %</th>
                      <th className="py-3.5 px-4">Min. Ticket</th>
                      <th className="py-3.5 px-4">Risk Profile</th>
                      <th className="py-3.5 px-4">Tenure & Liquidity</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-500/20">
                    {filteredInvestments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-sand-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-espresso-950">
                          <div>
                            <span>{inv.name}</span>
                            <span className="block text-[10px] text-espresso-500 font-normal">{inv.sponsor || 'Institutional Sponsor'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="champagne" size="xs">
                            {inv.category}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.priceMode === 'LIVE_MARKET' ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                LIVE • NSE
                              </span>
                              <span className="text-[10px] font-mono text-espresso-600 font-semibold uppercase">
                                {inv.symbolTicker || inv.symbol || 'TICKER'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-champagne-500/20 text-copper-900 border border-champagne-500/40 w-fit">
                                <Calendar className="w-2.5 h-2.5 text-copper-700" />
                                PERIODIC NAV
                              </span>
                              <span className="text-[10px] text-espresso-500">
                                {inv.lastValuationPeriod || 'Q3 2026'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.priceMode === 'LIVE_MARKET' ? (
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-espresso-950">
                                ₹{typeof inv.currentPrice === 'number' ? inv.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (inv.currentPrice || '—')}
                              </span>
                              {inv.priceChangePercent24h !== undefined && (
                                <span className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 ${
                                  (inv.priceChangePercent24h ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                                }`}>
                                  {(inv.priceChangePercent24h ?? 0) >= 0 ? '+' : ''}
                                  {inv.priceChangePercent24h}% (24h)
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-espresso-950">
                                ₹{typeof inv.currentPrice === 'number' ? inv.currentPrice.toLocaleString('en-IN') : (inv.minInvestmentNumeric?.toLocaleString('en-IN') || '—')}
                              </span>
                              <span className="text-[10px] text-espresso-500">
                                {inv.yieldPayoutFrequency || 'Quarterly'} Payout
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-copper-700">
                          {inv.indicativeYield}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-espresso-800">
                          {inv.minInvestment}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-espresso-800">
                          {inv.riskLevel}
                        </td>
                        <td className="py-3.5 px-4 text-espresso-600 text-[11px]">
                          {inv.tenure}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditInvestment(inv)}
                            className="p-1.5 rounded-lg hover:bg-copper-500/15 text-copper-700 transition-colors cursor-pointer"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvestment(inv.id, inv.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-700 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FEATURE C — ACADEMY MODULE CMS */}
        {/* ========================================================================= */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-espresso-950">
                  Hierarchical Curriculum Framework
                </h3>
                <p className="text-xs text-espresso-600">
                  Manage main topics, nested sub-topic chapters, numerical calculation walkthroughs, and quizzes.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddTopic}
                icon={<Plus className="w-4 h-4" />}
                className="text-xs font-bold shadow-sm shadow-copper-500/20"
              >
                Add Main Topic
              </Button>
            </div>

            {/* Tree View of Topics and Chapters */}
            <div className="space-y-4">
              {academyTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                const totalEstimatedMins = topic.subTopics.reduce((acc, st) => acc + (st.durationMinutes || 8), 0);

                return (
                  <GlassCard
                    key={topic.id}
                    variant="elevated"
                    className="p-5 rounded-3xl border border-champagne-500/40 bg-white/85 transition-all text-left"
                  >
                    {/* Main Topic Header */}
                    <div className="flex items-center justify-between gap-4">
                      <div 
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div className="w-8 h-8 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-700">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-display font-bold text-espresso-950">
                              {topic.title}
                            </h4>
                            <Badge variant="copper" size="xs">
                              {topic.category}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-espresso-600">
                            {topic.subTopics.length} Chapters • Est. {totalEstimatedMins} mins
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenAddChapter(topic.id)}
                          icon={<Plus className="w-3.5 h-3.5" />}
                          className="text-xs font-semibold"
                        >
                          Add Chapter
                        </Button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id, topic.title)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Nested Chapters List */}
                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-champagne-500/25 space-y-2.5 pl-6 sm:pl-10">
                        {topic.subTopics.length === 0 ? (
                          <p className="text-xs text-espresso-500 italic py-2">
                            No chapters added yet to this topic. Click "Add Chapter" above.
                          </p>
                        ) : (
                          topic.subTopics.map((sub, sIdx) => (
                            <div
                              key={sub.id}
                              className="p-3.5 rounded-2xl bg-sand-50/90 border border-champagne-500/30 flex items-center justify-between gap-4 hover:border-copper-500/40 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-bold text-copper-700 bg-copper-500/10 w-6 h-6 rounded-lg flex items-center justify-center">
                                  0{sIdx + 1}
                                </span>
                                <div>
                                  <span className="text-xs font-bold text-espresso-950 block">
                                    {sub.title}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-espresso-600">
                                    <span className="font-semibold text-copper-700">{sub.difficulty}</span>
                                    <span>•</span>
                                    <span>{sub.estimatedReadingTime}</span>
                                    {sub.quizQuestions && sub.quizQuestions.length > 0 && (
                                      <>
                                        <span>•</span>
                                        <span className="text-emerald-700 font-medium">Includes Quiz ({sub.quizQuestions.length} Qs)</span>
                                      </>
                                    )}
                                    {(sub.documentUrl || (sub.resources && sub.resources.length > 0)) && (
                                      <>
                                        <span>•</span>
                                        <span className="text-copper-700 font-bold inline-flex items-center gap-1 bg-copper-500/10 px-1.5 py-0.5 rounded">
                                          <FileText className="w-3 h-3" />
                                          <span>Document Attached</span>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditChapter(topic.id, sub)}
                                  className="p-1.5 rounded-lg text-copper-700 hover:bg-copper-50 transition-colors cursor-pointer"
                                  title="Edit Chapter & Documents"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(topic.id, sub.id)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Chapter"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FEATURE — WAITLIST SUBSCRIPTIONS & LEAD VIEWER (Prompt Requirement 3) */}
        {/* ========================================================================= */}
        {activeTab === 'waitlist' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Waitlist Top Header & Export Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="copper" size="xs">
                    Live Priority Queue
                  </Badge>
                  <span className="text-xs text-espresso-600 font-semibold">
                    {waitlistLeads.length} Total Signups
                  </span>
                </div>
                <h3 className="text-xl font-display font-black text-espresso-950">
                  Waitlist Subscriptions & Lead Viewer
                </h3>
                <p className="text-xs text-espresso-600 mt-0.5">
                  Live captured investor leads from the landing page early-access funnel.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<FileSpreadsheet className="w-4 h-4" />}
                onClick={() => {
                  const filtered = waitlistLeads.filter(lead => {
                    const matchesSearch = lead.fullName.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                      lead.email.toLowerCase().includes(waitlistSearch.toLowerCase());
                    const matchesProfile = waitlistProfileFilter === 'All' || lead.investorProfile === waitlistProfileFilter;
                    const matchesStatus = waitlistStatusFilter === 'All' || lead.status === waitlistStatusFilter;
                    return matchesSearch && matchesProfile && matchesStatus;
                  });
                  exportWaitlistToCSV(filtered);
                }}
                className="text-xs font-bold shadow-md shadow-copper-500/20 cursor-pointer"
              >
                Export CSV ({waitlistLeads.length})
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-espresso-500 block">Total Signups</span>
                <span className="text-2xl font-display font-extrabold text-espresso-950 mt-1 block">
                  {waitlistLeads.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                  100% Verified Submissions
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-copper-700 block">HNW & Institutional</span>
                <span className="text-2xl font-display font-extrabold text-copper-700 mt-1 block">
                  {waitlistLeads.filter(l => l.investorProfile.includes('HNW') || l.investorProfile.includes('Institutional')).length}
                </span>
                <span className="text-[10px] text-espresso-500 mt-0.5 block">
                  Accredited Ticket Sizes
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-espresso-500 block">Retail & Curious</span>
                <span className="text-2xl font-display font-extrabold text-espresso-900 mt-1 block">
                  {waitlistLeads.filter(l => l.investorProfile.includes('Retail') || l.investorProfile.includes('Curious')).length}
                </span>
                <span className="text-[10px] text-espresso-500 mt-0.5 block">
                  Retail Discovery Cohort
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">VIP Invited Status</span>
                <span className="text-2xl font-display font-extrabold text-emerald-700 mt-1 block">
                  {waitlistLeads.filter(l => l.status === 'VIP Invited').length}
                </span>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">
                  Phase 1 Beta Access
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                <input
                  type="text"
                  placeholder="Search by investor name or email..."
                  value={waitlistSearch}
                  onChange={(e) => setWaitlistSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-champagne-500/40 bg-sand-50/70 text-xs text-espresso-950 focus:outline-none focus:border-copper-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={waitlistProfileFilter}
                  onChange={(e) => setWaitlistProfileFilter(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 rounded-xl border border-champagne-500/40 bg-sand-50/70 text-xs text-espresso-800 font-medium focus:outline-none"
                >
                  <option value="All">All Investor Profiles</option>
                  <option value="Retail Stock/MF Investor">Retail Stock/MF</option>
                  <option value="HNW / Accredited Investor">HNW / Accredited</option>
                  <option value="Institutional / Family Office">Institutional / Family Office</option>
                  <option value="Finance Professional / CA">Finance Professional / CA</option>
                  <option value="NRI Investor">NRI Investor</option>
                  <option value="Curious Beginner">Curious Beginner</option>
                </select>

                <select
                  value={waitlistStatusFilter}
                  onChange={(e) => setWaitlistStatusFilter(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 rounded-xl border border-champagne-500/40 bg-sand-50/70 text-xs text-espresso-800 font-medium focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="VIP Invited">VIP Invited</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>
            </div>

            {/* Waitlist Data Table */}
            <div className="rounded-3xl border border-champagne-500/40 bg-white/90 overflow-hidden shadow-glass-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-100/90 border-b border-champagne-500/30 text-espresso-700 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Investor Profile</th>
                      <th className="py-3.5 px-4">Interests</th>
                      <th className="py-3.5 px-4">Signup Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-500/20">
                    {waitlistLeads
                      .filter(lead => {
                        const matchesSearch = lead.fullName.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                          lead.email.toLowerCase().includes(waitlistSearch.toLowerCase());
                        const matchesProfile = waitlistProfileFilter === 'All' || lead.investorProfile === waitlistProfileFilter;
                        const matchesStatus = waitlistStatusFilter === 'All' || lead.status === waitlistStatusFilter;
                        return matchesSearch && matchesProfile && matchesStatus;
                      })
                      .map((lead) => {
                        return (
                          <tr key={lead.id} className="hover:bg-sand-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-espresso-950 flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-copper-500/15 border border-copper-500/30 text-copper-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                                {lead.fullName.charAt(0)}
                              </div>
                              <span className="truncate max-w-[140px] sm:max-w-none">{lead.fullName}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-espresso-700">
                              {lead.email}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-lg bg-champagne-500/20 text-espresso-800 font-semibold border border-champagne-500/30 text-[11px]">
                                {lead.investorProfile}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {(lead.interests || ['REIT']).map((cat, cIdx) => (
                                  <span key={cIdx} className="px-1.5 py-0.5 rounded text-[9px] bg-sand-200 text-espresso-800 font-mono">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-espresso-600">
                              {lead.signupDate}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => handleWaitlistStatusChange(lead.id, e.target.value as any)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                  lead.status === 'VIP Invited'
                                    ? 'bg-copper-500/15 text-copper-700 border-copper-500/40'
                                    : lead.status === 'Verified'
                                    ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40'
                                    : 'bg-amber-500/15 text-amber-800 border-amber-500/40'
                                }`}
                              >
                                <option value="Verified">Verified</option>
                                <option value="VIP Invited">VIP Invited</option>
                                <option value="Pending Review">Pending Review</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleWaitlistDelete(lead.id, lead.fullName)}
                                className="p-1.5 rounded-lg text-espresso-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {waitlistLeads.filter(lead => {
                const matchesSearch = lead.fullName.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                  lead.email.toLowerCase().includes(waitlistSearch.toLowerCase());
                const matchesProfile = waitlistProfileFilter === 'All' || lead.investorProfile === waitlistProfileFilter;
                const matchesStatus = waitlistStatusFilter === 'All' || lead.status === waitlistStatusFilter;
                return matchesSearch && matchesProfile && matchesStatus;
              }).length === 0 && (
                <div className="p-10 text-center text-espresso-600 text-xs">
                  No waitlist subscriptions match the search or filter query.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTACT INQUIRIES & INVESTOR DESK */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Header & Export Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="copper" size="xs">
                    Institutional Desk
                  </Badge>
                  <span className="text-xs text-espresso-600 font-semibold">
                    {inquiries.length} Total Messages
                  </span>
                  {inquiries.filter(i => i.status === 'Unread').length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
                      {inquiries.filter(i => i.status === 'Unread').length} New Unread
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display font-black text-espresso-950">
                  Contact Inquiries & Investor Inbound Tracker
                </h3>
                <p className="text-xs text-espresso-600 mt-0.5">
                  Track and respond to investor questions, listing requests, and institutional outreach submitted via the contact form.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<FileSpreadsheet className="w-4 h-4" />}
                onClick={() => {
                  const filtered = inquiries.filter(inq => {
                    const matchesSearch = inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
                    const matchesStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
                    return matchesSearch && matchesStatus;
                  });
                  exportInquiriesToCSV(filtered);
                }}
                className="text-xs font-bold shadow-md shadow-copper-500/20 cursor-pointer"
              >
                Export CSV ({inquiries.length})
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-espresso-500 block">Total Inquiries</span>
                <span className="text-2xl font-display font-extrabold text-espresso-950 mt-1 block">
                  {inquiries.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                  100% Inbound Capture
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Unread Messages</span>
                <span className="text-2xl font-display font-extrabold text-amber-700 mt-1 block">
                  {inquiries.filter(i => i.status === 'Unread').length}
                </span>
                <span className="text-[10px] text-espresso-500 mt-0.5 block">
                  Requires Response
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Contacted</span>
                <span className="text-2xl font-display font-extrabold text-blue-700 mt-1 block">
                  {inquiries.filter(i => i.status === 'Contacted').length}
                </span>
                <span className="text-[10px] text-espresso-500 mt-0.5 block">
                  In Follow-up
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Resolved</span>
                <span className="text-2xl font-display font-extrabold text-emerald-700 mt-1 block">
                  {inquiries.filter(i => i.status === 'Resolved').length}
                </span>
                <span className="text-[10px] text-espresso-500 mt-0.5 block">
                  Completed Inquiries
                </span>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inquiries by sender name, email, or message keyword..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-champagne-500/40 bg-sand/40 text-xs text-espresso-950 focus:outline-none focus:ring-2 focus:ring-copper-500/30"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-espresso-700 shrink-0">Filter Status:</span>
                {(['All', 'Unread', 'Contacted', 'Resolved'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setInquiryStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      inquiryStatusFilter === status
                        ? 'bg-copper-500 text-white shadow-xs'
                        : 'bg-white hover:bg-[#FAF5EE] text-espresso-800 border border-champagne-500/30'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Data Table */}
            <div className="rounded-2xl border border-champagne-500/40 bg-white/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-espresso-900 border-collapse">
                  <thead>
                    <tr className="bg-[#FAF5EE] border-b border-champagne-500/40 text-[11px] font-bold uppercase tracking-wider text-espresso-700">
                      <th className="py-3 px-4">Sender & Category</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Message Snippet</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-500/20">
                    {inquiries
                      .filter((inq) => {
                        const matchesSearch =
                          inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                          inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                          inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
                        const matchesStatus =
                          inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((inq) => (
                        <tr key={inq.id} className="hover:bg-sand/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-espresso-950">
                            <div className="flex items-center gap-2">
                              <span>{inq.name}</span>
                              {inq.status === 'Unread' && (
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                              )}
                            </div>
                            <span className="text-[10px] text-copper-700 font-medium block mt-0.5">
                              {inq.category || 'General Inquiry'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <a href={`mailto:${inq.email}`} className="text-copper-700 hover:underline block truncate max-w-[180px]">
                              {inq.email}
                            </a>
                            {inq.phone && (
                              <span className="text-espresso-500 block text-[10px] mt-0.5">
                                {inq.phone}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-espresso-700 truncate line-clamp-1">
                              {inq.message}
                            </p>
                            <button
                              onClick={() => setViewingInquiry(inq)}
                              className="text-[10px] font-bold text-copper-700 hover:text-copper-900 mt-0.5 cursor-pointer"
                            >
                              Read Full Message
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-espresso-600 font-mono text-[11px] whitespace-nowrap">
                            {new Date(inq.timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={inq.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as InquiryStatus;
                                const updated = updateInquiryStatus(inq.id, newStatus);
                                setInquiries(updated);
                                await updateInquiryStatusInSupabase(inq.id, newStatus);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                inq.status === 'Unread'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : inq.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="Unread">Unread</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingInquiry(inq)}
                                className="p-1.5 rounded-lg text-copper-700 hover:bg-copper-500/10 transition-colors cursor-pointer"
                                title="View full details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to delete inquiry from ${inq.name}?`)) {
                                    const updated = deleteInquiry(inq.id);
                                    setInquiries(updated);
                                    await deleteInquiryFromSupabase(inq.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {inquiries.filter((inq) => {
                const matchesSearch =
                  inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                  inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                  inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
                const matchesStatus =
                  inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
                return matchesSearch && matchesStatus;
              }).length === 0 && (
                <div className="p-10 text-center text-espresso-600 text-xs">
                  No contact inquiries match the search or filter query.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FEATURE A — USER & TEAM ADMIN MANAGEMENT (RBAC) */}
        {/* ========================================================================= */}
        {activeTab === 'rbac' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-espresso-950">
                  Team Members & Access Privileges (RBAC)
                </h3>
                <p className="text-xs text-espresso-600">
                  Role-based access controls for platform editors, analysts, compliance officers, and super admin.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddAdminModalOpen(true)}
                icon={<Plus className="w-4 h-4" />}
                className="text-xs font-bold shadow-sm shadow-copper-500/20"
              >
                Add Team Member / Admin
              </Button>
            </div>

            {/* Team Glass Table */}
            <GlassCard variant="elevated" className="rounded-3xl border border-champagne-500/40 bg-white/80 p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-champagne-500/30 bg-sand-100/90 text-espresso-800 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Admin Name & Email</th>
                      <th className="py-3.5 px-4">Assigned Role</th>
                      <th className="py-3.5 px-4">Permissions Scope</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4 text-right">Revoke / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-500/20">
                    {teamAdmins.map((admin) => {
                      const isSuper = admin.email === 'rprohan06@gmail.com';
                      return (
                        <tr key={admin.id} className="hover:bg-sand-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-copper-500/15 text-copper-700 font-bold flex items-center justify-center shrink-0">
                                {admin.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-espresso-950 block">{admin.name}</span>
                                <span className="text-[11px] font-mono text-espresso-600">{admin.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              admin.role === 'Super Admin'
                                ? 'bg-copper-500/15 text-copper-800 border-copper-500/30'
                                : 'bg-sand-200 text-espresso-800 border-champagne-500/30'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-espresso-700 text-[11px]">
                            {admin.permissions.join(', ')}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              {admin.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-espresso-600 font-mono text-[10px]">
                            {admin.lastActive}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isSuper ? (
                              <span className="text-[10px] text-espresso-400 italic">Root Owner</span>
                            ) : (
                              <button
                                onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Revoke access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT INVESTMENT MODAL */}
      {/* ========================================================================= */}
      {isInvestmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30 mb-5">
              <h3 className="text-xl font-display font-bold text-espresso-950">
                {editingInvestment ? 'Edit Alternative Investment' : 'Create New Investment Listing'}
              </h3>
              <button
                onClick={() => setIsInvestmentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Asset Name / Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mindspace Business Parks REIT"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Provider / Sponsor</label>
                  <input
                    type="text"
                    value={formSponsor}
                    onChange={(e) => setFormSponsor(e.target.value)}
                    placeholder="e.g. K Raheja Corp & Blackstone"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  >
                    <option value="REIT">REIT</option>
                    <option value="InvIT">InvIT</option>
                    <option value="Debt">Bonds & SDIs</option>
                    <option value="Gold">Precious Metals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Access Model</label>
                  <select
                    value={formAccessModel}
                    onChange={(e) => setFormAccessModel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  >
                    <option value="Direct Public">Direct Public (Exchange Traded)</option>
                    <option value="Verified Partner">Verified Partner (Curated Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Indicative Yield %</label>
                  <input
                    type="text"
                    value={formYield}
                    onChange={(e) => setFormYield(e.target.value)}
                    placeholder="e.g. 7.50% p.a."
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Minimum Investment Ticket</label>
                  <input
                    type="text"
                    value={formMinInvestment}
                    onChange={(e) => setFormMinInvestment(e.target.value)}
                    placeholder="e.g. ₹350 or ₹10,00,000"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Risk Level</label>
                  <select
                    value={formRisk}
                    onChange={(e) => setFormRisk(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Tenure / Lock-in</label>
                  <input
                    type="text"
                    value={formTenure}
                    onChange={(e) => setFormTenure(e.target.value)}
                    placeholder="e.g. Perpetual or 3 Years"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Sub-Category</label>
                <input
                  type="text"
                  value={formSubCategory}
                  onChange={(e) => setFormSubCategory(e.target.value)}
                  placeholder="e.g. Grade-A Commercial IT Parks"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive institutional summary..."
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              {/* REAL-TIME MARKET PRICING & VALUATION ARCHITECTURE (Task 4) */}
              <div className="pt-3 pb-2 border-t border-champagne-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                      Market Pricing & Valuation Architecture
                    </span>
                    <span className="text-[10px] text-espresso-600">
                      Configure real-time tick-by-tick market pricing or structured periodic valuation updates
                    </span>
                  </div>
                  <Badge variant={formPriceMode === 'LIVE_MARKET' ? 'success' : 'champagne'} size="xs">
                    {formPriceMode === 'LIVE_MARKET' ? 'Live Stream Active' : 'Audited NAV Mode'}
                  </Badge>
                </div>

                {/* DUAL-MODE TOGGLE BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormPriceMode('LIVE_MARKET');
                      if (!formSymbolTicker) setFormSymbolTicker(formName.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, ''));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      formPriceMode === 'LIVE_MARKET'
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/30'
                        : 'bg-white/80 border-champagne-500/40 hover:border-emerald-500/40 text-espresso-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${formPriceMode === 'LIVE_MARKET' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-sand-100 text-espresso-600'}`}>
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-espresso-950">Live Exchange Ticker</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-800">
                          NSE / BSE
                        </span>
                      </div>
                      <p className="text-[10px] text-espresso-600 mt-0.5 leading-snug">
                        Tick-by-tick real-time feed with 24h ₹ / % shifts for listed REITs, InvITs & Gold ETFs.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriceMode('PERIODIC_NAV')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      formPriceMode === 'PERIODIC_NAV'
                        ? 'bg-copper-500/10 border-copper-500/50 shadow-xs ring-1 ring-copper-500/30'
                        : 'bg-white/80 border-champagne-500/40 hover:border-copper-500/40 text-espresso-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${formPriceMode === 'PERIODIC_NAV' ? 'bg-copper-600 text-white shadow-xs' : 'bg-sand-100 text-espresso-600'}`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-espresso-950">Manual NAV / Yield Update</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-copper-500/20 text-copper-900">
                          Unlisted / Private
                        </span>
                      </div>
                      <p className="text-[10px] text-espresso-600 mt-0.5 leading-snug">
                        Periodic valuation cycles (Q3 2026, Q4 2026) for private debt, SDIs & unlisted land.
                      </p>
                    </div>
                  </button>
                </div>

                {/* CONDITIONAL PRICING INPUTS */}
                {formPriceMode === 'LIVE_MARKET' ? (
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Live Exchange Parameters & Real-Time Sync</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          NSE/BSE Symbol Ticker <span className="text-emerald-700">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formSymbolTicker}
                          onChange={(e) => setFormSymbolTicker(e.target.value.toUpperCase())}
                          placeholder="e.g. EMBASSY, INDIGRID, GOLDBEES"
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 font-mono font-bold text-xs uppercase"
                        />
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Polled via Yahoo Finance / NSE feed
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          Current Market Price (₹) <span className="text-emerald-700">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={formCurrentPrice}
                          onChange={(e) => setFormCurrentPrice(e.target.value)}
                          placeholder="395.40"
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 font-mono font-bold text-xs"
                        />
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Base unit price (NSE tick ₹0.05)
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          Yield Payout Frequency
                        </label>
                        <select
                          value={formYieldPayoutFrequency}
                          onChange={(e) => setFormYieldPayoutFrequency(e.target.value as any)}
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 text-xs font-semibold"
                        >
                          <option value="Quarterly">Quarterly (REIT standard)</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Annual">Annual</option>
                          <option value="Maturity">At Maturity</option>
                        </select>
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Distribution schedule
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          24h Price Shift (₹)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.05"
                            value={formPriceChange24h}
                            onChange={(e) => setFormPriceChange24h(e.target.value)}
                            placeholder="+4.85"
                            className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 font-mono text-xs font-semibold"
                          />
                        </div>
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Absolute shift in ₹ over 24h
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          24h Price Shift (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formPriceChangePercent24h}
                          onChange={(e) => setFormPriceChangePercent24h(e.target.value)}
                          placeholder="+1.24"
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 font-mono text-xs font-semibold"
                        />
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Percentage movement over 24h
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-950 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span>
                        <strong>Live Market Feed Sync:</strong> Saving changes will immediately update the local cache, top marquee ticker, and explore grid.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-copper-500/30 space-y-3">
                    <div className="flex items-center gap-1.5 text-copper-900 text-[11px] font-bold">
                      <Calendar className="w-3.5 h-3.5 text-copper-700" />
                      <span>Periodic NAV & Valuation Audit Parameters</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          Assessed Unit NAV / Valuation (₹) <span className="text-copper-700">*</span>
                        </label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={formCurrentPrice}
                          onChange={(e) => setFormCurrentPrice(e.target.value)}
                          placeholder="100000"
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 font-mono font-bold text-xs"
                        />
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Certified Net Asset Value per unit
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          Valuation Cycle / Period <span className="text-copper-700">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formLastValuationPeriod}
                          onChange={(e) => setFormLastValuationPeriod(e.target.value)}
                          placeholder="e.g. Q3 2026 or FY 2026-27"
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 text-xs font-semibold"
                        />
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Educational appraisal timeline
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-espresso-800 mb-1">
                          Target Yield Payout Frequency
                        </label>
                        <select
                          value={formYieldPayoutFrequency}
                          onChange={(e) => setFormYieldPayoutFrequency(e.target.value as any)}
                          className="w-full p-2 rounded-xl border border-champagne-500/40 bg-sand-50/60 text-xs font-semibold"
                        >
                          <option value="Monthly">Monthly Cash Flow</option>
                          <option value="Quarterly">Quarterly Distribution</option>
                          <option value="Annual">Annual Payout</option>
                          <option value="Maturity">Lump Sum at Maturity</option>
                        </select>
                        <span className="text-[9px] text-espresso-500 block mt-0.5">
                          Investor payout schedule
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sand-100/80 border border-champagne-500/40 text-[10px] text-espresso-700">
                      <strong>Educational Transparency:</strong> Unlisted assets display "Last Valued: {formLastValuationPeriod || 'Q3 2026'}" and fixed target distribution yields rather than volatile 24h market swings.
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC CUSTOM FIELDS (Prompt Requirement 1) */}
              <div className="pt-2 border-t border-champagne-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                    Dynamic Custom Fields & Metrics
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-copper-700 bg-copper-500/10 hover:bg-copper-500/20 border border-copper-500/30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Field</span>
                  </button>
                </div>

                {formCustomFields.length > 0 ? (
                  <div className="space-y-2">
                    {formCustomFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                          placeholder="Field Label (e.g. Occupancy Rate, WALE, LTV)"
                          className="flex-1 p-2 rounded-xl border border-champagne-500/40 bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                          placeholder="Field Value (e.g. 94.5%, 6.2 Years)"
                          className="flex-1 p-2 rounded-xl border border-champagne-500/40 bg-white text-xs font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(idx)}
                          className="p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-espresso-500 italic bg-sand-100/70 p-2.5 rounded-xl border border-champagne-500/30">
                    No custom fields added yet. Click "+ Add Custom Field" to define bespoke metrics like Occupancy, WALE, or LTV Ratio.
                  </p>
                )}
              </div>

              {/* IMAGE ASSET UPLOAD SUPPORT (PNG/JPG/WEBP) */}
              <div className="pt-2 border-t border-champagne-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                    Property Photo Uploads (.png, .jpg, .webp)
                  </span>
                  <span className="text-[10px] text-espresso-500">
                    {formGalleryImages.length} Uploaded
                  </span>
                </div>

                {/* Drag-and-drop or file picker input */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-champagne-500/60 bg-sand-100/60 text-center hover:border-copper-500/60 transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
                    <Upload className="w-6 h-6 text-copper-600" />
                    <span className="text-xs font-bold text-espresso-900">
                      Click to Browse or Drag & Drop Property Images
                    </span>
                    <span className="text-[10px] text-espresso-500">
                      Supports PNG, JPG, JPEG, WEBP. Multiple photos supported.
                    </span>
                  </div>
                </div>

                {/* Previews Grid */}
                {formGalleryImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {formGalleryImages.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative rounded-xl overflow-hidden aspect-video border border-champagne-500/40 bg-white group shadow-xs"
                      >
                        <img
                          src={imgSrc}
                          alt={`Upload preview ${imgIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(imgIdx)}
                          className="absolute inset-0 bg-espresso-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4 text-rose-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MEDIA & ASSET LIST MANAGEMENT */}
              <div className="pt-2 border-t border-champagne-500/30 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                  Media & Asset List Management
                </span>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Property Photo Image URLs (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formPhotoUrls}
                    onChange={(e) => setFormPhotoUrls(e.target.value)}
                    placeholder="https://images.unsplash.com/..., https://..."
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Physical Properties List (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formAssetLocations}
                    onChange={(e) => setFormAssetLocations(e.target.value)}
                    placeholder="Express Towers Nariman Point, Embassy GolfLinks Bengaluru"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsInvestmentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="font-bold shadow-sm shadow-copper-500/20"
                >
                  {editingInvestment ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD ACADEMY TOPIC MODAL */}
      {/* ========================================================================= */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30 mb-5">
              <h3 className="text-xl font-display font-bold text-espresso-950">
                Add Main Topic to Academy
              </h3>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso-800 mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="e.g. Farmland & Managed Agro Assets"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value)}
                  placeholder="e.g. Farmland"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="Topic summary and educational value..."
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsTopicModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Save Topic
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD SUB-TOPIC CHAPTER MODAL */}
      {/* ========================================================================= */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30 mb-5">
              <h3 className="text-xl font-display font-bold text-espresso-950">
                {editingChapterId ? 'Edit Chapter & Attached Documents' : 'Add Chapter to Curriculum'}
              </h3>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso-800 mb-1">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Understanding Land Title Diligence & 10(1) Tax Shield"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Difficulty Level</label>
                  <select
                    value={chapterDifficulty}
                    onChange={(e) => setChapterDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Reading Duration</label>
                  <input
                    type="text"
                    value={chapterDuration}
                    onChange={(e) => setChapterDuration(e.target.value)}
                    placeholder="e.g. 8 mins"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Lesson Content Block</label>
                <textarea
                  rows={4}
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  placeholder="Structured chapter text content explaining key mechanics..."
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              {/* Quiz Settings */}
              <div className="pt-2 border-t border-champagne-500/30 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                  Interactive Quiz Question (Optional)
                </span>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={chapterQuizQuestion}
                    onChange={(e) => setChapterQuizQuestion(e.target.value)}
                    placeholder="e.g. Under Section 10(1), how is agricultural income taxed?"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">4 Options (Comma-separated)</label>
                  <input
                    type="text"
                    value={chapterQuizOptions}
                    onChange={(e) => setChapterQuizOptions(e.target.value)}
                    placeholder="100% Tax-Exempt, 30% Surcharge, 15% STCG, Flat 10% TDS"
                    className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-espresso-800 mb-1">Correct Option Index (0 to 3)</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={chapterQuizCorrectIndex}
                      onChange={(e) => setChapterQuizCorrectIndex(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-espresso-800 mb-1">Explanation</label>
                    <input
                      type="text"
                      value={chapterQuizExplanation}
                      onChange={(e) => setChapterQuizExplanation(e.target.value)}
                      placeholder="Agricultural income is fully exempt under Section 10(1)."
                      className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* CHAPTER DOCUMENTS & SLIDES ATTACHMENTS (Prompt Requirement 2) */}
              <div className="pt-2 border-t border-champagne-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                    Chapter Documents & Slides (.pdf, .ppt, .pptx)
                  </span>
                  <span className="text-[10px] text-espresso-500">
                    {chapterResources.length} Attached
                  </span>
                </div>

                {/* File picker dropzone */}
                <div className="p-3.5 rounded-2xl border-2 border-dashed border-champagne-500/60 bg-sand-100/60 text-center hover:border-copper-500/60 transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileUploadResource}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 pointer-events-none">
                    <Upload className="w-4 h-4 text-copper-600" />
                    <span className="text-xs font-bold text-espresso-900">
                      Upload PDF Document or Presentation Slides
                    </span>
                  </div>
                  <span className="text-[10px] text-espresso-500 block mt-0.5 pointer-events-none">
                    Accepts .pdf, .ppt, .pptx files. Automatically parses file size and format badge.
                  </span>
                </div>

                {/* Manual Link Input */}
                <div className="p-2.5 rounded-xl bg-sand-100/70 border border-champagne-500/30 space-y-2">
                  <span className="text-[10px] font-bold text-espresso-600 uppercase block">
                    Or Attach External Slide Link
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualResTitle}
                      onChange={(e) => setManualResTitle(e.target.value)}
                      placeholder="Resource Title (e.g. SEBI REIT Framework Slides)"
                      className="flex-1 p-2 rounded-lg border border-champagne-500/40 bg-white text-xs"
                    />
                    <select
                      value={manualResType}
                      onChange={(e) => setManualResType(e.target.value as any)}
                      className="px-2 py-1.5 rounded-lg border border-champagne-500/40 bg-white text-xs font-bold"
                    >
                      <option value="pdf">PDF</option>
                      <option value="ppt">PPT</option>
                      <option value="pptx">PPTX</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualResUrl}
                      onChange={(e) => setManualResUrl(e.target.value)}
                      placeholder="https://assets.welnex.in/... or Google Slides link"
                      className="flex-1 p-2 rounded-lg border border-champagne-500/40 bg-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualResource}
                      className="px-3 py-1.5 rounded-lg bg-copper-500 text-white text-xs font-bold hover:bg-copper-600 transition-colors cursor-pointer shrink-0"
                    >
                      Attach
                    </button>
                  </div>
                </div>

                {/* Attached resources list */}
                {chapterResources.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {chapterResources.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-champagne-500/40 shadow-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                            res.fileType === 'pdf' ? 'bg-rose-500/15 text-rose-700' : 'bg-amber-500/15 text-amber-800'
                          }`}>
                            {res.fileType}
                          </span>
                          <span className="text-xs font-bold text-espresso-950 truncate max-w-[220px]">
                            {res.title}
                          </span>
                          {res.fileSize && (
                            <span className="text-[10px] text-espresso-500 font-mono">
                              ({res.fileSize})
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(res.id)}
                          className="p-1 rounded text-espresso-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsChapterModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold cursor-pointer">
                  {editingChapterId ? 'Update Chapter' : 'Save Chapter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD TEAM MEMBER MODAL */}
      {/* ========================================================================= */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30 mb-5">
              <h3 className="text-xl font-display font-bold text-espresso-950">
                Add Team Member (RBAC)
              </h3>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="vikram@welnex.in"
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">Role Privileges</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-champagne-500/40 bg-white font-medium"
                >
                  <option value="Senior Editor">Senior Editor (Listings & Academy)</option>
                  <option value="Investment Analyst">Investment Analyst (Listings & Radar)</option>
                  <option value="Compliance Officer">Compliance Officer (Audit & SEBI Rules)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                  <option value="Super Admin">Super Admin (Full RBAC)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddAdminModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Add Administrator
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: VIEW FULL INQUIRY DETAILS MODAL */}
      {/* ========================================================================= */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#FAF5EE] border border-champagne-500/60 p-6 sm:p-7 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-champagne-500/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-copper-600" />
                <h3 className="font-display text-lg font-bold text-espresso-950">
                  Inquiry Details
                </h3>
              </div>
              <button
                onClick={() => setViewingInquiry(null)}
                className="p-1.5 rounded-full text-espresso-500 hover:text-espresso-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-champagne-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso-900 text-sm">{viewingInquiry.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-copper-500/15 text-copper-700 font-bold">
                    {viewingInquiry.category || 'General Inquiry'}
                  </span>
                </div>
                <div className="text-espresso-600 space-y-1">
                  <div><strong>Email:</strong> <a href={`mailto:${viewingInquiry.email}`} className="text-copper-700 hover:underline">{viewingInquiry.email}</a></div>
                  {viewingInquiry.phone && <div><strong>Phone:</strong> {viewingInquiry.phone}</div>}
                  <div><strong>Received:</strong> {new Date(viewingInquiry.timestamp).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-espresso-800 mb-1.5">
                  Message Content:
                </label>
                <div className="p-4 rounded-2xl bg-white border border-champagne-500/40 text-espresso-900 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {viewingInquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-espresso-800">Status:</span>
                  <select
                    value={viewingInquiry.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as InquiryStatus;
                      const updated = updateInquiryStatus(viewingInquiry.id, newStatus);
                      setInquiries(updated);
                      setViewingInquiry({ ...viewingInquiry, status: newStatus });
                      await updateInquiryStatusInSupabase(viewingInquiry.id, newStatus);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-champagne-500/50 bg-white font-bold cursor-pointer"
                  >
                    <option value="Unread">Unread</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <a
                  href={`mailto:${viewingInquiry.email}?subject=WelNex%20Inquiry%20Response&body=Dear%20${encodeURIComponent(viewingInquiry.name)},%0A%0AThank%20you%20for%20contacting%20WelNex.%0A%0A`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-copper-500 hover:bg-copper-600 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

