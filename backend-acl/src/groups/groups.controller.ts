import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards, Headers } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
    constructor(private readonly groupService: GroupsService) {}

    @Get()
    async getGroups(@Res() res: Response, @Headers() headers: any) {
        try {
            const groupData = await this.groupService.getAllGroups();
            return res.status(HttpStatus.OK).json({
                message: 'All groups fetched successfully',
                groupData,
            });
        } catch (err) {
            console.error('Error fetching groups:', err);
            return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error: Cannot fetch groups!',
                error: err.message,
            });
        }
    }

    @Post()
    async createGroup(@Body() createGroupDto: CreateGroupDto, @Res() res: Response) {
        try {
            const newGroup = await this.groupService.createGroup(createGroupDto);
            return res.status(HttpStatus.CREATED).json({
                message: 'Group has been created successfully',
                newGroup,
            });
        } catch (err) {
            console.error('Error creating group:', err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Group not created!',
                error: err.message,
            });
        }
    }
}
