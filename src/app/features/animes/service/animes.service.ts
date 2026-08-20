import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Animes } from "../../../shared/models/animes.model";

@Injectable({
  providedIn: 'root'
})
export class AnimesService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  animes(categoryId?: number): Observable<any> {
    return this.http.get<Animes[]>(`${this.API_URL}/animes/category/${categoryId}`);
  }

  allAnimes(): Observable<any> {
    return this.http.get<Animes[]>(`${this.API_URL}/animes`);
  }

  anime(id: string): Observable<any> {
    return this.http.get<Animes[]>(`${this.API_URL}/animes/${id}`);
  }
}
