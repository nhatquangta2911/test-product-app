import { Injectable } from '@angular/core';
import {
  GetProductListRequest,
  ModifyProductResponse
} from 'src/app/shared/models/product.model';
import { ApiService } from './../http/api.service';
import { Observable } from 'rxjs';
import {
  Product,
  AddProductRequest
} from './../../shared/models/product.model';
import { API_ENDPOINT } from 'src/app/shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private readonly apiService: ApiService) {}

  getList(request: GetProductListRequest): Observable<Product[]> {
    return this.apiService.getWithPaginators(API_ENDPOINT.PRODUCT, request);
  }

  getProductByCode(code: string): Observable<Product> {
    return this.apiService.get(`${API_ENDPOINT.PRODUCT}/details/${code}`);
  }

  addProduct(request: AddProductRequest): Observable<ModifyProductResponse> {
    return this.apiService.post(`${API_ENDPOINT.PRODUCT}`, request);
  }

  updateProduct(
    code: string,
    request: AddProductRequest
  ): Observable<ModifyProductResponse> {
    return this.apiService.put(`${API_ENDPOINT.PRODUCT}/${code}`, request);
  }

  deleteProduct(code: string): Observable<ModifyProductResponse> {
    const headers = new Headers();
    headers.append('responseType', 'text');
    return this.apiService.delete(`${API_ENDPOINT.PRODUCT}/${code}`, headers);
  }
}
