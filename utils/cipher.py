from Crypto.Cipher import AES
import base64
from Crypto.Util.Padding import pad, unpad

salt = "1039re9k20k0kws0"


def encrypt(data,key=salt):
    key = bytes(key,encoding="utf-8")
    data = bytes(data,encoding="utf-8")
    cipher = AES.new(key, AES.MODE_CBC)
    eTxt = cipher.encrypt(pad(data, AES.block_size))
    eTxt = base64.b64encode(eTxt).decode("utf-8")
    iv = base64.b64encode(cipher.iv).decode("utf-8")
    return iv+eTxt

def decrypt(data,key=salt):
    key = bytes(key,encoding="utf-8")
    iv = data[:24]
    data = data[24:]
    iv = base64.b64decode(iv)
    data = base64.b64decode(data)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    dTxt = unpad(cipher.decrypt(data), AES.block_size)
    return dTxt.decode("utf-8")
