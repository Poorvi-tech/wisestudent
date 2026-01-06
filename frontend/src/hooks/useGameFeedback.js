import { useState } from 'react';

/**
 * Custom hook for managing game feedback animations (score flash and confetti)
 * @returns {Object} - Object containing state and helper functions
 */
export const useGameFeedback = () => {
  const [flashPoints, setFlashPoints] = useState(null);
  const [showAnswerConfetti, setShowAnswerConfetti] = useState(false);

  /**
   * Show score flash and confetti for correct answers
   * @param {number} points - Number of points to display
   * @param {boolean} withConfetti - Whether to show confetti
   */
  const showCorrectAnswerFeedback = (points = 1, withConfetti = true) => {
    const multiplier =
      typeof window !== "undefined" && window.__flashPointsMultiplier
        ? window.__flashPointsMultiplier
        : 1;
    const displayPoints = Math.round(points * multiplier);
    setFlashPoints(displayPoints);
    if (withConfetti) {
      setShowAnswerConfetti(true);
    }

    // Auto-hide after animation
    setTimeout(() => {
      setFlashPoints(null);
      if (withConfetti) {
        setShowAnswerConfetti(false);
      }
    }, 1000);
  };

  /**
   * Reset all feedback states
   */
  const resetFeedback = () => {
    setFlashPoints(null);
    setShowAnswerConfetti(false);
  };

  return {
    // State values
    flashPoints,
    showAnswerConfetti,
    
    // Helper functions
    showCorrectAnswerFeedback,
    resetFeedback
  };
};

export default useGameFeedback;
