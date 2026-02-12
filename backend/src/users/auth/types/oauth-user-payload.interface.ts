export interface OAuthUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  provider: 'google' | 'facebook';
}
