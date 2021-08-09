import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import {
  CreateUserDto,
  UserDto,
  UserResponseDto,
  ValidateUserDto
} from '@vnbp/common/dist/models'
import { UsersService } from '../service/users.service'

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
  create(@Body() createDto: CreateUserDto): Promise<UserResponseDto> {
    return this._usersService.create(createDto)
  }

  @Post('signin')
  @HttpCode(200)
  signIn(@Body() validateDto: ValidateUserDto): Promise<UserResponseDto> {
    return this._usersService.signIn(validateDto)
  }
}
