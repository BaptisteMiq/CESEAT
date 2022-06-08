import { model, Schema } from "mongoose";

// Interface representing the document in MongoDB
export interface IUser {
    name: string;
    email: string;
    avatar: string;
}

// Schema corresponding to the document interface
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    avatar: {
        type: String,
        required: true,
    },
});

export const UserModel = model<IUser>("User", userSchema);