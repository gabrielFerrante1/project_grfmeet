import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv'
import { getUser } from '../utils/auth';

dotenv.config()

export const register = async (req: Request, res: Response) => {
    let { email, password, name } = req.body;

    if (name && email && password) {
        let hasUser = await User.findOne({ where: { email } });
        if (!hasUser) {
            let newUser = await User.create({ name, email, password });

            const token = JWT.sign(
                { id: newUser.id, name: newUser.name, email: newUser.email },
                process.env.JWT_SCRET_KEY as string,
                { expiresIn: 2 }
            );

            res.status(201);
            res.json({ error: '', user: { id: newUser.id, name: newUser.name, email: newUser.email, token } });
            return;

        } else {
            res.json({ error: 'E-mail já existe.' });
            return;
        }
    }

    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    let email: string = req.body.email;
    let password: string = req.body.password;

    if (!email || !password) res.json({ error: 'validators_error' });

    let user = await User.findOne({
        where: { email, password }
    });

    if (!user) {
        res.json({ error: 'Email e(ou) senha incorreto(s)' });
        return;
    }

    const token = JWT.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SCRET_KEY as string,
        { expiresIn: 2 }
    );

    res.json({ error: '', user: { id: user.id, name: user.name, email: user.email, token } });
}

export const verifyJWT = async (req: Request, res: Response) => {
    const user = await getUser(req);

    if (user != null) {
        res.json({
            error: "",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })

        return;
    }

    res.json({ error: "not_authenticated" })
}