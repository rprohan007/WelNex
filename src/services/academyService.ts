import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Topic, SubTopic } from '../types/academy';
import rawAcademyData from '../data/academyData.json';

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
    resources: Array.isArray(row.resources) ? row.resources : undefined
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

  if (!isSupabaseConfigured) {
    return getFallback();
  }

  try {
    // Hierarchical query fetching topics and chapters
    const { data: topicsData, error: topicsError } = await supabase
      .from('academy_topics')
      .select('*, academy_chapters(*)')
      .order('sort_order', { ascending: true });

    if (topicsError) {
      console.warn('[academyService] Supabase topics query error, using local fallback:', topicsError.message);
      return getFallback();
    }

    if (topicsData && topicsData.length > 0) {
      const formatted: Topic[] = topicsData.map((t) => {
        const rawChapters = Array.isArray(t.academy_chapters) ? t.academy_chapters : [];
        return mapDbTopicToTopic(t, rawChapters);
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formatted));
      } catch {
        // ignore
      }
      return formatted;
    }

    return getFallback();
  } catch (err) {
    console.error('[academyService] Network error fetching academy data:', err);
    return getFallback();
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
      console.error('[academyService] Error upserting topic:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
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
 */
export async function upsertAcademyChapterToSupabase(
  chapter: SubTopic
): Promise<{ success: boolean; error?: string }> {
  // Sync to local cache
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const row = mapSubTopicToDbChapter(chapter);
    const { error } = await supabase
      .from('academy_chapters')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[academyService] Error upserting chapter:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
