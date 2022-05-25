export class AuthDTO {
  username: string;
  password: string;
  grant_type: string;
  client_id: number;
  client_secret: string;
  scope: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.grant_type = 'password';
    this.client_id = 2;
    this.client_secret = 'jGajEm9FqBAg3kwpaIy527WXfmKo0mYNoqOvaRIK';
    this.scope = '*';
  }
}

export class TokenDTO {
  token_type: string;
  access_token: string;

  constructor(token_type: string, access_token: string) {
    this.token_type = token_type;
    this.access_token = access_token;
  }
}
