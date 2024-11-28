import {Component, OnInit, ViewChild} from '@angular/core';
import {Teacher} from '../../models/teacher.model';
import {Subject} from '../../models/subject.model';
import {TeachersService} from '../../services/teacher/teachers.service';
import {CommonModule, NgIf} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {SubjectService} from '../../services/subject/subject.service';
import {DistributionService} from '../../services/distribution/distribution.service';
import {Distribution} from '../../models/distribution.model';


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


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  distributions: Distribution[] = [];
  selectedDistributions: Distribution[] = [];


  constructor(private teacherService: TeachersService, private subjectService: SubjectService, private distributionService: DistributionService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers;
      this.showTeachers();
    });

    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });

    this.distributionService.getDistributions().subscribe((distributions) => {
      this.distributions = distributions;
    });

  }
  showTeachers(): void {
    this.dataSource.data = this.teachers;
    this.displayedColumns = ['firstName', 'lastName', 'title'];
    this.dataSource.paginator = this.paginator;
    this.isDistributionButtonDisabled = true;
  }

  showSubjects(): void {
    this.dataSource.data = this.subjects;
    this.displayedColumns = ['name', 'studyProgram', 'semester', 'lectureHours', 'exerciseHours', 'practicumHours', 'mandatory', 'lectureSessions', 'exerciseSessions'];
    this.dataSource.paginator = this.paginator;
    this.isDistributionButtonDisabled = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onRowClicked(row: any) {

    if(row.hasOwnProperty('title')) {
      this.selectedDistributions = this.distributions.filter((distribution: { teacherId: any; }) => distribution.teacherId === row.id);
      this.displayedColumns = ['teacher', 'subject', 'classType', 'sessionCount'];
      this.dataSource.paginator = this.paginator;
    }else if (row.hasOwnProperty('name')){
      this.displayedColumns = ['teacher', 'subject', 'classType', 'sessionCount'];
      this.selectedDistributions = this.distributions.filter((distribution: { subjectId: any; }) => distribution.subjectId === row.id);
      this.dataSource.paginator = this.paginator;
    }

    //Mapping data
    this.dataSource.data = this.selectedDistributions.map((distribution) => ({
      teacher: this.teachers.find((teacher) => teacher.id === distribution.teacherId)?.firstName + ' ' +
        this.teachers.find((teacher) => teacher.id === distribution.teacherId)?.lastName,
      subject: this.subjects.find((subject) => subject.id === distribution.subjectId)?.name,
      classType: distribution.classType,
      sessionCount: distribution.sessionCount,
    }));

    // activate distribution button
    this.isDistributionButtonDisabled = this.selectedDistributions.length === 0;
  }
}
