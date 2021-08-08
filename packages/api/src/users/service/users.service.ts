import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EXPIRE_TIME, TOKEN_TYPE } from '@vnbp/common'
import { Repository } from 'typeorm'
import { AuthService } from '../../auth/service/auth.service'
import {
  CreateUserDto,
  UserDto,
  UserResponseDto,
  ValidateUserDto
} from '../models/dto/users.dto'
import { User } from '../models/entity/users.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    private readonly _authService: AuthService
  ) {}

  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this._usersRepository.find()
      return users.map((user) => user.toDTO())
    } catch (error) {
      throw new HttpException(
        `something went wrong ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findOneById(userId: number): Promise<UserDto> {
    try {
      const user = await this._usersRepository.findOneOrFail(userId)
      return user.toDTO()
    } catch (error) {
      throw new HttpException(
        `user with id ${userId} not found`,
        HttpStatus.NOT_FOUND
      )
    }
  }

  async create(createDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const mailExists = await this.mailExists(createDto.email)
      if (mailExists)
        throw new HttpException(
          `email ${createDto.email} already exists`,
          HttpStatus.CONFLICT
        )

      const passwordHash = await this._authService.hashPassword(
        createDto.password
      )
      createDto.password = passwordHash

      const user = this._usersRepository.create(createDto)
      await this._usersRepository.save(user)

      const userDto = user.toDTO()
      const accessToken = await this.generateJwt(userDto)
      return { accessToken, tokenType: TOKEN_TYPE, expiresIn: EXPIRE_TIME }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async signIn(validateDto: ValidateUserDto): Promise<UserResponseDto> {
    const user = await this.findUserByEmail(validateDto.email)

    try {
      const passwordCorrect = await this.validatePassword(
        validateDto.password,
        user.password
      )
      if (!passwordCorrect)
        throw new HttpException(
          `incorrect email or password`,
          HttpStatus.UNAUTHORIZED
        )

      const userDto = user.toDTO()
      const accessToken = await this.generateJwt(userDto)
      return { accessToken, tokenType: TOKEN_TYPE, expiresIn: EXPIRE_TIME }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    try {
      // include password because it is excluded by default
      // see users.entity.ts
      return await this._usersRepository.findOneOrFail(
        { email },
        { select: ['id', 'email', 'firstName', 'lastName', 'password'] }
      )
    } catch (error) {
      throw new HttpException(
        `user with email: ${email}, not found`,
        HttpStatus.NOT_FOUND
      )
    }
  }

  private validatePassword(
    password: string,
    storedPasswordHash: string
  ): Promise<boolean> {
    return this._authService.comparePassword(password, storedPasswordHash)
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this._usersRepository.findOne({ email })
    if (user) return true
    return false
  }

  private async generateJwt(user: UserDto): Promise<string> {
    return this._authService.generateJwt(user)
  }
}
