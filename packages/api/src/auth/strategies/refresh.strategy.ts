import { User } from './../../users/models/users.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserRequestDto, CookieData, UserDto } from '@vnbp/common/dist/models'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly _configService: ConfigService,
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>
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

    try {
      const currentDate = new Date()
      const user = await this._usersRepository.findOneOrFail({
        where: {
          email: payload.email,
          refreshToken: cookieData.refreshToken,
          refreshTokenExp: MoreThanOrEqual(currentDate)
        }
      })

      return user.toDTO()
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
