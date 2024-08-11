import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';

@NgModule({
  declarations: [
    HeaderComponent,
    SpinnerComponent
  ],
  imports: [SharedModule, RouterModule],
  providers: [provideHttpClient(withInterceptors([spinnerInterceptor]))],
  exports: [HeaderComponent, SpinnerComponent]
})
export class CoreModule {}
