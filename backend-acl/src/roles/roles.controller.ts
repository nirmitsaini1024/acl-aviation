import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      const newRole = await this.roleService.createRole(createRoleDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Role has been created successfully',
        newRole,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Role not created!',
        error: err.message,
      });
    }
  }

  @Get()
  async getAllRoles(@Res() res) {
    try {
      const roleData = await this.roleService.getAllRoles();
      return res.status(HttpStatus.OK).json({
        message: 'All roles fetched successfully',
        roleData,
      });
    } catch (err) {
      return res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: 'Error: Cannot fetch roles!',
        error: err.message,
      });
    }
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string, @Res() res) {
    try {
      const role = await this.roleService.getRoleById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Role fetched successfully',
        role,
      });
    } catch (err) {
      return res.status(err.status || 404).json({
        statusCode: err.status || 404,
        message: 'Error: Role not found!',
        error: err.message,
      });
    }
  }

  @Patch(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res,
  ) {
    try {
      const updatedRole = await this.roleService.updateRole(id, updateRoleDto);
      return res.status(HttpStatus.OK).json({
        message: 'Role updated successfully',
        updatedRole,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Role not updated!',
        error: err.message,
      });
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string, @Res() res) {
    try {
      await this.roleService.deleteRole(id);
      return res.status(HttpStatus.OK).json({
        message: 'Role deleted successfully',
      });
    } catch (err) {
      return res.status(err.status || 400).json({
        statusCode: err.status || 400,
        message: 'Error: Role not deleted!',
        error: err.message,
      });
    }
  }
}
