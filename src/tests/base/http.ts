export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403
}

export const withAuth = (token: string): Record<string, string> => ({
  Authorization: token
});
