import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema, User, UserSchema } from 'src/mongodb';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { UserCompanies } from 'src/mongodb/schemas/user-companies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: UserCompanies.name, schema: UserCompanies },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, CustomLogger],
})
export class RolesModule {}
