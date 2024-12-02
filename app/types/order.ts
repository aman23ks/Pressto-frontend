// app/types/order.ts
export interface Shop {
    id: string;
    name: string;
    rating: number;
    distance: string;
    pricePerItem: number;
    totalOrders: number;
    deliveryTime: string;
}
  
export interface OrderItem {
    type: string;
    count: number;
    pricePerItem: number;
}
  
export interface PickupDetails {
    date: string;
    time: string;
    address: {
        street: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
    };
    specialInstructions?: string;
}
  
export interface NewOrder {
    shopId: string;
    items: OrderItem[];
    pickup: PickupDetails;
}