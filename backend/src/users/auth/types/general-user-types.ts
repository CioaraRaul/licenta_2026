export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface FacebookUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface GeneralUser {
  email: string;
  firstName: string;
  lastName: string;
  facebookId?: string;
}
