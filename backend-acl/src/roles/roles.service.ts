import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const newRole = new this.roleModel(createRoleDto);
    return await newRole.save();
  }

  async getAllRoles() {
    const roleData = await this.roleModel.find();
    if (!roleData || roleData.length === 0) {
      throw new NotFoundException('Roles not found!');
    }
    return roleData;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return updatedRole;
  }
}
