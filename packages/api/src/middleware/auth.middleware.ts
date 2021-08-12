import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UsersService } from 'users/service/users.service'
import { CookieData, UserDto } from '@vnbp/common/dist/models'

export interface RequestModel extends Request {
  user: UserDto
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _usersService: UsersService) {}

  async use(req: RequestModel, _: Response, next: NextFunction) {
    const cookieData: CookieData =
      req.cookies[process.env.COOKIE_NAME || 'bp_jwt']

    try {
      const user = await this._usersService.verifyJwt(cookieData.token)

      if (user) {
        req.user = user
        next()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED)
    }
  }
}
