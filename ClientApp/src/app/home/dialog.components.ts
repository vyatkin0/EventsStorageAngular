import { Component, Inject, ViewChild } from '@angular/core';
import { addEntity, dateToUrl, uploadFile } from '../../utils';

import { AppSearchBox } from './app-search-box.component'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface AppEntity{
  id: number;
}
@Component({
  selector: 'dialog-add-file',
  templateUrl: 'dialog-add-file.html',
  styleUrls: ['dialog.components.css'],
})
export class DialogAddFile {
  error: any;
  lastResult?: AppEntity;
  fileToUpload: File;
  uploading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {eventId: string}) { }

  onChangeFile(event: Event) {
      const files: FileList = (event.target as any)?.files;
      this.fileToUpload = files[0];
  }
  async onUpload() {
    this.lastResult = undefined;
    this.error = undefined;

    const formData: FormData = new FormData();
    formData.append('eventId', this.data.eventId);
    formData.append('formFile', this.fileToUpload, this.fileToUpload.name);

    this.uploading = true;

    try {
      this.lastResult = await uploadFile(formData, 'uploadFile');

      //Reload events
    }
    catch (e) {
      console.error(e);
      this.error = e;
      throw e;
    }
    finally{
      this.uploading = false;
    }
  }
}

@Component({
  selector: 'dialog-add-subject',
  templateUrl: 'dialog-add-subject.html',
  styleUrls: ['dialog.components.css'],
})
export class DialogAddSubject {
  error: any;
  lastResult?: AppEntity;
  name: string;
  createdOn?: Date;
  async addSubject() {
    this.lastResult = undefined;
    this.error = undefined;

    try {
      this.lastResult = await addEntity({
        name: this.name,
        createdOn: this.createdOn ? dateToUrl(this.createdOn) : null,
      }, 'subject');
    }
    catch (e) {
      console.error(e);
      this.error = e;
      throw e;
    }
  }
}

@Component({
  selector: 'dialog-add-event',
  templateUrl: 'dialog-add-event.html',
  styleUrls: ['dialog.components.css'],
})
export class DialogAddEvent {
  error: any;
  lastResult?: AppEntity;
  description: string;
  updated: boolean = false;
  @ViewChild('subjectSearch') subjectSearch: AppSearchBox;

  constructor(public dialogRef: MatDialogRef<DialogAddEvent>) {
  }
  async addEvent() {
    this.lastResult = undefined;
    this.error = undefined;

    try {
      this.lastResult = await addEntity({
        subjectId: this.subjectSearch.menuSelectedItem?.id,
        description: this.description,
      }, 'event');

      this.updated = true;
    }
    catch (e) {
      console.error(e);
      this.error = e;
      throw e;
    }
  }

  onClose(): void {
    this.dialogRef.close(this.updated ? 'updated' : 'close');
  }
}


@Component({
  selector: 'dialog-confirm-delete-file',
  templateUrl: 'dialog-confirm-delete-file.html',
  styleUrls: ['dialog.components.css'],
})
export class DialogConfirmDeleteFile {
  constructor(public dialogRef: MatDialogRef<DialogAddEvent>) {
  }

  deleteFile(): void {
    this.dialogRef.close('delete');
  }
}
