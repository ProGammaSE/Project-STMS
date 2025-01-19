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
  // prediction: Prediction = new Prediction;
  generalResponse: GeneralResponse = new GeneralResponse;
  predictionResult: any = []
  resultBox: boolean = false;
  resultboxColor: string = "alert alert-success";

  constructor (private predictService: PredictService) {}

  predictComponent() {
    this.predictService.predictComponent(this.predictRequest).pipe(
      timeout(10000),
      catchError(err => {
        return err;
      })
    ).subscribe ((result: any) => {
      this.resultBox = true
      console.log(result)
    })
  }
  
}
