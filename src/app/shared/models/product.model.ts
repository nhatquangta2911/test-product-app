export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  type: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface GetProductListRequest {
  page?: number;
  size?: number;
}

export interface AddProductRequest {
  code: string;
  name: string;
  category?: string;
  brand?: string;
  type?: string;
  description?: string;
}

export interface ModifyProductResponse {
  status: boolean;
  product: Product;
}
