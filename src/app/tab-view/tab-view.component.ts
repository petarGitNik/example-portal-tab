import {
  OnInit,
  OnDestroy,
  Component,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  Output,
  EventEmitter
} from '@angular/core';

import { TabPortalOutlet } from './tab-portal-outlet';
import { TabComponent, TabInterface } from './tab-portal.interfaces';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent implements OnInit, OnDestroy {

  // The tab portal host we're binding to a ViewChild in
  // this component
  private tabPortalHost: TabPortalOutlet;

  // The actual outlet element
  @ViewChild('tabContentOutlet') tabContentOutlet: ElementRef;

  // Tabs go here
  readonly tabs: TabInterface[] = [
    { name: 'cats', label: 'Cats', active: true, componentClass: GridComponent},
    { name: 'bananas', label: 'Bananas', componentClass: GridComponent},
  ]

  constructor(
    readonly injector: Injector,
    readonly appRef: ApplicationRef,
    readonly componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.tabPortalHost = new TabPortalOutlet(
      this.tabs,
      this.tabContentOutlet.nativeElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
  }

  ngOnDestroy() {
    this.tabPortalHost.dispose();
  }

  public isCurrent(name: string) {
    const current = this.tabPortalHost.currentTab;
    return current && current.name === name;
  }

  public switchTo(name: string) {
    this.tabPortalHost.switchTo(name);
    console.log(`Switching to ${name}`);
    return false;
  }
}
