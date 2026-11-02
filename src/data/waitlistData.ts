import type { WaitlistLead } from '../types';

export const INITIAL_WAITLIST_LEADS: WaitlistLead[] = [
  {
    id: 'lead-001',
    fullName: 'Rohan Sharma',
    email: 'rprohan06@gmail.com',
    investorProfile: 'HNW / Accredited Investor',
    interests: ['REIT', 'InvIT', 'SDI'],
    signupDate: '2026-10-24',
    status: 'VIP Invited'
  },
  {
    id: 'lead-002',
    fullName: 'Meera Nambiar',
    email: 'meera.nambiar@heritage-wealth.in',
    investorProfile: 'Retail Stock/MF Investor',
    interests: ['REIT', 'Bond'],
    signupDate: '2026-10-23',
    status: 'Verified'
  },
  {
    id: 'lead-003',
    fullName: 'Arvind Singhal',
    email: 'arvind.singhal@singhalcapital.com',
    investorProfile: 'Institutional / Family Office',
    interests: ['InvIT', 'SDI', 'Gold'],
    signupDate: '2026-10-22',
    status: 'VIP Invited'
  },
  {
    id: 'lead-004',
    fullName: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta.md@globalcare.org',
    investorProfile: 'NRI Investor',
    interests: ['REIT', 'Gold', 'Bond'],
    signupDate: '2026-10-21',
    status: 'Verified'
  },
  {
    id: 'lead-005',
    fullName: 'Vikramaditya Iyer',
    email: 'vikram.iyer@ca-associates.in',
    investorProfile: 'Finance Professional / CA',
    interests: ['SDI', 'Bond', 'InvIT'],
    signupDate: '2026-10-20',
    status: 'Pending Review'
  },
  {
    id: 'lead-006',
    fullName: 'Ananya Deshpande',
    email: 'ananya.d@fintechstartups.io',
    investorProfile: 'Curious Beginner',
    interests: ['REIT', 'Gold'],
    signupDate: '2026-10-19',
    status: 'Verified'
  },
  {
    id: 'lead-007',
    fullName: 'Rajiv Malhotra',
    email: 'rajiv.malhotra@malhotragroup.in',
    investorProfile: 'HNW / Accredited Investor',
    interests: ['REIT', 'InvIT', 'SDI', 'Bond'],
    signupDate: '2026-10-18',
    status: 'VIP Invited'
  }
];

const WAITLIST_STORAGE_KEY = 'welnex_waitlist_leads';

export function getWaitlistLeads(): WaitlistLead[] {
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(INITIAL_WAITLIST_LEADS));
      return INITIAL_WAITLIST_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WAITLIST_LEADS;
  } catch (err) {
    console.error('Error reading waitlist leads from localStorage:', err);
    return INITIAL_WAITLIST_LEADS;
  }
}

export function saveWaitlistLeads(leads: WaitlistLead[]): void {
  try {
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Error saving waitlist leads to localStorage:', err);
  }
}

export function addWaitlistLead(lead: Omit<WaitlistLead, 'id' | 'signupDate' | 'status'> & { status?: WaitlistLead['status'] }): WaitlistLead {
  const existing = getWaitlistLeads();
  const newLead: WaitlistLead = {
    id: `lead-${Date.now()}`,
    fullName: lead.fullName,
    email: lead.email,
    investorProfile: lead.investorProfile,
    interests: lead.interests || ['REIT'],
    signupDate: new Date().toISOString().split('T')[0],
    status: lead.status || 'Verified'
  };

  // Prepend so latest appears first
  const updated = [newLead, ...existing.filter(l => l.email.toLowerCase() !== lead.email.toLowerCase())];
  saveWaitlistLeads(updated);
  return newLead;
}

export function updateWaitlistLeadStatus(id: string, status: WaitlistLead['status']): WaitlistLead[] {
  const existing = getWaitlistLeads();
  const updated = existing.map(l => l.id === id ? { ...l, status } : l);
  saveWaitlistLeads(updated);
  return updated;
}

export function deleteWaitlistLead(id: string): WaitlistLead[] {
  const existing = getWaitlistLeads();
  const updated = existing.filter(l => l.id !== id);
  saveWaitlistLeads(updated);
  return updated;
}

export function exportWaitlistToCSV(leads: WaitlistLead[]): void {
  const headers = ['Full Name', 'Email Address', 'Investor Profile', 'Interests', 'Signup Date', 'Status'];
  const rows = leads.map(l => [
    `"${l.fullName.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.investorProfile.replace(/"/g, '""')}"`,
    `"${(l.interests || []).join('; ')}"`,
    `"${l.signupDate}"`,
    `"${l.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `welnex-waitlist-leads-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
