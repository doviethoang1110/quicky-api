import client from "../utils/redis";
import REPOSITORY from '../repositories';
import { relationships } from '../models';

const friendRequest = (socket,users) => {
    socket.on("SEND_ADD_FRIEND_REQUEST", async ({sender, receiver}) => {
        try {
            await REPOSITORY.create(relationships, {senderId: sender.id, receiverId: receiver, userActionId: sender.id});
            const found = await client.getAsync(`${receiver}`);
            console.log('vào',found)
            if(found) socket.to(found).emit("RECEIVED_ADD_FRIEND_REQUEST", sender)
        }catch (error) {
            console.log(error);
            socket.emit("FAILURE", "Có lỗi xảy ra");
        }
    });

}

export default friendRequest;