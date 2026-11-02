import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { ContactInquiry, InquiryStatus } from '../data/inquiriesData';
import {
  getContactInquiries,
  addContactInquiry as addContactInquiryLocal,
  updateInquiryStatus as updateInquiryStatusLocal,
  deleteInquiry as deleteInquiryLocal
} from '../data/inquiriesData';

const LOCAL_STORAGE_KEY = 'welnex_contact_inquiries';

/**
 * Maps Supabase DB row to ContactInquiry
 */
export function mapDbRowToInquiry(row: any): ContactInquiry {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone || '',
    message: row.message,
    category: row.category || 'General Inquiry',
    status: (row.status as InquiryStatus) || 'Unread',
    timestamp: row.created_at || new Date().toISOString()
  };
}

/**
 * Fetch all contact inquiries from Supabase with fallback
 */
export async function fetchContactInquiriesFromSupabase(): Promise<ContactInquiry[]> {
  if (!isSupabaseConfigured) {
    return getContactInquiries();
  }

  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[inquiriesService] Supabase query error, using local fallback:', error.message);
      return getContactInquiries();
    }

    if (Array.isArray(data)) {
      const inquiries = data.map(mapDbRowToInquiry);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inquiries));
      } catch {
        // ignore
      }
      return inquiries;
    }

    return getContactInquiries();
  } catch (err) {
    console.error('[inquiriesService] Network error fetching inquiries:', err);
    return getContactInquiries();
  }
}

/**
 * Submit contact inquiry to Supabase (protected insert access)
 */
export async function submitContactInquiryToSupabase(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  category?: string;
}): Promise<{ success: boolean; inquiry: ContactInquiry; error?: string }> {
  // Always record locally first
  const localInquiry = addContactInquiryLocal(data);

  if (!isSupabaseConfigured) {
    return { success: true, inquiry: localInquiry };
  }

  try {
    const dbRow = {
      full_name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      category: data.category || 'General Inquiry',
      status: 'Unread'
    };

    const { data: inserted, error } = await supabase
      .from('contact_inquiries')
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error('[inquiriesService] Error inserting contact inquiry:', error);
      return { success: true, inquiry: localInquiry, error: error.message };
    }

    const mapped = mapDbRowToInquiry(inserted);
    return { success: true, inquiry: mapped };
  } catch (err: any) {
    console.error('[inquiriesService] Network error submitting inquiry:', err);
    return { success: true, inquiry: localInquiry, error: err.message };
  }
}

/**
 * Update contact inquiry status in Supabase (Admin CMS action)
 */
export async function updateInquiryStatusInSupabase(
  id: string,
  status: InquiryStatus
): Promise<{ success: boolean; error?: string }> {
  updateInquiryStatusLocal(id, status);

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[inquiriesService] Error updating inquiry status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Delete inquiry from Supabase (Admin CMS action)
 */
export async function deleteInquiryFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  deleteInquiryLocal(id);

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[inquiriesService] Error deleting inquiry:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}
