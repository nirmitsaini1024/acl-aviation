import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/groups.schema';
import { Model, Types } from "mongoose"
import { CreateGroupDto } from './dto/create-group.dto';
import { TenantsService } from '../tenants/tenants.service';
 
@Injectable()
export class GroupsService {
    constructor(
        @InjectModel('Group') private GroupModel: Model<Group>,
        private readonly tenantsService: TenantsService
    ) {}
    
    async createGroup(createGroupDto: CreateGroupDto) {
        try {
            const { tenant_id, ...groupData } = createGroupDto;
            const newGroup = new this.GroupModel({
                ...groupData,
                tenant_id: new Types.ObjectId(tenant_id)
            });
            const savedGroup = await newGroup.save();
            
            // Update tenant with the new group
            await this.tenantsService.addGroupToTenant(tenant_id, savedGroup._id);
            
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
