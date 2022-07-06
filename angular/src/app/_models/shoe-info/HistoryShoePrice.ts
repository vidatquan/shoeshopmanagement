import { Moment } from 'moment';
export class HistoryShoePrice {
    Id: number;
    ShoeId: number;
    RealPrice: number;
    SellPrice: number;
    ApplyDate: Moment|null;
    ExpiryDate: Moment|null;
    
    }