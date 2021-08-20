import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DialogAddEvent, DialogAddFile, DialogAddSubject, DialogConfirmDeleteFile } from './dialog.components';
import { EventInfo, EventSubject, EventsDataSource, EventsInfo } from './events-data-source';
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
  subjects: EventSubject[];
  selection = new SelectionModel<number>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) { }

  dialogOptions: MatDialogConfig = {autoFocus: true, disableClose:true, restoreFocus:true};

  async ngOnInit() {
    const result : EventsInfo|null = await this.dataSource.loadEvents(
      0,
      10);

    this.paginator.length = result ? result.total : 0;
    this.paginator.pageSize = result ? result.count : 10;
    this.paginator.pageIndex = result ? result.offset/result.count : 0;
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadEventsPage(this.paginator.pageIndex))
        )
        .subscribe();
  }

  async loadEventsPage(pageIndex: number) {
      const result : EventsInfo|null = await this.dataSource.loadEvents(
          pageIndex,
          this.paginator.pageSize);

      this.paginator.length = result ? result.total : 0;
      this.paginator.pageSize = result ? result.count : 10;
      this.paginator.pageIndex = result ? result.offset/result.count : 0;
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
    this.dialog.open(DialogConfirmDeleteFile, this.dialogOptions);
  }

  onDeleteFile(row: EventInfo, id: number) {
    this.dialog.open(DialogConfirmDeleteFile, this.dialogOptions)
    .afterClosed()
    .subscribe(async result => {
      if(result==='delete')
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
      if(result==='updated') this.loadEventsPage(this.paginator.pageIndex);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.dataSource.data.map(e=>e.id)));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row.id) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
