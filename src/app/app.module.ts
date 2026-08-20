import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdjustmentProcessingComponent } from '../app/adjustment-processing/adjustment-processing.component';


@NgModule({
  declarations: [AdjustmentProcessingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AppModule { }
