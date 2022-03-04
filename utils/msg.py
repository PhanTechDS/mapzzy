from flask import Response
import json

def success(msg):
    return Response(json.dumps({
        "status": "success",
        "message": msg
    }), 200, mimetype="application/json")

def error(msg):
    return Response(json.dumps({
        "status": "error",
        "message": msg
    }), 400, mimetype="application/json")