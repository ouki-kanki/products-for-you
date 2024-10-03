from channels.generic.websocket import AsyncWebsocketConsumer
import json


class VerificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print('connection')
        await self.accept()

    async def disconnect(self, code):
        print(f'connection closed: {code}')

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender = text_data_json["sender"]

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
