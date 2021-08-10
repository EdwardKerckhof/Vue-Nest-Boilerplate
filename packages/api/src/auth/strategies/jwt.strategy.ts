import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UserRequestDto, CookieData } from '@vnbp/common/dist/models'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieData: CookieData =
            request?.cookies[process.env.COOKIE_NAME || 'bp_jwt']
          return cookieData?.token
        }
      ]),
      ignoreExpiration: false, // FALSE
      secretOrKey: _configService.get('JWT_SECRET')
    })
  }

  async validate(payload: UserRequestDto) {
    if (!payload) return

    return { ...payload }
  }
}
