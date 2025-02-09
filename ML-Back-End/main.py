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
import csv
import json

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Allow cross-origin
CORS(app)
cors = CORS(app, resources={
    r"/": {
        "origins": "*"
    }
})


# function to write ticket data into the dataset
@app.route('/dataset/write', methods=['POST'])
def dataset_write():
    print("***** dataset_write function is starting *****")
    row_count = 0

    # Get ticket data that are user inserting from the Angular FrontEnd
    # Get user input values
    month = int(request.json['month'])
    week = int(request.json['week'])
    component = int(request.json['component'])

    print(month, week, component)

    if month == 0 or week == 0 or component == 0:
        obj = {
            "status": 400,
            "description": "Ticket data not found!",
            "size": 0
        }

    else:
        # Open the CSV file in write mode to write the new ticket data
        new_ticket_data = [month, week, component]
        with open("sample_dataset.csv", mode="a", newline="") as file:
            writer = csv.writer(file)

            # Write the entry to the CSV file
            writer.writerow(new_ticket_data)
            print("New ticket data successfully written to the dataset CSV")

        # Open the CSV file and count rows and return
        with open("sample_dataset.csv", mode="r") as file:
            reader = csv.reader(file)
            for row in reader:
                row_count += 1

        obj = {
            "status": 200,
            "size": row_count,
            "description": "Ticket added successfully!",
        }

    print(obj)
    return obj


# function to train the machine learning model
# to predict the software or hardware component which is going to
# encounter an issue in the given time stamp
@app.route('/model/train', methods=['GET'])
def train_model():
    print("***** train_model function is starting *****")

    # Define column names
    column_names = ['month', 'week', 'components']

    try:
        # Load dataset (csv file)
        print("attempting to read the CSV file data (sample_dataset.csv)")
        csv_data = pd.read_csv("sample_dataset.csv", header=None, names=column_names)
        print("CSV reading successful")

        # Split dataset
        print("Fitting data into the Naive Bayes model")
        feature_columns = ['month', 'week']
        x = csv_data[feature_columns]
        y = csv_data['components']

        # 70% training and 30% test
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=1)

        # Fit the training datasets into the algorithm
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

        # Load the existing data from the JSON file where the accuracy is stored
        with open('local_data.json', 'r') as file:
            data = json.load(file)

        data['accuracy'] = str(accuracy) + "%"

        # Write the updated data back to the JSON file where the accuracy is stored
        with open('local_data.json', 'w') as file:
            json.dump(data, file, indent=4)

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

    print(obj)
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

        # Get the prediction using the user inputs
        input_array = [month, week]
        prediction = int(naive_joblib.predict([input_array])[0])

        # Get the accuracy from the local_data.json file
        # Load the existing data from the JSON file where the accuracy is stored
        with open('local_data.json', 'r') as file:
            data = json.load(file)

        accuracy = data['accuracy']
        print(accuracy)

        predict_array = [{"prediction": prediction, "component": get_component_name(prediction), "accuracy": accuracy}]

        # Creating an object using prediction
        obj = {
            "status": 200,
            "description": "Component predicted successfully",
            "prediction": predict_array
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


# Function get the component name by passing the component id
def get_component_name(predict_id):
    component_names = ['Computers/laptops', 'Projectors', 'Printers/Scanners', 'Network routers', 'Network switches',
                       'Security cameras', 'Audio/Video systems', 'Photocopy machines',
                       'Learning management system (LMS)', 'Operating systems (OS)',
                       'Antivirus/Virus guards or firewall', 'Communication tools (Email/Teams/Zoom)',
                       'Library management system', 'Database or storage', 'Backup solutions (local or cloud)']

    return component_names[predict_id - 1]


app.run(port=5001, debug=True)
