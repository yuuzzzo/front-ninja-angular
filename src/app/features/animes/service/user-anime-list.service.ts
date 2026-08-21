import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type AnimeListType = 'WANT_TO_WATCH' | 'WATCHED' | 'LIKED' | 'DISLIKED';

export interface ToggleListResponse {
  message: string;
  action: 'added' | 'removed';
  data?: any;
}

export interface ListCounters {
  WANT_TO_WATCH: number;
  WATCHED: number;
  LIKED: number;
  DISLIKED: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserAnimeListService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/user-anime-list'; // Ajuste sua URL base aqui

  toggleList(animeId: string, listType: AnimeListType): Observable<ToggleListResponse> {
    return this.http.post<ToggleListResponse>(`${this.apiUrl}/toggle`, { animeId, listType });
  }

  getCounters(): Observable<ListCounters> {
    return this.http.get<ListCounters>(`${this.apiUrl}/counters`);
  }

  getListByType(type: AnimeListType): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${type}`);
  }
}
