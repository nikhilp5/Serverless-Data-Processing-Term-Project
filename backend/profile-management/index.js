const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    console.log(event);
  // const { userId, , name, contactNumber } = JSON.parse(event.body);
  const userId = event.userId;
  const image = event.image;
  const name = event.name;
  const contactNumber = event.contactNumber;

  const getItemParams = {
    TableName: 'profile_info',
    Key: {
      userId: { S: userId },
    },
  };

  try {
    // Check if the user exists in the DynamoDB table
    const existingUser = await dynamodb.getItem(getItemParams).promise();

    if (existingUser.Item) {
      // User exists, update the details
      const updateItemParams = {
        TableName: 'profile_info',
        Key: {
          userId: { S: userId },
        },
        UpdateExpression: 'SET #img = :img, #name = :name, #contact = :contact',
        ExpressionAttributeNames: {
          '#img': 'image',
          '#name': 'name',
          '#contact': 'contactNumber',
        },
        ExpressionAttributeValues: {
          ':img': { S: image },
          ':name': { S: name },
          ':contact': { S: contactNumber },
        },
      };

      await dynamodb.updateItem(updateItemParams).promise();
    } else {
      // User doesn't exist, add a new entry
      const putItemParams = {
        TableName: 'profile_info',
        Item: {
          userId: { S: userId },
          image: { S: image },
          name: { S: name },
          contactNumber: { S: contactNumber },
        },
      };

      await dynamodb.putItem(putItemParams).promise();
    }

    return {
      statusCode: 200,
      body: 'User information saved successfully',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error saving user information',
    };
  }
};
