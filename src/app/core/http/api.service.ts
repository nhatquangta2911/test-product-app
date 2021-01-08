import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GetProductListRequest } from 'src/app/shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.url_api}${path}`, { ...params });
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http.post(`${environment.url_api}${path}`, body);
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(`${environment.url_api}${path}`, JSON.stringify(body));
  }

  delete(
    path: string,
    headers?: any,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http.delete(`${environment.url_api}${path}`, {
      headers
    });
  }

  getWithPaginators(
    path: string,
    query: GetProductListRequest,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http.get(
      `${environment.url_api}${path}?page=${query.page}&size=${query.size}`,
      { params }
    );
  }
}
