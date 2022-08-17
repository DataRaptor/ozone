export interface IUpdateUserPayload {
  name: string;
  email: string;
}

export interface IUpdateUserExistingPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ISetUserNewPasswordPayload {
  repeatPassword: string;
  newPassword: string;
}
