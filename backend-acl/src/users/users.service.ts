import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private UserModel: Model<User>,
        private readonly tenantsService: TenantsService
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        try {
            const { tenant_id, ...userData } = createUserDto;
            const newUser = new this.UserModel({
                ...userData,
                tenant_id: new Types.ObjectId(tenant_id)
            });
            const savedUser = await newUser.save();
            
            // Update tenant with the new user
            await this.tenantsService.addUserToTenant(tenant_id, savedUser._id);
            
            return savedUser;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async findByEmail(email: string) {
        return await this.UserModel.findOne({ email });
    }

    async getAllUsers() {
        const UserData = await this.UserModel.find();
        if (!UserData || UserData.length == 0) {
            throw new NotFoundException('Users not found!');
        }
        return UserData;
    }

    async addGroupToUser(userId: string, groupId: MongooseSchema.Types.ObjectId) {
        try {
            const user = await this.UserModel.findById(userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            
            // Add group to user's groups array if not already present
            if (!user.groups.includes(groupId)) {
                user.groups.push(groupId);
                await user.save();
            }
            
            return user;
        } catch (error) {
            throw new Error(`Error adding group to user: ${error.message}`);
        }
    }
}
