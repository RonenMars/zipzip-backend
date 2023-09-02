import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest<IncomingMessage & { user?: Record<string, unknown> }>(context); // you could use FastifyRequest here too
    try {
      const token = this.getToken(request);
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (e) {
      // return false or throw a specific error if desired
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  protected getToken(request: { headers: Record<string, unknown> | undefined }): string {
    const authorization = request?.headers?.authorization || undefined;
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    return (authorization as string).split(' ')[1];
  }
}
