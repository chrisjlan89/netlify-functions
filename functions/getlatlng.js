const axios = require("axios");

exports.handler = async (event, context) => {
  const { address = "26 Fleetwood Drive Hazlet NJ 07730" } = event;
  const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&`;
  const url = baseUrl + `key=${process.env.GOOGLE_API_KEY}`;

  const response = await axios.get(url);
  const helloResponse = await axios.get(
    `http://localhost:8888/.netlify/functions/hello`
  );
  console.log(helloResponse);
  return {
    statusCode: 200,
    body: JSON.stringify(response.data),
  };
};
