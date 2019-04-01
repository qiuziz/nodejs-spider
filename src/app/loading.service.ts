import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  isLoading = false;
  constructor() { }

  setLoading(flag: boolean) {
    setTimeout(() => {
      this.isLoading = flag;
    });
  }
}
