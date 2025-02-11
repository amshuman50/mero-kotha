import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
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
      const decoded = await this.jwtService.verify(jwt);

      if (+role === 1 && decoded) return true;
      return false;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
