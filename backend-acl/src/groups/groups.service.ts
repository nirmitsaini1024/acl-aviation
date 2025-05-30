import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/groups.schema';
import { Model } from "mongoose"
import { CreateGroupDto } from './dto/create-group.dto';
 
@Injectable()
export class GroupsService {
        constructor(@InjectModel('Group') private GroupModel : Model<Group> ) {}
    
        async createGroup(createGroupDto : CreateGroupDto){
            const newGroup =  new this.GroupModel(createGroupDto);
            return await newGroup.save();
        }
    
    
        async getAllGroups(){
            const GroupData = await this.GroupModel.find();
            if (!GroupData || GroupData.length == 0) {
            throw new NotFoundException('Group not found!');
            }
            return GroupData;
        }
}
