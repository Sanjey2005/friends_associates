import jwt from 'jsonwebtoken';

const JWT_SECRET_USER = process.env.JWT_SECRET_USER;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

if (!JWT_SECRET_USER || !JWT_SECRET_ADMIN) {
    throw new Error('Please define JWT_SECRET_USER and JWT_SECRET_ADMIN in .env.local');
}

export const signUserToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET_USER, { expiresIn: '7d' });
};

export const verifyUserToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET_USER);
    } catch (error) {
        return null;
    }
};

export const signAdminToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET_ADMIN, { expiresIn: '1d' });
};

export const verifyAdminToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET_ADMIN);
    } catch (error) {
        return null;
    }
};
