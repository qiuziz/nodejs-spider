import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from 'src/app/loading.service';
interface Image {
  id: number;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, public loadingService: LoadingService) { }

  getImages(page: number = 1): Observable<Image[]> {
    this.loadingService.setLoading(true);
    return this.http.get<Image[]>(`/jandan/images?page=${page}`).pipe(
      catchError(() => {
        this.loadingService.setLoading(false);
        return of([]);
      })
    );
  }

  like(data: object): Observable<{}> {
    this.loadingService.setLoading(true);
    return this.http.post<{}>(`/jandan/like`, data).pipe(
      catchError(() => {
        this.loadingService.setLoading(false);
        return of({});
      })
    );
  }


  getList(data: object = {page: 1}): Observable<Image[]> {
    this.loadingService.setLoading(true);
    return this.http.post<Image[]>(`/jandan/like/list`, data).pipe(
      catchError(() => {
        this.loadingService.setLoading(false);
        return of([]);
      })
    );
  }
  deleteImg(data: object): Observable<{}> {
    this.loadingService.setLoading(true);
    return this.http.post<{}>(`/jandan/delete`, data).pipe(
      catchError(() => {
        this.loadingService.setLoading(false);
        return of({});
      })
    );
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
