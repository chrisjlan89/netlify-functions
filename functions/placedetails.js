const { default: axios } = require("axios");

exports.handler = async (event) => {
  const { httpMethod, body } = event;
  if (httpMethod !== "POST") {
    return {
      statusCode: 302,
      body: `Please try a post Request!`,
    };
  }
  const { fields, input, inputType, detailsFields } = JSON.parse(body);

  const placesProxyResponse = await axios.post(
    `http://api.chrislantier.com/.netlify/functions/placesid`,
    {
      input: input,
      inputType: inputType,
      fields,
      detailsFields,
    }
  );
  const relevant_data = placesProxyResponse.data.candidates[0];
  const place_id = relevant_data.place_id;

  const getfieldsstr = (fields) => `fields=${fields.join(",")}`;
  let baseurl = `https://maps.googleapis.com/maps/api/place/details/json?`;

  baseurl += `place_id=${place_id}`;
  baseurl += `&${getfieldsstr(detailsFields)}`;
  baseurl += `&key=${process.env.GOOGLE_API_KEY}`;

  encodeURI(baseurl);

  console.log(baseurl);

  const { data } = await axios.get(baseurl);
  c;
  return {
    statusCode: 200,

    body: JSON.stringify({
      ...relevant_data,
      ...data.result,
    }),
  };
};
