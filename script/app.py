from flask import Flask
from flask import request
import requests as rq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/',methods=['GET'])
def get_weather():
    cordinates = request.args.to_dict()
    print(cordinates)
    url = "https://samples.openweathermap.org/data/2.5/weather?lat=" + cordinates["latitude"] + "&lon=" + cordinates["longtitude"] + "&appid=8d50b46972b36311b1bdd74f434be1b0"
    print(url)
    response = rq.get(url)
    return response.content

if __name__ == '__main__':
    app.run()