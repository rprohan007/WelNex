import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { WaitlistLead } from '../types';
import {
  getWaitlistLeads,
  saveWaitlistLeads,
  addWaitlistLead as addWaitlistLeadLocal,
  updateWaitlistLeadStatus as updateWaitlistLeadStatusLocal,
  deleteWaitlistLead as deleteWaitlistLeadLocal
} from '../data/waitlistData';

/**
 * Transforms Supabase DB row to WaitlistLead
 */
export function mapDbRowToWaitlistLead(row: any): WaitlistLead {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    investorProfile: row.investor_profile || 'Curious Beginner',
    interests: Array.isArray(row.interests) ? row.interests : ['REIT'],
    signupDate: row.signup_date || (row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    status: row.status || 'Verified'
  };
}

/**
 * Fetch all waitlist leads from Supabase with fallback
 */
export async function fetchWaitlistLeadsFromSupabase(): Promise<WaitlistLead[]> {
  if (!isSupabaseConfigured) {
    return getWaitlistLeads();
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[waitlistService] Supabase query error, using local fallback:', error.message);
      return getWaitlistLeads();
    }

    if (data && data.length > 0) {
      const leads = data.map(mapDbRowToWaitlistLead);
      saveWaitlistLeads(leads);
      return leads;
    }

    return getWaitlistLeads();
  } catch (err) {
    console.error('[waitlistService] Network error fetching waitlist:', err);
    return getWaitlistLeads();
  }
}

/**
 * Submit a new waitlist lead to Supabase (protected insert access)
 */
export async function submitWaitlistLeadToSupabase(
  lead: Omit<WaitlistLead, 'id' | 'signupDate' | 'status'> & { status?: WaitlistLead['status'] }
): Promise<{ success: boolean; lead: WaitlistLead; error?: string }> {
  // Always update local cache first
  const localLead = addWaitlistLeadLocal(lead);

  if (!isSupabaseConfigured) {
    return { success: true, lead: localLead };
  }

  try {
    const dbRow = {
      full_name: lead.fullName.trim(),
      email: lead.email.trim(),
      investor_profile: lead.investorProfile,
      interests: lead.interests || ['REIT'],
      status: lead.status || 'Verified',
      signup_date: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('waitlist')
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error('[waitlistService] Error inserting waitlist lead:', error);
      // Return success with local lead so user experience is smooth
      return { success: true, lead: localLead, error: error.message };
    }

    const createdLead = mapDbRowToWaitlistLead(data);
    return { success: true, lead: createdLead };
  } catch (err: any) {
    console.error('[waitlistService] Network error submitting waitlist lead:', err);
    return { success: true, lead: localLead, error: err.message };
  }
}

/**
 * Update waitlist lead status in Supabase (Admin CMS action)
 */
export async function updateWaitlistLeadStatusInSupabase(
  id: string,
  status: WaitlistLead['status']
): Promise<{ success: boolean; error?: string }> {
  updateWaitlistLeadStatusLocal(id, status);

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[waitlistService] Error updating waitlist lead status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Delete waitlist lead from Supabase (Admin CMS action)
 */
export async function deleteWaitlistLeadFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  deleteWaitlistLeadLocal(id);

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[waitlistService] Error deleting waitlist lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}
