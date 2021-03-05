const { default: axios } = require("axios");

exports.handler = async (event) => {
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

    const placesProxyResponse = await axios.post(
      `https://api.chrislantier.com/.netlify/functions/placesid`,
      {
        input: input,
        inputType: inputType,
        fields,
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
