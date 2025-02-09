import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PredictRequest } from '../Models/PredictRequest';
import { Train } from '../Models/Train';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  BASE_URL = 'http://127.0.0.1:5001';
  
    constructor(private http: HttpClient) { }

    // Function to add the ticket data into the dataset
    datasetWrite(trainRequest: Train) {
      return this.http.post(this.BASE_URL + '/dataset/write', trainRequest)
    }

    // Function to train the model using the latest ticket details
    trainModel() {
      return this.http.get(this.BASE_URL + '/model/train')
    }
  
    // Function to get the prediction from the Machine Leanring (Python) backend
    predictComponent(predictRequest: PredictRequest) {
      return this.http.post(this.BASE_URL + '/predict/component', predictRequest);
    }
}

