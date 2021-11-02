import QuizSubmissionQuestion, {
  IQuizSubmissionQuestion,
} from "@entities/QuizSubmissionQuestion";
import CanvasClient from "@daos/Canvas/client";

export type QuizSubmissionQuestionResponse =
  Promise<QuizSubmissionQuestion | null>;
export type QuizSubmissionQuestionsArrayResponse = Promise<
  QuizSubmissionQuestion[] | null
>;

export interface IQuizSubmissionQuestionsDao {
  getAll: (quizSubmissionId: number) => QuizSubmissionQuestionsArrayResponse;
}

class QuizSubmissionQuestionsDao implements IQuizSubmissionQuestionsDao {
  private client: CanvasClient<Record<string, IQuizSubmissionQuestion>>;

  constructor() {
    this.client = new CanvasClient<Record<string, IQuizSubmissionQuestion>>();
  }

  /**
   * @param courseId
   * @param quizId
   */
  public async getAll(
    quizSubmissionId: number
  ): QuizSubmissionQuestionsArrayResponse {
    const path = `quiz_submissions/${quizSubmissionId}/questions?per_page=100`;
    const response = (await this.client.get(path)) as unknown as Record<
      string,
      QuizSubmissionQuestion[]
    >;
    return response.quiz_submission_questions;
  }
}

export default QuizSubmissionQuestionsDao;
