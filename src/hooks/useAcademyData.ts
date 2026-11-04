import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Topic, SubTopic, LessonStatus, AcademyStats } from '../types/academy';
import rawAcademyData from '../data/academyData.json';
import { fetchAcademyDataFromSupabase, mergeTopicsWithLocalCache } from '../services/academyService';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY_TOPICS = 'welnex_custom_academy_topics';

export const useAcademyData = () => {
  // Initial cached / raw topics for immediate display
  const [allTopics, setAllTopics] = useState<Topic[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TOPICS);
      return stored ? JSON.parse(stored) : (rawAcademyData as Topic[]);
    } catch {
      return rawAcademyData as Topic[];
    }
  });

  const { user, isSignedIn, openAuthModal } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic Supabase Query on mount and whenever authentication state changes:
  // Hydrates live chapters from Supabase for all users (standard users & admins)
  const refreshAcademyData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Hydrate state from Supabase first
      const liveTopics = await fetchAcademyDataFromSupabase();
      if (Array.isArray(liveTopics) && liveTopics.length > 0) {
        setAllTopics(liveTopics);
      } else {
        // Fall back to cached chapters from local storage without resetting freshly created chapters
        const stored = localStorage.getItem(STORAGE_KEY_TOPICS);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setAllTopics((prev) => mergeTopicsWithLocalCache(parsed, prev));
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('[useAcademyData] Error refreshing academy topics from Supabase, preserving local chapters:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAcademyData();
  }, [refreshAcademyData, isSignedIn]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopicIds, setExpandedTopicIds] = useState<string[]>([allTopics[0]?.id || 'topic-foundations']);
  const [selectedLesson, setSelectedLesson] = useState<SubTopic | null>(null);

  // Storage key uniquely scoped per user identity
  const userStorageKey = useMemo(() => {
    if (!isSignedIn || !user) return null;
    const identifier = user.id || user.primaryEmailAddress?.emailAddress || 'default_user';
    return `welnex_academy_user_progress_${identifier}`;
  }, [isSignedIn, user]);

  // Completed Lessons State initialized explicitly to 0% (empty array) for first-time or guest users
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    if (!isSignedIn || !user) return [];
    try {
      const identifier = user.id || user.primaryEmailAddress?.emailAddress || 'default_user';
      const stored = localStorage.getItem(`welnex_academy_user_progress_${identifier}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // In-Progress Lessons State (clean initial state)
  const [inProgressLessonIds, setInProgressLessonIds] = useState<string[]>([]);

  // Re-sync progress whenever authentication state or logged-in user changes
  useEffect(() => {
    if (isSignedIn && userStorageKey) {
      try {
        const stored = localStorage.getItem(userStorageKey);
        setCompletedLessonIds(stored ? JSON.parse(stored) : []);
      } catch {
        setCompletedLessonIds([]);
      }
    } else {
      // Guest or logged-out: reset to empty
      setCompletedLessonIds([]);
    }
  }, [isSignedIn, userStorageKey]);

  // Persist completed lessons only for authenticated users
  useEffect(() => {
    if (isSignedIn && userStorageKey) {
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(completedLessonIds));
      } catch {
        // ignore
      }
    }
  }, [completedLessonIds, isSignedIn, userStorageKey]);

  // Dynamic Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allTopics.forEach((t) => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [allTopics]);

  // Filtered Topics - module contents are strictly gated to signed-in users
  const filteredTopics = useMemo(() => {
    if (!isSignedIn) {
      return [];
    }

    return allTopics.filter((topic) => {
      // Category filter
      if (selectedCategory !== 'All' && topic.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTopic = topic.title.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q);
        const matchesSub = topic.subTopics.some(
          (sub) => sub.title.toLowerCase().includes(q) || sub.summary.toLowerCase().includes(q)
        );
        if (!matchesTopic && !matchesSub) {
          return false;
        }
      }

      return true;
    });
  }, [allTopics, selectedCategory, searchQuery, isSignedIn]);

  // Topic Accordion Toggle
  const toggleTopicExpand = (id: string) => {
    setExpandedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAllTopics = () => {
    setExpandedTopicIds(filteredTopics.map((t) => t.id));
  };

  const collapseAllTopics = () => {
    setExpandedTopicIds([]);
  };

  // Status helper
  const getLessonStatus = (id: string): LessonStatus => {
    if (completedLessonIds.includes(id)) return 'Completed';
    if (inProgressLessonIds.includes(id)) return 'In Progress';
    return 'Unread';
  };

  // Mark Complete toggle (auth-gated)
  const markLessonComplete = (lessonId: string) => {
    if (!isSignedIn) {
      openAuthModal();
      return;
    }

    setCompletedLessonIds((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      }
      return [...prev, lessonId];
    });

    // Remove from in-progress if completed
    setInProgressLessonIds((prev) => prev.filter((id) => id !== lessonId));
  };

  // Mark in progress
  const markLessonInProgress = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId) && !inProgressLessonIds.includes(lessonId)) {
      setInProgressLessonIds((prev) => [...prev, lessonId]);
    }
  };

  // Flat lessons list for sequential navigation
  const allSubTopics = useMemo(() => {
    const list: SubTopic[] = [];
    allTopics.forEach((t) => {
      t.subTopics.forEach((st) => list.push(st));
    });
    return list;
  }, [allTopics]);

  // Find next and prev lessons
  const getNextLesson = (currentId: string): SubTopic | null => {
    const idx = allSubTopics.findIndex((item) => item.id === currentId);
    if (idx >= 0 && idx < allSubTopics.length - 1) {
      return allSubTopics[idx + 1];
    }
    return null;
  };

  const getPrevLesson = (currentId: string): SubTopic | null => {
    const idx = allSubTopics.findIndex((item) => item.id === currentId);
    if (idx > 0) {
      return allSubTopics[idx - 1];
    }
    return null;
  };

  const findLessonById = (id: string): { lesson: SubTopic; topic: Topic } | null => {
    for (const topic of allTopics) {
      const match = topic.subTopics.find((st) => st.id === id);
      if (match) return { lesson: match, topic };
    }
    return null;
  };

  // Compute Overall Stats
  const stats: AcademyStats = useMemo(() => {
    let totalMinutes = 0;
    let completedMinutes = 0;

    allSubTopics.forEach((st) => {
      totalMinutes += st.durationMinutes;
      if (completedLessonIds.includes(st.id)) {
        completedMinutes += st.durationMinutes;
      }
    });

    const totalSubTopics = allSubTopics.length;
    const completedCount = completedLessonIds.length;
    const progressPct = totalSubTopics > 0 ? Math.round((completedCount / totalSubTopics) * 100) : 0;
    const remaining = Math.max(0, totalMinutes - completedMinutes);

    return {
      totalTopics: allTopics.length,
      totalSubTopics,
      completedSubTopics: completedCount,
      progressPercentage: progressPct,
      totalEstimatedMinutes: totalMinutes,
      remainingMinutes: remaining
    };
  }, [allTopics, allSubTopics, completedLessonIds]);

  return {
    topics: allTopics,
    isLoading,
    refreshAcademyData,
    filteredTopics,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    expandedTopicIds,
    toggleTopicExpand,
    expandAllTopics,
    collapseAllTopics,
    selectedLesson,
    setSelectedLesson,
    completedLessonIds,
    inProgressLessonIds,
    markLessonComplete,
    markLessonInProgress,
    getLessonStatus,
    getNextLesson,
    getPrevLesson,
    findLessonById,
    stats,
    isSignedIn,
    isAuthenticated: isSignedIn,
    user,
    openAuthModal
  };
};
