import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productTypes';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm!: ElementRef;
  products!: IProduct[];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams: ShopParams;
  totalCount = 0;

  sortOptions = [
    { value: "name", name: "Alphabetical" },
    { value: "priceDesc", name: "Price - High to low" },
    { value: "priceAsc", name: "Price - Low to high" },
  ];

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes()
  }


  getProducts() {
    this.shopService.getProducts().subscribe({
      next: response => {
        this.products = response.data;
        // this.shopParams.pageNumber = response!.pageIndex;
        // this.shopParams.pageSize = response!.pageSize;
        this.totalCount = response.count;
        console.log(response);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
        console.log(response);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: response => {
        this.types = [{ id: 0, name: 'All' }, ...response];
        console.log(response);
      },
      error: err => {
        console.log(err);
      }
    });
  }


  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.brandId = brandId;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.typeId = typeId;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm?.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

}
