import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './service/auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshStrategy } from './strategies/refresh.strategy'
import { RefreshAuthGuard } from './guards/refresh-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { EXPIRE_TIME } from '@vnbp/common/dist/constants'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/models/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: EXPIRE_TIME }
      })
    })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RefreshStrategy,
    RefreshAuthGuard,
    RolesGuard
  ],
  exports: [AuthService]
})
export class AuthModule {}
