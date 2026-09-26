import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, ToastModule],
  providers: [MessageService],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
