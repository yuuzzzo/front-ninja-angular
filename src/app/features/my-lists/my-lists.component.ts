import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserAnimeListService, AnimeListType } from '../animes/service/user-anime-list.service';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-lists.component.html',
  styleUrl: './my-lists.component.css'
})
export class MyListsComponent implements OnInit {
  private readonly userListService = inject(UserAnimeListService);
  private readonly location = inject(Location);

  activeTab = signal<AnimeListType>('WANT_TO_WATCH');
  isLoading = signal<boolean>(false);
  animesList = signal<any[]>([]);

  tabs: { key: AnimeListType; label: string }[] = [
    { key: 'WANT_TO_WATCH', label: 'Quero Assistir' },
    { key: 'WATCHED', label: 'Já Assisti' },
    { key: 'LIKED', label: 'Gostei' },
    { key: 'DISLIKED', label: 'Não Gostei' }
  ];

  ngOnInit(): void {
    this.loadCurrentTabList();
  }

  selectTab(tab: AnimeListType): void {
    this.activeTab.set(tab);
    this.loadCurrentTabList();
  }

  loadCurrentTabList(): void {
    this.isLoading.set(true);
    const type = this.activeTab();

    this.userListService.getListByType(type).subscribe({
      next: (data) => {
        const extractedAnimes = data
          .map(item => item.animeId)
          .filter(anime => anime !== null && anime !== undefined);

        this.animesList.set(extractedAnimes);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar lista de animes', err);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
