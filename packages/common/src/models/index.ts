import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin'
}

export class UserDto {
  protected password?: string

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public refreshTokenExp: string,
    public roles: UserRole[]
  ) {}
}

export class ValidationResponse {
  @ApiProperty({
    type: 'string',
    description: 'JWT'
  })
  accessToken!: string

  @ApiProperty({
    type: 'string',
    description: 'refresh token'
  })
  refreshToken!: string

  @ApiProperty({
    type: 'string',
    description: 'refresh token expiration date'
  })
  refreshTokenExp!: string

  @ApiProperty({
    type: 'string',
    description: 'user roles'
  })
  roles!: UserRole[]
}

export class CookieData {
  token: string
  refreshToken: string
}

export class UserResponseDto {
  success!: boolean
}

export class ErrorResponseDto {
  statusCode!: number
  message!: string | string[]
  error?: string
}

export class UserRequestDto {
  id: number
  firstName: string
  lastName: string
  email: string
  refreshTokenExp: string
}

export class ValidateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'users email address',
    type: 'string'
  })
  email!: string

  @IsNotEmpty()
  @ApiProperty({
    description: 'users password',
    type: 'string'
  })
  password!: string
}

export class RegisterUserDto extends ValidateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'users first name',
    type: 'string'
  })
  firstName!: string

  @IsNotEmpty()
  @ApiProperty({
    description: 'Users last name',
    type: 'string'
  })
  lastName!: string
}
