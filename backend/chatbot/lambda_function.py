def lambda_handler(event, context):
    url = "http://"
    
    dictionary = {
        'login': f'{url}login',
        'signup':  f'{url}signup',
        'profile':  f'{url}profile'
    }

    user_input = event['inputTranscript']  # Retrieve user input from Lex event

    if user_input in dictionary:
        response_str = dictionary[user_input]
    else:
        response_str = 'Key not found in the dictionary.'

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

    # response = {
    #     'sessionState': event['sessionState'],
    #     'messages': [
    #         {
    #             'contentType': 'PlainText',
    #             'content': ''
    #         }
    #     ],
    # }
    
    # response['sessionState']['dialogAction'] = {
    #         "type": "Close",
    #         "intent": {
	# 	      "name": "NavigationIntent",
	# 			  "state": "Fulfilled"
	# 	    }
    #     }
        
    # response['sessionState']["intent"] = {
    #     "state": "Fulfilled",
    #     "name": "string",
    # }


    
    # print("-------")
    # print("reponse=----", response)
    # print("--------")

    # return response

# def lambda_handler(event, context):
#     # Hardcoded dictionary
#     dictionary = {
#         'apple': 'A sweet fruit',
#         'banana': 'A yellow fruit',
#         'orange': 'A citrus fruit'
#     }

#     user_input = event['inputTranscript']  # Retrieve user input from Lex event

#     response = {
#         'sessionState': event['sessionState'],
#         'messages': [
#             {
#                 'contentType': 'PlainText',
#                 'content': ''
#             }
#         ],
#     }
    
#     response['sessionState']['dialogAction'] = {
#             "slotElicitationStyle": "Default",
#             "slotToElicit": "string",
#             "type": "Delegate"
#         }

#     if user_input in dictionary:
#         response['messages'][0]['content'] = dictionary[user_input]
#     else:
#         response['messages'][0]['content'] = 'Key not found in the dictionary.'
    
#     print("-------")
#     print("reponse=----", response)
#     print("--------")

#     return response