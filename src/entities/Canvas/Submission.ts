// https://canvas.iastate.edu/doc/api/submissions.html
export interface ICanvasSubmissionUser {
  id: number;
  name: string;
  created_at: Date;
  sortable_name: string;
  short_name: string;
  sis_user_id: string | null;
  integration_id: string | null;
  login_id: string;
  avatar_url: string;
}

export interface ICompleteCanvasSubmission {
  id: string;
  assignment_id: string;
  grading_period_id: number | null;
  body: string;
  url: string;
  grade: string;
  score: number;
  submitted_at: Date;
  user_id: string;
  submission_type: string;
  workflow_state: string;
  grade_matches_current_submission: boolean; // false if re-submitted
  graded_at: Date;
  grader_id: string;
  attempt: number;
  cached_due_date: Date | null;
  excused: boolean;
  late_policy_status: string | null;
  points_deducted: number | null;
  extra_attempts: number | null;
  posted_at: Date | null;
  late: boolean;
  missing: boolean;
  seconds_late: number | null;
  entered_grade: string | null;
  entered_score: number | null;
  preview_url: string;
  assignment_visible: boolean;
  user: ICanvasSubmissionUser;
}
