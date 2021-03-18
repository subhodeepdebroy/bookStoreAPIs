const redis = require('redis')

const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})

client.on('connent', ()=>{
    console.log('Client connected to redis...');
})

client.on('end', ()=>{
    console.log('Client disconnected from redis...');
})

client.on('ready', ()=>{
    console.log('Client ready to be used...');
})

// process.on('SIGINT',()=>{
//     client.quit()
// })

// client.set()

module.exports = client;