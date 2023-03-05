import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

import { User, UserDocument } from "src/user/schemas/user.schema";
import { EditUserDto } from "./dto/edit-user.dto";
import { EditUserAvatarDto } from "./dto/edit-userAvatar.dto";

@Injectable()
export class EditUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  // update user name and surname
  async updateNameByEmail(
    userEmail: string,
    dto: EditUserDto
  ): Promise<{ firstName: string; lastName: string }> {
    const updateUser = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { ...dto },
      { new: true }
    );

    if (!updateUser) throw new NotFoundException();
    return { firstName: updateUser.firstName, lastName: updateUser.lastName };
  }

  // get user info
  async findByEmail(userEmail: string): Promise<{
    firstName: string;
    lastName: string;
    avatar: string;
    id: ObjectId;
  }> {
    const user = await this.userModel.findOne({ userEmail }).exec();
    if (!user) throw new NotFoundException();

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      id: user._id,
    };
  }

  // upload avatar
  async updateAvatarByEmail(
    userEmail: string,
    dto: EditUserAvatarDto
  ): Promise<string> {
    const user = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { ...dto },
      { new: true }
    );

    if (!user) throw new NotFoundException();
    return user.avatar;
  }
}
