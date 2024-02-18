import { Injectable, UsePipes } from '@nestjs/common';
import { CreateRoleRequestDto, UpdateRoleRequestDto } from './roles.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from 'src/mongodb/schemas/role.schema';
import { Model, Types } from 'mongoose';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { User, UserDocument } from 'src/mongodb';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('RoleService');
  }

  async createRole(createRoleDto: CreateRoleRequestDto) {
    try {
      const newRole = new this.roleModel(createRoleDto);
      return await newRole.save().then((user) => user.toObject());
    } catch (ex) {
      this.customLogger.logger(`Error in roles.service.createRole(): ${ex.message}`, ex);
      return null;
    }
  }

  async findAllRoles() {
    try {
      const allRoles = await this.roleModel.find().lean();
      return allRoles;
    } catch (ex) {
      this.customLogger.logger(`Error in roles.service.findAllRoles(): ${ex.message}`, ex);
      return null;
    }
  }

  async findRole(_id: Types.ObjectId) {
    try {
      const newRole = await this.roleModel.findOne({ _id }).lean();
      return newRole;
    } catch (ex) {
      this.customLogger.logger(`Error in roles.service.findRole(): ${ex.message}`, ex);
      return null;
    }
  }

  async updateRole(_id: Types.ObjectId, updateRoleDto: UpdateRoleRequestDto) {
    try {
      const updatedRole = await this.roleModel.findOneAndUpdate({ _id }, updateRoleDto, { new: true }).lean();
      return updatedRole;
    } catch (ex) {
      this.customLogger.logger(`Error in roles.service.updateRole(): ${ex.message}`, ex);
      return null;
    }
  }

  async removeRole(_id: Types.ObjectId) {
    const errorMessage = `Cannot delete a role that is used by one or more users.`;
    try {
      const role = await this.roleModel.findOne({ _id }).lean();
      if (role) {
        const users = await this.userModel.find({ companyId: role.companyId }).lean();
        const usersWithRole = users.filter((user) => user.roles.includes(_id));
        if (usersWithRole.length > 0) {
          throw new Error(errorMessage);
        }
        const newRole = await this.roleModel.findOneAndDelete({ _id }).lean();
        return newRole;
      } else {
        throw new Error(`Role not found.`);
      }
    } catch (ex) {
      this.customLogger.logger(`Error in roles.service.removeRole(): ${ex.message}`, ex);
      if (ex.message === errorMessage) {
        throw new Error(errorMessage);
      }
      return null;
    }
  }
}
