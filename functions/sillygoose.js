exports.handler = async (event) => {
  const name = event.queryStringParameters.name || "";
  return {
    statusCode: 200,
    body: `Hey there ${name}, you found me you thilly (Silly, but read as Mike Tyson) Goose`,
  };
};
