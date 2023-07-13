import requests
import boto3
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud import pubsub_v1
import logging
import os

# Setting up logging
logging.basicConfig(level=logging.INFO)

# Initialize the Firebase Admin SDK
cred = credentials.Certificate('./serviceAccountKey.json')
default_app = firebase_admin.initialize_app(cred)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./serviceAccountKey.json"

db = firestore.client()

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    logging.info(event)
    try:
        game_id = event['gameId']
        team_id = event['teamId']

        print(event)

        # Get the game details from DynamoDB
        table = dynamodb.Table('GamesTable')
        game = table.get_item(Key={'gameID': game_id})['Item']

        teams = {}
        response = requests.get(
            f'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team?teamId={team_id}')
        teams[team_id] = response.json()

        logging.info(f"Teams: {teams}")

        # Store only questionIDs
        question_ids = [question['questionID']
                        for question in game['questions']]

        game_category = game['category']
        diff_level = game['difficultyLevel']

        game_state = {
            'gameId': game_id,
            'questionIds': question_ids,
            'category': game_category,
            'difficultyLevel': diff_level,
            'teams': teams,
            'scores': {
                team_id: {
                    'teamScore': 0,
                    'members': {
                        member['userEmail']: {
                            'correctAnswersCount': 0,
                            'incorrectAnswersCount': 0
                        } for member in teams[team_id]['teamMembers']
                    }
                }
            },

        }

        # print(json.dumps(game_state, indent=4))

        # Set the current game state in Firestore
        doc_ref = db.collection('currentGame').document(game_id)
        doc_ref.set(game_state, merge=True)


        return {
            'statusCode': 200,
            'body': json.dumps({"message": "Game Started!"}),
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
        }

    except Exception as e:
        # log the error with a traceback
        logging.error("Error occurred:", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "An error occurred while starting the game"}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
        }
