import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { UserDTO } from 'src/app/Models/user.dto';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users!: UserDTO[];
  public loading = true;

  constructor(
    private router: Router,
    private userService: UserService,
    public loggedUser: LoggedUserData
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (users: UserDTO[]) => {
        this.loading = false;
        this.users = users;
      },
    });
  }

  userForm(userId: string): void {
    this.router.navigateByUrl('user/' + userId);
  }

  deleteUser(userId: string): void {
    if (userId != this.loggedUser.id) {
      // show confirmation popup
      let result = confirm('Confirma para borrar al usuario ' + userId + ' .');

      if (result) {
        this.loading = true;
        this.userService.deleteUser(userId).subscribe({
          //complete: () => {},
          error: (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error.error);
          },
          next: () => {
            this.loadUsers();
          },
        });
      }
    }
  }
}
