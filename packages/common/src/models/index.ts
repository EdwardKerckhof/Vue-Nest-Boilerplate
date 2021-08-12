import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin'
}

export class UserDto {
  protected password?: string

  @ApiProperty({
    type: 'string',
    description: 'user id'
  })
  id: number

  @ApiProperty({
    type: 'string',
    description: 'first name'
  })
  firstName: string

  @ApiProperty({
    type: 'string',
    description: 'last name'
  })
  lastName: string

  @ApiProperty({
    type: 'string',
    description: 'email'
  })
  email: string

  @ApiProperty({
    type: 'string',
    description: 'refresh token expiration date'
  })
  refreshTokenExp: string

  @ApiProperty({
    enum: UserRole,
    enumName: 'User Role',
    description: 'user roles',
    isArray: true
  })
  roles: UserRole[]

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    refreshTokenExp: string,
    roles: UserRole[]
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.refreshTokenExp = refreshTokenExp
    this.roles = roles
  }
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
    enum: UserRole,
    enumName: 'User Role',
    description: 'user roles',
    isArray: true
  })
  roles!: UserRole[]
}

export class CookieData {
  @ApiProperty({
    description: 'JWT',
    type: 'string'
  })
  token: string
  @ApiProperty({
    description: 'refresh Token',
    type: 'string'
  })
  refreshToken: string
}

export class UserResponseDto {
  @ApiProperty({
    description: 'returns success boolean',
    type: 'boolean'
  })
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
