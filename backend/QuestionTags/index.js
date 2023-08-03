const AWS = require('aws-sdk');
const axios = require('axios');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Process the DynamoDB stream event
    const records = event.Records;

    // Assuming there's only one record in the stream for simplicity
    if (records.length === 1) {
      const record = records[0];
      if (record.eventName === 'INSERT') {
        // Get the data from the DynamoDB stream event
        const dynamoData = record.dynamodb.NewImage;
        console.log(dynamoData);

        // Extract values using the appropriate property for each data type
        const questionId = dynamoData.questionId.S;
        console.log("questionID: "+ questionId);
        const question = dynamoData.question.S;
        console.log("Question: "+question);

        // Send the fetched question to the REST API
        const apiUrl = 'https://us-central1-deep-way-391222.cloudfunctions.net/extractTags';
        const response = await axios.post(apiUrl, { question });
        const tags = response.data.tags;

        // Update the DynamoDB table with the retrieved tags
        const params = {
          TableName: 'Questions', // Replace 'Questions' with your actual table name
          Key: {
            questionId: questionId,
          },
          UpdateExpression: 'SET tags = :tags',
          ExpressionAttributeValues: {
            ':tags': tags,
          },
        };

        await dynamoDB.update(params).promise();
        console.log(`Updated question with ID ${questionID} with tags: ${tags}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing event' }),
    };
  }
};
