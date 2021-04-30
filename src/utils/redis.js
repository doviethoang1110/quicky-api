import redis from 'redis';
import { redis_config } from '../config';
const { promisify } = require("util");

const client = redis.createClient({
    host: redis_config.host,
    port: redis_config.port,
    password: redis_config.password
});

// client.keys('*', function (err, keys) {
//     if (err) return console.log(err);
//
//     for (var i = 0, len = keys.length; i < len; i++) {
//         console.log(keys[i])
//         client.getAsync(`${keys[i]}`).then(r => console.log('aaa',r));
//     }
// });

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);
client.delAsync = promisify(client.del).bind(client);


client.on("connect", () => console.log("Redis connected"));

client.on("ready", () => console.log("Redis ready to use"));

client.on("end", () => console.log("Redis ended"));

client.on("error", (error) => console.error(error));

export default client;