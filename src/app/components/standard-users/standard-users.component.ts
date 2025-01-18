import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule, NgIf} from '@angular/common';
import {DistributionService} from '../../services/distribution/distribution.service';
import {standardUser} from '../../models/standardUser.model';
import {MatSortModule} from '@angular/material/sort';
import { Router } from '@angular/router';


@Component({
  selector: 'app-standard-users',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, NgIf, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './standard-users.component.html',
  standalone: true,
  styleUrl: './standard-users.component.css'
})
export class StandardUsersComponent implements OnInit{
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  standardUser : standardUser[] = [];
  user: any;
  username : any

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnNamesMap: { [key: string]: string } = {
    name: 'Predmet',
    studyProgram: 'Studijski program',
    semester: 'Semestar',
    countHours: 'Broj časova',
    sessionCount:'Broj termina',
    leftSessionCount: 'Preostali termini',
    classType: 'Vrsta',
  };

  constructor(private router: Router,private distributionService: DistributionService) {
    this.dataSource = new MatTableDataSource<any>();

  }

  ngOnInit(): void {
    this.user = history.state.user;
    this.distributionService.getStandardUser(this.user).subscribe((standardUsers) => {
      this.standardUser = standardUsers;
      console.log(standardUsers)
      this.dataSource.data = this.standardUser;
      this.displayedColumns = ['name', 'studyProgram', 'semester','countHours','sessionCount','leftSessions','classType'];
      this.dataSource.paginator = this.paginator;

      if (this.standardUser.length > 0) {
        const { firstName, lastName } = this.standardUser[0];
        this.username = `${firstName} ${lastName}`;
      } else {
        console.warn('Standard user array is empty.');
        this.username = 'Nepoznat korisnik';
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
