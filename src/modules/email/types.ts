export enum TemplateType {
  welcomeAboard = 'welcomeAboard',
  passwordReset = 'passwordReset',
}

type TWelcomeAboard = {
  context: {
    name: string;
    link: string;
  };
  type: TemplateType.welcomeAboard;
};

type TPasswordReset = {
  context: {
    name: string;
    link: string;
  };
  type: TemplateType.passwordReset;
};

export type TMailData = {
  email: string;
  content: TWelcomeAboard | TPasswordReset;
};
