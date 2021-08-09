import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserDto {
  protected password?: string

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string
  ) {}
}

export class UserResponse {
  accessToken!: string
  tokenType!: string
  expiresIn!: number
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
  user!: UserDto
}

export class ValidateUserDto {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  password!: string
}

export class CreateUserDto extends ValidateUserDto {
  @IsNotEmpty()
  firstName!: string

  @IsNotEmpty()
  lastName!: string
}
