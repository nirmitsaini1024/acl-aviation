import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentRepoService } from '../services/document-repo.service';
import { CreateDocumentRepoDto } from '../dto/create-document-repo.dto';

@Controller('document-repo')
export class DocumentRepoController {
  constructor(private readonly documentRepoService: DocumentRepoService) {}

  @Post()
  async createDocumentRepo(@Body() createDocumentRepoDto: CreateDocumentRepoDto, @Res() res: Response) {
    try {
      const newDocumentRepo = await this.documentRepoService.createDocumentRepo(createDocumentRepoDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Document repo access has been created successfully',
        newDocumentRepo,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Document repo access not created!',
        error: err.message,
      });
    }
  }

  @Get()
  async getAllDocumentRepos(@Res() res: Response) {
    try {
      const documentRepos = await this.documentRepoService.getAllDocumentRepos();
      return res.status(HttpStatus.OK).json({
        message: 'All document repo accesses fetched successfully',
        documentRepos,
      });
    } catch (err) {
      return res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: 'Error: Cannot fetch document repo accesses!',
        error: err.message,
      });
    }
  }
} 