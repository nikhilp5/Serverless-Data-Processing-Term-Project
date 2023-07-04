const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  const functionName = event.functionName;
  if (functionName === 'updateProfile') {
    return updateProfile(event)
  } else if (functionName === 'getProfile') {
    return getProfile(event)
  }

};

async function updateProfile(event) {
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
      Body: Buffer.from(image, 'base64'),
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

async function getProfile(event) {
  const { userId } = event;

  const getItemParams = {
    TableName: 'profile_info',
    Key: {
      userId: { S: userId },
    },
  };

  try {
    const userProfile = await dynamodb.getItem(getItemParams).promise();

    if (userProfile.Item) {
      // User profile found
      const { name, contactNumber } = userProfile.Item;

      // Get the image from S3
      const imageKey = `${userId}.jpg`;
      const getObjectParams = {
        Bucket: 'serverless-profile-images',
        Key: imageKey,
      };

      try {
        const s3Object = await s3.getObject(getObjectParams).promise();
        const image = s3Object.Body.toString('base64');

        return {
          statusCode: 200,
          body: JSON.stringify({
            name: name.S,
            contactNumber: contactNumber.S,
            image: `https://serverless-profile-images.s3.amazonaws.com/${userId}.jpg`,
          }),
        };
      } catch (error) {
        // Image not found in S3
        const defaultImage = 'https://serverless-profile-images.s3.amazonaws.com/profile.png';
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            name: name.S,
            contactNumber: contactNumber.S,
            image: defaultImage,
          }),
        };
      }
    } else {
      // User profile not found
      return {
        statusCode: 404,
        body: 'User profile not found',
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error retrieving user profile',
    };
  }
}

