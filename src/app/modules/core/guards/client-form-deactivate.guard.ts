import { CanDeactivateFn } from '@angular/router';
import { ClientFormComponent } from '../../clients/components/client-form/client-form.component';

export const clientFormDeactivateGuard: CanDeactivateFn<ClientFormComponent> = (component, currentRoute, currentState, nextState) => {
  if(component.clientForm.dirty) {
    return window.confirm('You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost');
  } else {
    return true;
  }
};
