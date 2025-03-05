import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Teacher} from '../../../models/teacher.model';
import {TeachersService} from '../../../services/teacher/teachers.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Modal, Tooltip} from 'bootstrap';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {Subject} from '../../../models/subject.model';
import {Distribution} from '../../../models/distribution.model';
import {SubjectService} from '../../../services/subject/subject.service';
import {DistributionService} from '../../../services/distribution/distribution.service';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'app-distribution',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule,NgSelectModule],
  templateUrl: './distribution.component.html',
  standalone: true,
  styleUrl: './distribution.component.css'
})
export class DistributionComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  distributionForm: FormGroup;
  teachers : Teacher[] = [];
  subjects : Subject[] = [];
  distributions: Distribution[] = [];
  createNewDistribution: boolean = true;
  distributionSubject: string = '';

  distributionId: number = 0;
  classTypes: Array<string> = [];
  activeOption: string = 'first';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnNamesMap: { [key: string]: string } = {
    teacher: 'Profesor',
    subject: 'Predmet',
    studyProgram: 'Studijski program',
    semester: 'Semestar',
    countHours: 'Broj časova',
    sessionCount:'Broj termina',
    leftSessionCount: 'Preostali termini',
    classType: 'Vrsta',
    actions: 'Akcije',
    email: 'Email',
    //Secound Table
    name:'ime',
    mismatchType: 'vrsta',
    mismatchCount: 'preostalo Termina',
  };

  constructor(private teacherService: TeachersService,
              private subjectService: SubjectService,
              private distributionService: DistributionService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<any>();
    this.distributionForm = formBuilder.group({
      teacher: ['',Validators.required],
      subject: ['',Validators.required],
      studyProgram: ['',Validators.required],
      semester: ['',Validators.required],
      countHours: ['',Validators.required],
      sessionCount: ['',Validators.required],
      classType: ['',Validators.required],
    })
  }

  openAddDistributionModal(row: any) {
    this.createNewDistribution = true;
    this.distributionForm.reset();
    this.classTypes = Array.from(new Set(this.distributions.map(distribution => distribution.classType)));

    const modalElement = document.getElementById('distributionModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }

    const fullTeacher = this.teachers.find(teacher => teacher.email === row.email);
    this.distributionForm.patchValue({
      subject: row.name,
      fullTeacher: fullTeacher,
      studyProgram: row.studyProgram,
      semester: row.semester,
      countHours: row.countHours,
      classType: row.classType,
    });
  }

  editDistribution(row: any) {
    this.distributionId = row.id;
    this.createNewDistribution = false;
    this.classTypes = Array.from(new Set(this.distributions.map(distribution => distribution.classType)));

    const modalElement = document.getElementById('distributionModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();

      const fullTeacher = this.teachers.find(teacher => teacher.email === row.email);
      this.distributionForm.setValue({
        teacher: fullTeacher,
        subject: row.subject,
        studyProgram: row.studyProgram,
        semester: row.semester,
        countHours: row.countHours,
        sessionCount: row.sessionCount,
        classType: row.classType,
      });
    }
  }

  openDeleteModal(distribution: Distribution): void {
    this.distributionId = distribution.id;
    console.log(distribution);
    this.distributionSubject = ""+distribution.subject;
    const modal = new Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  deleteDistribution() {
    this.distributionService.deleteDistribution(this.distributionId).subscribe(
      () => {
        this.distributions = this.distributions.filter(distribution => distribution.id !== this.distributionId);
        this.dataSource.data = this.mapDistributionsToDataSource(this.distributions);
        Modal.getInstance(document.getElementById('confirmDeleteModal')!)?.hide();
        this.snackBar.open('Uspešno ste obrisali raspodelu!', 'Zatvori', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      (error) => {
        this.snackBar.open(`Niste uspeli da obrišete raspodelu. Error: ${error.error.message}`, 'Zatvori', {
          duration: 8000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }


  submitDistribution() {
    if(this.createNewDistribution){
      if(this.distributionForm.valid) {
        const distribution = this.distributionForm.value;
        distribution.teacher = distribution.teacher.email;
        distribution.id =0;
        console.log(distribution.teacher);
        this.distributionService.saveDistribution(distribution).subscribe(
          (savedDistribution) => {
            Modal.getInstance(document.getElementById('distributionModal')!)?.hide();
            this.snackBar.open('Uspešno ste uneli raspodelu!', 'Zatvori', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.distributions.unshift(savedDistribution);
            this.dataSource.data = this.filterDistributions(this.distributions);
          },
          (error)=> {
            this.snackBar.open(`Niste uspeli da kreirate raspodelu. Error: ${error.error.message}`, 'Zatvori', {
              duration: 8000,
              panelClass: ['error-snackbar']
            });
            //Just to make sure that modal is on top
            const overlayContainer = document.querySelector('.cdk-overlay-container');
            if (overlayContainer) {
              (overlayContainer as HTMLElement).style.zIndex = '1200';
            }
          }
        );
      }
    }else{
      if(this.distributionForm.valid) {
        const distribution = this.distributionForm.value;
        distribution.id = this.distributionId;
        distribution.teacher = distribution.teacher.email;
        this.distributionService.updateDistribution(distribution).subscribe(
          (savedDistribution) => {
            Modal.getInstance(document.getElementById('distributionModal')!)?.hide();
            this.snackBar.open('Uspešno ste izmenili raspodelu!', 'Zatvori', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            // Update distribution in the table
            const index = this.distributions.findIndex(tmp => tmp.id === this.distributionId);
            if (index !== -1) {
              this.distributions[index] = savedDistribution;
              this.dataSource.data = this.mapDistributionsToDataSource(this.distributions);
            }
          },
          (error)=> {
            this.snackBar.open(`Niste uspeli da izmenite raspodelu. Error: ${error.error.message}`, 'Zatvori', {
              duration: 8000,
              panelClass: ['error-snackbar']
            });
            //Just to make sure that modal is on top
            const overlayContainer = document.querySelector('.cdk-overlay-container');
            if (overlayContainer) {
              (overlayContainer as HTMLElement).style.zIndex = '1200';
            }
          }
        );
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  }

  ngOnInit(): void {
    this.distributionService.getDistributions().subscribe((distributions) => {
      this.distributions = distributions;
      this.dataSource.data = this.mapDistributionsToDataSource(distributions);
    });
    this.displayedColumns = ['teacher','email','subject', 'studyProgram', 'semester', 'countHours','sessionCount' ,'classType','actions'];

    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers.map(teacher => ({
        ...teacher,
        fullName: `${teacher.firstName} ${teacher.lastName}`,
      }));
    });

    this.subjectService.getSubjects().subscribe((subjects) =>{
      this.subjects = subjects;
    } );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mapDistributionsToDataSource(distributions: any[]): any[] {
    return distributions.map((distribution) => {
      return {
        id: distribution.id,
        teacher: distribution.teacher?.firstName + ' ' + distribution.teacher?.lastName,
        studyProgram: distribution.subject?.studyProgram,
        semester: distribution.subject?.semester,
        countHours: distribution.classType === 'vezbe'
          ? distribution.subject?.exerciseHours
          : distribution.subject?.lectureHours,
        leftSessionCount: distribution.classType === 'vezbe'
          ? distribution.subject?.exerciseSessions
          : distribution.subject?.lectureSessions,
        subject: distribution.subject?.name,
        classType: distribution.classType,
        sessionCount: distribution.sessionCount,
        email: distribution.teacher?.email,
      };
    });
  }

  setFirstActive(): void {
    this.activeOption = 'first';
    this.distributionService.getDistributions().subscribe((distributions) => {
      this.distributions = distributions;
      this.dataSource.data = this.mapDistributionsToDataSource(distributions);
    });
    this.displayedColumns = ['teacher','subject', 'studyProgram', 'semester', 'countHours','sessionCount' ,'classType','actions'];
  }

  setSecondActive(): void {
    this.activeOption = 'second';
    this.distributionService.getDistributions().subscribe(
      (distributions) => {
        this.dataSource.data = this.filterDistributions(distributions);
      },
      (error) => {
        console.error('Došlo je do greške pri učitavanju distribucija:', error);
      }
    );
    this.displayedColumns = ['name','studyProgram', 'mismatchType', 'mismatchCount','actions'];
  }

  onSubjectChange(event: Subject): void {
    this.distributionForm.patchValue({
      studyProgram: event?.studyProgram,
      semester: event?.semester,
      countHours: event?.lectureHours,
    });
  }

  filterDistributions(distributions: any[]): any[] {
    const filteredSubjects: any[] = [];

    const grouped = distributions.reduce((acc: any, distribution: any) => {
      const key = `${distribution.subject.name}-${distribution.classType}-${distribution.subject.studyProgram}`;
      if (!acc[key]) {
        acc[key] = {
          subject: distribution.subject.name,
          classType: distribution.classType,
          studyProgram:distribution.subject.studyProgram ,
          sessionCount: 0,
          email:distribution.teacher.email
        };
      }
      acc[key].sessionCount += distribution.sessionCount;
      return acc;
    }, {});

    // Provera subjekata koji nisu u distribucijama
    this.subjects.forEach((subject: any) => {
      const isInDistributions = distributions.some(
        (distribution: any) =>
          distribution.subject.name === subject.name &&
          distribution.subject.studyProgram === subject.studyProgram
      );

      if (!isInDistributions) {
        // Ako predmet nije u distribucijama, dodajemo posebno predavanja i vežbe
        if (subject.lectureSessions > 0) {
          filteredSubjects.push({
            ...subject,
            mismatchType: 'predavanja',
            countHours: subject.lectureHours,
            mismatchCount: subject.lectureSessions,
            classType: 'predavanja',
            email: null
          });
        }
        if (subject.exerciseSessions > 0) {
          filteredSubjects.push({
            ...subject,
            mismatchType: 'vezbe',
            countHours: subject.exerciseHours,
            mismatchCount: subject.exerciseSessions,
            classType: 'vezbe',
            email: null
          });
        }
      }
    });

    for (const key in grouped) {
      const { subject, classType, studyProgram ,sessionCount } = grouped[key];
      const matchingSubject = this.subjects.find((sub: any) => sub.name === subject && sub.studyProgram === studyProgram);

      if (matchingSubject) {
        const expectedCount =
          classType === 'vezbe' ? matchingSubject.exerciseSessions : matchingSubject.lectureSessions;

        if (sessionCount !== expectedCount) {
          const difference = expectedCount - sessionCount;
          const filteredSubject = {
            ...matchingSubject,
            mismatchType: classType === 'vezbe' ? 'vezbe' : 'predavanja',
            countHours: classType === 'vezbe' ? matchingSubject.exerciseHours : matchingSubject.lectureHours,
            mismatchCount: difference,
            classType: classType,
            email:null
          };
          filteredSubjects.push(filteredSubject);
        }
      }
    }
    return filteredSubjects;
  }


}
