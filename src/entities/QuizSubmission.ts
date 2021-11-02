export enum QuizSubmissionWorkflowState {
  untaken = "untaken",
  pending_review = "pending_review",
  complete = "complete",
  settings_only = "settings_only",
  preview = "preview",
}

// https://canvas.instructure.com/doc/api/quiz_submissions.html
export interface IQuizSubmission {
  id: number;
  quiz_id: number;
  user_id: number;
  submission_id: number;
  started_at: Date;
  finished_at: Date;
  end_at: Date;
  attempt?: number;
  extra_attempts?: number;
  extra_time?: number;
  manually_unlocked: boolean;
  time_spent: number;
  score?: number;
  score_before_regrade?: number;
  kept_score?: number;
  fudge_points: number;
  has_seen_results: boolean;
  workflow_state: QuizSubmissionWorkflowState;
  overdue_and_needs_submission: false;
}

export class QuizSubmission implements IQuizSubmission {
  public id: number;
  public quiz_id: number;
  public user_id: number;
  public submission_id: number;
  public started_at: Date;
  public finished_at: Date;
  public end_at: Date;
  public attempt?: number;
  public extra_attempts?: number;
  public extra_time?: number;
  public manually_unlocked: boolean;
  public time_spent: number;
  public score?: number;
  public score_before_regrade?: number;
  public kept_score?: number;
  public fudge_points: number;
  public has_seen_results: boolean;
  public workflow_state: QuizSubmissionWorkflowState;
  public overdue_and_needs_submission: false;

  constructor(
    id: number,
    quiz_id: number,
    user_id: number,
    submission_id: number,
    started_at: Date,
    finished_at: Date,
    end_at: Date,
    manually_unlocked: boolean,
    time_spent: number,
    fudge_points: number,
    has_seen_results: boolean,
    workflow_state: QuizSubmissionWorkflowState,
    overdue_and_needs_submission: false,
    attempt?: number,
    extra_attempts?: number,
    extra_time?: number,
    score?: number,
    score_before_regrade?: number,
    kept_score?: number
  ) {
    this.id = id;
    this.quiz_id = quiz_id;
    this.user_id = user_id;
    this.submission_id = submission_id;
    this.started_at = started_at ? new Date(started_at) : new Date();
    this.finished_at = finished_at ? new Date(finished_at) : new Date();
    this.end_at = end_at ? new Date(end_at) : new Date();
    this.attempt = attempt;
    this.extra_attempts = extra_attempts;
    this.extra_time = extra_time;
    this.manually_unlocked = manually_unlocked;
    this.time_spent = time_spent;
    this.score = score;
    this.score_before_regrade = score_before_regrade;
    this.kept_score = kept_score;
    this.fudge_points = fudge_points;
    this.has_seen_results = has_seen_results;
    this.workflow_state = workflow_state;
    this.overdue_and_needs_submission = overdue_and_needs_submission;
  }
}

export default QuizSubmission;
