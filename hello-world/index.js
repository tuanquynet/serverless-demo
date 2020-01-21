
exports.handler = async () => {
  console.log('hello world');

  return {
    statusCode: 200,
    body: 'Hello world',
  };
};
