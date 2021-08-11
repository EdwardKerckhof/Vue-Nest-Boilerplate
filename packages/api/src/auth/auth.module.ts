import { forwardRef, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './service/auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshStrategy } from './strategies/refresh.strategy'
import { RefreshAuthGuard } from './guards/refresh-auth.guard'
import { UsersModule } from '../users/users.module'
import { EXPIRE_TIME } from '@vnbp/common/dist/constants'

@Module({
  imports: [
    forwardRef(() => UsersModule),
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
    RefreshAuthGuard
  ],
  exports: [AuthService]
})
export class AuthModule {}
