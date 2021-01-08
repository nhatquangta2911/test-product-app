import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApiService } from './http/api.service';
import { NotificationService } from './services/notification.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [HttpClientModule, MatSnackBarModule],
  providers: [ApiService, NotificationService, ProductService],
  declarations: []
})
export class CoreModule {}
