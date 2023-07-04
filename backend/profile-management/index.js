const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  const { userId, image, name, contactNumber } = event;

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
        UpdateExpression: 'SET #name = :name, #contact = :contact',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#contact': 'contactNumber',
        },
        ExpressionAttributeValues: {
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
          name: { S: name },
          contactNumber: { S: contactNumber },
        },
      };

      await dynamodb.putItem(putItemParams).promise();
    }

    // Upload the image to S3
    const uploadParams = {
      Bucket: 'serverless-profile-images',
      Key: `${userId}.jpg`,
      Body: image,
    };

    await s3.upload(uploadParams).promise();

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
