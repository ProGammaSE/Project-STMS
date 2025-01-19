import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../Models/Users';
import { PredictRequest } from '../Models/predictRequest';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  BASE_URL = 'http://127.0.0.1:5001';
  
    constructor(private http: HttpClient) { }
  
    // Functio to get the prediction from the Machine Leanring (Python) backend
    predictComponent(predictRequest: PredictRequest) {
      return this.http.post(this.BASE_URL + '/predict/component', predictRequest);
    }
}
