import jwt from 'jsonwebtoken';
import { EntityManager } from 'typeorm';
import { User } from 'entities/User';

export const validateToken = (token: string) => {
    const user = jwt.verify(token, 'password') as { id: string };
    return user.id;
};

export const signUp = async (email: string, password: string, manager: EntityManager) => {
    const user = await manager.findOne(User, {
        email,
    });

    if (user) {
        throw 'User already exist';
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        await manager.save(newUser);
        return jwt.sign({ id: newUser.id }, 'password');
    }
};

export const login = async (email: string, password: string, manager: EntityManager) => {
    const user = await manager.findOne(User, {
        email,
    });

    if (user && password === user.password) {
        return jwt.sign({ id: user.id }, 'password');
    }
    throw 'Wrong user or password';
};
