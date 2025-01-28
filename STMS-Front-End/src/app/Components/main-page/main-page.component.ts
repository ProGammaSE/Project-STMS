import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GeneralResponse } from '../../Models/GeneralResponse';
import { PredictService } from '../../Services/predict.service';
import { PredictRequest } from '../../Models/predictRequest';
import { catchError, timeout } from 'rxjs';

@Component({
  selector: 'app-main-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  // global variables
  loadingBox: boolean = false;
  alertStatus: boolean = false;
  alertClass: string = "";
  alertText: string = "";
  predictRequest: PredictRequest = new PredictRequest()
  generalResponse: GeneralResponse = new GeneralResponse;
  predictionResult: any = []
  resultBox: boolean = false;
  resultboxColor: string = "alert alert-success";

  constructor (private predictService: PredictService) {}

  // Function to predict the component by sending the month and the week
  predictComponent() {
    this.resultBox = false;
    this.loadingBox = true;
    this.alertStatus = false;

    if (this.predictRequest.month == 0 || this.predictRequest.week == 0) {
      // Showing an error message for 5 seconds
      this.loadingBox = false;
      this.alertStatus = true
      this.alertClass = "alert alert-danger"
      this.alertText = "Please select a month and a week!"

      setTimeout(() => {
        this.loadingBox = false;
        this.resultBox = false;
        this.alertStatus = false;
      }, 3000);
    }
    else {
      this.predictService.predictComponent(this.predictRequest).pipe(
        timeout(10000),
        catchError(err => {
          return err;
        })
      ).subscribe ((result: any) => {
        this.generalResponse = result

        if (this.generalResponse.response == 200) {
          // Showing an status message for 3 seconds
          this.loadingBox = false;
          this.alertStatus = true
          this.alertClass = "alert alert-success"
          this.alertText = this.generalResponse.message

          this.resultBox = true
          this.predictionResult = result.prediction[0]
          console.log(result)
          console.log(this.predictionResult)

          setTimeout(() => {
            this.alertStatus = false
            this.loadingBox = false;
          }, 3000);
        }
        else {
          // Showing an error message for 5 seconds
          this.loadingBox = false;
          this.alertStatus = true
          this.alertClass = "alert alert-danger"
          this.alertText = this.generalResponse.message

          setTimeout(() => {
            this.loadingBox = false;
            this.resultBox = false
          }, 3000);
        }
      })
    }
  }

  clickOnReset() {
    this.predictRequest = new PredictRequest();
    this.loadingBox = false;
    this.resultBox = false;
    this.alertStatus = false;
  }
  
}
