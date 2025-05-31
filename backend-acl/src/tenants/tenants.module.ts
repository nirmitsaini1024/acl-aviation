import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSchema } from './schemas/tenants.schema';
import { TenantsService } from './tenants.service';

@Module({
  imports : [MongooseModule.forFeature([{name : 'Tenant', schema : TenantSchema}])],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService]
})
export class TenantsModule {}
