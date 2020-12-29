import numpy as np

import keras
from keras.utils import to_categorical
from keras.datasets import fashion_mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load training and test data from keras dataset
(train_X, train_Y), (test_X, test_Y) = fashion_mnist.load_data()
print('Training data: ', train_X.shape, train_Y.shape)
print('Testing data: ', test_X.shape, test_Y.shape)

# Extract unique classes
uniqueClasses = np.unique(train_Y)
numberOfUniqueClasses = len(uniqueClasses)
print('Number of classes from input data: ', numberOfUniqueClasses)
print('Number of output classes: ', uniqueClasses)

# Transform training dataset
train_X = train_X.reshape(-1, 28, 28, 1)
test_X = test_X.reshape(-1, 28, 28, 1)
train_X.shape, test_X.shape

# Change to float32 format
train_X = train_X.astype('float32')
test_X = test_X.astype('float32')

# Normalize - pixel value in 0-1 range
train_X = train_X / 255
test_X = test_X / 255

# Categorise via one-hot encoding
train_Y_one_hot = to_categorical(train_Y)
test_Y_one_hot = to_categorical(test_Y)
print('Original labels: ', train_Y[0])
print('After performing one-hot encoding: ', train_Y_one_hot[0])

# Divide data to training and validation subsets (80% / 20%)
train_X, valid_X, train_label, valid_label = train_test_split(
    train_X, train_Y_one_hot, test_size=0.2, random_state=13)
train_X.shape, valid_X.shape, train_label.shape, valid_label.shape

# Configure (size of batch, epochs count, number of classes)
size_of_batch = 64
epochs = 20
number_of_classes = 10

# Model structure (CNN - 3-layered)
cnn_fashion_model = Sequential()
cnn_fashion_model.add(
    Conv2D(
        32,
        kernel_size=(3, 3),
        activation='relu',
        padding='same',
        input_shape=(28, 28, 1)
    )
)
cnn_fashion_model.add(
    MaxPooling2D((2, 2), padding='same')
)
cnn_fashion_model.add(Dropout(0.25))
cnn_fashion_model.add(
    Conv2D(
        64,
        (3, 3),
        activation='relu',
        padding='same'
    )
)
cnn_fashion_model.add(
    MaxPooling2D(
        pool_size=(2, 2),
        padding='same'
    )
)
cnn_fashion_model.add(Dropout(0.25))
cnn_fashion_model.add(
    Conv2D(
        128,
        (3, 3),
        activation='relu',
        padding='same'
    )
)
cnn_fashion_model.add(
    MaxPooling2D(
        pool_size=(2, 2),
        padding='same'
    )
)
cnn_fashion_model.add(Dropout(0.4))
cnn_fashion_model.add(Flatten())
cnn_fashion_model.add(
    Dense(128, activation='relu')
)
cnn_fashion_model.add(
    Dropout(0.3))
cnn_fashion_model.add(
    Dense(number_of_classes, activation='softmax')
)

# Summary
cnn_fashion_model.summary()

# Configure CNN model
cnn_fashion_model.compile(
    loss=keras.losses.categorical_crossentropy,
    optimizer=keras.optimizers.Adam(),
    metrics=['accuracy'])

# Train model
fashion_train_dropout = cnn_fashion_model.fit(
    train_X, train_label, batch_size=size_of_batch,
    epochs=epochs, verbose=1,
    validation_data=(valid_X, valid_label))

# Save model
cnn_fashion_model.save("artifacts/model_fashion_classifier.h5py")

# Estimate performance
model_evaluation = cnn_fashion_model.evaluate(
    test_X, test_Y_one_hot, verbose=1)
print('Wrongly classified: ', model_evaluation[0])
print('Accuracy: ', model_evaluation[1])

# Predicted classes including probability
predicted_classes = cnn_fashion_model.predict(test_X)

# Compare with label
predicted_classes = np.argmax(
    np.round(predicted_classes),
    axis=1
)
predicted_classes.shape, test_Y.shape

# Summarise all classes - precision, recall, f1-score
target_names = ["Class {}".format(i)
                for i in range(number_of_classes)]
print(classification_report(
    test_Y, predicted_classes,
    target_names=target_names)
)