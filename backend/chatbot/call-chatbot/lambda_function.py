import json
import boto3

lex_runtime = boto3.client('lexv2-runtime')

def lambda_handler(event, context):
    user_id = event['sessionId']
    user_input = event['text']
    
    print("useeeueueueu------", user_id, user_input)

    params = {
        'botId': 'N3WILBLNLZ',
        'botAliasId': 'MNRGL2M89P',
        'localeId': 'en_US',
        'sessionId': user_id,
        'text': user_input,
    }

    try:
        response = lex_runtime.recognize_text(**params)
        messages = response['messages']
        print("messages===========", messages)
        bot_message = next((msg for msg in messages if msg['contentType'] == 'PlainText'), None)
        
        print("botmesgsgs===========", bot_message)
        if bot_message:
            return {
                'statusCode': 200,
                'body': bot_message['content'],
            }
        else:
            return {
                'statusCode': 200,
                'body': 'Please message again.',
            }
    except Exception as e:
        print('Error sending message to Lex:', e)
        return {
            'statusCode': 500,
            'content': json.dumps({'error': 'Error sending message to Lex'}),
        }

