import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../../../core/models/client.model';
import { ClientsService } from '../../../../core/services/clients.service';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrl: './edit-client-dialog.component.scss'
})
export class EditClientDialogComponent implements OnInit {
  private clientService = inject(ClientsService);
  private dialogRef = inject(MatDialogRef<EditClientDialogComponent>);
  private data = inject<string>(MAT_DIALOG_DATA);
  client = signal<Client | undefined>(undefined);

  ngOnInit(): void {
    this.clientService.getClient(this.data)
      .subscribe({
        next: (client) => this.client.set(client),
      });
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

}
