import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private UserModel : Model<User> ) {}

    async createUser(createUserDto : CreateUserDto){
        const newUser =  new this.UserModel(createUserDto);
        return await newUser.save();
    }

    async findByEmail(email: string) {
        return await this.UserModel.findOne({ email });
    }

    async getAllUsers(){
        const UserData = await this.UserModel.find();
        if (!UserData || UserData.length == 0) {
        throw new NotFoundException('Students data not found!');
        }
        return UserData;
    }

}
