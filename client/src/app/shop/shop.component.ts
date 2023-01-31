import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productTypes';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm!: ElementRef;
  products!: IProduct[];
  brands!: IBrand[];
  types!: IType[];
  shopParams = new ShopParams();
  totalCount = 0;

  sortOptions = [
    { value: "name", name: "Alphabetical"},
    { value: "priceDesc", name: "Price - High to low" },
    { value: "priceAsc", name: "Price - Low to high" },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes()
  }


  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response!.data;
        this.shopParams.pageNumber = response!.pageIndex;
        this.shopParams.pageSize = response!.pageSize;
        this.totalCount = response!.count;
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
        this.brands = [{id: 0, name:'All'}, ...response];
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
        this.types = [{id: 0, name:'All'}, ...response];
        console.log(response);
      },
      error: err => {
          console.log(err);
      }
    });
  }


  onBrandSelected(brandId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId= brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams= new ShopParams();
    this.getProducts();
  }

}
