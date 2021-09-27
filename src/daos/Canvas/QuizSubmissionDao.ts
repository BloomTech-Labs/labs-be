import QuizSubmission, { IQuizSubmission } from "@entities/QuizSubmission";
import CanvasClient from "@daos/Canvas/client";

export type QuizSubmissionResponse = Promise<QuizSubmission | null>;
export type QuizSubmissionArrayResponse = Promise<QuizSubmission[] | null>;

export interface IQuizSubmissionDao {
  getOne: (
    courseId: number,
    quizId: number,
    lambdaId: string
  ) => QuizSubmissionArrayResponse;
  getAll: (courseId: number, quizId: number) => QuizSubmissionArrayResponse;
  getByQuizAndUser: (
    courseId: number,
    quizId: number,
    lambdaId: string
  ) => QuizSubmissionArrayResponse;
}

class QuizSubmissionDao implements IQuizSubmissionDao {
  private client: CanvasClient<Record<string,IQuizSubmission>>;

  constructor() {
    this.client = new CanvasClient<Record<string,IQuizSubmission>>();
  }

  /**
   * @param courseId
   * @param quizId
   * @param lambdaId
   */
  public async getOne(
    courseId: number,
    quizId: number,
    lambdaId: string
  ): QuizSubmissionArrayResponse {
    const path = `courses/${courseId}/quizzes/${quizId}/submissions/sis_user_id:${lambdaId}`;
    const response =
      await this.client.get(path) as unknown as Record<string, QuizSubmission[]>;
    return response.quiz_submissions;
  }

  /**
   * @param courseId
   * @param quizId
   */
  public async getAll(
    courseId: number,
    quizId: number
  ): QuizSubmissionArrayResponse {
    const path = `courses/${courseId}/quizzes/${quizId}/submissions?per_page=100`;
    const response =
      await this.client.get(path) as unknown as Record<string, QuizSubmission[]>;
    return response.quiz_submissions;
  }

  /**
   * @param courseId
   * @param quizId
   * @param lambdaId
   */
  public async getByQuizAndUser(
    courseId: number,
    quizId: number,
    lambdaId: string
  ): QuizSubmissionArrayResponse {
    const path = `courses/${courseId}/quizzes/${quizId}/submissions/sis_user_id:${lambdaId}?per_page=100`;
    const response =
      await this.client.get(path) as unknown as Record<string, QuizSubmission[]>;
    return response.quiz_submissions;
  }

}

export default QuizSubmissionDao;
