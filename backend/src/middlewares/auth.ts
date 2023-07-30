import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUser } from '../utils/auth';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false;

        const user = await getUser(req);

        if (user != null) success = true;

        if (success) {
            next();
        } else {
            res.status(403);
            res.json({ error: 'not_authenticated' });
        }
    }
}