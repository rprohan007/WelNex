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

export const INITIAL_INQUIRIES: ContactInquiry[] = [];

const LEGACY_MOCK_INQUIRY_IDS = new Set([
  'inq-101',
  'inq-102',
  'inq-103',
  'inq-104'
]);

export function getContactInquiries(): ContactInquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out legacy dummy mock items if present in old localStorage
      const cleaned = parsed.filter(item => item && item.id && !LEGACY_MOCK_INQUIRY_IDS.has(item.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse contact inquiries from localStorage:', err);
    return [];
  }
}

export function saveContactInquiries(inquiries: ContactInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Failed to save contact inquiries to localStorage:', err);
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
  saveContactInquiries(updated);

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InquiryStatus): ContactInquiry[] {
  const inquiries = getContactInquiries();
  const updated = inquiries.map((item) => (item.id === id ? { ...item, status } : item));
  saveContactInquiries(updated);
  return updated;
}

export function deleteInquiry(id: string): ContactInquiry[] {
  const inquiries = getContactInquiries();
  const updated = inquiries.filter((item) => item.id !== id);
  saveContactInquiries(updated);
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
