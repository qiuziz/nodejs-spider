import { Injectable } from '@angular/core';
import { IMAGES } from '../assets/mock/image';
import { Observable, from } from 'rxjs';
import { toPromise } from 'rxjs/operator/toPromise';
import { map } from 'rxjs/operator/map';
interface Image {
  id: number;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  getImages(): Observable<Image[]> {
    return from([IMAGES]);
  }
}
