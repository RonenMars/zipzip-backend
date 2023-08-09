export class UserCreateDto {
  phone: string;
  name: string;
  email: string;
  isVerified?: boolean;
  validationCode?: string;
  codeExpiration?: string;
}
