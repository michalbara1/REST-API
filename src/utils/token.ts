import jwt from 'jsonwebtoken';

export const createToken = async (data: object,expires: string): Promise<string> => {
    const token = await jwt.sign(data, process.env.JWT_SECRET_KEY as string, {
        expiresIn: expires,
    });
    return token;
};