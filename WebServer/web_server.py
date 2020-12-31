from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
import json

import numpy as np
import keras
from keras.models import load_model

import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)
api = Api(app)
cors = CORS(app, allow_headers='*',
            origins='*', methods='*', expose_headers='Authorization')


def decode_image(data):
    decoded = base64.b64decode(data)

    img = Image.open(BytesIO(decoded))
    img = np.array(img)
    img = img.reshape(1, 28, 28, 1)
    img = img.astype('float32')
    img = img / 255.0

    return img


class WebServer(Resource):
    @cross_origin()
    def post(self):
        payload = request.get_json()
        print('Payload:\n' + json.dumps(payload, indent=4) + '\n')

        data = dict.fromkeys(payload)
        for k, v in payload.items():
            data[k] = [v]

        img = decode_image(data['data'][0])
        model = load_model('../Model/artifacts/model_fashion_classifier.h5py')
        prediction = model.predict_classes(img)

        result = int(prediction[0])

        return jsonify(result=result)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST')

        return response


api.add_resource(WebServer, '/')

if __name__ == '__main__':
    app.run(use_debugger=False, use_reloader=False,
            passthrough_errors=True, threaded=False)
