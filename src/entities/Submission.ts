// https://canvas.iastate.edu/doc/api/submissions.html
export interface ISubmission {
  id: string;
  user_id: string;
  grader_id: string;
  canvadoc_document_id: string;
  submitted_at: Date;
  score: number;
  body: string;
  grade: string;
  grade_matches_current_submission: boolean; // false if re-submitted
  late: boolean;
  preview_url: string;
  url: string;
  assignment_visible: boolean;
  workflow_state: string;
}

class Submission implements ISubmission {
  public id: string;
  public user_id: string;
  public grader_id: string;
  public canvadoc_document_id: string;
  public submitted_at: Date;
  public score: number;
  public body: string;
  public grade: string;
  public grade_matches_current_submission: boolean; // false if re-submitted
  public late: boolean;
  public preview_url: string;
  public url: string;
  public assignment_visible: boolean;
  public workflow_state: string;

  constructor(id: string, user_id?: string, grader_id?: string, canvadoc_document_id?: string
    ,submitted_at?: Date, score?: number, body?: string, grade?: string
    ,grade_matches_current_submission?: boolean, late?: boolean, url?: string
    ,preview_url?: string, assignment_visible?: boolean, workflow_state?: string) {
    
    this.id = id || "";
    this.user_id = user_id || "";
    this.grader_id = grader_id || "";
    this.canvadoc_document_id = canvadoc_document_id || "";
    this.submitted_at = submitted_at ? new Date(submitted_at) : new Date();
    this.score = score ? score : 0;
    this.body = body || "";
    this.grade = grade || "";
    this.grade_matches_current_submission = grade_matches_current_submission || false;
    this.late = late || false;
    this.preview_url = preview_url || "";
    this.url = url || "";
    this.assignment_visible = assignment_visible || false;
    this.workflow_state = workflow_state || "";
  }
}

export default Submission;