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
  HttpCode,
  Put,
  Param,
  Query
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RefreshAuthGuard } from '../../auth/guards/refresh-auth.guard'
import {
  RegisterUserDto,
  UserDto,
  ValidationResponse,
  UserResponseDto,
  CookieData,
  ValidateUserDto,
  UserRole
} from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'
import { Request, Response } from 'express'
import { Pagination } from 'nestjs-typeorm-paginate'
import { User } from '../models/users.entity'

interface RequestModel extends Request {
  user: UserDto
}

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ValidationResponse> {
    const data = await this._usersService.register(registerDto)
    this.setCookie(data.accessToken, data.refreshToken, res)
    return data
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('signin')
  async signIn(
    @Body() validateUser: ValidateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ValidationResponse> {
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit
    return this._usersService.getAllUsers({
      page,
      limit,
      route: '/users'
    })
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/roles')
  addRole(
    @Param('id') userId: number,
    @Body() roleReq: { role: UserRole }
  ): Promise<UserDto> {
    return this._usersService.addRoleToUser(userId, roleReq.role)
  }

  @Get('user')
  getSignedInUser(@Req() req: RequestModel): UserDto {
    return req.user
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
