import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductService } from 'src/app/core/services/product.service';

@NgModule({
  imports: [CommonModule, SharedModule, CommonModule, ProductRoutingModule],
  declarations: [ProductComponent, AddProductComponent],
  providers: [ProductService]
})
export class ProductModule {}
