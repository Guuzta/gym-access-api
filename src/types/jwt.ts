export type JwtPayload = {
  sub: string;
  name: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
