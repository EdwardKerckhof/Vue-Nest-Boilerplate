import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  RegisterUserDto,
  UserDto,
  ValidationResponse,
  UserRole,
  ValidateUserDto
} from '@vnbp/common/dist/models'
import { GET_USERS_CACHE_KEY } from '@vnbp/common/dist/constants'
import { MoreThanOrEqual, Repository, Like } from 'typeorm'
import { AuthService } from '../../auth/service/auth.service'
import { User } from '../models/users.entity'
import {
  IPaginationOptions,
  paginate,
  Pagination
} from 'nestjs-typeorm-paginate'
import { Cache } from 'cache-manager'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    private readonly _authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache
  ) {}

  async clearCache() {
    const store = this._cacheManager.store
    let keys: string[] = []
    if (store.keys) {
      keys = await store.keys()
    }
    keys.forEach((key) => {
      if (key.startsWith(GET_USERS_CACHE_KEY)) {
        this._cacheManager.del(key)
      }
    })
  }

  async register(registerDto: RegisterUserDto): Promise<ValidationResponse> {
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
      await this.clearCache()

      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp || '',
        roles: user.roles
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async signIn(validateDto: ValidateUserDto): Promise<ValidationResponse> {
    const user = await this.getUserByEmail(validateDto.email)

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
      await this.clearCache()

      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp || '',
        roles: user.roles
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getAllUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    try {
      return await paginate<User>(this._usersRepository, options)
    } catch (error) {
      throw new HttpException(
        `something went wrong ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findAllByName(name: string): Promise<UserDto[]> {
    try {
      const users = await this._usersRepository.find({
        where: [
          { firstName: Like(`%${name}%`) },
          { lastName: Like(`%${name}%`) }
        ]
      })

      if (users.length > 0) return users.map((user) => user.toDTO())

      return []
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  private async getUserByEmail(email: string): Promise<User> {
    try {
      // include password because it is excluded by default
      // see users.entity.ts
      return await this._usersRepository.findOneOrFail(
        { email },
        {
          select: [
            'id',
            'email',
            'firstName',
            'lastName',
            'refreshTokenExp',
            'password'
          ]
        }
      )
    } catch (error) {
      throw new HttpException(
        `user with email: ${email}, not found`,
        HttpStatus.NOT_FOUND
      )
    }
  }

  async getUserById(userId: number): Promise<UserDto> {
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

  async addRoleToUser(userId: number, role: UserRole): Promise<UserDto> {
    try {
      const user = await this._usersRepository.findOneOrFail(userId)
      if (!user.roles.includes(role)) {
        user.roles = [...user.roles, role]
        await this._usersRepository.save({ ...user })
      }
      await this.clearCache()

      return user.toDTO()
    } catch (error) {
      throw new HttpException(
        `unable to add role: ${role} to user with id: ${userId}: ${error}`,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  // validates passwords using bcrypt
  private validatePassword(
    password: string,
    storedPasswordHash: string
  ): Promise<boolean> {
    return this._authService.comparePassword(password, storedPasswordHash)
  }

  // checks if email address is already in use
  private async mailExists(email: string): Promise<boolean> {
    const user = await this._usersRepository.findOne({ email })
    if (user) return true
    return false
  }

  // generates a new JWT
  private async generateJwt(user: UserDto): Promise<string> {
    return this._authService.generateJwt(user)
  }

  // creates a new accessToken and refreshToken for the given user
  async createNewTokens(userDto: UserDto): Promise<ValidationResponse> {
    try {
      const user = await this.getUserById(userDto.id)
      const accessToken = await this.generateJwt(user)
      const refreshToken = await this.generateRefreshToken(user.id)
      return {
        accessToken,
        refreshToken,
        refreshTokenExp: user.refreshTokenExp,
        roles: user.roles
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // generates a refreshToken for the user with given Id (1 day).
  // updates refreshToken and refreshTokenExp in database.
  private async generateRefreshToken(userId: number): Promise<string> {
    const userToUpdate = await this.getUserById(userId)
    const refreshToken = this._authService.generateRefreshToken()

    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1))

    if (userToUpdate)
      await this._usersRepository.update(userId, {
        refreshToken,
        refreshTokenExp: this.dateToISOString(tomorrow)
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
    const currentDate = new Date()
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // verifies the cookies JWT
  // if valid, returns the user by id from the JWT
  async verifyJwt(token: string): Promise<UserDto> {
    try {
      const data = await this._authService.verifyJwt(token)

      if (!data.id)
        throw new HttpException(
          `unable to verify JWT cookie`,
          HttpStatus.UNAUTHORIZED
        )

      return await this.getUserById(data.id)
    } catch (error) {
      throw new HttpException(
        `unable to verify JWT cookie: ${error}`,
        HttpStatus.UNAUTHORIZED
      )
    }
  }

  private dateToISOString(date: Date) {
    return date.toISOString()
  }
}
