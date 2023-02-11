import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.css']
})
export class OrderDetailedComponent implements OnInit {
  order!: Order;

  constructor(private ordersService: OrdersService, private activatedRoute: ActivatedRoute,
    public bcService: BreadcrumbService){
      this.bcService.set('@OrderDetails', " ");
    }


  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.ordersService.getOrder(+id).subscribe({
      next: order => {
        this.order = order;
        this.bcService.set('@OrderDetails', `Order# ${order.id} - ${order.status}`);
      },
      error: error => console.log(error)
    })
  }
}
