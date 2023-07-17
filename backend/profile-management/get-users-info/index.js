const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  const getAllUsersParams = {
    TableName: 'profile_info',
  };

  try {
    const allUsersData = await dynamodb.scan(getAllUsersParams).promise();

    if (allUsersData.Items && allUsersData.Items.length > 0) {
      const users = await Promise.all(
        allUsersData.Items.map(async (user) => {
          const { userId, name, email, contactNumber } = user;

          const imageKey = `${userId.S}.jpg`;
          const getObjectParams = {
            Bucket: 'serverless-profile-images',
            Key: imageKey,
          };

          try {
            const s3Object = await s3.getObject(getObjectParams).promise();
            const image = s3Object.Body.toString('base64');

            return {
              userId: userId.S,
              name: name.S,
              email: email.S,
              contactNumber: contactNumber.S,
              imageLink: `https://serverless-profile-images.s3.amazonaws.com/${userId.S}.jpg`,
            };
          } catch (error) {
            // Image not found in S3
            const defaultImage = 'https://serverless-profile-images.s3.amazonaws.com/profile.png';

            return {
              userId: userId.S,
              name: name.S,
              email: email.S,
              contactNumber: contactNumber.S,
              imageLink: defaultImage,
            };
          }
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(users),
      };
    } else {
      // No user profiles found
      return {
        statusCode: 404,
        body: 'No user profiles found',
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error retrieving user profiles',
    };
  }
}
