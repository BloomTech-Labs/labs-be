export enum QuizReportType {
  student_analysis = "student_analysis",
  item_analysis="item_analysis",
}

interface IQuizReportProgress {
  id: number,
  context_id: number,
  context_type: string,
  user_id: number | null,
  tag: string,
  completion: number,
  workflow_state: string,
  created_at: Date,
  updated_at: Date,
  message: string | null,
  url: string,
}

export interface IQuizReportFile {
  id: number,
  uuid: string,
  folder_id: number | null,
  display_name: string,
  filename: string
  upload_status: string,
  "content-type": string,
  url: string,
  size: number,
  created_at: Date | null,
  updated_at: Date | null,
  unlock_at: Date | null,
  locked: boolean,
  hidden: boolean,
  lock_at: Date | null,
  hidden_for_user: boolean,
  thumbnail_url: string | null,
  modified_at: Date | null,
  mime_class: string,
  media_entry_id: number | string | null,
  locked_for_user: boolean
}

// https://canvas.instructure.com/doc/api/quiz_reports.html
export interface IQuizReport {
  id: number,
  report_type: QuizReportType,
  readable_type: string,
  includes_all_versions: boolean,
  includes_sis_ids: boolean,
  generatable: boolean,
  anonymous: boolean,
  url: string,
  progress_url: string,
  created_at: Date,
  updated_at: Date,
  progress: IQuizReportProgress,
  file: IQuizReportFile,
  quiz_id: number
}

export class QuizReport implements IQuizReport {
  public id: number;
  public report_type: QuizReportType;
  public readable_type: string;
  public includes_all_versions: boolean;
  public includes_sis_ids: boolean;
  public generatable: boolean;
  public anonymous: boolean;
  public url: string;
  public progress_url: string;
  public created_at: Date;
  public updated_at: Date;
  public progress: IQuizReportProgress;
  public file: IQuizReportFile;
  public quiz_id: number;

  constructor(
    id: number,
    report_type: QuizReportType,
    readable_type: string,
    includes_all_versions: boolean,
    includes_sis_ids: boolean,
    generatable: boolean,
    anonymous: boolean,
    url: string,
    progress_url: string,
    created_at: Date,
    updated_at: Date,
    progress: IQuizReportProgress,
    file: IQuizReportFile,
    quiz_id: number
  ) {
    this.id = id;
    this.report_type = report_type;
    this.readable_type = readable_type;
    this.includes_all_versions = includes_all_versions;
    this.includes_sis_ids = includes_sis_ids;
    this.generatable = generatable;
    this.anonymous = anonymous;
    this.url = url;
    this.progress_url = progress_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.progress = progress;
    this.file = file;
    this.quiz_id = quiz_id;
  }
}

export default QuizReport;
