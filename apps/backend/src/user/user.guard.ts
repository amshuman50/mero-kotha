import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
    // ): boolean | Promise<boolean> | Observable<boolean> {
  ) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];
    const role = request.cookies['role'];

    if (!jwt || !role) return false;

    try {
      const decoded = await this.jwtService.verifyAsync(jwt);
      console.log(decoded);
      if (+role === 1 || decoded) {
        request.user = decoded;
        console.log(request.user);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
