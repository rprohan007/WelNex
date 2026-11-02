export type InquiryStatus = 'Unread' | 'Contacted' | 'Resolved';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  status: InquiryStatus;
  category?: string;
}

const STORAGE_KEY = 'welnex_contact_inquiries';

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-101',
    name: 'Vikramaditya Singhania',
    email: 'v.singhania@apexcapital.in',
    phone: '+91 98201 44521',
    message: 'We are evaluating SEBI-registered Category II AIFs and SM REIT pipelines for our multi-family office in Mumbai. Would like to understand WelNex verification criteria and institutional API access.',
    timestamp: '2026-10-24T18:30:00.000Z',
    status: 'Unread',
    category: 'Family Office / Institutional'
  },
  {
    id: 'inq-102',
    name: 'Dr. Ananya Deshmukh',
    email: 'ananya.deshmukh@cardiohealth.org',
    phone: '+91 94220 88390',
    message: 'Hello team WelNex. I currently invest in mutual funds and fixed deposits. Wanted guidance on whether InvIT distribution yields (like IndiGrid or PGInvIT) have TDS withheld automatically, and how taxation works in the 30% slab.',
    timestamp: '2026-10-24T14:15:00.000Z',
    status: 'Contacted',
    category: 'Retail & HNI Investor'
  },
  {
    id: 'inq-103',
    name: 'Rajesh K. Mehta',
    email: 'rajesh.mehta@solargridinfra.com',
    phone: '+91 98110 33402',
    message: 'We are preparing a ₹250 Cr clean-energy InvIT prospectus for renewable solar assets in Gujarat & Rajasthan. We would like to explore listing asset disclosures on WelNex discovery catalogue.',
    timestamp: '2026-10-23T11:45:00.000Z',
    status: 'Unread',
    category: 'Asset Sponsor / Listing'
  },
  {
    id: 'inq-104',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@wealthzenith.com',
    phone: '+91 97410 55199',
    message: 'Requesting a demo of the Virtual Portfolio Simulator for our team of 14 wealth managers in Bengaluru to stress-test high-yield corporate bonds.',
    timestamp: '2026-10-22T09:20:00.000Z',
    status: 'Resolved',
    category: 'Advisor Demo'
  }
];

export function getContactInquiries(): ContactInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse contact inquiries from localStorage:', err);
    return INITIAL_INQUIRIES;
  }
}

export function addContactInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  category?: string;
}): ContactInquiry {
  const inquiries = getContactInquiries();
  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    message: data.message.trim(),
    timestamp: new Date().toISOString(),
    status: 'Unread',
    category: data.category || 'General Inquiry'
  };

  const updated = [newInquiry, ...inquiries];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save inquiry to localStorage:', err);
  }

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InquiryStatus): ContactInquiry[] {
  const inquiries = getContactInquiries();
  const updated = inquiries.map((item) => (item.id === id ? { ...item, status } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update inquiry status in localStorage:', err);
  }
  return updated;
}

export function deleteInquiry(id: string): ContactInquiry[] {
  const inquiries = getContactInquiries();
  const updated = inquiries.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete inquiry from localStorage:', err);
  }
  return updated;
}

export function exportInquiriesToCSV(inquiries: ContactInquiry[]): void {
  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Category', 'Status', 'Submission Timestamp', 'Message Content'];
  const rows = inquiries.map((inq) => [
    `"${inq.id}"`,
    `"${inq.name.replace(/"/g, '""')}"`,
    `"${inq.email.replace(/"/g, '""')}"`,
    `"${inq.phone.replace(/"/g, '""')}"`,
    `"${(inq.category || 'General').replace(/"/g, '""')}"`,
    `"${inq.status}"`,
    `"${new Date(inq.timestamp).toLocaleString('en-IN')}"`,
    `"${inq.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `welnex-contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
