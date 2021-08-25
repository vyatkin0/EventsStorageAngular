import { ComponentFixture, TestBed } from '@angular/core/testing';

import {AppModule} from './app.module';
import {AppSearchBox} from './components/app-search-box.component';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

let loader: HarnessLoader;

describe('AppSearchBox', () => {
  let fixture: ComponentFixture<AppSearchBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppModule], declarations: [AppSearchBox]})
        .compileComponents();
    fixture = TestBed.createComponent(AppSearchBox);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should work', async () => {
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    const input = await loader.getHarness(MatInputHarness);
  });
});
