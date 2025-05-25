import logging
import os
import sys
from pathlib import Path
import asyncio
import jwt
import django
from django.conf import settings
from django.contrib.auth import get_user_model

from aiohttp import web
from websockets.asyncio.server import serve
from websockets.frames import CloseCode


BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_shop.settings.dev')
django.setup()
User = get_user_model()

connected_clients = set()


# *** OBSOLETE ***
async def activate_user(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        print("the user id", user_id)

        if user_id is None:
            return "user is does not exist"

        # activate the user
        user = await asyncio.to_thread(User.objects.get, id=user_id)
        user.is_verified = True

        await asyncio.to_thread(user.save)

        return user
    except (jwt.ExpiredSignatureError,
            jwt.InvalidTokenError,
            User.DoesNotExist,
            jwt.DecodeError) as e:
        print("the error", e)
        return None


async def handler(websocket):
    """ connection to react client """
    connected_clients.add(websocket)

    try:
        await websocket.send("hello from server")
        async for message in websocket:
            pass
    except Exception as e:
        print("error in connection", e)
    finally:
        connected_clients.remove(websocket)
        await websocket.close()


async def http_handler(request):
    try:
        for ws in connected_clients:
            await ws.send("user_activated")
            await ws.close()

            return web.json_response({
                'message': 'send activation signal success'
            }, status=200)
    except Exception as e:
        print("there was an error", e)
        return web.json_response({
            'message': 'couldn\'t send activation signal',
        }, status=500)


async def main():
    app = web.Application()
    app.router.add_post('/activate_user', http_handler)
    runner = web.AppRunner(app)

    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8765)
    await site.start()

    # TODO: use the domain name on production
    async with serve(handler, 'localhost', 8888):
        print("server is listening on port 8888...")
        print("socket is listening on port 8765...")
        await asyncio.get_running_loop().create_future()


if __name__ == "__main__":
    asyncio.run(main())

