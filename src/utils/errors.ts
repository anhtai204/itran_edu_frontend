/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = "Email/Password không hợp lệ!"
}

export class InactiveAccountError extends AuthError {
  static type = "Tài khoản chưa được kích hoạt!"
}

export class ForbiddenError extends AuthError {
  static type = "Không có quyền truy cập!"
}

export class NotFoundError extends AuthError {
  static type = "Không tìm thấy trang!"
}

export class RequestTimeOutError extends AuthError {
  static type = "Yêu cầu đã hết thời gian!"
}
