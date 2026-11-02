import React, { useState } from 'react';
import type { SubTopic, LessonStatus } from '../../types/academy';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  X,
  Clock,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Share2,
  XCircle,
  FileText,
  Download
} from 'lucide-react';


interface LessonReaderModalProps {
  lesson: SubTopic | null;
  isOpen: boolean;
  onClose: () => void;
  status: LessonStatus;
  onToggleComplete: (lessonId: string) => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNextLesson?: boolean;
  hasPrevLesson?: boolean;
}

export const LessonReaderModal: React.FC<LessonReaderModalProps> = ({
  lesson,
  isOpen,
  onClose,
  status,
  onToggleComplete,
  onNextLesson,
  onPrevLesson,
  hasNextLesson = false,
  hasPrevLesson = false
}) => {
  // Quiz selection state keyed by question id
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Clean empty state UI when no lesson is active
  if (!lesson) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg p-8 rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-2xl bg-copper-500/10 text-copper-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-display font-bold text-espresso-950">
            No Lesson Selected
          </h3>
          <p className="text-xs text-espresso-600">
            Select a topic chapter from the academy syllabus to launch the interactive lesson reader.
          </p>
          <Button variant="primary" size="sm" onClick={onClose}>
            Back to Syllabus
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = status === 'Completed';

  const handleSelectQuizOption = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optIndex
    }));
  };

  const handleShareLesson = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso-950/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-champagne-500/30 bg-sand-100/95 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="copper" size="xs">
                WelNex Academy Reader
              </Badge>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  lesson.difficulty === 'Beginner'
                    ? 'bg-emerald-500/15 text-emerald-800'
                    : lesson.difficulty === 'Intermediate'
                    ? 'bg-amber-500/15 text-amber-800'
                    : 'bg-copper-500/20 text-copper-800'
                }`}
              >
                {lesson.difficulty}
              </span>
              <span className="text-[11px] font-mono text-espresso-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-copper-600" />
                <span>{lesson.estimatedReadingTime}</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-display font-extrabold text-espresso-950 leading-tight">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShareLesson}
              className="p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 transition-colors cursor-pointer"
              title="Share Lesson"
              aria-label="Share lesson"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] font-bold text-copper-700 hidden sm:inline-block">
                Copied!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 transition-colors cursor-pointer"
              aria-label="Close lesson reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE LESSON CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 bg-sand">
          
          {/* Summary Lead Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-sm text-sm text-espresso-800 leading-relaxed">
            <strong className="text-copper-700 font-bold block mb-1">
              Chapter Overview:
            </strong>
            {lesson.summary}
          </div>

          {/* DYNAMIC CONTENT SECTIONS */}
          {lesson.contentSections.map((sec) => (
            <div key={sec.id} className="space-y-4">
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-espresso-950 border-b border-champagne-500/30 pb-2">
                {sec.heading}
              </h3>

              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm text-espresso-800 leading-relaxed">
                  {p}
                </p>
              ))}

              {/* Callout Note if present */}
              {sec.calloutNote && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 my-4 ${
                    sec.calloutNote.type === 'key-takeaway'
                      ? 'bg-copper-500/10 border-copper-500/30 text-espresso-900'
                      : sec.calloutNote.type === 'warning'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-950'
                      : 'bg-sand-200 border-champagne-500/50 text-espresso-900'
                  }`}
                >
                  <Lightbulb className="w-5 h-5 text-copper-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-[13px] leading-relaxed">
                    <strong className="font-bold text-copper-800 block mb-0.5">
                      {sec.calloutNote.title}:
                    </strong>
                    {sec.calloutNote.text}
                  </div>
                </div>
              )}

              {/* Bullet Points if present */}
              {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                <ul className="space-y-2 p-4 rounded-2xl bg-white/60 border border-champagne-500/30 text-xs sm:text-sm text-espresso-800">
                  {sec.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-copper-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* NUMERICAL EXAMPLE CARDS (Framework Requirement) */}
          {lesson.numericalExamples && lesson.numericalExamples.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-champagne-500/30">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-copper-600" />
                <h4 className="text-base font-display font-bold text-espresso-950">
                  Real-World Numerical Walkthrough
                </h4>
              </div>

              {lesson.numericalExamples.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white/90 border border-copper-500/30 shadow-glass-sm space-y-4"
                >
                  <div>
                    <h5 className="font-display font-extrabold text-sm sm:text-base text-espresso-950">
                      {ex.title}
                    </h5>
                    {ex.subtitle && (
                      <span className="text-xs text-espresso-600 block mt-0.5">
                        {ex.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Input parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {ex.inputs.map((inp, i) => (
                      <div key={i} className="p-3 rounded-xl bg-sand-100 border border-champagne-500/30">
                        <span className="text-[10px] uppercase font-bold text-espresso-600 block">
                          {inp.label}
                        </span>
                        <span className="font-mono font-bold text-xs sm:text-sm text-espresso-950 mt-0.5 block">
                          {inp.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculation steps */}
                  <div className="p-3.5 rounded-xl bg-sand-50/70 border border-champagne-500/25 space-y-1.5 font-mono text-xs text-espresso-800">
                    {ex.calculationSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <span className="text-copper-600 font-bold">›</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Final Result Card */}
                  <div className="p-4 rounded-xl bg-copper-500/10 border border-copper-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-copper-700 block">
                        {ex.finalResult.label}
                      </span>
                      <span className="text-lg font-mono font-black text-copper-700">
                        {ex.finalResult.value}
                      </span>
                    </div>
                    {ex.finalResult.note && (
                      <span className="text-xs text-espresso-600 sm:max-w-xs sm:text-right">
                        {ex.finalResult.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QUIZ QUESTIONS ARRAY (Interactive Checkpoint) */}
          {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-champagne-500/30">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-copper-600" />
                <h4 className="text-base font-display font-bold text-espresso-950">
                  Concept Verification Checkpoint
                </h4>
              </div>

              {lesson.quizQuestions.map((quiz, qIdx) => {
                const selected = selectedAnswers[quiz.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === quiz.correctOptionIndex;

                return (
                  <div
                    key={quiz.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-champagne-500/40 shadow-sm space-y-4"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-copper-700 block">
                      Question {qIdx + 1} of {lesson.quizQuestions?.length}
                    </span>
                    <p className="text-sm font-bold text-espresso-950 leading-snug">
                      {quiz.question}
                    </p>

                    <div className="space-y-2">
                      {quiz.options.map((option, optIdx) => {
                        const isThisSelected = selected === optIdx;
                        let optStyle = 'bg-sand-50/80 border-champagne-500/30 hover:border-copper-500/50 hover:bg-white text-espresso-800';

                        if (isAnswered) {
                          if (optIdx === quiz.correctOptionIndex) {
                            optStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isThisSelected) {
                            optStyle = 'bg-rose-500/15 border-rose-500 text-rose-900';
                          } else {
                            optStyle = 'opacity-60 bg-sand-100 border-champagne-500/20 text-espresso-600';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(quiz.id, optIdx)}
                            className={`w-full p-3 rounded-xl text-left border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback / Explanation Box */}
                    {isAnswered && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Correct Answer!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Incorrect Answer</span>
                            </>
                          )}
                        </div>
                        <p>{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CHAPTER DOCUMENTS & PRESENTATION SLIDES (Phase 6 Enhancement) */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-champagne-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-copper-600" />
                  <h4 className="text-base font-display font-bold text-espresso-950">
                    Chapter Documents & Presentation Slides
                  </h4>
                </div>
                <span className="text-xs text-espresso-600 font-medium">
                  {lesson.resources.length} Downloadable {lesson.resources.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.resources.map((res) => {
                  const isPdf = res.fileType === 'pdf';
                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-white/90 border border-champagne-500/40 hover:border-copper-500/50 shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                              isPdf
                                ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                            }`}
                          >
                            {res.fileType.toUpperCase()}
                          </span>
                          {res.fileSize && (
                            <span className="text-[11px] font-mono text-espresso-500 font-medium">
                              {res.fileSize}
                            </span>
                          )}
                        </div>
                        <h5 className="font-display font-bold text-xs sm:text-sm text-espresso-950 line-clamp-1 mb-1">
                          {res.title}
                        </h5>
                        {res.description && (
                          <p className="text-[11px] text-espresso-600 line-clamp-2 leading-relaxed mb-3">
                            {res.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-champagne-500/25 flex items-center justify-between mt-2">
                        <span className="text-[10px] text-espresso-500">
                          Verified Academy Asset
                        </span>
                        <a
                          href={res.fileUrl}
                          download={res.title}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-copper-500/10 hover:bg-copper-500/20 text-copper-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download / View</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-champagne-500/30 bg-sand-100/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Mark as Complete Toggle */}
          <button
            onClick={() => onToggleComplete(lesson.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                : 'bg-copper-500 text-white hover:bg-copper-600 shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (Click to Reset)' : 'Mark Chapter as Complete'}</span>
          </button>

          {/* Sequential Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevLesson}
              disabled={!hasPrevLesson}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                hasPrevLesson
                  ? 'bg-white text-espresso-800 border-champagne-500/40 hover:bg-copper-500/10 cursor-pointer'
                  : 'bg-sand-200/50 text-espresso-400 border-champagne-500/20 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={onNextLesson}
              disabled={!hasNextLesson}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                hasNextLesson
                  ? 'bg-white text-espresso-800 border-champagne-500/40 hover:bg-copper-500/10 cursor-pointer'
                  : 'bg-sand-200/50 text-espresso-400 border-champagne-500/20 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
