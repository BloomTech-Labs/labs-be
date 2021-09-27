// https://canvas.instructure.com/doc/api/quiz_submission_questions.html
export interface IQuizSubmissionQuestion {
  id: number;
  flagged: boolean;
  position?: number;
  answer?: unknown | null;
  answers?: unknown | null;
  matches?: unknown | null;
}

export class QuizSubmissionQuestion implements IQuizSubmissionQuestion {
  public id: number;
  public flagged: boolean;
  public position: number;
  public answer?: unknown | null;
  public answers?: unknown | null;
  public matches?: unknown | null;


  constructor(
    id: number,
    flagged: boolean,
    position: number,
    answer?: unknown | null,
    answers?: unknown | null,
    matches?: unknown | null

  ) {
    this.id = id;
    this.flagged = flagged;
    this.position = position;
    this.answer = answer;
    this.answers = answers;
    this.matches = matches;
  }
}

export default QuizSubmissionQuestion;
