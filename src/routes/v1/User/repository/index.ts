import {  UserDocument, UserModel } from '../../../../models/user';
import { User } from '../../../../types/user';

export const createUserRepo = (userData: User): Promise<UserDocument> => {
  const user = new UserModel(userData);
  return user.save();
};

export const getAllUsers = (): Promise<UserDocument[]> => {
  return UserModel.find({}).select('-password');
};

export const getUserByEmail = (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email: email });
};

export const getUserById = (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};

export const getAllUsersNameID = async (): Promise<{ key: string, value: string }[]> => {
  const users = await UserModel.aggregate([
    {
      $project: {
        _id: { $toString: '$_id' },
        name: 1
      }
    }
  ]);

  const result: { key: string, value: string }[] = users.map(user => ({ key: user.name, value: user._id }));

  return result;
};
