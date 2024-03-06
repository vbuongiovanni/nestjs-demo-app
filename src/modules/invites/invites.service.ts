import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateInviteRequestDto, CreateWelcomeAboardInviteRequestDto, UpdateInviteRequestDto } from './invites.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invite, InviteDocument } from 'src/mongodb';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { TQuery } from 'src/common/types/query';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Invite.name) private readonly inviteModel: Model<InviteDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('InvitesService');
  }
  async createInvite(createInviteBody: CreateInviteRequestDto | CreateWelcomeAboardInviteRequestDto) {
    try {
      const link = randomUUID();
      const newCompany = new this.inviteModel({ ...createInviteBody, link });
      return await newCompany.save().then((doc) => doc.toObject());
    } catch (ex) {
      this.customLogger.logger(`Error in invites.service.createInvite(): ${ex.message}`, ex);
      return null;
    }
  }
  async findAllInvitesAdmin() {
    try {
      return await this.inviteModel.find().lean();
    } catch (ex) {
      this.customLogger.logger(`Error in invites.service.findAllInvites(): ${ex.message}`, ex);
      return null;
    }
  }
  async findAllInvites(query: TQuery) {
    try {
      return await this.inviteModel.find(query).lean();
    } catch (ex) {
      this.customLogger.logger(`Error in invites.service.findAllInvites(): ${ex.message}`, ex);
      return null;
    }
  }
  async findInvite(query: { _id?: Types.ObjectId; companyId?: Types.ObjectId; link?: string }) {
    try {
      return await this.inviteModel.findOne(query).lean();
    } catch (ex) {
      this.customLogger.logger(`Error in invites.service.findInvite(): ${ex.message}`, ex);
      return null;
    }
  }
  async updateInvite(query: TQuery, updateInviteBody: UpdateInviteRequestDto) {
    try {
      const updateCompany = await this.inviteModel.findOneAndUpdate(query, updateInviteBody, { new: true }).lean();
      return updateCompany;
    } catch (ex) {
      this.customLogger.logger(`Error in invites.service.updateInvite(): ${ex.message}`, ex);
      return null;
    }
  }
}
