import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserResponse } from '@vnbp/common/dist/models'
import { UsersService } from '../../users/service/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly _usersService: UsersService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserResponse> {
    const user = await this._usersService.signIn({ email, password })

    if (!user) throw new HttpException(`unauthorized`, HttpStatus.UNAUTHORIZED)

    return user
  }
}
