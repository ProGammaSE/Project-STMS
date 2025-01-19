# author: Supun
import flask
from flask import request
from flask_restful import abort
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn import naive_bayes
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Allow cross-origin
CORS(app)
cors = CORS(app, resources={
    r"/": {
        "origins": "*"
    }
})


# function to train the machine learning model
# to predict the software or hardware component which is going to
# encounter an issue in the given time stamp
@app.route('/model/train', methods=['POST'])
def train_model():
    print("***** train_model function is starting *****")

    # Define column names
    column_names = ['month', 'week', 'components']

    try:
        # Load dataset (csv file)
        print("attempting to read the CSV file data (dataset)")
        csv_data = pd.read_csv("sample_dataset.csv", header=None, names=column_names)
        print("CSV reading successful")

        # Split dataset
        print("Fitting data into the Naive Bayes model")
        feature_columns = ['month', 'week']
        x = csv_data[feature_columns]
        y = csv_data['components']

        # # 70% training and 30% test
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=1)

        # # Fit the training datasets into the algorithm
        naive = naive_bayes.MultinomialNB()
        naive.fit(x_train.values, y_train.values)
        print("Naive Bayes model fitted")

        # Save the trained model in a pickle file
        print("Attempting to save the PICKLE file")
        joblib.dump(naive, 'trained_model.pkl')
        print("Pickle file saved successfully")

        # get prediction accuracy
        print("Generating the model accuracy")
        prediction = naive.predict(x_test.values)
        accuracy = round(accuracy_score(prediction, y_test) * 100, 2)
        print("Model Accuracy: ", accuracy, "%")

        obj = {
            "status": 200,
            "description": "Predictive ticketing model trained successfully",
        }

    except Exception as e:
        obj = {
            "status": 400,
            "description": "Predictive ticketing model training failed!",
        }
        print(e)
        abort(400)

    return obj


# function to predict the component which going to encounter an issue
@app.route('/predict/component', methods=['POST'])
def predict_component():
    print("--- predict_component function is calling ---")

    try:
        # Load Naive Bayes pickle
        naive_joblib = joblib.load('trained_model.pkl')

        # Get user input values
        month = int(request.json['month'])
        week = int(request.json['week'])

        # print(month)
        # print(week)
        # input_array = [month, week]
        # prediction = naive_joblib.predict([input_array])[0]
        # print("Prediction: ", prediction)
        #
        # predict_array = [{"prediction": naive_joblib.predict([month, week])[0], "accuracy": "100%"}]
        #
        # # check before week predict
        # # If week 01 then check the last week of the previous month
        # if week == 1:
        #     # If the selected month is January, then check the December last week prediction
        #     if month == 1:
        #         predict_array.append({"prediction": naive_joblib.predict([12, 5])[0], "accuracy": "25%"})
        #     else:
        #         predict_array.append({"prediction": naive_joblib.predict([(month - 1), 5])[0], "accuracy": "25%"})
        #
        # elif week == 2:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 1])[0], "accuracy": "25%"})
        #
        # elif week == 3:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 2])[0], "accuracy": "25%"})
        #
        # elif week == 4:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 3])[0], "accuracy": "25%"})
        #
        # else:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 4])[0], "accuracy": "25%"})
        #
        # # Check next week
        # if week == 5:
        #     # If the selected month is January, then check the December last week prediction
        #     if month == 12:
        #         predict_array.append({"prediction": naive_joblib.predict([1, 1])[0], "accuracy": "25%"})
        #     else:
        #         predict_array.append({"prediction": naive_joblib.predict([(month + 1), 5])[0], "accuracy": "25%"})
        #
        # elif week == 4:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 5])[0], "accuracy": "25%"})
        #
        # elif week == 3:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 4])[0], "accuracy": "25%"})
        #
        # elif week == 2:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 3])[0], "accuracy": "25%"})
        #
        # else:
        #     predict_array.append({"prediction": naive_joblib.predict([month, 2])[0], "accuracy": "25%"})
        #
        # print(predict_array)

        # Creating an array using given inputs
        input_array = [month, week]
        print(input_array)

        # Get the prediction using the input array
        prediction = naive_joblib.predict([input_array])[0]
        print("Prediction: ", prediction)

        # Creating an object using prediction
        obj = {
            "status": 200,
            "description": "Component predicted successfully",
            "prediction": int(prediction)
        }
        print(obj)

    except Exception as e:
        print(e)
        obj = {
            "status": 400,
            "description": "Component predicted successfully",
            "prediction": 0
        }

        abort(400)
    return obj


app.run(port=5001, debug=True)
