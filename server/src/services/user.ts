import argon2 from "argon2";
import { Service } from "typedi";
import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import {
  IUpdateUserExistingPasswordPayload,
  IUpdateUserPayload,
  IUser,
  ISetUserNewPasswordPayload,
  Context,
} from "../interfaces";
import { userExistingPasswordUpdateSchema, userNewPasswordUpdateSchema, userSchema } from "../schema";
import { utils } from "../utils";

@Service()
export class UserService {
  public async updateUser(payload: IUpdateUserPayload, context: Context) {
    const { user } = context;
    const cleanPayload: IUpdateUserPayload = utils.clean(payload);
    const data: IUpdateUserPayload = await userSchema.validateAsync(cleanPayload);

    if (data.email && data.email !== user!.email) {
      const user = await prisma.user.findFirst({ where: { email: data.email } });

      if (user) {
        throw new ApiError("User email address already exists", 409);
      }
    }

    const update = await prisma.user.update({ where: { id: user!.id }, data: { ...cleanPayload, ...data } });
    return {
      name: update.name,
      email: update.email,
      address: update.address,
      hasPassword: !!update.password ? true : false,
    };
  }

  public async updateUserPassword(
    payload: ISetUserNewPasswordPayload & IUpdateUserExistingPasswordPayload,
    context: Context
  ) {
    const { user } = context;
    const cleanPayload = utils.clean(payload);
    let data: IUpdateUserExistingPasswordPayload & ISetUserNewPasswordPayload;
    if (user!.password) {
      data = await userExistingPasswordUpdateSchema.validateAsync(cleanPayload);

      if (await argon2.verify(user!.password, data.newPassword)) {
        throw new ApiError("New password cannot be the same as new password", 400);
      }

      if (!(await argon2.verify(user!.password, data.oldPassword))) {
        throw new ApiError("Old password is not correct", 400);
      }
    } else {
      data = await userNewPasswordUpdateSchema.validateAsync(cleanPayload);
      if (data.newPassword !== data.repeatPassword) {
        throw new ApiError("Repeated Password does not match the new password", 400);
      }
    }

    const hash = await argon2.hash(data.newPassword);
    const update = await prisma.user.update({ where: { id: user!.id }, data: { password: hash } });

    return { name: update.name, email: update.email, address: update.address, hasPassword: true };
  }
}
