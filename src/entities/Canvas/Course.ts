import { Entity, Column, PrimaryColumn } from "typeorm";

export class CanvasEnrollment {
  type: string;
  role: string;
  role_id: number;
  user_id: number;
  enrollment_state: string;
  limit_privileges_to_course_section: boolean;
}

export class CanvasCalendar {
  ics: string;
}

export interface ICanvasCourseUser {
  id: number;
  name: string;
  created_at: string;
  sortable_name: string;
  short_name: string;
  sis_user_id: string;
  integration_id: string | null;
  login_id: string;
  email: string;
}

export interface ICompleteCanvasCourse {
  id: number;
  name: string;
  account_id: number;
  uuid: string;
  created_at: string;
  course_code: string;
  course_color: string | null;
  sis_course_id: number | null;
  workflow_state: string;
  friendly_name: string | null;
  root_account_id: number;
  start_at: string;
  grading_standard_id: number;
  is_public: boolean;
  default_view: string;
  enrollment_term_id: number;
  license: string;
  grade_passback_setting: string | null;
  end_at: string | null;
  public_syllabus: boolean;
  public_syllabus_to_auth: boolean;
  storage_quota_mb: number;
  is_public_to_auth_users: boolean;
  homeroom_course: boolean;
  hide_final_grades: boolean;
  apply_assignment_group_weights: boolean;
  calendar: CanvasCalendar | null;
  time_zone: string;
  blueprint: boolean;
  template: boolean;
  integration_id: number | null;
  enrollments: CanvasEnrollment[];
  restrict_enrollments_to_course_dates: boolean;
  override_course_visibility: string;
}

@Entity()
class CanvasCourse {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  account_id: number;
  @Column()
  uuid: string;
  @Column()
  created_at: string;
  @Column()
  course_code: string;
  @Column({ type: "varchar", nullable: true })
  course_color: string | null;
  @Column({ type: "varchar", nullable: true })
  sis_course_id: number | null;
  @Column()
  workflow_state: string;
  @Column({ type: "varchar", nullable: true })
  friendly_name: string | null;

  @Column("hstore")
  other_fields: Record<string, unknown>;
}

function isCompleteCourse(
  course: CanvasCourse | ICompleteCanvasCourse
): course is ICompleteCanvasCourse {
  if ((course as ICompleteCanvasCourse).id) {
    return true;
  }
  return false;
}

export function convertCompleteCourseToCourse(
  course: CanvasCourse | ICompleteCanvasCourse
): CanvasCourse {
  if (isCompleteCourse(course)) {
    return {
      id: course.id,
      name: course.name,
      account_id: course.account_id,
      uuid: course.uuid,
      created_at: course.created_at,
      course_code: course.course_code,
      course_color: course.course_color,
      sis_course_id: course.sis_course_id,
      workflow_state: course.workflow_state,
      friendly_name: course.friendly_name,
      other_fields: {
        root_account_id: course.root_account_id,
        start_at: course.start_at,
        grading_standard_id: course.grading_standard_id,
        is_public: course.is_public,
        default_view: course.default_view,
        enrollment_term_id: course.enrollment_term_id,
        license: course.license,
        grade_passback_setting: course.grade_passback_setting,
        end_at: course.end_at,
        public_syllabus: course.public_syllabus,
        public_syllabus_to_auth: course.public_syllabus_to_auth,
        storage_quota_mb: course.storage_quota_mb,
        is_public_to_auth_users: course.is_public_to_auth_users,
        homeroom_course: course.homeroom_course,
        hide_final_grades: course.hide_final_grades,
        apply_assignment_group_weights: course.apply_assignment_group_weights,
        calendar: JSON.stringify(course.calendar),
        time_zone: course.time_zone,
        blueprint: course.blueprint,
        template: course.template,
        integration_id: course.integration_id,
        enrollments: JSON.stringify(course.enrollments),
        restrict_enrollments_to_course_dates:
          course.restrict_enrollments_to_course_dates,
        override_course_visibility: course.override_course_visibility,
      },
    };
  }
  return course;
}

export default CanvasCourse;
