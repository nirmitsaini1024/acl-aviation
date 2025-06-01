import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
    }),
    RolesModule, UsersModule, GroupsModule, PermissionsModule, AuthModule, TenantsModule, AbilityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
