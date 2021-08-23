import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuItem, AppSearchBox } from './app-search-box.component';
import { DialogAddEvent, DialogAddFile, DialogAddSubject, DialogConfirm } from './dialog.components';
import { EventInfo, EventsDataSource, EventsInfo } from './events-data-source';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { deleteEntity, getEntity } from '../../utils';

import { MatPaginator } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['select', 'id', 'subjectId', 'subjectName', 'description', 'createdAt', 'file'];
  dataSource = new EventsDataSource();
  subjects: AppMenuItem[] = [];
  selection = new SelectionModel<number>(true, []);
  currentPageEvents: EventInfo[] = [];

  @ViewChild('subjectSearch') subjectSearch: AppSearchBox;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) { }

  dialogOptions: MatDialogConfig = {autoFocus: true, disableClose:true, restoreFocus:true};

  async ngOnInit() {
    this.loadEventsPage(0, 10);
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadEventsPage(this.paginator.pageIndex, this.paginator.pageSize))
        )
        .subscribe();
  }

  async loadEventsPage(pageIndex: number, pageSize: number) {
      const result : EventsInfo|null = await this.dataSource.loadEvents(
          pageIndex,
          pageSize,
          this.subjects.map(s=>s.id as number));

      this.selection.clear();

      this.currentPageEvents = result ? result.events : [] as EventInfo[];
      this.paginator.length = result ? result.total : 0;
      this.paginator.pageSize = result ? result.count : pageSize;
      this.paginator.pageIndex = result ? result.offset/result.count : pageIndex;
  }

  openAddFileDialog(row: EventInfo,) {
    this.dialog.open(DialogAddFile, {...this.dialogOptions, data: { eventId:row.id }})
    .afterClosed()
    .subscribe(result => {
      if(result==='added') {
        this.updateEventRow(row);
      }
    });
  }

  openAddSubjectDialog() {
    this.dialog.open(DialogAddSubject, this.dialogOptions);
  }

  openConfirmDeleteDialog() {
    this.dialog.open(DialogConfirm, {...this.dialogOptions, data: {
      title:'Delete Events',
      message:'Do you really want to delete selected events?',
    }}).afterClosed()
    .subscribe(async result => {
      if(result==='yes')
      {
        await deleteEntity({ids:this.selection.selected},'events');
        let pageIndex = this.paginator.pageIndex;
        if(pageIndex>0 && this.isAllSelected()) {
          --pageIndex;
        }

        this.loadEventsPage(pageIndex, this.paginator.pageSize);
      }
    });
  }

  onDeleteFile(row: EventInfo, id: number) {
    this.dialog.open(DialogConfirm, {...this.dialogOptions, data: {
      title:'Delete File',
      message:'Do you really want to delete file?',
    }}).afterClosed()
    .subscribe(async result => {
      if(result==='yes')
      {
        await deleteEntity({id},'file')
        this.updateEventRow(row);
      }
    });
  }

  async updateEventRow(row: EventInfo)
  {
    const e: EventInfo = await getEntity({id:row.id},'event');
    row.createdAt = e.createdAt;
    row.description = e.description;
    row.files = e.files;
    row.subject = e.subject;
  }

  openAddEventDialog() {
    this.dialog.open(DialogAddEvent, this.dialogOptions)
    .afterClosed()
    .subscribe(result => {
      if(result==='updated') {
        this.loadEventsPage(this.paginator.pageIndex,this.paginator.pageSize);
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.currentPageEvents.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.currentPageEvents.map(e=>e.id)));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row.id) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addSubject(subject:AppMenuItem) {
    this.subjects.push(subject);
    this.subjectSearch.clearSelection();
    this.loadEventsPage(0, this.paginator.pageSize);
  }
  removeSubject(id:number|undefined) {

    if(id === undefined) return;

    this.subjects = this.subjects.filter(s=>s.id!==id);
    this.loadEventsPage(0, this.paginator.pageSize);
  }
}
