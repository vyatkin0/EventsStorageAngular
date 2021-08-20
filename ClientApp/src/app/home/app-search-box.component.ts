import { Component, Output, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { getEntities } from '../../utils';

export interface AppMenuItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search-box',
  templateUrl: 'app-search-box.component.html',
  inputs: ['inputPlaceholder', 'queryPath : entities', 'notFoundPlaceholder: notFound', 'hint', 'formFieldClass'],
  styleUrls: ['dialog.components.css', 'home.component.css'],
  exportAs: 'appSearchBox'
})
export class AppSearchBox {

  inputPlaceholder:string;
  menuItems: AppMenuItem[] = [];
  searchTimerId: any = null;
  queryPath: string;
  notFoundPlaceholder: string;
  hint: string;
  exclude: number[] = [];
  formFieldClass: string='';

  @Output() menuSelectedItem?: AppMenuItem;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatMenu) inputMenu: MatMenu;

  async getMenuItems(search: string) {
    try {
      this.menuItems = await getEntities(search, this.exclude, this.queryPath);

      if (this.notFoundPlaceholder && this.menuItems.length < 1) {
        this.menuItems = [{ id: '', name: this.notFoundPlaceholder }];
      }
    }
    catch (e) {
      console.error(e);
      this.menuItems = [{ id: '', name: 'Error: ' + e }];
      throw e;
    }

   this.trigger.openMenu();
  }

  startSearch(search: string, now: boolean) {
    clearTimeout(this.searchTimerId);

    let timeout = 0;
    if (!now) {
      switch (search.length) {
        case 0:
          this.menuSelectedItem = undefined;
          return;
        case 1:
          timeout = 2000;
          break;
        case 2:
          timeout = 1000;
          break;
        default:
          timeout = 500;
          break;
      }
    }

    this.searchTimerId = setTimeout(() => {
      this.getMenuItems(search);
    }, timeout);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.startSearch(value, false);
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        if(this.trigger.menuOpen)
        {
          this.trigger.focus();
          this.inputMenu.focusFirstItem();
          event.stopPropagation();
          break;
        }
        /* falls through */
      case 'Enter':
        {
          const value = (event.target as HTMLInputElement).value.trim();
          this.startSearch(value, true);
          event.stopPropagation();
        }
        break;
      case 'Escape':
        this.trigger.closeMenu();
        event.stopPropagation();
        break;
    }
  }

  setMenuSelectedItem(item: AppMenuItem) {
    if(item.id===''){
      this.menuSelectedItem = undefined;
    }
    else{
    this.menuSelectedItem = item;
    }
  }
}
