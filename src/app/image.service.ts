import { Injectable } from '@angular/core';
import { IMAGES } from '../assets/mock/image';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
interface Image {
  id: number;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imagesUrl = '/jandan/images/';  // URL to web api
  constructor(private http: HttpClient) { }

  getImages(page: number = 1): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.imagesUrl}?page=${page}`);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
