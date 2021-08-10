import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards,
  Res,
  Req
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RefreshStrategyService } from '../../users/strategies/refresh.strategy'
import {
  CreateUserDto,
  UserDto,
  UserResponse,
  UserResponseDto,
  ValidateUserDto,
  CookieData
} from '@vnbp/common/dist/models'
import { EXPIRE_TIME, TOKEN_TYPE } from '@vnbp/common/dist/constants'
import { UsersService } from '../service/users.service'
import { Request, Response } from 'express'

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<UserDto[]> {
    return this._usersService.findAll()
  }

  @Post()
  async create(
    @Body() createDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    const data = await this._usersService.create(createDto)
    this.setCookie(data, res)
    return { success: true }
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() validateDto: ValidateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    const data = await this._usersService.signIn(validateDto)
    this.setCookie(data, res)
    return { success: true }
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response
  ): Promise<{ success: boolean }> {
    res.clearCookie(process.env.COOKIE_NAME || 'bp_jwt')

    return {
      success: true
    }
  }

  @Get('user')
  getSignedInUser(@Req() req: Request): Promise<UserDto> {
    const cookieData: CookieData =
      req?.cookies[process.env.COOKIE_NAME || 'bp_jwt']
    return this._usersService.verifyJwt(cookieData.token)
  }

  @UseGuards(RefreshStrategyService)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(req)
    const accessToken = await this._usersService.generateJwt(
      req.user as UserDto
    )
    const refreshToken = await this._usersService.getRefreshToken(
      (req.user as UserDto).id
    )
    const data = {
      accessToken,
      refreshToken,
      refreshTokenExp: '',
      tokenType: TOKEN_TYPE,
      expiresIn: EXPIRE_TIME
    }
    this.setCookie(data, res)
    return { success: true }
  }

  private setCookie = (data: UserResponse, res: Response) => {
    const cookieData: CookieData = {
      token: data.accessToken,
      refreshToken: data.refreshToken
    }
    res.cookie(process.env.COOKIE_NAME || 'bp_jwt', cookieData, {
      httpOnly: true
    })
  }
}
