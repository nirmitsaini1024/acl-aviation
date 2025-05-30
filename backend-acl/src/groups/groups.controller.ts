import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupService : GroupsService) {}

        @Post()
        async createGroup(@Body() createGroupDto : CreateGroupDto, @Res() res ){
            try {
                const newGroup = await this.groupService.createGroup(createGroupDto);
                return res.status(HttpStatus.CREATED).json({
                    message: 'Group has been created successfully',
                    newGroup,
                });
            } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Group not created!',
                error: err.message,
            });
            }
        }

        @Get()
        async getGroups(@Res() response) {
            try {
            const GroupData = await this.groupService.getAllGroups();
            return response.status(HttpStatus.OK).json({
                message: 'All Groups fetch successfully',
                GroupData,
            });
            } catch (err) {
            return response.status(err.status).json(err.response);
            }
        }
}
