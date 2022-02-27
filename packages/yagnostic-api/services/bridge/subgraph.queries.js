const axios = require('axios').default;

const getTxToSend = (fromBlock, toBlock) => `{transfers:transferRequesteds(first:1000,where:{
    block_gte:${fromBlock}, block_lte:${toBlock},step:0
  }){
    from
    to
    amount
    signature
    id
    step
    transactionId
    block

  }
 }`;

const getTxToCheck = (transactionId, from) =>
  `{
  check:transferRequesteds(first:100, where:{transactionId:${transactionId},from:"${from.toLowerCase()}", step:1}){
    to
  }
 }`

const query = async (uri,q) => {
  try {
    const res = (await axios.post(uri,{ query: q }))?.data;
    return res
  }catch (e) {
    throw e;
  }
}

module.exports = {
  query,
  getTxToCheck,
  getTxToSend
}
