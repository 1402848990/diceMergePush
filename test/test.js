const axios = require('axios');
const data = JSON.stringify({"text":{"content":"ok"},"senderNick":"王锐"});

const config = {
  method: 'post',
  url: 'http://localhost:8088/api/Ding/push',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

const postData = async ()=>{
  for (let i = 0; i < 201; i++) {
    console.log('i',i)
    await axios(config)
  }
}
// postData()



