import QuizReport, { IQuizReport, IQuizReportFile } from "@entities/QuizReport";
import CanvasClient from "@daos/Canvas/client";
import { parseCsvUrl } from "@shared/functions";

export type QuizReportResponse = Promise<QuizReport | null>;
export type QuizReportArrayResponse = Promise<QuizReport[] | null>;

export interface IQuizReportDao {
  getAll: (courseId: number, quizId: number) => QuizReportArrayResponse;
  getOne: (
    courseId: number,
    quizId: number,
    reportId: string
  ) => QuizReportArrayResponse;
  getFile: (
    courseId: number,
    quizId: number,
    reportId: string
  ) => Promise<Papa.ParseResult<unknown> | null>;
}

class QuizReportDao implements IQuizReportDao {
  private client: CanvasClient<Record<string, IQuizReport>>;

  constructor() {
    this.client = new CanvasClient<Record<string, IQuizReport>>();
  }

  /**
   * @param courseId
   * @param quizId
   */
  public async getAll(
    courseId: number,
    quizId: number
  ): QuizReportArrayResponse {
    const path = `courses/${courseId}/quizzes/${quizId}/reports`;
    const response = (await this.client.get(path)) as unknown as Record<
      string,
      QuizReport[]
    >;
    return response.quiz_reports;
  }

  /**
   * @param courseId
   * @param quizId
   * @param reportId
   */
  public async getOne(
    courseId: number,
    quizId: number,
    reportId: string
  ): QuizReportArrayResponse {
    const path = `courses/${courseId}/quizzes/${quizId}/reports/${reportId}`;
    const response = (await this.client.get(path)) as unknown as Record<
      string,
      QuizReport[]
    >;
    return response.quiz_reports;
  }

  /**
   * @param courseId
   * @param quizId
   * @param reportType
   */
  public async getFile(
    courseId: number,
    quizId: number,
    reportType: string
  ): Promise<Papa.ParseResult<unknown> | null> {
    const quizReports = await this.getAll(courseId, quizId);
    if (!quizReports) {
      return null;
    }

    const reportObj = quizReports.find((x) => x.report_type === reportType);
    const reportUrl = reportObj?.file?.url;
    if (!reportUrl) {
      return null;
    }

    const parseOptions = {
      header: true,
      skipEmptyLines: true,
      transform: (value: string): string => {
        return value.trim();
      },
    };
    const reportJson = (await parseCsvUrl(
      reportUrl,
      parseOptions
    )) as Papa.ParseResult<unknown> | null;

    return reportJson;
  }
}

export default QuizReportDao;
