import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './roles.service';
import { DocumentRepoController } from './controllers/document-repo.controller';
import { DocumentRepoService } from './services/document-repo.service';
import { DocumentRepoAccessSchema } from './schemas/document-repo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
      { name: 'DocumentRepoAccess', schema: DocumentRepoAccessSchema }
    ]),
  ],
  controllers: [RolesController, DocumentRepoController],
  providers: [RoleService, DocumentRepoService]
})
export class RolesModule {}
