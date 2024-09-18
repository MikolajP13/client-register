import { NgModule } from "@angular/core";
import { InfoRoutingModule } from "./info-routing.module";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material/material.module";
import { ContactComponent } from "./contact/contact.component";

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, InfoRoutingModule, MaterialModule],
  exports: [],
})
export class InfoModule {}