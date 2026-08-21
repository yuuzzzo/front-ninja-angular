import { Component, inject, OnInit, signal } from '@angular/core';
import { AnimesService } from '../animes/service/animes.service';
import { Animes } from '../../shared/models/animes.model';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAnimeListService, AnimeListType } from '../animes/service/user-anime-list.service';

@Component({
  selector: 'app-anime-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anime-description.html',
  styleUrl: './anime-description.css',
})
export class AnimeDescriptionComponent implements OnInit {
  private readonly animesService = inject(AnimesService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly userListService = inject(UserAnimeListService);
  private routeSub!: Subscription;

  userLists = signal<Record<AnimeListType, boolean>>({
    'WANT_TO_WATCH': false,
    'WATCHED': false,
    'LIKED': false,
    'DISLIKED': false,
  });

  isLoading = signal<boolean>(false);
  animes = signal<Animes | null>(null);
  currentId = signal<string>('');

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.currentId.set(id);
        this.loadAnime(id);
        this.loadUserListsStatus(id);
      }
    })
  }

  loadAnime(id: string): void {
    if (!id) return;

    this.isLoading.set(true);

    this.animesService.anime(id).subscribe({
      next: (dados) => {
        this.animes.set(dados);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar o anime especifico', err);
        this.isLoading.set(false);
      }
    })
  }

  loadUserListsStatus(animeId: string): void {
    const types: AnimeListType[] = ['WANT_TO_WATCH', 'WATCHED', 'LIKED', 'DISLIKED'];

    types.forEach((type) => {
      this.userListService.getListByType(type).subscribe({
        next: (list: any[]) => {
          const isPresent = list.some((item) => {
            const targetId = item.animeId?._id ? item.animeId._id : item.animeId;
            return targetId?.toString() === animeId?.toString();
          });

          this.userLists.update((prev) => ({
            ...prev,
            [type]: isPresent,
          }));
        },
        error: (err) => console.error(`Erro ao verificar lista ${type}`, err),
      });
    });
  }

  toggleAnimeList(listType: AnimeListType): void {
    const id = this.currentId();
    if (!id) return;

    this.userListService.toggleList(id, listType).subscribe({
      next: (res) => {
        this.userLists.update((prev) => ({
          ...prev,
          [listType]: res.action === 'added',
        }));
      },
      error: (err) => console.error('Erro ao atualizar lista', err),
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
