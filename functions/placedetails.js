const { default: axios } = require("axios");
require("dotenv").config();

exports.handler = async (event) => {
  console.log("???");
  try {
    const { httpMethod, body } = event;
    if (httpMethod !== "POST") {
      return {
        statusCode: 302,
        body: `Please try a post Request!`,
      };
    }

    const defaultFields = [
      "place_id",
      "user_ratings_total",
      "name",
      "formatted_address",
    ];
    const defaultDetailsFields = [
      "rating",
      "price_level",
      "opening_hours",
      "photo",
      "icon",
      "business_status",
    ];
    const {
      fields = defaultFields,
      input,
      inputType,
      detailsFields = defaultDetailsFields,
    } = JSON.parse(body);
    console.log(process.env);
    const placesProxyResponse = await axios.post(
      process.env.PLACE_ID_ENDPOINT,
      {
        input: input,
        inputType: inputType,
        fields,
      }
    );
    const relevant_data = placesProxyResponse.data.candidates[0];
    const place_id = relevant_data.place_id;
    console.log("placeid", place_id);
    const getfieldsstr = (fields) => `fields=${fields.join(",")}`;
    let baseurl = `https://maps.googleapis.com/maps/api/place/details/json?`;

    baseurl += `place_id=${place_id}`;
    baseurl += `&${getfieldsstr(detailsFields)}`;
    baseurl += `&key=${process.env.GOOGLE_API_KEY}`;

    encodeURI(baseurl);

    const { data } = await axios.get(baseurl);

    return {
      statusCode: 200,

      body: JSON.stringify({
        ...relevant_data,
        ...data.result,
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 200,

      body: JSON.stringify(e),
    };
  }
};
