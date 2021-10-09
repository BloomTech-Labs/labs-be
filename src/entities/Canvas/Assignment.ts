import { Entity, Column, PrimaryColumn } from "typeorm";

export interface ICompleteCanvasAssignment {
  id: number;
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
  quiz_id: number | null;
  anonymous_submissions?: boolean | null;
  discussion_topic?: any; // ?
  freeze_on_copy?: boolean | null;
  frozen?: boolean | null;
  frozen_attributes?: string[] | null;
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
  workflow_state: string;
}

@Entity()
class CanvasAssignment {
  @PrimaryColumn()
  id: number;
  @Column()
  course_id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ type: "int", nullable: true })
  quiz_id: number | null;
  @Column({ type: "float", nullable: true })
  points_possible: number | null;
  @Column({ type: "varchar", nullable: true })
  html_url: string | null;
  @Column({ type: "varchar", nullable: true })
  submissions_download_url: string | null;
  @Column()
  workflow_state: string;
  @Column()
  created_at: Date;
  @Column()
  updated_at: Date;

  @Column({ type: "simple-json", nullable: true })
  other_fields: Record<string, unknown>;
}

function isCompleteAssignment(
  course: CanvasAssignment | ICompleteCanvasAssignment
): course is ICompleteCanvasAssignment {
  if ((course as ICompleteCanvasAssignment).id) {
    return true;
  }
  return false;
}

export function convertCompleteAssignmentToassignment(
  assignment: CanvasAssignment | ICompleteCanvasAssignment
): CanvasAssignment {
  if (isCompleteAssignment(assignment)) {
    return {
      id: assignment.id,
      course_id: assignment.course_id,
      name: assignment.name,
      description: assignment.description,
      quiz_id: assignment.quiz_id,
      points_possible: assignment.points_possible,
      html_url: assignment.html_url,
      submissions_download_url: assignment.submissions_download_url,
      workflow_state: assignment.workflow_state,
      created_at: assignment.created_at,
      updated_at: assignment.updated_at,
      other_fields: {
        due_at: assignment.due_at,
        lock_at: assignment.lock_at,
        unlock_at: assignment.unlock_at,
        has_overrides: assignment.has_overrides,
        all_dates: assignment.all_dates,
        assignment_group_id: assignment.assignment_group_id,
        due_date_required: assignment.due_date_required,
        allowed_extensions: assignment.allowed_extensions,
        max_name_length: assignment.max_name_length,
        turnitin_enabled: assignment.turnitin_enabled,
        vericite_enabled: assignment.vericite_enabled,
        turnitin_settings: assignment.turnitin_settings,
        grade_group_students_individually:
          assignment.grade_group_students_individually,
        external_tool_tag_attributes: assignment.external_tool_tag_attributes,
        peer_reviews: assignment.peer_reviews,
        automatic_peer_reviews: assignment.automatic_peer_reviews,
        peer_review_count: assignment.peer_review_count,
        peer_reviews_assign_at: assignment.peer_reviews_assign_at,
        intra_group_peer_reviews: assignment.intra_group_peer_reviews,
        group_category_id: assignment.group_category_id,
        needs_grading_count: assignment.needs_grading_count,
        position: assignment.position,
        post_to_sis: assignment.post_to_sis,
        integration_id: assignment.integration_id,
        integration_data: assignment.integration_data,
        submission_types: assignment.submission_types,
        has_submitted_submissions: assignment.has_submitted_submissions,
        grading_type: assignment.grading_type,
        grading_standard_id: assignment.grading_standard_id,
        published: assignment.published,
        unpublishable: assignment.unpublishable,
        only_visible_to_overrides: assignment.only_visible_to_overrides,
        locked_for_user: assignment.locked_for_user,
        lock_info: assignment.lock_info,
        lock_explanation: assignment.lock_explanation,
        anonymous_submissions: assignment.anonymous_submissions,
        discussion_topic: assignment.discussion_topic,
        freeze_on_copy: assignment.freeze_on_copy,
        frozen: assignment.frozen,
        frozen_attributes: assignment.frozen_attributes,
        use_rubric_for_grading: assignment.use_rubric_for_grading,
        rubric_settings: assignment.rubric_settings,
        rubric: assignment.rubric,
        assignment_visibility: assignment.assignment_visibility,
        overrides: assignment.overrides,
        omit_from_final_grade: assignment.omit_from_final_grade,
        moderated_grading: assignment.moderated_grading,
        grader_count: assignment.grader_count,
        final_grader_id: assignment.final_grader_id,
        grader_comments_visible_to_graders:
          assignment.grader_comments_visible_to_graders,
        graders_anonymous_to_graders: assignment.graders_anonymous_to_graders,
        grader_names_visible_to_final_grader:
          assignment.grader_names_visible_to_final_grader,
        anonymous_grading: assignment.anonymous_grading,
        allowed_attempts: assignment.allowed_attempts,
        post_manually: assignment.post_manually,
        score_statistics: assignment.score_statistics,
        can_submit: assignment.can_submit,
      },
    };
  }
  return assignment;
}

export default CanvasAssignment;
