import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserDto } from '@vnbp/common/dist/models'

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}

  generateJwt(user: UserDto): Promise<string> {
    return this._jwtService.signAsync({ ...user })
  }

  verifyJwt(token: string): Promise<any> {
    return this._jwtService.verifyAsync(token)
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  comparePassword(
    password: string,
    storedPasswordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash)
  }
}
