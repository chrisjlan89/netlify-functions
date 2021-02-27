const { default: axios } = require("axios");

exports.handler = async (event) => {
  console.log(event);
  const { httpMethod, body } = event;
  if (httpMethod !== "POST") {
    return {
      statusCode: 302,
      body: `Please try a post Request!`,
    };
  }
  const { fields, input, inputType } = JSON.parse(body);
  const inputtype = `inputtype=${inputType}`;
  const getfieldsstr = (fields) => `fields=${fields.join(",")}`;
  let baseurl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=`;
  baseurl += `${input.split(" ").join("%20")}&${inputtype}&${getfieldsstr(
    fields
  )}&key=${process.env.GOOGLE_API_KEY}`;

  encodeURI(baseurl);

  const { data } = await axios.get(baseurl);
  console.log(data);
  return {
    statusCode: 200,

    body: JSON.stringify(data),
  };
};
