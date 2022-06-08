import { IUser, UserModel } from "../models/UserModel";

export default class UserResolver {
    async users(): Promise<IUser[]> {
        const users = await UserModel.find();
        return users;
    }

    async createUser({ user }: { user: IUser }): Promise<IUser> {
        const userCreated = await UserModel.create(user);
        return userCreated;
    }
}
