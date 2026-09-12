import React, { useState } from 'react';
import { CheckCircle2, XCircle, Volume2, ArrowRight } from 'lucide-react';
import { speakText } from '../../utils/ttsHelper';
import { updateSRSWord } from '../../services/api';
import { useApp } from '../../context/AppContext';

const QuizCard = ({ quiz, onNext }) => {
  const { t, language, soundSpeed } = useApp();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const rawOptions = Array.isArray(quiz.options)
    ? quiz.options
    : typeof quiz.options === 'string'
      ? JSON.parse(quiz.options || '[]')
      : [];


  const handleSelect = async (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    const correct = option === quiz.correctAnswer;
    setIsCorrect(correct);

    // If vocabId is linked, update Leitner SRS Box automatically
    if (quiz.vocabId) {
      try {
        await updateSRSWord({ vocabId: quiz.vocabId, isCorrect: correct });
      } catch (err) {
        console.warn('SRS update sync:', err);
      }
    }

    // Audio pronounce correct answer
    speakText(quiz.correctAnswer, 'en-US', soundSpeed);
  };

  const getQuestionText = () => {
    if (language === 'hi' && quiz.question_hi) return quiz.question_hi;
    if (language === 'en' && quiz.question_en) return quiz.question_en;
    return quiz.question_mr || quiz.question_en;
  };

  return (
    <div className="quiz-card-container glass-card">
      <div className="quiz-card-header">
        <span className="badge badge-primary">{t.quizTitleBadge}</span>
        <h3 className="quiz-question-title">{getQuestionText()}</h3>
      </div>

      <div className="quiz-options-list">
        {rawOptions.map((option, idx) => {
          let btnClass = 'quiz-option-btn';
          if (isAnswered) {
            if (option === quiz.correctAnswer) {
              btnClass += ' correct';
            } else if (option === selectedOption) {
              btnClass += ' wrong';
            }
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
            >
              <span className="option-index">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option}</span>
              {isAnswered && option === quiz.correctAnswer && (
                <CheckCircle2 size={20} className="status-icon-correct" />
              )}
              {isAnswered && option === selectedOption && option !== quiz.correctAnswer && (
                <XCircle size={20} className="status-icon-wrong" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`quiz-feedback-box ${isCorrect ? 'correct-box' : 'wrong-box'}`}>
          <div className="feedback-content">
            <h4 className="feedback-headline">
              {isCorrect ? t.correctMsg : t.wrongMsg}
            </h4>
            {quiz.explanation_mr && (
              <p className="feedback-explanation">
                {language === 'hi' && quiz.explanation_hi ? quiz.explanation_hi : quiz.explanation_mr}
              </p>
            )}
          </div>

          <button className="btn-primary next-btn" onClick={onNext}>
            <span>{t.nextQuestionBtn}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <style>{`
        .quiz-card-container {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid var(--border-color);
        }
        .quiz-card-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .quiz-question-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }
        .quiz-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .quiz-option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          text-align: left;
          transition: all 0.2s ease;
          position: relative;
        }
        .quiz-option-btn:hover:not(:disabled) {
          border-color: var(--primary);
          background: #fff7ed;
          transform: translateY(-1px);
        }
        .option-index {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #e2e8f0;
          color: #334155;
          font-weight: 800;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .option-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          flex: 1;
        }
        .quiz-option-btn.correct {
          background: #ecfdf5;
          border-color: #10b981;
        }
        .quiz-option-btn.correct .option-index {
          background: #10b981;
          color: #ffffff;
        }
        .quiz-option-btn.wrong {
          background: #fef2f2;
          border-color: #ef4444;
        }
        .quiz-option-btn.wrong .option-index {
          background: #ef4444;
          color: #ffffff;
        }
        .status-icon-correct {
          color: #10b981;
        }
        .status-icon-wrong {
          color: #ef4444;
        }
        .quiz-feedback-box {
          padding: 18px 20px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .correct-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }
        .wrong-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }
        .feedback-headline {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .feedback-explanation {
          font-size: 0.92rem;
          color: #334155;
          margin-top: 4px;
        }
        .next-btn {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default QuizCard;
