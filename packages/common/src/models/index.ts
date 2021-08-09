import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserDto {
  protected password?: string

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string
  ) {}
}

export class UserResponseDto {
  accessToken!: string
  tokenType!: string
  expiresIn!: number
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
