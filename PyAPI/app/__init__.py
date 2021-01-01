from flask import Flask, Response

class MyResponse(Response):
     default_mimetype = 'application/xml'
     

def create_app(config_filename):
    app = Flask(__name__)
    app.config.from_object(config_filename)
    app.response_class = MyResponse
    return app
