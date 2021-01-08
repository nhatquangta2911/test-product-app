import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { finalize, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PAGINATOR } from 'src/app/shared/constants/constants';
import { ProductService } from './../../core/services/product.service';
import {
  ModifyProductResponse,
  Product
} from './../../shared/models/product.model';
import { GetProductListRequest } from 'src/app/shared/models/product.model';
import { ProductDataSource } from './product.dataSource';
import { NotificationService } from './../../core/services/notification.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {
  defaultPageNumber = PAGINATOR.DEFAULT_PAGE_NUMBER;
  defaultPageSize = PAGINATOR.DEFAULT_PAGE_SIZE;
  displayedColumns = ['code', 'name', 'description', 'actions'];
  productList: Product[] = [];
  dataSource: ProductDataSource | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paginator.pageIndex = this.defaultPageNumber;
    this.paginator.pageSize = this.defaultPageSize;
    this.dataSource = new ProductDataSource(this.productService);
    this.loadData();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => {
          this.loadData();
        })
      )
      .subscribe();
  }

  loadData() {
    const request: GetProductListRequest = {
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize
    };
    this.dataSource.loadProducts(request);
  }

  onAddProduct() {
    this.router.navigate(['add'], {
      relativeTo: this.route.parent,
      state: { type: 'add' }
    });
  }

  onUpdateProduct(product: any) {
    this.router.navigate(['update'], {
      relativeTo: this.route.parent,
      state: { type: 'update', product }
    });
  }

  onDeleteProduct(code: string) {
    const deleteRequest = this.productService.deleteProduct(code).pipe(
      tap((data: ModifyProductResponse) => {
        if (data.status === true) {
          this.loadData();
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
