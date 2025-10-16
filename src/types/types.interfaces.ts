export interface UserCred {
  email: string;
  password: string;
}

export interface AuthApiResponse {
  message: string;
  success: boolean;
  token: string;
  user: {
    created_at: object;
    dob: string;
    email: string;
    id: string;
    isAdmin: boolean;
    isConsultant: boolean;
    name: string;
    password: string;
    phoneNumber: string;
    uniqueId: number;
  };
}
