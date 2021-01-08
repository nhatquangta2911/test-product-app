import { OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  GetProductListRequest,
  Product
} from './../../shared/models/product.model';

export class ProductDataSource implements DataSource<Product> {
  get data(): Product[] {
    return this.productResponseSubject?.value;
  }
  private productResponseSubject = new BehaviorSubject<Product[]>(
    [] as Product[]
  );

  @BlockUI() private readonly blockUI: NgBlockUI;
  constructor(private productService: ProductService) {}

  loadProducts(request: GetProductListRequest) {
    this.blockUI.start();
    this.productResponseSubject.next({} as Product[]);
    this.productService
      .getList(request)
      .pipe(
        catchError(error => of([])),
        finalize(() => this.blockUI.stop())
      )
      .subscribe((getProductResponse: Product[]) => {
        this.productResponseSubject.next(getProductResponse);
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.productResponseSubject;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.productResponseSubject.complete();
  }
}
