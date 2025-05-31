import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantsService } from './tenants.service';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantService: TenantsService) {}

  @Post()
  async createTenant(@Body() createTenantDto: CreateTenantDto, @Res() res) {
    try {
      const newTenant = await this.tenantService.createTenant(createTenantDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Tenant has been created successfully',
        newTenant,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Tenant not created!',
        error: err.message,
      });
    }
  }

  @Get()
  async getAllTenants(@Res() res) {
    try {
      const tenants = await this.tenantService.getAllTenants();
      return res.status(HttpStatus.OK).json({
        message: 'All tenants fetched successfully',
        tenants,
      });
    } catch (err) {
      return res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: 'Error: Cannot fetch tenants!',
        error: err.message,
      });
    }
  }

  @Delete(':id')
  async deleteTenant(@Param('id') id: string, @Res() res) {
    try {
      const result = await this.tenantService.deleteTenant(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(err.status || 404).json({
        statusCode: err.status || 404,
        message: 'Error: Tenant not deleted!',
        error: err.message,
      });
    }
  }
}
