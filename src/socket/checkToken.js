import jwt from 'jsonwebtoken';
import {secret} from '../config';

export const checkToken = async (socket) => {
    try {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.replace("Bearer ", "");
        if(!token) throw new Error('Bạn chưa đăng nhập');
        const decoded = await jwt.verify(token, secret.jwt_key);
        return decoded.user.id;
    }catch (error) {
        console.log(error)
        delete error.expiredAt;
        error.message = "Token đã hết hạn"
        throw new Error(error);
    }
}