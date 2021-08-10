import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EXPIRE_TIME, TOKEN_TYPE } from '@vnbp/common/dist/constants'
import {
  RegisterUserDto,
  UserDto,
  UserResponse,
  ValidateUserDto
} from '@vnbp/common/dist/models'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { AuthService } from '../../auth/service/auth.service'
import { User } from '../models/users.entity'
import moment from 'moment'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    private readonly _authService: AuthService
  ) {}

  async register(registerDto: RegisterUserDto): Promise<UserResponse> {
    try {
      const mailExists = await this.mailExists(registerDto.email)
      if (mailExists)
        throw new HttpException(
          `email ${registerDto.email} already in use`,
          HttpStatus.CONFLICT
        )

      const passwordHash = await this._authService.hashPassword(
        registerDto.password
      )
      registerDto.password = passwordHash

      const user = this._usersRepository.create(registerDto)
      await this._usersRepository.save(user)

      const userDto = user.toDTO()
      const { accessToken, refreshToken } = await this.createNewTokens(userDto)
      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp || '',
        tokenType: TOKEN_TYPE,
        expiresIn: EXPIRE_TIME,
        user: userDto
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async signIn(validateDto: ValidateUserDto): Promise<UserResponse> {
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
      const { accessToken, refreshToken } = await this.createNewTokens(userDto)
      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp || '',
        tokenType: TOKEN_TYPE,
        expiresIn: EXPIRE_TIME,
        user: userDto
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

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

  // creates a new accessToken and refreshToken
  async createNewTokens(userDto: UserDto): Promise<UserResponse> {
    try {
      const user = await this.findOneById(userDto.id)
      const accessToken = await this.generateJwt(user)
      const refreshToken = await this.generateRefreshToken(user.id)
      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp,
        tokenType: TOKEN_TYPE,
        expiresIn: EXPIRE_TIME,
        user
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // generates a refreshToken for the user with given Id.
  // updates refreshToken and refreshTokenExp in database.
  private async generateRefreshToken(userId: number): Promise<string> {
    const userToUpdate = await this.findOneById(userId)
    const refreshToken = this._authService.generateRefreshToken()

    if (userToUpdate)
      await this._usersRepository.update(userId, {
        refreshToken,
        refreshTokenExp: moment().day(1).format('YYYY/MM/DD')
      })

    return refreshToken
  }

  // USED BY `RefreshAuthGuard`
  // finds user by email and refreshToken and where
  // users refreshTokenExp is bigger or equal than today.
  // if found, return that user (refreshToken is valid),
  // else throw error
  async validateRefreshToken(
    email: string,
    refreshToken: string
  ): Promise<UserDto> {
    const currentDate = moment().format('YYYY/MM/DD')
    try {
      const user = await this._usersRepository.findOneOrFail({
        where: {
          email,
          refreshToken,
          refreshTokenExp: MoreThanOrEqual(currentDate)
        }
      })

      return user.toDTO()
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED)
    }
  }

  // verifies the cookies JWT
  // if valid, returns the user by id from the JWT
  async verifyJwt(token: string): Promise<UserDto> {
    try {
      const data = await this._authService.verifyJwt(token)

      if (!data)
        throw new HttpException(
          `unable to verify JWT cookie`,
          HttpStatus.UNAUTHORIZED
        )

      return await this.findOneById(data.id)
    } catch (error) {
      throw new HttpException(
        `unable to verify JWT cookie: ${error}`,
        HttpStatus.UNAUTHORIZED
      )
    }
  }
}
