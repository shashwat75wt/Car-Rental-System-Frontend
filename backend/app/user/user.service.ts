
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { createUserTokens } from "../common/services/passport-jwt.service";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IGroup } from "../group/group.dto";


/**
 * Logs in a user by verifying credentials and generating access tokens.
 * @param {Object} data - Login credentials.
 * @param {string} data.email - User email.
 * @param {string} data.password - User password.
 * @returns {Promise<Object>} - Access and refresh tokens.
 * @throws {Error} - If user is not found.
 */
export const login = async (data: { email: string; password: string }) => {
    const user = await getUserByEmail(data.email);
    if (user) {
      //type Guard
      const { password, ...userWithoutPassword } = user;
      const tokens = createUserTokens(userWithoutPassword);
      await UserSchema.findByIdAndUpdate(
        user._id,
        { refreshToken: tokens.refreshToken },
        { new: true }
      );
  
      return tokens;
    } else {
      throw new Error("User not found");
    }
  };
  

export const createUser = async (data: IUser) => {
    const result = await UserSchema.create({ ...data, active: true });
    return result.toObject();
};

export const updateUser = async (id: string, data: IUser) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
};
export const getUserByEmail = async (email: string, withPassword = false) => {
    if (withPassword) {
        const result = await UserSchema.findOne({ email }).select('+password').lean();
        return result;
    }
    const result = await UserSchema.findOne({ email }).lean();
    return result;


}


/**
 * Refreshes access tokens using a refresh token.
 * @param {string} refreshToken - Refresh token.
 * @returns {Promise<Object>} - New access and refresh tokens.
 * @throws {Error} - If refresh token is invalid or user not found.
 */
export const refreshToken = async (refreshToken: string) => {
    // console.log(`Refreshing token: ${refreshToken}`);
    const jwtRefreshSecret = process.env.JWT_SECRET ?? "";
  
    if (!jwtRefreshSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
  
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as JwtPayload;
  
    if (!decoded || !decoded._id) {
      throw new Error("Invalid refresh token");
    }
  
    const user = await UserSchema.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }
  
    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }
    const { password, ...userWithoutPassword } = user;
    const tokens = createUserTokens(userWithoutPassword);
  
    await UserSchema.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });
  
    return tokens;
  };

/**
 * Logs out a user by clearing the refresh token.
 * @param {Omit<IUser, "password">} data - User data without password.
 * @returns {Promise<void>} - Resolves when logout is complete.
 */
export const logout = async (data: Omit<IUser, "password">) => {
    // console.log(data);
    await UserSchema.findByIdAndUpdate(data._id, { refreshToken: null });
    return;
  };

  /**
 * Adds a user to a group, ensuring no duplicates.
 * @param {string} userId - User ID.
 * @param {string} groupId - Group ID.
 * @returns {Promise<void>} - Resolves when update is complete.
 */
export const updateUserGroup = async (userId: string, groupId: string) => {
  await UserSchema.findByIdAndUpdate(
    userId,
    { $addToSet: { groups: groupId } }, //ensure no duplicacy
    { new: true }
  );
};

  /**
 * Removes the specified group ID from each member's list of groups.
 * @param {IGroup} group - The group object containing member IDs.
 * @returns {Promise<void>} - Resolves when the operation is complete.
 */
export const removeGroupIdFromEachMember = async (group: IGroup) => {
  await UserSchema.updateMany(
    { _id: { $in: group.members } }, // Find all users who are members of the group
    { $pull: { groups: group._id } } // Remove the group ID from their list of groups
  );
};

