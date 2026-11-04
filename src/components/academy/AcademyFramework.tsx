import React from 'react';
import { useAcademyData } from '../../hooks/useAcademyData';
import { TopicAccordion } from './TopicAccordion';
import { LessonReaderModal } from './LessonReaderModal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Compass,
  Lock,
  FileText
} from 'lucide-react';


interface AcademyFrameworkProps {
  onOpenWaitlist?: () => void;
  isStandalonePage?: boolean;
}

export const AcademyFramework: React.FC<AcademyFrameworkProps> = ({
  onOpenWaitlist,
  isStandalonePage = false
}) => {
  const {
    topics,
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
    markLessonComplete,
    getLessonStatus,
    getNextLesson,
    getPrevLesson,
    stats,
    isSignedIn,
    openAuthModal
  } = useAcademyData();

  // Dynamically compute syllabus metrics from live topics state
  const totalTopics = topics.length;
  const totalChapters = topics.reduce((sum, t) => sum + (t.subTopics?.length || 0), 0);
  const totalMins = topics.reduce((sum, t) => 
    sum + (t.subTopics?.reduce((subSum, st) => {
      const dur = typeof st.durationMinutes === 'number' && !isNaN(st.durationMinutes)
        ? st.durationMinutes
        : parseInt(String((st as any).duration || (st as any).durationMinutes || st.estimatedReadingTime || 0)) || 0;
      return subSum + dur;
    }, 0) || 0), 0
  );

  const isModalOpen = selectedLesson !== null;

  return (
    <section id="academy" className={`w-full ${isStandalonePage ? 'pt-28 pb-24' : 'py-20'} bg-sand text-espresso-950`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE / SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-champagne-500/30">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="copper" size="sm" withDot>
                Phase 5 Educational Engine
              </Badge>
              <span className="text-xs font-semibold text-espresso-700">
                Objective Investor Curriculum
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
              WelNex Academy — Learn Before You Invest
            </h2>
            <p className="text-sm sm:text-base text-espresso-700 mt-2.5 max-w-2xl leading-relaxed">
              Master the statutory, financial, and structural mechanics of Indian commercial REITs, infrastructure InvITs, corporate debt, and private credit with zero sales bias.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWaitlist && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenWaitlist}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Join Study Cohort
              </Button>
            )}
          </div>
        </div>

        {/* LEARNER PROGRESS & STATS BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          
          {/* Card 1: Total Syllabus Scope */}
          <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-glass-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-copper-500/10 text-copper-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-espresso-500 block truncate">
                Total Syllabus Scope
              </span>
              <span className="font-mono font-bold text-base text-espresso-950 truncate block">
                {totalTopics} Topics • {totalChapters} Chapters
              </span>
            </div>
          </div>

          {/* Card 2: Estimated Reading Time */}
          <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-glass-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sand-300 text-espresso-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-espresso-500 block truncate">
                Estimated Reading Time
              </span>
              <span className="font-mono font-bold text-base text-espresso-950 truncate block">
                {isSignedIn ? `${stats.remainingMinutes} Mins Remaining` : `${totalMins} Mins Total`}
              </span>
            </div>
          </div>

          {isSignedIn ? (
            <>
              {/* Card 3: Authenticated User Progress */}
              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-glass-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-espresso-500 block truncate">
                    Your Progress
                  </span>
                  <span className="font-mono font-bold text-base text-emerald-800 truncate block">
                    {stats.completedSubTopics}/{totalChapters} Done ({stats.progressPercentage}%)
                  </span>
                </div>
              </div>

              {/* Card 4: Curriculum Mastery */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-copper-500/15 via-champagne-500/20 to-transparent border border-copper-500/30 flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-copper-800 block truncate">
                    Curriculum Mastery
                  </span>
                  <div className="w-full max-w-[120px] h-2 rounded-full bg-sand-300 overflow-hidden">
                    <div
                      className="h-full bg-copper-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progressPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono font-black text-lg text-copper-700 shrink-0">
                  {stats.progressPercentage}%
                </span>
              </div>
            </>
          ) : (
            /* Guest Learner Callout spanning 2 columns */
            <div className="sm:col-span-2 md:col-span-2 p-4 rounded-2xl bg-white/85 border border-copper-500/30 shadow-glass-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-copper-500/10 text-copper-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-copper-700 block">
                    Personalized Tracking
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-espresso-900 block truncate">
                    Sign in to track progress & chapter completion
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                className="text-xs font-semibold shrink-0 shadow-sm w-full sm:w-auto cursor-pointer"
              >
                Sign In to Track
              </Button>
            </div>
          )}

        </div>

        {/* AUTH GATE OR INTERACTIVE CURRICULUM */}
        {!isSignedIn ? (
          /* HIGH-CONVERTING AUTH GATE PREVIEW CARD */
          <div className="my-10 max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-white/90 border border-copper-500/30 shadow-glass text-center space-y-6 relative overflow-hidden animate-fadeIn">
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-copper-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-champagne-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-copper-500 to-copper-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>

            {/* Header & Subtitle */}
            <div className="space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-copper-500/10 border border-copper-500/20 text-copper-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Member Curriculum Gate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-espresso-950">
                Welcome to WelNex Academy
              </h3>
              <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
                Sign in with your Google account to unlock full interactive modules, embedded PDF slides, financial calculators, and institutional investment learning materials.
              </p>
            </div>

            {/* Curriculum Value Props Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left max-w-xl mx-auto pt-2">
              <div className="p-3.5 rounded-xl bg-sand-100/70 border border-champagne-500/30 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-copper-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-espresso-900">{totalTopics} Topics • {totalChapters} Chapters</p>
                  <p className="text-[11px] text-espresso-600 leading-tight mt-0.5">Commercial REITs, InvITs & debt frameworks</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-100/70 border border-champagne-500/30 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-copper-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-espresso-900">Embedded PDF Reader</p>
                  <p className="text-[11px] text-espresso-600 leading-tight mt-0.5">Read lecture slides & technical notes in-app</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-100/70 border border-champagne-500/30 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-espresso-900">Interactive Quizzes</p>
                  <p className="text-[11px] text-espresso-600 leading-tight mt-0.5">Track your mastery & verified progress</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={openAuthModal}
                icon={<Lock className="w-4 h-4" />}
                className="px-8 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Sign In to Access Courses
              </Button>
              <p className="text-[11px] text-espresso-500 mt-2.5">
                Instant access with Google authentication • No subscription fees
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* CONTROLS: CATEGORY FILTER PILLS & SEARCH */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sand-100/90 border border-champagne-500/40 mb-8 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search topics, chapters, NDCF, WALE, tax rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/90 border border-champagne-500/40 text-xs text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Expand / Collapse All Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllTopics}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/80 border border-champagne-500/30 text-espresso-700 hover:bg-copper-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 text-copper-600" />
                    <span>Expand All</span>
                  </button>
                  <button
                    onClick={collapseAllTopics}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/80 border border-champagne-500/30 text-espresso-700 hover:bg-copper-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Minimize2 className="w-3 h-3 text-espresso-500" />
                    <span>Collapse All</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-copper-500 text-white shadow-sm'
                          : 'bg-white/80 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* HIERARCHICAL ACCORDIONS LIST */}
            {filteredTopics.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/70 border border-dashed border-champagne-500/50 text-center space-y-3 max-w-md mx-auto my-8">
                <Compass className="w-8 h-8 text-copper-600/40 mx-auto" />
                <h4 className="text-base font-bold text-espresso-950">
                  No Academy Lessons Found
                </h4>
                <p className="text-xs text-espresso-600">
                  No topics matched your search or category filter. Try clearing your search keyword.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTopics.map((topic) => (
                  <TopicAccordion
                    key={topic.id}
                    topic={topic}
                    isExpanded={expandedTopicIds.includes(topic.id)}
                    onToggleExpand={() => toggleTopicExpand(topic.id)}
                    getLessonStatus={getLessonStatus}
                    onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                    activeLessonId={selectedLesson?.id}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* PLUG-AND-PLAY LESSON READER MODAL (AUTH GATED) */}
      {isSignedIn && (
        <LessonReaderModal
          lesson={selectedLesson}
          isOpen={isModalOpen}
          onClose={() => setSelectedLesson(null)}
          status={selectedLesson ? getLessonStatus(selectedLesson.id) : 'Unread'}
          onToggleComplete={(id) => markLessonComplete(id)}
          onNextLesson={() => {
            if (selectedLesson) {
              const next = getNextLesson(selectedLesson.id);
              if (next) setSelectedLesson(next);
            }
          }}
          onPrevLesson={() => {
            if (selectedLesson) {
              const prev = getPrevLesson(selectedLesson.id);
              if (prev) setSelectedLesson(prev);
            }
          }}
          hasNextLesson={selectedLesson ? getNextLesson(selectedLesson.id) !== null : false}
          hasPrevLesson={selectedLesson ? getPrevLesson(selectedLesson.id) !== null : false}
        />
      )}

    </section>
  );
};
