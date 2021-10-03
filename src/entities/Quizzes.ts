// eslint-disable-next-line max-len
// https://canvas.instructure.com/doc/api/quiz_submissions.html#method.quizzes/quiz_submissions_api.index
export interface IQuizScores {
  id: number;
  quiz_id: number;
  user_id: number;
  submission_id: number;
  started_at: string;
  finished_at: string;
  end_at: string;
  attempt: number;
  extra_attempts: number;
  extra_time: number;
  manually_unlocked: boolean;
  time_spent: number;
  score: number;
  score_before_regrade: number;
  kept_score: number;
  fudge_points: number;
  has_seen_results: boolean;
  workflow_state: string;
  overdue_and_needs_submission: boolean;
}
