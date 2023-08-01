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
    
    api_url = f'https://jmflaholi8.execute-api.us-east-1.amazonaws.com/dev/getteamstatsbyname?teamName={team_name}'
    
    try:
        # Make a GET request to the API
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()
            team_scores = data[0]
            total_matches = team_scores.get('totalMatches', 0)
            total_wins = team_scores.get('totalWins', 0)
            total_losses = team_scores.get('totalLosses', 0)
            total_points = team_scores.get('totalPoints', 0)
            response_str = f"{team_name} stats:\nTotal Matches: {total_matches}\nTotal Wins: {total_wins}\nTotal Losses: {total_losses}\nTotal Points: {total_points}"
        else:
            response_str = f'Team stats not found for team: {team_name}'
    except requests.RequestException as e:
        print('Error fetching team score:', e)
        response_str = f'Error fetching team stats for {team_name}'
    
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
    
    return response