export enum TemplateType {
  newCompanyNewUser = 'newCompanyNewUser',
  newCompanyExistingUser = 'newCompanyExistingUser',
  existingCompanyUser = 'existingCompanyUser',
  passwordReset = 'passwordReset',
}

type TWelcomeAboard = {
  context: {
    userName: string;
    companyName: string;
    link: string;
  };
  type: TemplateType.newCompanyNewUser;
};

type TNewCompanyExistingUser = {
  context: {
    userName: string;
    companyName: string;
    link: string;
  };
  type: TemplateType.newCompanyExistingUser;
};

type TExistingCompanyUser = {
  context: {
    userName: string;
    companyName: string;
    link: string;
  };
  type: TemplateType.existingCompanyUser;
};

type TPasswordReset = {
  context: {
    userName: string;
    companyName: string;
    link: string;
  };
  type: TemplateType.passwordReset;
};

export type TMailData = {
  email: string;
  content: TWelcomeAboard | TPasswordReset | TNewCompanyExistingUser | TExistingCompanyUser;
};
