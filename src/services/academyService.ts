import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Topic, SubTopic } from '../types/academy';
import rawAcademyData from '../data/academyData.json';
import { saveDocumentToIndexedDB } from './indexedDbStorage';

const LOCAL_STORAGE_KEY = 'welnex_custom_academy_topics';

/**
 * Maps Supabase chapter row to SubTopic
 */
export function mapDbChapterToSubTopic(row: any): SubTopic {
  return {
    id: row.id,
    topicId: row.topic_id,
    title: row.title,
    slug: row.slug,
    difficulty: row.difficulty || 'Beginner',
    estimatedReadingTime: row.estimated_reading_time || `${row.duration_minutes || 8} min read`,
    durationMinutes: Number(row.duration_minutes) || 8,
    summary: row.summary || '',
    order: Number(row.sort_order) || 1,
    contentSections: Array.isArray(row.content_sections) ? row.content_sections : [],
    numericalExamples: Array.isArray(row.numerical_examples) ? row.numerical_examples : undefined,
    quizQuestions: Array.isArray(row.quiz_questions) ? row.quiz_questions : undefined,
    resources: Array.isArray(row.resources) ? row.resources : undefined,
    documentUrl: row.document_url || row.documentUrl || undefined,
    slidesUrl: row.slides_url || row.slidesUrl || undefined
  };
}

/**
 * Maps SubTopic to Supabase chapter row
 */
export function mapSubTopicToDbChapter(chapter: SubTopic): any {
  return {
    id: chapter.id,
    topic_id: chapter.topicId,
    title: chapter.title,
    slug: chapter.slug,
    difficulty: chapter.difficulty,
    estimated_reading_time: chapter.estimatedReadingTime,
    duration_minutes: chapter.durationMinutes,
    summary: chapter.summary,
    sort_order: chapter.order || 1,
    content_sections: chapter.contentSections || [],
    numerical_examples: chapter.numericalExamples || [],
    quiz_questions: chapter.quizQuestions || [],
    resources: chapter.resources || [],
    document_url: chapter.documentUrl || null,
    slides_url: chapter.slidesUrl || null,
    updated_at: new Date().toISOString()
  };
}

/**
 * Maps Supabase topic row to Topic
 */
export function mapDbTopicToTopic(row: any, chapters: any[] = []): Topic {
  const subTopics = chapters
    .filter((c) => c.topic_id === row.id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(mapDbChapterToSubTopic);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description || '',
    iconName: row.icon_name || 'BookOpen',
    order: Number(row.sort_order) || 1,
    subTopics
  };
}

/**
 * Sanitizes a single chapter for localStorage:
 * Offloads bulky Base64 binary strings to IndexedDB and replaces them with
 * clean `indexeddb://` references, preventing QUOTA_EXCEEDED_ERR.
 */
export function sanitizeChapterForLocalStorage(chapter: SubTopic): SubTopic {
  let docUrl = chapter.documentUrl;
  let sldUrl = chapter.slidesUrl;

  if (docUrl && docUrl.startsWith('data:')) {
    const key = `doc_${chapter.id}`;
    saveDocumentToIndexedDB(key, docUrl);
    docUrl = `indexeddb://${key}`;
  }

  if (sldUrl && sldUrl.startsWith('data:')) {
    const key = `slides_${chapter.id}`;
    saveDocumentToIndexedDB(key, sldUrl);
    sldUrl = `indexeddb://${key}`;
  }

  const resources = chapter.resources?.map(r => {
    if (r.fileUrl && r.fileUrl.startsWith('data:')) {
      saveDocumentToIndexedDB(r.id, r.fileUrl);
      return {
        ...r,
        fileUrl: `indexeddb://${r.id}`
      };
    }
    return r;
  });

  return {
    ...chapter,
    documentUrl: docUrl,
    slidesUrl: sldUrl,
    resources
  };
}

/**
 * Sanitizes all topics for localStorage to guarantee payload is under ~50KB.
 */
export function sanitizeTopicsForLocalStorage(topics: Topic[]): Topic[] {
  return topics.map(topic => ({
    ...topic,
    subTopics: topic.subTopics.map(sanitizeChapterForLocalStorage)
  }));
}

/**
 * Safely saves topics to localStorage with quota protection and emergency fallback.
 */
export function safeSaveAcademyTopicsToLocalStorage(topics: Topic[]): void {
  try {
    const sanitized = sanitizeTopicsForLocalStorage(topics);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[academyService] LocalStorage quota limit detected, performing aggressive compression:', err);
    try {
      // Emergency strip of any large data strings
      const ultraClean = topics.map(t => ({
        ...t,
        subTopics: t.subTopics.map(st => ({
          ...st,
          documentUrl: st.documentUrl?.startsWith('data:') ? `indexeddb://doc_${st.id}` : st.documentUrl,
          slidesUrl: st.slidesUrl?.startsWith('data:') ? `indexeddb://slides_${st.id}` : st.slidesUrl,
          resources: st.resources?.map(r => ({
            ...r,
            fileUrl: r.fileUrl?.startsWith('data:') ? `indexeddb://${r.id}` : r.fileUrl
          }))
        }))
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ultraClean));
    } catch (e2) {
      console.error('[academyService] Critical localStorage write error:', e2);
    }
  }
}

/**
 * Merges freshly fetched topics with locally cached topics to guarantee
 * that custom chapters, Base64 document attachments, and slide decks
 * are never wiped or reset by stale network responses.
 */
export function mergeTopicsWithLocalCache(incomingTopics: Topic[], cachedTopics: Topic[]): Topic[] {
  if (!cachedTopics || cachedTopics.length === 0) return incomingTopics;
  if (!incomingTopics || incomingTopics.length === 0) return cachedTopics;

  const cachedTopicMap = new Map<string, Topic>();
  cachedTopics.forEach(t => cachedTopicMap.set(t.id, t));

  const mergedTopics: Topic[] = incomingTopics.map(inTopic => {
    const cachedTopic = cachedTopicMap.get(inTopic.id);
    if (!cachedTopic) return inTopic;

    const cachedSubMap = new Map<string, SubTopic>();
    cachedTopic.subTopics.forEach(st => cachedSubMap.set(st.id, st));

    // Merge subtopics, preserving attached documentUrl, slidesUrl, and resources
    const mergedSubs = inTopic.subTopics.map(inSub => {
      const cachedSub = cachedSubMap.get(inSub.id);
      if (!cachedSub) return inSub;
      return {
        ...inSub,
        documentUrl: cachedSub.documentUrl || inSub.documentUrl,
        slidesUrl: cachedSub.slidesUrl || inSub.slidesUrl,
        resources: (cachedSub.resources && cachedSub.resources.length > 0) ? cachedSub.resources : inSub.resources
      };
    });

    // Also preserve custom chapters in cache that aren't yet in the remote database
    const inSubIds = new Set(inTopic.subTopics.map(st => st.id));
    const extraCachedSubs = cachedTopic.subTopics.filter(st => !inSubIds.has(st.id));

    return {
      ...inTopic,
      subTopics: [...mergedSubs, ...extraCachedSubs]
    };
  });

  // Also preserve entirely new topics created locally
  const inTopicIds = new Set(incomingTopics.map(t => t.id));
  const extraCachedTopics = cachedTopics.filter(t => !inTopicIds.has(t.id));

  return [...mergedTopics, ...extraCachedTopics];
}

/**
 * Fetch all Academy topics and nested chapters from Supabase
 */
export async function fetchAcademyDataFromSupabase(): Promise<Topic[]> {
  const getFallback = (): Topic[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : (rawAcademyData as Topic[]);
    } catch {
      return rawAcademyData as Topic[];
    }
  };

  const cachedData = getFallback();

  if (!isSupabaseConfigured) {
    return cachedData;
  }

  try {
    // Hierarchical query fetching topics and chapters
    const { data: topicsData, error: topicsError } = await supabase
      .from('academy_topics')
      .select('*, academy_chapters(*)')
      .order('sort_order', { ascending: true });

    if (topicsError) {
      console.warn('[academyService] Supabase topics query error, using local fallback:', topicsError.message);
      return cachedData;
    }

    if (topicsData && topicsData.length > 0) {
      const formatted: Topic[] = topicsData.map((t) => {
        const rawChapters = Array.isArray(t.academy_chapters) ? t.academy_chapters : [];
        return mapDbTopicToTopic(t, rawChapters);
      });

      // Merge Supabase topics with local cache so custom uploaded documents/chapters are never lost
      const merged = mergeTopicsWithLocalCache(formatted, cachedData);
      safeSaveAcademyTopicsToLocalStorage(merged);
      return merged;
    }

    return cachedData;
  } catch (err) {
    console.error('[academyService] Network error fetching academy data:', err);
    return cachedData;
  }
}

/**
 * Upsert a topic into Supabase (Admin CMS action)
 */
export async function upsertAcademyTopicToSupabase(
  topic: Topic
): Promise<{ success: boolean; error?: string }> {
  // Update local cache
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: Topic[] = raw ? JSON.parse(raw) : (rawAcademyData as Topic[]);
    const idx = existing.findIndex((t) => t.id === topic.id);
    let updated: Topic[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = topic;
    } else {
      updated = [...existing, topic];
    }
    safeSaveAcademyTopicsToLocalStorage(updated);
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const row = {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      description: topic.description,
      icon_name: topic.iconName || 'BookOpen',
      sort_order: topic.order || 1,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('academy_topics')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('[academyService] Error upserting topic to Supabase, keeping local state:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[academyService] Network error upserting topic to Supabase:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Delete a topic from Supabase
 */
export async function deleteAcademyTopicFromSupabase(
  topicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const existing: Topic[] = JSON.parse(raw);
      const filtered = existing.filter((t) => t.id !== topicId);
      safeSaveAcademyTopicsToLocalStorage(filtered);
    }
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('academy_topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Upsert a chapter into Supabase (Admin CMS action)
 * Wrapped in safe try/catch to log schema/payload errors while preserving local memory state.
 */
export async function upsertAcademyChapterToSupabase(
  chapter: SubTopic
): Promise<{ success: boolean; error?: string }> {
  // 1. Sync to local cache immediately with safe quota protection
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: Topic[] = raw ? JSON.parse(raw) : (rawAcademyData as Topic[]);
    const updated = existing.map((t) => {
      if (t.id === chapter.topicId) {
        const cIndex = t.subTopics.findIndex((st) => st.id === chapter.id);
        const newSubs = cIndex >= 0
          ? t.subTopics.map((st, i) => (i === cIndex ? chapter : st))
          : [...t.subTopics, chapter];
        return { ...t, subTopics: newSubs };
      }
      return t;
    });
    safeSaveAcademyTopicsToLocalStorage(updated);
  } catch (err) {
    console.warn('[academyService] Local cache sync warning:', err);
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  // 2. Wrap Supabase update in a try-catch block and log DB schema / payload rejection errors
  try {
    // Sanitize payload so Supabase doesn't reject mega-byte Base64 payloads
    const sanitizedChapter = {
      ...chapter,
      documentUrl: chapter.documentUrl?.startsWith('data:')
        ? `indexeddb://doc_${chapter.id}`
        : chapter.documentUrl,
      slidesUrl: chapter.slidesUrl?.startsWith('data:')
        ? `indexeddb://slides_${chapter.id}`
        : chapter.slidesUrl,
      resources: chapter.resources?.map(r => ({
        ...r,
        fileUrl: r.fileUrl?.startsWith('data:')
          ? `indexeddb://${r.id}`
          : r.fileUrl
      }))
    };

    const row = mapSubTopicToDbChapter(sanitizedChapter);
    const { error } = await supabase
      .from('academy_chapters')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('[academyService] Supabase DB chapter upsert schema/payload rejection, local memory state kept intact:', error.message || error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[academyService] Supabase chapter upsert network error, local memory state kept intact:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Delete a chapter from Supabase
 */
export async function deleteAcademyChapterFromSupabase(
  chapterId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const existing: Topic[] = JSON.parse(raw);
      const updated = existing.map((t) => ({
        ...t,
        subTopics: t.subTopics.filter((st) => st.id !== chapterId)
      }));
      safeSaveAcademyTopicsToLocalStorage(updated);
    }
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('academy_chapters')
      .delete()
      .eq('id', chapterId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error' };
  }
}
