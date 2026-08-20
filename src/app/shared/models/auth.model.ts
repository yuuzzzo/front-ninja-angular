export interface UsersLogin {
  email: string;
  password?: string;
}

export interface UsersRegister {
  user: string;
  email: string;
  password?: string;
}

export interface UserForgotPass {
  email: string;
}

export interface UserResetPass {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  access_token: string;
}
