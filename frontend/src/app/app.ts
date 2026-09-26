import { Component, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-root',
  imports: [Toolbar, Card, Message, ButtonDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly primengChecked = signal(false);

  protected confirmPrimeNg(): void {
    this.primengChecked.set(true);
  }
}
