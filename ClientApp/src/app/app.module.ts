import { DialogAddEvent, DialogAddFile, DialogAddSubject, DialogConfirmDeleteFile } from './home/dialog.components';

import { AppComponent } from './app.component';
import {AppSearchBox} from './home/app-search-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogAddSubject,
    DialogAddFile,
    DialogAddEvent,
    DialogConfirmDeleteFile,
    AppSearchBox,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
