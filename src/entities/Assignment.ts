import { ISubmission } from "./Submission";

// https://canvas.iastate.edu/doc/api/assignments.html
export interface IAssignment {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  due_at: Date | null;
  lock_at: Date | null;
  unlock_at: Date | null;
  has_overrides: boolean;
  all_dates?: Date[] | null;
  course_id: number;
  html_url: string;
  submissions_download_url: string;
  assignment_group_id: number;
  due_date_required: boolean;
  allowed_extensions: string[];
  max_name_length: number;
  turnitin_enabled?: boolean | null;
  vericite_enabled?: boolean | null;
  turnitin_settings?: boolean | null;
  grade_group_students_individually?: boolean | null;
  external_tool_tag_attributes?: string[] | null;
  peer_reviews: boolean;
  automatic_peer_reviews: boolean;
  peer_review_count?: number | null;
  peer_reviews_assign_at?: Date | null;
  intra_group_peer_reviews: boolean;
  group_category_id?: number | null;
  needs_grading_count?: number | null;
  needs_grading_count_by_section?: ISectionGradingCount | null;
  position: number;
  post_to_sis?: boolean | null;
  integration_id?: string | null;
  integration_data?: any; // This might be anything
  points_possible: number;
  submission_types: string[];
  has_submitted_submissions: boolean;
  grading_type: string;
  grading_standard_id?: number | string | null;
  published: boolean;
  unpublishable: boolean;
  only_visible_to_overrides: boolean;
  locked_for_user?: boolean | null;
  lock_info?: any; // ?
  lock_explanation?: string | null;
  quiz_id?: number | null;
  anonymous_submissions?: boolean | null;
  discussion_topic?: any; // ?
  freeze_on_copy?: boolean | null;
  frozen?: boolean | null;
  frozen_attributes?: string[] | null;
  submission?: ISubmission | null;
  use_rubric_for_grading?: boolean | null;
  rubric_settings?: any; // ?
  rubric?: any; // ?
  assignment_visibility?: number[] | null;
  overrides?: any; // TOOD: Assignment Override entity?
  omit_from_final_grade?: boolean | null;
  moderated_grading: boolean;
  grader_count: number;
  final_grader_id?: number | null;
  grader_comments_visible_to_graders?: boolean | null;
  graders_anonymous_to_graders?: boolean | null;
  grader_names_visible_to_final_grader?: boolean | null;
  anonymous_grading: boolean;
  allowed_attempts: number;
  post_manually?: boolean | null;
  score_statistics?: any; // ?
  can_submit?: boolean | null;
}

export interface ISectionGradingCount {
  section_id: string;
  needs_grading_count: number;
}

class SectionGradingCount {
  public section_id: string;
  public needs_grading_count: number;

  constructor(id: string, needs_grading_count: number) {
    this.section_id = id;
    this.needs_grading_count = needs_grading_count;
  }
}

class Assignment implements IAssignment {
  public id: string;
  public name: string;
  public description: string;
  public created_at: Date;
  public updated_at: Date;
  public due_at: Date | null;
  public lock_at: Date | null;
  public unlock_at: Date | null;
  public has_overrides: boolean;
  public all_dates?: Date[] | null;
  public course_id: number;
  public html_url: string;
  public submissions_download_url: string;
  public assignment_group_id: number;
  public due_date_required: boolean;
  public allowed_extensions: string[];
  public max_name_length: number;
  public turnitin_enabled?: boolean | null;
  public vericite_enabled?: boolean | null;
  public turnitin_settings?: boolean | null;
  public grade_group_students_individually?: boolean | null;
  public external_tool_tag_attributes?: string[] | null;
  public peer_reviews: boolean;
  public automatic_peer_reviews: boolean;
  public peer_review_count?: number | null;
  public peer_reviews_assign_at?: Date | null;
  public intra_group_peer_reviews: boolean;
  public group_category_id?: number | null;
  public needs_grading_count?: number | null;
  public needs_grading_count_by_section?: ISectionGradingCount | null;
  public position: number;
  public post_to_sis?: boolean | null;
  public integration_id?: string | null;
  public integration_data?: any; // This might be anything
  public points_possible: number;
  public submission_types: string[];
  public has_submitted_submissions: boolean;
  public grading_type: string;
  public grading_standard_id?: number | string | null;
  public published: boolean;
  public unpublishable: boolean;
  public only_visible_to_overrides: boolean;
  public locked_for_user?: boolean | null;
  public lock_info?: any; // ?
  public lock_explanation?: string | null;
  public quiz_id?: number | null;
  public anonymous_submissions?: boolean | null;
  public discussion_topic?: any; // ?
  public freeze_on_copy?: boolean | null;
  public frozen?: boolean | null;
  public frozen_attributes?: string[] | null;
  public submission?: ISubmission | null;
  public use_rubric_for_grading?: boolean | null;
  public rubric_settings?: any; // ?
  public rubric?: any; // ?
  public assignment_visibility?: number[] | null;
  public overrides?: any; // TOOD: Assignment Override entity?
  public omit_from_final_grade?: boolean | null;
  public moderated_grading: boolean;
  public grader_count: number;
  public final_grader_id?: number | null;
  public grader_comments_visible_to_graders?: boolean | null;
  public graders_anonymous_to_graders?: boolean | null;
  public grader_names_visible_to_final_grader?: boolean | null;
  public anonymous_grading: boolean;
  public allowed_attempts: number;
  public post_manually?: boolean | null;
  public score_statistics?: any; // ?
  public can_submit?: boolean | null;

  constructor(
    id: string,
    name: string,
    description: string,
    created_at: Date,
    updated_at: Date,
    due_at: Date | null,
    lock_at: Date | null,
    unlock_at: Date | null,
    has_overrides: boolean,
    course_id: number,
    html_url: string,
    submissions_download_url: string,
    assignment_group_id: number,
    due_date_required: boolean,
    allowed_extensions: string[],
    max_name_length: number,
    peer_reviews: boolean,
    automatic_peer_reviews: boolean,
    intra_group_peer_reviews: boolean,
    position: number,
    points_possible: number,
    submission_types: string[],
    has_submitted_submissions: boolean,
    grading_type: string,
    published: boolean,
    unpublishable: boolean,
    only_visible_to_overrides: boolean,
    moderated_grading: boolean,
    grader_count: number,
    anonymous_grading: boolean,
    allowed_attempts: number,
    all_dates?: Date[] | null,
    turnitin_enabled?: boolean | null,
    vericite_enabled?: boolean | null,
    turnitin_settings?: boolean | null,
    grade_group_students_individually?: boolean | null,
    external_tool_tag_attributes?: string[] | null,
    peer_review_count?: number | null,
    peer_reviews_assign_at?: Date | null,
    group_category_id?: number | null,
    needs_grading_count?: number | null,
    needs_grading_count_by_section?: ISectionGradingCount | null,
    post_to_sis?: boolean | null,
    integration_id?: string | null,
    integration_data?: any, // This might be anything
    grading_standard_id?: number | string | null,
    locked_for_user?: boolean | null,
    lock_info?: any, // ?
    lock_explanation?: string | null,
    quiz_id?: number | null,
    anonymous_submissions?: boolean | null,
    discussion_topic?: any, // ?
    freeze_on_copy?: boolean | null,
    frozen?: boolean | null,
    frozen_attributes?: string[] | null,
    submission?: ISubmission | null,
    use_rubric_for_grading?: boolean | null,
    rubric_settings?: any, // ?
    rubric?: any, // ?
    assignment_visibility?: number[] | null,
    overrides?: any, // TOOD: Assignment Override entity?
    omit_from_final_grade?: boolean | null,
    final_grader_id?: number | null,
    grader_comments_visible_to_graders?: boolean | null,
    graders_anonymous_to_graders?: boolean | null,
    grader_names_visible_to_final_grader?: boolean | null,
    post_manually?: boolean | null,
    score_statistics?: any, // ?
    can_submit?: boolean | null
  ) {
    this.id = id || "";
    this.name = name || "";
    this.description = description || "";
    this.created_at = created_at ? new Date(created_at) : new Date();
    this.updated_at = updated_at ? new Date(updated_at) : new Date();
    this.due_at = due_at ? new Date(due_at) : new Date();
    this.lock_at = lock_at ? new Date(lock_at) : new Date();
    this.unlock_at = unlock_at ? new Date(unlock_at) : new Date();
    this.has_overrides = has_overrides;
    this.all_dates = all_dates ? all_dates.map((date) => new Date(date)) : [];
    this.course_id = course_id;
    this.html_url = html_url;
    this.submissions_download_url = submissions_download_url;
    this.assignment_group_id = assignment_group_id;
    this.due_date_required = due_date_required;
    this.allowed_extensions = allowed_extensions;
    this.max_name_length = max_name_length;
    this.turnitin_enabled = turnitin_enabled || null;
    this.vericite_enabled = vericite_enabled || null;
    this.turnitin_settings = turnitin_settings || null;
    this.grade_group_students_individually =
      grade_group_students_individually || null;
    this.external_tool_tag_attributes = external_tool_tag_attributes || null;
    this.peer_reviews = peer_reviews;
    this.automatic_peer_reviews = automatic_peer_reviews;
    this.peer_review_count = peer_review_count || null;
    this.peer_reviews_assign_at = peer_reviews_assign_at
      ? new Date(peer_reviews_assign_at)
      : new Date();
    this.intra_group_peer_reviews = intra_group_peer_reviews;
    this.group_category_id = group_category_id || null;
    this.needs_grading_count = needs_grading_count || null;
    this.needs_grading_count_by_section =
      needs_grading_count_by_section || null;
    this.position = position;
    this.post_to_sis = post_to_sis || null;
    this.integration_id = integration_id || null;
    this.integration_data = integration_data || null; // This might be anything
    this.points_possible = points_possible;
    this.submission_types = submission_types;
    this.has_submitted_submissions = has_submitted_submissions;
    this.grading_type = grading_type;
    this.grading_standard_id = grading_standard_id || null;
    this.published = published;
    this.unpublishable = unpublishable;
    this.only_visible_to_overrides = only_visible_to_overrides;
    this.locked_for_user = locked_for_user || null;
    this.lock_info = lock_info || null; // ?
    this.lock_explanation = lock_explanation || null;
    this.quiz_id = quiz_id || null;
    this.anonymous_submissions = anonymous_submissions || null;
    this.discussion_topic = discussion_topic || null; // ?
    this.freeze_on_copy = freeze_on_copy || null;
    this.frozen = frozen || null;
    this.frozen_attributes = frozen_attributes || null;
    this.submission = submission || null;
    this.use_rubric_for_grading = use_rubric_for_grading || null;
    this.rubric_settings = rubric_settings || null; // ?
    this.rubric = rubric || null; // ?
    this.assignment_visibility = assignment_visibility || null;
    this.overrides = overrides || null; // TOOD = Assignment Override entity?
    this.omit_from_final_grade = omit_from_final_grade || null;
    this.moderated_grading = moderated_grading;
    this.grader_count = grader_count;
    this.final_grader_id = final_grader_id || null;
    this.grader_comments_visible_to_graders =
      grader_comments_visible_to_graders || null;
    this.graders_anonymous_to_graders = graders_anonymous_to_graders || null;
    this.grader_names_visible_to_final_grader =
      grader_names_visible_to_final_grader || null;
    this.anonymous_grading = anonymous_grading;
    this.allowed_attempts = allowed_attempts;
    this.post_manually = post_manually || null;
    this.score_statistics = score_statistics || null; // ?
    this.can_submit = can_submit || null;
  }
}

export default Assignment;
