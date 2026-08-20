import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Signal reativo que guarda a notificação atual (null quando não há alerta na tela)
  toast = signal<ToastData | null>(null);

  // Método público para disparar o alerta
  show(message: string, type: ToastType = 'info', duration: number = 6000): void {
    // 1. Atualiza o estado do Signal com os dados do alerta
    this.toast.set({ message, type });

    // 2. Remove o alerta automaticamente após o tempo definido (ex: 3 segundos)
    setTimeout(() => {
      this.clear();
    }, duration);
  }

  // Método para fechar o alerta manualmente
  clear(): void {
    this.toast.set(null);
  }
}
