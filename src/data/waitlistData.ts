import type { WaitlistLead } from '../types';

export const INITIAL_WAITLIST_LEADS: WaitlistLead[] = [];

const WAITLIST_STORAGE_KEY = 'welnex_waitlist_leads';

const LEGACY_MOCK_LEAD_IDS = new Set([
  'lead-001',
  'lead-002',
  'lead-003',
  'lead-004',
  'lead-005',
  'lead-006',
  'lead-007'
]);

export function getWaitlistLeads(): WaitlistLead[] {
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any legacy dummy mock items if present in old localStorage
      const cleaned = parsed.filter(lead => lead && lead.id && !LEGACY_MOCK_LEAD_IDS.has(lead.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Error reading waitlist leads from localStorage:', err);
    return [];
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
