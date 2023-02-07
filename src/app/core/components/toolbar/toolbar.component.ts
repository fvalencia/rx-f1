import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  routes = [
    {
      url: '/drivers',
      name: 'Drivers',
    },
    {
      url: '/races',
      name: 'Races',
    },
  ];

  get activeRoute() {
    return this.router.url;
  }

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
