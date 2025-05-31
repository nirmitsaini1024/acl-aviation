import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async addUserToTenant(tenantId: string, userId: any) {
    try {
      const tenant = await this.tenantModel.findById(tenantId);
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
      }

      const userIdStr = userId.toString();
      if (!tenant.users.some(id => id.toString() === userIdStr)) {
        tenant.users.push(new Types.ObjectId(userId));
        await tenant.save();
      }
      return tenant;
    } catch (error) {
      throw new Error(`Error adding user to tenant: ${error.message}`);
    }
  }

  async addGroupToTenant(tenantId: string, groupId: any) {
    try {
      const tenant = await this.tenantModel.findById(tenantId);
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
      }

      const groupIdStr = groupId.toString();
      if (!tenant.groups.some(id => id.toString() === groupIdStr)) {
        tenant.groups.push(new Types.ObjectId(groupId));
        await tenant.save();
      }
      return tenant;
    } catch (error) {
      throw new Error(`Error adding group to tenant: ${error.message}`);
    }
  }
}
