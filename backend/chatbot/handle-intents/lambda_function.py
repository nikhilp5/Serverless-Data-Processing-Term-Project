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

    # Check the intent name and call the corresponding handler function
    if intent_name == navigationIntent:
        return handleNavIntent(event)

    if intent_name == teamScoresIntent:
        return handleTeamScoresIntent(event)


def handleNavIntent(event):
    # Define the base URL for navigation
    url = "http://"
    slots = event['sessionState']['intent']['slots']
    nav_req_name = slots['navReqName']['value']['interpretedValue'].lower()
    
    # Map user input to corresponding URLs
    dictionary = {
        'login': f'{url}login',
        'signup': f'{url}signup',
        'profile': f'{url}profile'
    }
    
    # Retrieve the URL from the dictionary based on user input
    if nav_req_name in dictionary:
        response_str = dictionary[nav_req_name]
    else:
        response_str = f'{nav_req_name} not found.'
    
    # Prepare the response in Lex format
    response = {
        "sessionState": {
            "dialogAction": {
                "type": "Close"
            },
            "intent": {
                "name": "TeamScoresIntent",
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

def handleTeamScoresIntent(event):
    slots = event['sessionState']['intent']['slots']
    team_name = slots['teamName']['value']['interpretedValue'].lower()
    response_str = f'{team_name} score is 100'
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
