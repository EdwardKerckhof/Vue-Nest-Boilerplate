import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RefreshStrategyService } from '../../auth/strategies/refresh.strategy'
import {
  RegisterUserDto,
  UserDto,
  UserResponse,
  UserResponseDto,
  ValidateUserDto,
  CookieData
} from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    const userResponse = await this._usersService.register(registerDto)
    this.setCookie(userResponse, res)
    return { success: true }
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signIn(
    @Body() validateDto: ValidateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    const userResponse = await this._usersService.signIn(validateDto)
    this.setCookie(userResponse, res)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<UserDto[]> {
    return this._usersService.findAll()
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
    console.log(req.user)
    if (!req.user) return
    const data = await this._usersService.refreshToken(req.user as UserDto)
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
