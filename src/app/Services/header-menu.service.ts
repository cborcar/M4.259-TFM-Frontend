import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenuDTO } from '../Models/header-menu.dto';

@Injectable({
  providedIn: 'root',
})
export class HeaderMenuService {
  headerManagement: BehaviorSubject<HeaderMenuDTO> =
    new BehaviorSubject<HeaderMenuDTO>({
      showNavigationMenu: false,
    });
}
