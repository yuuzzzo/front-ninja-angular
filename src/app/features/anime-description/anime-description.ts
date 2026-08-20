import { Component, inject, OnInit, signal } from '@angular/core';
import { AnimesService } from '../animes/service/animes.service';
import { Animes } from '../../shared/models/animes.model';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  private routeSub!: Subscription;

  isLoading = signal<boolean>(false);
  animes = signal<Animes | null>(null);
  currentId = signal<string>('');

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.currentId.set(id);
        this.loadAnime(id);
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

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
