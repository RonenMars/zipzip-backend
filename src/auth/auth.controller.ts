import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserPhoneDto } from '@validations/user/dto/login.phone.dto';
import { PhoneSchema } from '@validations/user';
import { JoiValidationPipe } from '@validations/joi-schema.validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new JoiValidationPipe(PhoneSchema))
  @HttpCode(200)
  @Post('login')
  login(@Body() loginDto: UserPhoneDto) {
    return this.authService.login(loginDto);
  }
}
