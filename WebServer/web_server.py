from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
import json

import numpy as np
import keras
from keras.models import load_model

import base64
import cv2
from PIL import Image
from io import BytesIO

app = Flask(__name__)
api = Api(app)
cors = CORS(app, allow_headers='*',
            origins='*', methods='*', expose_headers='Authorization')


def mask(img):
    BLUR = 21
    CANNY_THRESH_1 = 10
    CANNY_THRESH_2 = 200
    MASK_DILATE_ITER = 10
    MASK_ERODE_ITER = 10

    # BGR format
    MASK_COLOR = (0.0, 0.0, 0.0)

    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, CANNY_THRESH_1, CANNY_THRESH_2)
    edges = cv2.dilate(edges, None)
    edges = cv2.erode(edges, None)

    contour_info = []
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

    for c in contours:
        contour_info.append((
            c,
            cv2.isContourConvex(c),
            cv2.contourArea(c),
        ))
    contour_info = sorted(contour_info, key=lambda c: c[2], reverse=True)
    max_contour = contour_info[0]

    mask = np.zeros(edges.shape)
    cv2.fillConvexPoly(mask, max_contour[0], (255))

    mask = cv2.dilate(mask, None, iterations=MASK_DILATE_ITER)
    mask = cv2.erode(mask, None, iterations=MASK_ERODE_ITER)
    mask = cv2.GaussianBlur(mask, (BLUR, BLUR), 0)
    mask_stack = np.dstack([mask]*3)

    mask_stack = mask_stack.astype(
        'float32') / 255.0
    img = img.astype('float32') / 255.0

    masked = (mask_stack * img) + ((1-mask_stack) * MASK_COLOR)
    masked = (masked * 255).astype('uint8')
    masked = np.asarray(masked)

    return masked


def decode_image(data):
    decoded = base64.b64decode(data)

    img = Image.open(BytesIO(decoded))
    img = mask(img)
    img = Image.fromarray(img)
    img = img.resize((28, 28))
    img = img.convert('L')
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
        print('Result:', result)

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
