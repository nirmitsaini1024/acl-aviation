import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './schemas/tenants.schema';


@Injectable()
export class TenantsService {
  constructor(@InjectModel('Tenant') private readonly tenantModel: Model<Tenant>) {}

  async createTenant(createTenantDto: CreateTenantDto) {
    const newTenant = new this.tenantModel(createTenantDto);
    return await newTenant.save();
  }

  async getAllTenants() {
    const tenantData = await this.tenantModel.find();
    if (!tenantData || tenantData.length === 0) {
      throw new NotFoundException('Tenants not found!');
    }
    return tenantData;
  }


  async deleteTenant(id: string) {
    const deletedTenant = await this.tenantModel.findByIdAndDelete(id);

    if (!deletedTenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return {
      message: 'Tenant deleted successfully',
      id: deletedTenant._id,
    };
  }
}
