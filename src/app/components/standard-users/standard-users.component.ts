import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {DistributionService} from '../../services/distribution/distribution.service';
import {standardUser} from '../../models/standardUser.model';
import {MatSortModule} from '@angular/material/sort';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-standard-users',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatFormFieldModule, MatInputModule],
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

  totalLectures = 0;
  totalExercises = 0;
  weeklyLecturesE = 0;
  weeklyExercisesE = 0;
  weeklyLecturesO = 0;
  weeklyExercisesO = 0;



  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnNamesMap: { [key: string]: string } = {
    name: 'Predmet',
    studyProgram: 'Studijski program',
    semester: 'Semestar',
    countHours: 'Broj časova',
    sessionCount:'Broj termina',
    leftSessionCount: 'Preostali termini',
    classType: 'Vrsta',
  };

  constructor(private router: Router,private distributionService: DistributionService,private authService: AuthService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  calculateSummaryFromData() {
    this.weeklyLecturesE = 0;
    this.weeklyExercisesE = 0;
    this.weeklyLecturesO = 0;
    this.weeklyExercisesO = 0;
    this.totalLectures = 0;
    this.totalExercises = 0;

    this.dataSource.data.forEach((row) => {
      // console.log('Red podataka:', row);

      let hoursPerWeek = 0;
      // console.log("classType->",row);
      if (row.classType === "vezbe") {
        hoursPerWeek = row.exerciseHours ?? 0;
      } else {
        hoursPerWeek = row.lectureHours ?? 0;
      }

      const totalHours = hoursPerWeek * row.sessionCount *13;

      if (row.classType === "vezbe") {
        this.totalExercises += totalHours;
        if (row.semester % 2 === 0) {
          this.weeklyExercisesE += hoursPerWeek;
        } else {
          this.weeklyExercisesO += hoursPerWeek;
        }
      } else {
        this.totalLectures += totalHours;
        if (row.semester % 2 === 0) {
          this.weeklyLecturesE += hoursPerWeek;
        } else {
          this.weeklyLecturesO += hoursPerWeek;
        }
      }
    });

  }



  ngOnInit(): void {
    this.user = this.authService.getEmail();

    this.distributionService.getStandardUser(this.user).subscribe((standardUsers) => {
      this.standardUser = standardUsers.map(user => ({
        ...user,
        countHours: user.classType === 'vezbe' ? user.exerciseHours : user.lectureHours
      }));

      // console.log('Podaci učitani:', this.standardUser);

      this.dataSource.data = this.standardUser;
      this.displayedColumns = ['name', 'studyProgram', 'semester', 'countHours', 'sessionCount', 'leftSessionCount', 'classType'];

      if (this.standardUser.length > 0) {
        this.calculateSummaryFromData();
        const { firstName, lastName } = this.standardUser[0];
        this.username = `${firstName} ${lastName}`;
      } else {
        this.username = 'Nepoznat korisnik';
      }
    });
  }



  onLogout(): void {
    this.authService.logout();
  }
}
