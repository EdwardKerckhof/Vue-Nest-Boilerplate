export const EXPIRE_TIME: number = 7200 // 2 hrs
export const TOKEN_TYPE: string = 'JWT'

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserDto {
  id!: number
  firstName!: string
  lastName!: string
  email!: string
  password?: string
}

export class UserResponseDto {
  accessToken!: string
  tokenType!: string
  expiresIn!: number
}

export class UserRequestDto {
  user!: UserDto
}

export class ValidateUserDto {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}

export class CreateUserDto extends ValidateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string
}
