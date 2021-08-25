import { DialogAddEvent, DialogAddFile, DialogAddSubject, DialogConfirm } from './dialogs/dialog.components';
import { NgModule, Pipe, PipeTransform, } from '@angular/core';

import { AppComponent } from './app.component';
import {AppSearchBox} from './components/app-search-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';

@Pipe({name: 'trimEllipsis'})
export class TrimEllipsisPipe implements PipeTransform {
  transform(value: string): string {
    const maxlen = 10;

    if (value.length > maxlen) {
        return value.substr(0, maxlen-3) +'...';
    }
    return value;
  }
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogAddSubject,
    DialogAddFile,
    DialogAddEvent,
    DialogConfirm,
    AppSearchBox,
    TrimEllipsisPipe
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
