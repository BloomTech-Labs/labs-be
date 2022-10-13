export interface IContact {
  id: string;
  name: string;
  lambdaId?: string;
  oktaId?: string;
  status?: string;
  classType?: string;
  learnerProgramType?: string;
  githubHandle?: string;
  githubUrl?: string;
  slackDisplayName?: string;
  slackId?: string;
  learnerAssistantName?: string;
  canvasStudentId?: string;
  paymentType?: string;
  appPaymentType?: string;
  isaPaymentType?: string;
}

export class Contact implements IContact {
  public id: string;
  public name: string;
  public lambdaId?: string;
  public oktaId?: string;
  public status?: string;
  public classType?: string;
  public learnerProgramType?: string;
  public githubHandle?: string;
  public githubUrl?: string;
  public slackDisplayName?: string;
  public slackId?: string;
  public learnerAssistantName?: string;
  public canvasStudentId?: string;
  public paymentType?: string;
  public appPaymentType?: string;
  public isaPaymentType?: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public static parseLargeContact(contact: Record<string, unknown>): Contact {
    const newContact = new Contact(
      contact.Id as string,
      contact.Name as string
    );

    return newContact;
  }
}

export default Contact;
