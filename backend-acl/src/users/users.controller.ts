import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Post()
    async createUser(@Body() createUsersDto : CreateUserDto, @Res() res ){
        try {
            const newUser = await this.userService.createUser(createUsersDto);
            return res.status(HttpStatus.CREATED).json({
                message: 'Document has been created successfully',
                newUser,
            });
        } catch (err) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'Error: User not created!',
            error: err.message,
        });
        }
    }

    @Get()
    async getUsers(@Res() response) {
        try {
            const UserData = await this.userService.getAllUsers();
            return response.status(HttpStatus.OK).json({
                message: 'All Users data fetch successfully',
                UserData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}
