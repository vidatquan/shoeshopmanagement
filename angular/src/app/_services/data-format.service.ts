import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DataFormatService {

  constructor() { }

  // Tiền
  moneyFormat(value) {
    return value ? Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0';
  }

  // Số
  numberFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    // return value ? parseFloat(Math.round((+value) * 100) / 100).toFixed(2) : '';
    return value ? parseFloat(value).toString() : '';
  }

  // Ngày
  dateFormat(val) {
    return val ? moment(val).format('DD/MM/YYYY') : null
  }

  monthFormat(val) {
    return val ? moment(val).format('MMM-YYYY') : null
  }


  // Ngày giờ
  dateTimeFormat(val) {
    return moment(val).format('DD/MM/YYYY, HH:mm');
  }

  // Biển số xe
  registerNoValidate(registerNo: string) {
    const REGISTER_NO_REGEX = /^\d{2}\D{1}[-. ]?\d{4}[\d{1}]?$/g;
    return REGISTER_NO_REGEX.test(registerNo);
  }

  // Số điện thoại
  phoneNumberValidate(phoneNumber) {
    const PHONE_NUMBER_REGEX = /(0|[+]([0-9]{2})){1}[ ]?[0-9]{2}([-. ]?[0-9]){7}|((([0-9]{3}[- ]){2}[0-9]{4})|((0|[+][0-9]{2}[- ]?)(3|7|8|9|1)([0-9]{8}))|(^[\+]?[(][\+]??[0-9]{2}[)]?([- ]?[0-9]{2}){2}([- ]?[0-9]{3}){2}))$/gm;
    return !phoneNumber || PHONE_NUMBER_REGEX.test(phoneNumber);
  }

  // Mã màu
  colorValidate(color) {
    const COLOR_REGEX = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;
    return COLOR_REGEX.test(color);
  }

  // Không được là số âm
  notNegativeNumberValidate(params) {
    return !(params.value !== '' && (params.value && Number(params.value) < 0));
  }

  // Số nguyên dương
  positiveNumberValidate(params) {
    const NUMBER_REG = /^\d*[1-9]+\d*$/;
    // return !(params.value !== '' && ((params.value && Number(params.value) <= 0) || !NUMBER_REG.test(params.value)));
    return NUMBER_REG.test(params);
  }

  // Số nguyên không âm
  notNegativeIntNumberValidate(params) {
    const NUMBER_REG = /^\d+$/g;
    return NUMBER_REG.test(params);
  }

  // Số nguyên
  intNumberValidate(params) {
    const NUMBER_REG = /^([+-]?[1-9]\d*|0)$/;
    return !(params.value !== '' && !NUMBER_REG.test(params.value));
  }

  emailValidate(email) {
    const NUMBER_REG = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return NUMBER_REG.test(email);
  }

  /* For Sale */
  // Format input trong Cell Grid sang dạng DateTime để truyền xuống database
  formatInputToDateTime(input) {
    const date = new Date(input);
    return date;
  }

  // format từ số giây sang giờ
  formatHoursSecond(seconds) {
    if (seconds && seconds > 0) {
      const hours = Math.floor(seconds / 3600) < 10 ? `0${Math.floor(seconds / 3600)}` : Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60) < 10 ? `0${Math.floor((seconds % 3600) / 60)}` : Math.floor((seconds % 3600) / 60);
      // const second = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
      return `${hours}:${minutes}`;
    } else if (seconds === 0) {
      return `00:00`;
    } else if (!seconds) {
      return '';
    }
  }

  //convert từ giờ nhập vào sang số giây
  convertTimeToSeconds(time: string): number {
    return time.split(':').reverse().reduce((prev, curr, i) => prev + +curr * Math.pow(60, i), 0);
  }

  //format Date for sale
  formatDateForSale(date) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    if (date) {
      let convertDate;
      if (typeof date === 'string' && date.length === 1) {
        return date;
      }

      if (isFirefox && typeof date === 'string') {
        const dateArr = date.split('-');
        date = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
      }
      convertDate = new Date(date);
      const displayDate = convertDate.getDate() < 10 ? `0${convertDate.getDate()}` : convertDate.getDate();
      const formattedMonth = convertDate.getMonth() < 9 ? `0${convertDate.getMonth() + 1}` : convertDate.getMonth() + 1;
      const displayMonth = moment(formattedMonth, 'MM').format('MMM');

      return convertDate ? `${displayDate}-${displayMonth}-${convertDate.getFullYear()}` : '';
    }
    return '';
  }
}
