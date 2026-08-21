import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { AnimesService } from './service/animes.service';
import { CommonModule, Location } from '@angular/common';
import { Animes } from '../../shared/models/animes.model';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';

interface Category {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-animes',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './animes.component.html',
  styleUrl: './animes.component.css',
})
export class AnimesComponent implements OnInit, OnDestroy {
  private readonly animesService = inject(AnimesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);
  private routeSub!: Subscription;

  animes = signal<Animes[]>([]);
  isLoading = signal<boolean>(true);
  currentCategoryId = signal<number | null>(null);
  searchTerm = signal<string>('');

  isSidebarClosed = signal<boolean>(false);

  categories: Category[] = [
    { id: 1, name: 'Romance', icon: '💖' },
    { id: 2, name: 'Ação', icon: '⚔️' },
    { id: 3, name: 'Terror', icon: '👻' },
    { id: 5, name: 'Isekai', icon: '🌀' },
    { id: 6, name: 'Sports', icon: '⚽' },
    { id: 7, name: 'Clássicos', icon: '👑' },
    { id: 8, name: 'Todos os pergaminhos', icon: '🎬' }
  ];

  currentCategory = computed(() => {
    const id = this.currentCategoryId();
    return this.categories.find(c => c.id === id) || { name: 'Todos os Animes', icon: '🎬' };
  });

  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.animes();

    return this.animes().filter(anime =>
      anime.title?.toLowerCase().includes(term)
    );
  });

  toggleSidebar(): void {
    this.isSidebarClosed.update(state => !state);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      const parsedId = categoryId ? Number(categoryId) : null;

      this.currentCategoryId.set(parsedId);
      this.searchTerm.set('');
      this.loadAnimes(parsedId ?? undefined);
    });
  }

  loadAnimes(categoryId?: number): void {
    this.isLoading.set(true);

    if (categoryId === 8) {
      this.animesService.allAnimes().subscribe({
        next: (dados) => {
          this.animes.set(dados);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erro ao buscar animes:', err);
          this.isLoading.set(false);
        }
      });
      return;
    }

    this.animesService.animes(categoryId).subscribe({
      next: (dados) => {
        this.animes.set(dados);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar anime com categoria:', err);
        this.isLoading.set(false);
      }
    });
  }

  showDescriptionAnime(id: string): void {
    this.router.navigate(['anime/description/', id]);
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
