import { DialogAddEvent, DialogAddFile, DialogAddSubject, DialogConfirm } from './dialogs/dialog.components';

import { AppComponent } from './app.component';
import {AppSearchBox} from './components/app-search-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { TestBed } from '@angular/core/testing';
import {TrimEllipsisPipe} from './app.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*
  it(`should have as title 'ClientApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ClientApp');
  });
*/

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('ClientApp app is running!');
  });
});
