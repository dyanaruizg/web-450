import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GardenDetailsComponent } from './garden/garden-details/garden-details.component';
import { GardenListComponent } from './garden/garden-list/garden-list.component';
import { GardenAddComponent } from './garden/garden-add/garden-add.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'gardens',
    component: GardenListComponent
  },
  {
    path: 'gardens/add',
    component: GardenAddComponent
  },
  {
    path: 'gardens/:gardenId',
    component: GardenDetailsComponent
  }
];
