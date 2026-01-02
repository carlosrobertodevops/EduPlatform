type User = {
  id: number;
  name: string;
  email: string;
};

/* API */
type APISignInResponse = {
  user: User;
  access_token: string;
};

type APISignUpResponse = {
  user: User;
  access_token: string;
};

export interface SignupPayload {
  name?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  detail?: string;
}
