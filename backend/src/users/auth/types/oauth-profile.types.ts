export interface GoogleProfle {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    fammily: string;
  };
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

export interface FacebookProfile {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
}

export interface OAtuhUser {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
}
