const axios = require('axios');
const slackbot = require('../setup/slackbot');

let year = new Date().getFullYear()

const instance = axios.create({
  baseURL: process.env.BASE_URL,
});

instance.interceptors.response.use(response => {
  return response;
 }, error => {
   console.log(error.response);
  if(process.env.ENVIRONMENT === 'PROD') {
    slackbot.sendMessage(`
    Axios error!
    Status: ${error.response.status}
    Message: ${error.response.statusText}
    path: ${error.response.request.path}
    `)
  }
  return Promise.reject(error)
 });

exports.getDrivers = async () => {
  try {
    const response = await instance.get(`${year}/drivers.json`)
    return response.data.MRData
  } catch (err) {
    console.log(err);
  }
}

exports.getRaces = async () => {
  try {
    console.log(year);
    const response = await instance.get('current.json')
    return response.data.MRData
  }
  catch(err) {
    console.log(err);
  }
}

exports.getRaceResults = async (round) => {
  try {
    const response = await instance.get(`${year}/${round}/results.json`)
    return response.data.MRData
  } catch (err) {
    console.log(err);
  }
}

exports.getQualifyingResults = async (round) => {
  try {
    const response = await instance.get(`${year}/${round}/qualifying.json`)
    return response.data.MRData
  } catch (err) {
    console.log(err);
  }
}

exports.getSprintResults = async (round) => {
  try {
    const response = await instance.get(`${year}/${round}/qualifying.json`)
    return response.data.MRData
  } catch (err) {
    console.log(err);
  }
}

exports.getConstructors = async (round) => {
  try {
    const response = await instance.get(`${year}/constructors.json`)
    return response.data.MRData
  } catch (err) {
    console.log(err);
  }
}