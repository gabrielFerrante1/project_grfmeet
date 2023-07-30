import JWT from "jsonwebtoken";
import { AuthUser } from "../types/Auth";
import { User } from "../models/User";
import { Request } from "express";

export const getUser = async (req: Request): Promise<AuthUser | null> => {
    if (req.headers.authorization) {
        const jwtUser = JWT.decode(req.headers.authorization.split(' ')[1]) as AuthUser;

        if (!jwtUser) return null;

        const user = await User.findOne({ where: { id: jwtUser.id } })

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }

    return null
}