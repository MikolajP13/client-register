import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrl: './edit-client-dialog.component.scss'
})
export class EditClientDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<EditClientDialogComponent>);
  private clientData = inject<Client>(MAT_DIALOG_DATA);
  client = signal<Client | undefined>(undefined);

  ngOnInit(): void {
    this.client.set(this.clientData);
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

}
