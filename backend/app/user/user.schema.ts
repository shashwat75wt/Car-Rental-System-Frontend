
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { type IUser } from "./user.dto";

const Schema = mongoose.Schema;

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
};

const UserSchema = new Schema<IUser>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        active: { type: Boolean, required: false, default: true },
        role: { type: String, required: true, enum: ["USER", "ADMIN"], default: "USER" },
        password: { type: String, required: true, select: false },
        refreshToken: { type: String, default:null },

}, { timestamps: true });

UserSchema.pre("save", async function (next) {
        if (this.password) {
                this.password = await hashPassword(this.password);
        }
        next();
});

export default mongoose.model<IUser>("user", UserSchema);
