import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridsterModule } from 'angular-gridster2';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { TabViewComponent } from './tab-view/tab-view.component';
import { GridComponent } from './grid/grid.component';

@NgModule({
  declarations: [
    AppComponent,
    TabViewComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    GridsterModule
  ],
  providers: [],
  entryComponents: [GridComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
