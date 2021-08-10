import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserDto {
  protected password?: string

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public refreshTokenExp: string
  ) {}
}

export class UserResponse {
  accessToken!: string
  refreshToken!: string
  refreshTokenExp!: string
  tokenType!: string
  expiresIn!: number
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
  email!: string

  @IsNotEmpty()
  password!: string
}

export class RegisterUserDto extends ValidateUserDto {
  @IsNotEmpty()
  firstName!: string

  @IsNotEmpty()
  lastName!: string
}
