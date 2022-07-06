import { Moment } from 'moment';
export class Shoes {
  Id: number;
  ShoeName: string;
  ShoeCode: string;
  ShoeQty: number;
  ShoeSize: number;
  RealPrice: number;
  SellPrice: number
  Color: string;
  Gender:number;
  ShoeType: number;
  Note:string;
  Img: Int8Array;
  ImageString: string;
  IsDeleted: number;
  ModifyPriceTime: Moment|null;
  }