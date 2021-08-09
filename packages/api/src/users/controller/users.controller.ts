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
import {
  CreateUserDto,
  UserDto,
  UserResponseDto,
  ValidateUserDto
} from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'
import { Request, Response } from 'express'

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get('test')
  testHello(): { title: string } {
    return { title: 'HELLO FROM SERVER!' }
  }

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
    res.cookie(process.env.COOKIE_NAME || 'bp_jwt_fb', data.accessToken, {
      httpOnly: true
    })
    return { success: true }
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() validateDto: ValidateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserResponseDto> {
    const data = await this._usersService.signIn(validateDto)
    res.cookie(process.env.COOKIE_NAME || 'bp_jwt', data.accessToken, {
      httpOnly: true
    })
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
    const cookie = req.cookies[process.env.COOKIE_NAME || 'bp_jwt']
    return this._usersService.verifyJwt(cookie)
  }
}
