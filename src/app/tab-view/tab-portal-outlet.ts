import {
  BasePortalOutlet,
  ComponentPortal,
  PortalOutlet
} from '@angular/cdk/portal';

import {
  ActiveTabInterface,
  TabInterface,
  TabComponent
} from './tab-portal.interfaces';

import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector
} from '@angular/core';

/*
 * A PortalOutlet that lets multiple components live for the
 * lifetime of the outlet, allowing faster switching and persistent
 * data.
 */
export class TabPortalOutlet {
  // Activate tabs that have benn instantiated
  private _activeTabs: { [name: string]: ActiveTabInterface } = {};

  // The current tab
  // private _currentTab: ActiveTabInterface | null;
  private _currentTab: ActiveTabInterface | null = null;

  constructor(
    public availableTabs: TabInterface[],
    public outletElement: Element,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    // Uncomment below to set the default active tab
    this.setCurrentTab(this.availableTabs);
  }

  /*
   * Returns the current active TabComponent instance
   */
  public get activeComponents(): TabComponent[] {
    return Object
      .keys(this._activeTabs)
      .map((name: string) => this._activeTabs[name].componentRef.instance);
  }

  public get currentTab(): Readonly<ActiveTabInterface> {
    return this._currentTab;
  }

  /*
   * Set 'active' tab as default tab. Assume that only one tab can be set active
   * when application starts.
   */
  public setCurrentTab(availableTabs: TabInterface[]) {
    let tab;
    for (let t of availableTabs) {
      if (t.active) {
        tab = t;
      }
    }
    this._currentTab = this.activateInstance(tab);
  }

  public switchTo(name: string) {
    const tab = this.availableTabs.find(tab => tab.name === name);

    if (!tab) {
      throw(`Trying to switch to unkwnon tab ${name}.`);
    }

    // Detach any current instance
    this.detach();

    // Get the existing or new component instance
    const instance = this.activateInstance(tab);

    // At this point the component has be instantiate
    // so we move it to the location in the DOM where we want
    // it to be rendered.
    this.outletElement.innerHTML = '';
    this.outletElement.appendChild(this._getComponentRootNode(instance.componentRef));
    this._currentTab = instance;
    instance.componentRef.instance.onActivate();
  }

  private detach(): void {
    const current = this._currentTab;
    if (current !== null) {
      // clear the portal
      current.portal.setAttachedHost(null);
      // clear the current tab variable
      this._currentTab = null;
    }
  }

  dispose(): void {
    // Dispose all active tabs

    // Remove outlet element
  }

  private activateInstance(tab: TabInterface): ActiveTabInterface {
    if (!this._activeTabs[tab.name]) {
      this._activeTabs[tab.name] = this.createComponent(tab);
    }

    return this._activeTabs[tab.name] || null;
  }

  private createComponent(tab: TabInterface): ActiveTabInterface {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.componentClass);
    const componentRef = componentFactory.create(this.injector);
    const portal = new ComponentPortal(tab.componentClass, null, this.injector);

    // Attach component view
    this.appRef.attachView(componentRef.hostView);

    return {
      name: tab.name,
      portal: portal,
      componentRef: componentRef,
      dispose: () => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }
    };
  }

  /* Gets the root HTMLElement for an instantiated component. */
  private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}
