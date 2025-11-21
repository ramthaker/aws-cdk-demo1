// D:\demos\cdk-demo1\lambda\items.js

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  return {
    
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda', event }),
  };
};