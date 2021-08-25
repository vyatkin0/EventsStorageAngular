import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {AppModule} from './app.module';
import {AppSearchBox} from './components/app-search-box.component';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

describe('AppSearchBox', () => {
  let fixture: ComponentFixture<AppSearchBox>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppModule], declarations: [AppSearchBox]})
        .compileComponents();
    fixture = TestBed.createComponent(AppSearchBox);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should work', async () => {
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    const input = await loader.getHarness(MatInputHarness);

    expect(inputs.length).toEqual(1);

    const type = await input.getType();
    expect(type).toEqual('search');
  });
});

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [AppModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render bottom toolbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const bottomToolbar = compiled.querySelector('div.bottom-toolbar');

    expect(bottomToolbar?.children[0]?.textContent).toContain('Delete Selected Events');
    expect(bottomToolbar?.children[1]?.textContent).toContain('Add Subject');
    expect(bottomToolbar?.children[2]?.textContent).toContain('Add Event');
  });
});
