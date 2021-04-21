import client from "../utils/redis";
import REPOSITORY from '../repositories';
import {relationships} from '../models';

const friendRequest = (socket, users) => {
    socket.on("SEND_ADD_FRIEND_REQUEST", async ({sender, receiver}) => {
        try {
            const unique = await REPOSITORY.findOne(relationships, {
                where: {
                    senderId: sender.id,
                    receiverId: receiver
                },
                attributes: ['id']
            });
            if (!unique) {
                const result = await REPOSITORY.create(relationships, {
                    senderId: sender.id,
                    receiverId: receiver,
                    userActionId: sender.id
                });
                const found = await client.getAsync(`${receiver}`);
                if (found) socket.to(found).emit("RECEIVED_ADD_FRIEND_REQUEST", {
                    id: sender.id,
                    name: sender.name,
                    status: result.status,
                    userActionId: result.userActionId
                });
            } else throw new Error(socket.request.__("exist"))
        } catch (error) {
            console.log(error);
            socket.emit("FAILURE", error.message);
        }
    });

    socket.on("REMOVE_ADD_FRIEND_REQUEST", async ({sender, receiver}) => {
        try {
            const found = await REPOSITORY.findOne(relationships, {
                where: {
                    senderId: sender.id,
                    receiverId: receiver
                },
                attributes: ['id']
            });
            if (found) {
                await REPOSITORY.destroy(relationships, {
                    where: {
                        senderId: sender.id,
                        receiverId: receiver
                    }
                });
                const foundSocket = await client.getAsync(`${receiver}`);
                if (foundSocket) socket.to(foundSocket).emit("REMOVE_ADD_FRIEND_REQUEST_SUCCESS", {
                    id: sender.id,
                    name: sender.name,
                    status: null,
                    userActionId: null
                });
            } else throw new Error(socket.request.__("exist"))
        } catch (error) {
            console.log(error);
            socket.emit("FAILURE", error.message);
        }
    });

    socket.on("ACCEPT_ADD_FRIEND_REQUEST", async ({sender, receiver}) => {
        try {
            const found = await REPOSITORY.findOne(relationships, {
                where: {
                    senderId: sender,
                    receiverId: receiver.id
                },
                attributes: ['id']
            });
            if (found) {
                await REPOSITORY.update(relationships, {
                    status: 3,
                    userActionId: receiver.id
                }, {
                    where: {
                        senderId: sender,
                        receiverId: receiver.id
                    }
                });
                const foundSocket = await client.getAsync(`${sender}`);
                if (foundSocket) socket.to(foundSocket).emit("ACCEPT_ADD_FRIEND_REQUEST_SUCCESS", {
                    id: receiver.id,
                    name: receiver.name,
                    status: 3,
                    userActionId: receiver.id
                });
            } else throw new Error(socket.request.__("exist"))
        } catch (error) {
            console.log(error);
            socket.emit("FAILURE", error.message);
        }
    });

}

export default friendRequest;