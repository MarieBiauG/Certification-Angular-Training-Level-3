import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
