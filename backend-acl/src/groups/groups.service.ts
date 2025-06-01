import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/groups.schema';
import { Model, Types, Schema as MongooseSchema } from "mongoose"
import { CreateGroupDto } from './dto/create-group.dto';
import { TenantsService } from '../tenants/tenants.service';
import { UsersService } from '../users/users.service';
 
@Injectable()
export class GroupsService {
    constructor(
        @InjectModel('Group') private GroupModel: Model<Group>,
        private readonly tenantsService: TenantsService,
        private readonly usersService: UsersService
    ) {}
    
    async createGroup(createGroupDto: CreateGroupDto) {
        try {
            const { tenant_id, users, ...groupData } = createGroupDto;
            const newGroup = new this.GroupModel({
                ...groupData,
                users: users.map(userId => new Types.ObjectId(userId)),
                tenant_id: new Types.ObjectId(tenant_id)
            });
            const savedGroup = await newGroup.save();
            
            // Update tenant with the new group
            await this.tenantsService.addGroupToTenant(tenant_id, savedGroup._id);
            
            // Update each user with the new group
            for (const userId of users) {
                await this.usersService.addGroupToUser(userId, savedGroup._id as MongooseSchema.Types.ObjectId);
            }
            
            return savedGroup;
        } catch (error) {
            throw new Error(`Error creating group: ${error.message}`);
        }
    }
    
    async getAllGroups() {
        const GroupData = await this.GroupModel.find();
        if (!GroupData || GroupData.length == 0) {
            throw new NotFoundException('Group not found!');
        }
        return GroupData;
    }
}
