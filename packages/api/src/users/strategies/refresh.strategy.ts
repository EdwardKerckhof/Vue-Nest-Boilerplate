import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserRequestDto, CookieData, UserDto } from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly _configService: ConfigService,
    private readonly _usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieData: CookieData =
            request?.cookies[process.env.COOKIE_NAME || 'bp_jwt']
          return cookieData?.token
        }
      ]),
      passReqToCallback: true,
      ignoreExpiration: true, // TRUE
      secretOrKey: _configService.get('JWT_SECRET')
    })
  }

  async validate(req: Request, payload: UserRequestDto): Promise<UserDto> {
    const cookieData: CookieData =
      req?.cookies[process.env.COOKIE_NAME || 'bp_jwt']

    if (!cookieData.refreshToken || !payload.email)
      throw new HttpException(
        `no refresh token or email`,
        HttpStatus.BAD_REQUEST
      )

    const user = await this._usersService.validateRefreshToken(
      payload.email,
      cookieData.refreshToken
    )

    if (!user)
      throw new HttpException(`invalid refresh token`, HttpStatus.BAD_REQUEST)

    return user
  }
}
