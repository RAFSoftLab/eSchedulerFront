import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Teacher} from '../../../models/teacher.model';
import {Subject} from '../../../models/subject.model';
import {TeachersService} from '../../../services/teacher/teachers.service';
import {CommonModule, NgIf} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {SubjectService} from '../../../services/subject/subject.service';
import {DistributionService} from '../../../services/distribution/distribution.service';
import {Distribution} from '../../../models/distribution.model';
import {TeacherSummary} from '../../../models/teacherSummary.model';


@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, NgIf, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  isDistributionButtonDisabled: boolean = true;
  teacherSummary: TeacherSummary[] = [];

  summaryRows = 1;
  totalLectures = 0;
  totalExercises = 0;
  weeklyLecturesE = 0;
  weeklyExercisesE = 0;
  weeklyLecturesO = 0;
  weeklyExercisesO = 0;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  distributions: Distribution[] = [];
  selectedDistributions: Distribution[] = [];

  columnNamesMap: { [key: string]: string } = {
    firstName: 'Ime',
    lastName: 'Prezime',
    title: 'Zvanje',
    name: 'Naziv',
    studyProgram: 'Studijski program',
    semester: 'Semestar',
    countHours: 'Broj časova',
    lectureHours: 'Fond predavanja',
    exerciseHours: 'Fond vežbe',
    practicumHours: 'Fond praktikum',
    mandatory: 'Obaveznost',
    lectureSessions: 'Predavanja (konsultacije)',
    exerciseSessions: 'Vežbe (konsultacije)',
    classType: 'Vrsta',
    sessionCount:'Broj termina',
    teacher: 'Nastavnik',
    subject: 'Predmet',
    email : 'Email',
    summaryLectureHours: 'Ukupno predavanja',
    summaryExerciseHours: 'Ukupno vežbi',
  };


  constructor(private teacherService: TeachersService, private subjectService: SubjectService, private distributionService: DistributionService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers;
      this.teacherSummary = this.teachers.map((teachers)=>({
        id: teachers.id,
        email: teachers.email,
        firstName: teachers.firstName,
        lastName: teachers.lastName,
        title: teachers.title,
        summaryExerciseHours: 0,
        summaryLectureHours: 0,
      }));
      // this.showTeachers();
    });

    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });

    this.distributionService.getDistributions().subscribe((distributions) => {
      this.distributions = distributions;

      this.distributions.forEach((distribution) => {
        const index = this.teacherSummary.findIndex(
          (ts) => ts.id === distribution.teacher.id
        );

        if (index !== -1) {
          if (distribution.classType === 'vezbe') {
            this.teacherSummary[index].summaryExerciseHours += (distribution.subject.exerciseHours *13* distribution.sessionCount);
          } else {
            this.teacherSummary[index].summaryLectureHours += (distribution.subject.lectureHours *13* distribution.sessionCount);
          }
        }
      });
      this.showTeachers();
    });
  }

  showTeachers(): void {
    this.dataSource.data = this.teacherSummary;
    this.displayedColumns = ['firstName', 'lastName', 'email', 'title','summaryLectureHours','summaryExerciseHours'];
    this.dataSource.paginator = this.paginator;
    this.isDistributionButtonDisabled = true;
  }

  showSubjects(): void {
    this.dataSource.data = this.subjects;
    this.displayedColumns = ['name', 'studyProgram', 'semester', 'lectureHours', 'exerciseHours', 'practicumHours', 'mandatory'];
    this.dataSource.paginator = this.paginator;
    this.isDistributionButtonDisabled = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateSummaryRows() {
    this.totalLectures = 0;
    this.totalExercises = 0;

    this.dataSource.data.forEach((row) => {
      if(row.classType == "vezbe") {
        this.totalExercises += row.sessionCount ;
      }
      else {
        this.totalLectures += row.sessionCount;
      }
    });
  }
  calculateSummaryFromData() {
    this.weeklyLecturesE = 0;
    this.weeklyExercisesE = 0;
    this.weeklyLecturesO = 0;
    this.weeklyExercisesO = 0;
    this.totalLectures = 0;
    this.totalExercises = 0;

    this.dataSource.data.forEach((row) => {

      if(row.classType === "vezbe") {
        this.totalExercises += (row.countHours *13* row.sessionCount);
        if(row.semester % 2 == 0) {
          this.weeklyExercisesE += row.countHours;
        }else {
          this.weeklyExercisesO += row.countHours;
        }
      }
      else {
        this.totalLectures += (row.countHours *13* row.sessionCount);
        if(row.semester % 2 == 0) {
          this.weeklyLecturesE += row.countHours;
        }else {
          this.weeklyLecturesO += row.countHours;
        }
      }
    });
  }

  onRowClicked(row: any) {
    console.log("ZISOV -> ", row.email);
    if(row.hasOwnProperty('title')) {
      this.summaryRows = 1;
      this.selectedDistributions = this.distributions.filter((distribution: { teacher: any; }) => distribution.teacher.email == row.email);
      this.displayedColumns = ['teacher','subject', 'studyProgram', 'semester', 'countHours','sessionCount' ,'classType'];
      this.dataSource.paginator = this.paginator;
      console.log("SELECTED DISTRIBUTIONS->",this.selectedDistributions);
      console.log("SELECTED DISTRIBUTIONS->",this.distributions[0]);
    }else if (row.hasOwnProperty('name')){
      this.summaryRows = 2;
      this.displayedColumns = ['teacher','subject', 'studyProgram', 'semester', 'countHours','sessionCount' ,'classType'];
      this.selectedDistributions = this.distributions.filter((distribution: { subject: any; }) => distribution.subject.id === row.id);
      this.dataSource.paginator = this.paginator;
      console.log("SELECTED DISTRIBUTIONS->"+this.selectedDistributions);
    }

    // Mapping data
    this.dataSource.data = this.selectedDistributions.map((distribution) => {
      return {
        teacher: distribution.teacher?.firstName + '' +distribution.teacher.lastName,
        studyProgram: distribution.subject?.studyProgram,
        semester: distribution.subject?.semester,
        countHours: distribution.classType === 'vezbe'
          ? distribution.subject?.exerciseHours
          : distribution.subject?.lectureHours,
        subject: distribution.subject?.name,
        classType: distribution.classType,
        sessionCount: distribution.sessionCount
      };
    });
    if(this.summaryRows == 1){
      this.calculateSummaryFromData();
    }else if(this.summaryRows == 2){
      this.calculateSummaryRows();
    }
    // activate distribution button
    this.isDistributionButtonDisabled = this.selectedDistributions.length === 0;
  }



}
