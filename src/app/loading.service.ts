import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  isLoading = true;
  constructor() { }

  setLoading(flag: boolean) {
    setTimeout(() => {
      this.isLoading = flag;
    });
  }
}
