import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Skinet';
  products!: IProduct[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<IPagination>('https://localhost:5001/api/products?pageSize=20')
      .subscribe({
        next: (response :IPagination) => {
          this.products = response.data;
          console.log(response);
        },
        error: err => {
            console.log(err);
        }
      });
  }
  
}
