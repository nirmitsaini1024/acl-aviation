import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { User } from '../users/schemas/users.schema';
import { Group } from '../groups/schemas/groups.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Group') private readonly groupModel: Model<Group>
  ) {}

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

  async getRoleById(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async getRoleWithAssignments(id: string) {
    const role = await this.roleModel.findById(id)
      .populate('userIds', 'firstName lastName email')
      .populate('groupIds', 'groupName description');
    
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
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

  async deleteRole(id: string) {
    const result = await this.roleModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return { message: 'Role deleted successfully' };
  }

  async assignRole(roleId: string, assignRoleDto: AssignRoleDto) {
    const { userId, groupId } = assignRoleDto;

    // Validate that at least one of userId or groupId is provided
    if (!userId && !groupId) {
      throw new BadRequestException('At least one of userId or groupId must be provided');
    }

    // Validate role exists
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const roleObjectId = new Types.ObjectId(roleId);
    const results = {
      userUpdated: false,
      groupUpdated: false,
      roleUpdated: false,
      message: ''
    };

    // Assign role to user if userId is provided
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Check if role is already assigned to avoid duplicates (idempotent)
      const hasRole = user.roles.some(roleRef => roleRef.toString() === roleId);
      
      if (!hasRole) {
        // Update user with role
        await this.userModel.findByIdAndUpdate(
          userId,
          { $addToSet: { roles: roleObjectId } },
          { new: true, runValidators: true }
        );
        results.userUpdated = true;
      }
    }

    // Assign role to group if groupId is provided
    if (groupId) {
      const group = await this.groupModel.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      }

      // Check if role is already assigned to avoid duplicates (idempotent)
      const hasRole = group.roles.some(roleRef => roleRef.toString() === roleId);
      
      if (!hasRole) {
        // Update group with role
        await this.groupModel.findByIdAndUpdate(
          groupId,
          { $addToSet: { roles: roleObjectId } },
          { new: true, runValidators: true }
        );
        results.groupUpdated = true;
      }
    }

    // Update role document with user and group IDs
    const roleUpdates: any = {};
    
    if (userId && results.userUpdated) {
      roleUpdates.$addToSet = { ...roleUpdates.$addToSet, userIds: new Types.ObjectId(userId) };
    }
    
    if (groupId && results.groupUpdated) {
      roleUpdates.$addToSet = { ...roleUpdates.$addToSet, groupIds: new Types.ObjectId(groupId) };
    }

    // Only update role if there were actual changes
    if (Object.keys(roleUpdates).length > 0) {
      await this.roleModel.findByIdAndUpdate(
        roleId,
        roleUpdates,
        { new: true, runValidators: true }
      );
      results.roleUpdated = true;
    }

    // Build response message
    const updates = [];
    if (results.userUpdated) updates.push('user');
    if (results.groupUpdated) updates.push('group');
    
    if (updates.length > 0) {
      results.message = `Role assigned successfully to ${updates.join(' and ')}`;
    } else {
      results.message = 'Role was already assigned to specified entities';
    }

    return {
      roleId,
      ...results,
      role: role.roleName
    };
  }
}
