const { default: axios } = require("axios");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkmubywdr",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  try {
    const { httpMethod, body } = event;
    if (httpMethod !== "POST") {
      return {
        statusCode: 302,
        body: `Please try a post Request!`,
      };
    }

    const { photoreference } = JSON.parse(body);
    console.log(photoreference);

    let baseurl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400`;
    baseurl += `&photoreference=${photoreference}`;
    baseurl += `&key=${process.env.GOOGLE_API_KEY}`;

    const data = await axios.get(baseurl);
    // console.log(data);

    // let bufferObj = Buffer.from(data);
    //  let base64String = data.toString("base64");

    // cloudinary.v2.uploader.upload(
    //   `data%3Aimage%2Fpng%3Bbase64%2C${base64String.replace("/", "%2F")}`,
    //   function (error, result) {
    //     console.log(result, error, "error");
    //     return error;
    //   }
    // );

    cloudinary.v2.uploader.upload(
      "https://lh3.googleusercontent.com/p/AF1QipNeeLZO2s4cJNEsD8LW_BaERzCqfKwYJpeXq78b=s1600-w400",
      function (error, result) {
        console.log(result, error);
      }
    );

    return {
      statusCode: 200,

      body: JSON.stringify(base64String),
    };
  } catch (e) {
    return {
      statusCode: 418,
      body: JSON.stringify(e),
    };
  }
};
