import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentRepoAccess } from '../schemas/document-repo.schema';

@Injectable()
export class DocumentRepoService {
  constructor(
    @InjectModel('DocumentRepoAccess')
    private documentRepoModel: Model<DocumentRepoAccess>,
  ) {}

  async createDocumentRepo(documentRepoData: DocumentRepoAccess): Promise<DocumentRepoAccess> {
    const newDocumentRepo = new this.documentRepoModel(documentRepoData);
    return newDocumentRepo.save();
  }

  async getAllDocumentRepos(): Promise<DocumentRepoAccess[]> {
    return this.documentRepoModel.find().exec();
  }
} 