navigationIntent = 'NavigationIntent'
teamScoresIntent = 'TeamScoresIntent'

def lambda_handler(event, context):
	
	intent_name = event['sessionState']['intent']['name']
	user_input = event['inputTranscript'].lower()  # Retrieve user input from Lex event
	
	if intent_name==navigationIntent:
		return handleNavIntent(user_input)
	
	if intent_name==teamScoresIntent:
		return handleTeamScoresIntent(user_input)


def handleNavIntent(user_input):
	url = "http://"
    
    dictionary = {
        'login': f'{url}login',
        'signup':  f'{url}signup',
        'profile':  f'{url}profile'
    }


    if user_input in dictionary:
        response_str = dictionary[user_input]
    else:
        response_str = f'{user_input} not found.'

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
    


def handleTeamScoresIntent(user_input):
	
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
	
	
	