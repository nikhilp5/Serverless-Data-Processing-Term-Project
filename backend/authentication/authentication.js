const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.userId; 
  const answers = event.securityAnswers;

  const params = {
    TableName: 'security_questions',
    Key: {
      userId: userId,
    },
  };

  try {
    const response = await dynamodb.get(params).promise();
    const item = response.Item;

    if (!item) {
      // User not found in DynamoDB, write the answers for the user
      const putParams = {
        TableName: 'security_questions',
        Item: {
          userId: userId,
          securityAnswers: answers,
        },
      };

      await dynamodb.put(putParams).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Answers saved successfully', newUser: true }),
      };
    }

    const dbAnswers = item.securityAnswers;

    // Check if the answers match
    if (JSON.stringify(answers) === JSON.stringify(dbAnswers)) {
      // Answers match
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Answers match', newUser: false }),
      };
    } else {
      // Answers do not match
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Answers do not match', newUser: false  }),
      };
    }
  } catch (error) {
    console.error('Error fetching/putting answers in DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
