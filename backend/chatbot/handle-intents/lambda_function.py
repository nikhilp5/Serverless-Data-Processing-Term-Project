# Author: Shubham Mishra

########################################################################################
#    Code Reference: LexRuntimeV2
#    Author: AWS
#    Availability: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/lexv2-runtime.html
########################################################################################/

# Define intent names
navigationIntent = 'NavigationIntent'
teamScoresIntent = 'TeamScoresIntent'

def lambda_handler(event, context):
    # Extract intent name and user input from the Lex event
    intent_name = event['sessionState']['intent']['name']
    user_input = event['inputTranscript'].lower()

    # Check the intent name and call the corresponding handler function
    if intent_name == navigationIntent:
        return handleNavIntent(user_input)

    if intent_name == teamScoresIntent:
        return handleTeamScoresIntent(user_input)


def handleNavIntent(user_input):
    # Define the base URL for navigation
    url = "http://"
    
    # Map user input to corresponding URLs
    dictionary = {
        'login': f'{url}login',
        'signup': f'{url}signup',
        'profile': f'{url}profile'
    }
    
    # Retrieve the URL from the dictionary based on user input
    if user_input in dictionary:
        response_str = dictionary[user_input]
    else:
        response_str = f'{user_input} not found.'
    
    # Prepare the response in Lex format
    response = {
        "sessionState": {
            "dialogAction": {
                "type": "Close"
            },
            "intent": {
                "name": "NavigationIntent",
                "state": "Fulfilled"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": response_str
            }
        ]
    }
    
    print("handleNavIntent==", response)
    
    return response


########################################################################################
#    Code Reference: DynamoDB
#    Author: AWS
#    Availability: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
########################################################################################/

def handleTeamScoresIntent(user_input):
    # Generate a response with the team score based on user input
    response_str = f'{user_input} score is 100'
    response = {
        "sessionState": {
            "dialogAction": {
                "type": "Close"
            },
            "intent": {
                "name": "NavigationIntent",
                "state": "Fulfilled"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": response_str
            }
        ]
    }
    
    return response
