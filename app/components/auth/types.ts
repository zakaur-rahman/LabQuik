export type UserType = "User" | "Admin" | "Organisation" | "B2B";

export interface LoginFormData {
  phoneNumber: string;
  countryCode: string;
  email: string;
  password: string;
  userType: UserType;
  otp: string;
}

export interface SignUpFormData {
  labName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  otp: string;
}
