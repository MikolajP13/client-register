import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { clientFormDeactivateGuard } from './client-form-deactivate.guard';

describe('clientFormDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => clientFormDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
