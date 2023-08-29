import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '@validations/user/dto/login.dto';
import { LoginSchema } from '@validations/user';
import { JoiValidationPipe } from '@validations/joi-schema.validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate a user by logging them in.
   *
   * @param {UserLoginDto} loginDto - The user's login data.
   * @returns {Promise<any>} A response from the authentication service.
   */
  @UsePipes(new JoiValidationPipe(LoginSchema))
  @HttpCode(200)
  @Post('login')
  login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }
}
