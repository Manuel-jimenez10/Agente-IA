import axios from 'axios';

async function createLongAccessToken() {

    const appId = "1418274882800949"
    const appSecret = "4431ed251c1ec0274e61a773e38d8ef8"
    const accessToken = "EAAUJ6dqVTTUBPeJMa5U0Bd3rEOsH0IT2NgHUVcMJjN3352J7ZBv8UeZAj4O6ugbVeNGkPlYsZBHo0zUV207xPyOZCwx0s60N4D6HZASqxnjUmCPFcKDoe5Sj3z2p0NunJzWyA5sJEb3SQ69p8w98jr81vKNBmss00dxFGumASIFlmRZBM2ZCKESTzNOV2Y6xT9Eq0nI2mvWoFV2KOAwo1kJZAv8XXt7JU6CtkfxQuJ4uOc9XJQZDZD"

    const response = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: accessToken
      }
    });
    
    console.log( response.data.access_token )

    process.exit(1) 

}

async function checkTokenExpiration() {
  

  const appId = "1418274882800949"
  const appSecret = "4431ed251c1ec0274e61a773e38d8ef8"
  const appToken = `${appId}|${appSecret}`; 

  const accessToken = "EAAUJ6dqVTTUBPbzQjHPn5fJgyHUmYhr2aFKZCj8O60KYZA3vrr7gxZBmwmcjWSw6c79dUWKeTpKdJ9qmIHoDSh1HLgcZBp8SEklLaCZCZACNUc3CIYubaOiyZAo9T0SfZAOkt1TyAiOwrh7hBb84mSHfgplm0gzOQd3yxP9EVMhW6noolv3CAxZCtfOQX3XqUTweg"

  const response = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: {
          input_token: accessToken,
          access_token: appToken
      }
  });

  console.log(response.data.data)

}

//createLongAccessToken();
checkTokenExpiration()