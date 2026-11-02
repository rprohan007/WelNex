import React from 'react';
import type { Topic, SubTopic, LessonStatus } from '../../types/academy';
import { Badge } from '../common/Badge';
import {
  ChevronDown,
  Clock,
  BookOpen,
  CheckCircle2,
  CircleDot,
  Circle,
  ArrowRight,
  GraduationCap,
  Layers,
  Building2,
  TowerControl,
  Shield,
  Landmark,
  Building
} from 'lucide-react';

interface TopicAccordionProps {
  topic: Topic;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getLessonStatus: (id: string) => LessonStatus;
  onSelectLesson: (lesson: SubTopic) => void;
  activeLessonId?: string;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  topic,
  isExpanded,
  onToggleExpand,
  getLessonStatus,
  onSelectLesson,
  activeLessonId
}) => {
  // Compute topic level stats
  const totalChapters = topic.subTopics.length;
  const totalMinutes = topic.subTopics.reduce((acc, st) => acc + st.durationMinutes, 0);
  const completedCount = topic.subTopics.filter(
    (st) => getLessonStatus(st.id) === 'Completed'
  ).length;
  const isAllCompleted = totalChapters > 0 && completedCount === totalChapters;

  // Icon selector based on category or iconName
  const getTopicIcon = (category: string) => {
    switch (category) {
      case 'REITs':
        return <Building2 className="w-5 h-5 text-copper-600" />;
      case 'SM REITs':
        return <Building className="w-5 h-5 text-amber-600" />;
      case 'InvITs':
        return <TowerControl className="w-5 h-5 text-amber-700" />;
      case 'AIFs':
        return <Shield className="w-5 h-5 text-espresso-700" />;
      case 'Private Credit':
        return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'Bonds':
        return <Landmark className="w-5 h-5 text-copper-700" />;
      default:
        return <GraduationCap className="w-5 h-5 text-copper-600" />;
    }
  };

  // Difficulty badge styling
  const renderDifficultyBadge = (diff: SubTopic['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
            Beginner
          </span>
        );
      case 'Intermediate':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
            Intermediate
          </span>
        );
      case 'Advanced':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-copper-500/20 text-copper-800 border border-copper-500/35">
            Advanced
          </span>
        );
    }
  };

  // Status indicator
  const renderStatusIndicator = (status: LessonStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-copper-700 bg-copper-500/15 px-2 py-0.5 rounded-full border border-copper-500/30">
            <CircleDot className="w-3.5 h-3.5 animate-pulse text-copper-600" />
            <span>In Progress</span>
          </span>
        );
      case 'Unread':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-espresso-500 bg-sand-200/80 px-2 py-0.5 rounded-full border border-champagne-500/30">
            <Circle className="w-3 h-3 text-espresso-400" />
            <span>Unread</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-champagne-500/40 bg-white/70 backdrop-blur-md shadow-glass-sm transition-all duration-200 overflow-hidden mb-4 hover:border-champagne-500/60">
      
      {/* MAIN TOPIC HEADER */}
      <button
        onClick={onToggleExpand}
        className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-sand-100/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          {/* Topic Icon Container */}
          <div className="w-12 h-12 rounded-2xl bg-sand-200/80 border border-champagne-500/40 flex items-center justify-center shrink-0 shadow-inner">
            {getTopicIcon(topic.category)}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="copper" size="xs">
                {topic.category}
              </Badge>
              {isAllCompleted && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Topic Completed</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-display font-black text-espresso-950 truncate">
              {topic.title}
            </h3>

            <p className="text-xs text-espresso-600 line-clamp-1">
              {topic.description}
            </p>
          </div>
        </div>

        {/* Right Topic Summary Badges & Toggle Chevron */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-espresso-900">
              <BookOpen className="w-3.5 h-3.5 text-copper-600" />
              <span>{totalChapters} Chapter{totalChapters !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-espresso-600 mt-0.5">
              <Clock className="w-3 h-3 text-espresso-400" />
              <span>{totalMinutes} min total</span>
              <span className="text-espresso-400">•</span>
              <span className="font-semibold text-copper-700">
                {completedCount}/{totalChapters} done
              </span>
            </div>
          </div>

          <div
            className={`w-9 h-9 rounded-xl border border-champagne-500/40 flex items-center justify-center text-espresso-700 bg-white/90 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 bg-copper-500/10 text-copper-700 border-copper-500/30' : ''
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </button>

      {/* NESTED SUB-TOPIC / CHAPTER LIST SLOT */}
      {isExpanded && (
        <div className="border-t border-champagne-500/30 bg-sand-50/70 p-4 sm:p-6 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between text-xs font-bold text-espresso-600 mb-1 px-1">
            <span>Module Chapters ({topic.subTopics.length}):</span>
            <span className="text-[11px] text-copper-700 font-semibold">
              Click any chapter to launch interactive lesson
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {topic.subTopics.map((subTopic, idx) => {
              const status = getLessonStatus(subTopic.id);
              const isActive = activeLessonId === subTopic.id;

              return (
                <div
                  key={subTopic.id}
                  onClick={() => onSelectLesson(subTopic)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    isActive
                      ? 'bg-copper-500/10 border-copper-500/50 shadow-sm'
                      : 'bg-white/80 border-champagne-500/30 hover:border-copper-500/40 hover:bg-white'
                  }`}
                >
                  {/* Left: Index, Title & Summary */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-sand-200 border border-champagne-500/30 text-espresso-700 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {renderDifficultyBadge(subTopic.difficulty)}
                        <span className="text-[11px] text-espresso-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-espresso-400" />
                          <span>{subTopic.estimatedReadingTime}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-espresso-950 group-hover:text-copper-700 transition-colors">
                        {subTopic.title}
                      </h4>

                      <p className="text-xs text-espresso-600 line-clamp-1">
                        {subTopic.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Pill & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-champagne-500/20">
                    {renderStatusIndicator(status)}

                    <button
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-copper-500/10 text-copper-700 border border-copper-500/25 group-hover:bg-copper-500 group-hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
