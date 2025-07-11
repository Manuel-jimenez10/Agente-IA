import axios from 'axios';

async function createLongAccessToken() {

    const appId = "1140085761151002"
    const appSecret = "9348f606b5cc8f6bf308f7ded3d819e0"
    const accessToken = "EAAQM5ubOkBoBOZBI51ZBFGZBikOe3T33QyMMMwLQndzVRFfUzDAus0mRa89VbtHbiwR2yNFODPqiryySxAwTQyGLqlCCgi84hNkbXppwMZA2BRDXiU6UhJ3UTqFon1dr8B61MwsgjQOlFYyJCZCQGTARaLSRZAU7Pid57Rmj5wZCzh6aJrsb7TOMG4L4FDFZB0HC0S6mCcwd57L2cDi79Nk1eqfEynrDsv3cEZBGEz7lQgkEZBHgZDZD"

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
  

  const appId = "1140085761151002"
  const appSecret = "9348f606b5cc8f6bf308f7ded3d819e0"
  const appToken = `${appId}|${appSecret}`; 

  const accessToken = "EAAQM5ubOkBoBO2Odawi8LJRmAZAZB1I7LgZBSdgZCdL17cS3E5Csj1wQgmAiVekL8PEKgs6MqbWhVTSbHe8Kl6G0j2MmZCS65Bw1NcUTprDDEzbTGkhWAyNv4JEIdc5w7qiMZBR7sMUYO3aD8utNz6JbCQ5VQKZCpWx1zqQsOntO6dnB3Viazar17cDa7hTVe4F"

  const response = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: {
          input_token: accessToken,
          access_token: appToken
      }
  });

  console.log(response.data.data)

}

createLongAccessToken();
//checkTokenExpiration()