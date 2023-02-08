import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { OrderToCreate } from 'src/app/shared/models/order';
import { Address } from 'src/app/shared/models/user';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, 
    private toastr: ToastrService, private router: Router) {}



    async submitOrder() {
      //this.loading = true;
      const basket = this.basketService.getCurrentBasketValue();
      if (!basket) return;
      const orderToCreate = this.getOrderToCreate(basket);
      if (!orderToCreate) return;
      this.checkoutService.createOrder(orderToCreate).subscribe({
        next: order => {
          this.toastr.success('Order created succesfully');
          this.basketService.deleteLocalBasket();
          console.log(order);
          const navigationExtras: NavigationExtras = {state: order};
          this.router.navigate(['checkout/success'], navigationExtras);
          
        }
      })
      // if (!basket) throw new Error('cannot get basket');
      // try {
      //   const createdOrder = await this.createOrder(basket);
      //   const paymentResult = await this.confirmPaymentWithStripe(basket);
      //   if (paymentResult.paymentIntent) {
      //     this.basketService.deleteBasket(basket);
      //     const navigationExtras: NavigationExtras = {state: createdOrder};
      //     this.router.navigate(['checkout/success'], navigationExtras);
      //   } else {
      //     this.toastr.error(paymentResult.error.message);
      //   }
      // } catch (error: any) {
      //   console.log(error);
      //   this.toastr.error(error.message)
      // } finally {
      //   this.loading = false;
      // }
    }


    private getOrderToCreate(basket: Basket): OrderToCreate {
      const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
      const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
      if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
      return {
        basketId: basket.id,
        deliveryMethodId: deliveryMethodId,
        shipToAddress: shipToAddress
      }
    }
}
