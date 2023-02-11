import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrdersComponent implements OnInit {
  orders!: Order[];

  constructor(private ordersService: OrdersService){}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
      this.ordersService.getOrders().subscribe({
        next: (orders)  => {
          this.orders = orders;
          //console.log(orders);
        },
        error: (e) => console.log(e)
        
      })
  }

}
