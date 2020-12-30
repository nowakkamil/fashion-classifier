import numpy as np
import keras
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img

# Load and prepare the image


def load_image(filename):
    img = load_img(filename, grayscale=True, target_size=(28, 28))
    img = img_to_array(img)

    # Reshape into a single sample with 1 channel
    img = img.reshape(1, 28, 28, 1)

    # Prepare pixel data
    img = img.astype('float32')
    img = img / 255.0

    return img


def test_trained_model():
    model = load_model('artifacts/model_fashion_classifier.h5py')
    img = load_image('samples/ankle_boot.png')

    result = model.predict_classes(img)
    print(result[0])


test_trained_model()
