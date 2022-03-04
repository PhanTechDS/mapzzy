from utils.cipher import encrypt, decrypt
import json
from datetime import datetime, timedelta

days_to_expiration = 7

def generate(data):
    data = json.dumps(data)
    data = encrypt(data)
    week = timedelta(days=days_to_expiration)
    now = datetime.now()
    expiry = now + week
    expiry = expiry.strftime("%c")
    return encrypt(json.dumps({"data":data,"expiry":expiry}))

def verify(token):
    token = json.loads(decrypt(token))
    data = token["data"]
    expiry = datetime.strptime(token["expiry"],"%c")
    now = datetime.now()
    if now < expiry:
        data = decrypt(data)
        data = json.loads(data)
        return data
    else:
        return None