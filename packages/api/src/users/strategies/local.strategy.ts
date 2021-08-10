import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserResponse } from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly _usersService: UsersService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserResponse> {
    const userResponse = await this._usersService.signIn({ email, password })

    if (!userResponse)
      throw new HttpException(
        `in correct email or password`,
        HttpStatus.UNAUTHORIZED
      )
    return userResponse
  }
}
