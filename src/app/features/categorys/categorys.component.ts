import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorys',
  standalone: true,
  imports: [],
  templateUrl: './categorys.component.html',
  styleUrl: './categorys.component.css',
})
export class CategorysComponent {
  private readonly router = inject(Router)

  goToCategory(categoryId: number) {
    this.router.navigate(['/animes/category', categoryId]);
  }
}
