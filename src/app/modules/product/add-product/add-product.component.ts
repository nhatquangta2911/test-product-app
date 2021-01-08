import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {
  ModifyProductResponse,
  Product
} from '../../../shared/models/product.model';
import { NotificationService } from './../../../core/services/notification.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  type: string;
  product: Product = {} as Product;
  initialProductDetails: Product = {} as Product;
  addProductForm: FormGroup;
  maxTextlength: number = 5;
  constructor(
    private router: Router,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras?.state as {
      type: string;
      product: Product;
    };
    this.type = state?.type ?? 'add';
    this.product = state?.product;
    this.addProductForm = new FormGroup({});
  }

  ngOnInit() {
    this.addProductForm = this.createForm(this.product);
    this.initialProductDetails = this.addProductForm.getRawValue();
  }

  createForm(product: Product): FormGroup {
    return new FormGroup({
      code: new FormControl(
        { value: product?.code || '', disabled: this.type === 'update' },
        [Validators.required]
      ),
      name: new FormControl(product?.name || '', [Validators.required]),
      description: new FormControl(product?.description || '', [
        Validators.maxLength(250)
      ]),
      category: new FormControl(product?.category || '', []),
      brand: new FormControl(product?.brand || '', []),
      type: new FormControl(product?.type || '', [])
    });
  }

  hasFormChanged() {
    return (
      JSON.stringify(this.addProductForm.getRawValue()) !==
      JSON.stringify(this.initialProductDetails)
    );
  }

  onReset() {
    this.addProductForm = this.createForm(this.initialProductDetails);
  }

  onCancel() {
    this.notificationService
      .showConfirmDialog('CONFIRMATION', 'Are you sure you want to cancel?')
      .subscribe(data => {
        if (data.isConfirmed) {
          this.router.navigate(['/']);
        }
      });
  }

  onSubmit() {
    const productFormValue = this.addProductForm.getRawValue() as Product;
    this.type === 'add'
      ? this.productService.addProduct(productFormValue).subscribe(
          data => {
            this.router.navigate(['/']);
            this.notificationService.showNotification(
              'snackbar-success',
              'Added successfully.'
            );
          },
          error =>
            this.notificationService.showNotification(
              'snackbar-danger',
              'Something went wrong. Please try again.'
            )
        )
      : this.productService
          .updateProduct(productFormValue.code, productFormValue)
          .subscribe(
            data => {
              this.router.navigate(['/']);
              this.notificationService.showNotification(
                'snackbar-success',
                'Updated successfully.'
              );
            },
            error =>
              this.notificationService.showNotification(
                'snackbar-danger',
                'Something went wrong. Please try again.'
              )
          );
  }

  onDeleteProduct(code: string) {
    const deleteRequest = this.productService.deleteProduct(code).pipe(
      tap((data: ModifyProductResponse) => {
        if (data.status === true) {
          this.router.navigate(['/']);
          this.notificationService.showNotification(
            'snackbar-success',
            'Deleted successfully.'
          );
        } else {
          this.notificationService.showNotification(
            'snackbar-danger',
            'Something went wrong. Please try again.'
          );
        }
      })
    );
    this.notificationService
      .showConfirmDialog(
        'Confirmation',
        `Are you sure you want to delete this product?`,
        deleteRequest,
        `Deleting...`
      )
      .subscribe();
  }
}
