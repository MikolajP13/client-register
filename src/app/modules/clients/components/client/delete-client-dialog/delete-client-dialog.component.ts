import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../../../core/models/client.model';
import { ClientsService } from '../../../../core/services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-client-dialog',
  templateUrl: './delete-client-dialog.component.html',
  styleUrl: './delete-client-dialog.component.scss',
})
export class DeleteClientDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DeleteClientDialogComponent>);
  private clientData = inject<Client>(MAT_DIALOG_DATA);
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  errorMessage = signal('');
  client = signal<Client | null>(null);

  ngOnInit(): void {
    this.client.set(this.clientData);
  }

  onDelete() {
    const clientId = this.client()?.id;
    if (clientId) {
      this.clientsService.deleteClient(clientId).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/clients']);
        },
        error: () => this.errorMessage.set('An error ocurred!'),
      });
    }
  }
}
