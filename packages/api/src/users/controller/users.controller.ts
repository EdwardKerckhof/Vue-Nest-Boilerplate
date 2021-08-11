import { RolesGuard } from './../../auth/guards/roles.guard'
import { Roles } from './../../auth/decorators/role.decorator'
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
  HttpCode
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RefreshAuthGuard } from '../../auth/guards/refresh-auth.guard'
import {
  RegisterUserDto,
  UserDto,
  UserResponse,
  UserResponseDto,
  CookieData,
  ValidateUserDto
} from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'
import { Request, Response } from 'express'

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponse> {
    const data = await this._usersService.register(registerDto)
    this.setCookie(data.accessToken, data.refreshToken, res)
    return data
  }

  @HttpCode(200)
  @Post('signin')
  async signIn(
    @Body() validateUser: ValidateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponse> {
    const data = await this._usersService.signIn(validateUser)
    this.setCookie(data.accessToken, data.refreshToken, res)
    return data
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    res.clearCookie(process.env.COOKIE_NAME || 'bp_jwt')

    return {
      success: true
    }
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(): Promise<UserDto[]> {
    return this._usersService.getAllUsers()
  }

  @Get('user')
  getSignedInUser(@Req() req: Request): Promise<UserDto> {
    const cookieData: CookieData =
      req?.cookies[process.env.COOKIE_NAME || 'bp_jwt']
    return this._usersService.verifyJwt(cookieData.token)
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<CookieData> {
    if (!req.user) return { token: '', refreshToken: '' }
    const { accessToken, refreshToken } =
      await this._usersService.createNewTokens(req.user as UserDto)
    this.setCookie(accessToken, refreshToken, res)
    return { token: accessToken, refreshToken }
  }

  private setCookie = (
    accessToken: string,
    refreshToken: string,
    res: Response
  ) => {
    const cookieData: CookieData = {
      token: accessToken,
      refreshToken
    }
    res.cookie(process.env.COOKIE_NAME || 'bp_jwt', cookieData, {
      httpOnly: true
    })
  }
}
