import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserDto } from '@vnbp/common'

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}

  generateJwt(user: UserDto): Promise<string> {
    return this._jwtService.signAsync({ user })
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
