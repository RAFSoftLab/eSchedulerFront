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
import {MatMenuModule} from '@angular/material/menu';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts;





@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, NgIf, MatButtonModule, MatFormFieldModule, MatInputModule,MatMenuModule],
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



  // exportData(type: 'teachers' | 'subjects' | 'distributions', format: 'json' | 'pdf') {
  //   if (format === 'json') {
  //     this.exportDataToJson(type)
  //   } else if (format === 'pdf') {
  //     this.exportDataToPdf(type)
  //   }
  // }
  //
  // exportDataToJson(type: 'teachers' | 'subjects' | 'distributions'): void {
  //   let data;
  //   let fileName = '';
  //
  //   switch (type) {
  //     case 'teachers':
  //       data = this.teachers;
  //       fileName = 'nastavnici.json';
  //       break;
  //     case 'subjects':
  //       data = this.subjects;
  //       fileName = 'predmeti.json';
  //       break;
  //     case 'distributions':
  //       data = this.distributions;
  //       fileName = 'raspodela.json';
  //       break;
  //   }
  //
  //   const jsonData = JSON.stringify(data, null, 2);
  //   const blob = new Blob([jsonData], { type: 'application/json' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }






  // exportDataToPdf(type: 'teachers' | 'subjects' | 'distributions'): void {
  //   let data: any[];
  //   let fileName = '';
  //
  //   switch (type) {
  //     case 'teachers':
  //       data = this.teacherSummary;
  //       fileName = 'nastavnici.pdf';
  //       break;
  //     case 'subjects':
  //       data = this.subjects;
  //       fileName = 'predmeti.pdf';
  //       break;
  //     case 'distributions':
  //       data = this.distributions;
  //       fileName = 'raspodela.pdf';
  //       break;
  //     default:
  //       console.warn(`Nepoznat tip podataka: ${type}`);
  //       return;
  //   }
  //
  //   if (!data || data.length === 0) {
  //     console.warn(`Nema podataka za ${type}`);
  //     return;
  //   }
  //
  //   const docDefinition = {
  //     content: [
  //       { text: `Izveštaj - ${type.charAt(0).toUpperCase() + type.slice(1)}`, style: 'header' },
  //       ...this.generateContentForPdf(type, data)
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         alignment: 'center' as const,
  //         margin: [0, 0, 0, 10] as [number,number,number,number]
  //       },
  //       subheader: {
  //         fontSize: 14,
  //         bold: true,
  //         margin: [0, 10, 0, 5] as [number,number,number,number]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 12,
  //         color: 'white',
  //         fillColor: '#2980b9',
  //         alignment: 'center' as const,
  //         margin: [0,0,0,0] as [number,number,number,number]
  //       }
  //     },
  //     defaultStyle: {
  //       font: 'Roboto',
  //       fontSize: 10
  //     },
  //     fonts:{
  //       Roboto: {
  //         normal: 'Roboto-Regular.ttf',
  //         bold: 'Roboto-Medium.ttf',
  //         italics: 'Roboto-Italic.ttf',
  //         bolditalics: 'Roboto-MediumItalic.ttf'
  //       }
  //     }
  //   };
  //
  //   pdfMake.createPdf(docDefinition).download(fileName);
  // }
  //
  // generateContentForPdf(type: string, data: any[]): any[] {
  //   const content: any[] = [];
  //
  //   if (type === 'teachers') {
  //     data.forEach((teacherSummary: TeacherSummary) => {
  //       const teacher = this.teachers.find(t => t.id === teacherSummary.id);
  //
  //       content.push(
  //         { text: `${teacherSummary.lastName} ${teacherSummary.firstName} - ${teacher?.title || 'N/A'}`, style: 'subheader' },
  //         { text: `Fond časova: ${teacherSummary.summaryLectureHours + teacherSummary.summaryExerciseHours}`, margin: [0, 0, 0, 10] }
  //       );
  //
  //       const teacherDistributions = this.distributions.filter(dist => dist.teacher.id === teacherSummary.id);
  //       const tableData = teacherDistributions.map(dist => [
  //         dist.subject.name,
  //         dist.subject.studyProgram,
  //         dist.subject.semester,
  //         dist.classType === 'vezbe' ? 'Vežbe' : 'Predavanja',
  //         dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours,
  //         dist.sessionCount,
  //         (dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours) * 13 * dist.sessionCount
  //       ]);
  //
  //       content.push({
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'Naziv', style: 'tableHeader' },
  //               { text: 'Stud. program', style: 'tableHeader' },
  //               { text: 'Semestar', style: 'tableHeader' },
  //               { text: 'Vrsta', style: 'tableHeader' },
  //               { text: 'Fond', style: 'tableHeader' },
  //               { text: 'Broj termina', style: 'tableHeader' },
  //               { text: 'Ukupno', style: 'tableHeader' }
  //             ],
  //             ...tableData
  //           ]
  //         },
  //         margin: [0, 0, 0, 20]
  //       });
  //     });
  //   } else if (type === 'subjects') {
  //     data.forEach((subject: Subject) => {
  //       content.push(
  //         { text: `${subject.name} - ${subject.studyProgram}, semestar: ${subject.semester}`, style: 'subheader' },
  //         { text: `Termini predavanja: ${subject.lectureSessions}`, margin: [0, 0, 0, 5] },
  //         { text: `Termini vežbi: ${subject.exerciseSessions}`, margin: [0, 0, 0, 10] }
  //       );
  //
  //       const subjectDistributions = this.distributions.filter(dist => dist.subject.id === subject.id);
  //       const tableData = subjectDistributions.map(dist => [
  //         `${dist.teacher.lastName} ${dist.teacher.firstName}`,
  //         dist.classType === 'vezbe' ? 'Vežbe' : 'Predavanja',
  //         dist.sessionCount,
  //         dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours,
  //         (dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours) * 13 * dist.sessionCount
  //       ]);
  //
  //       content.push({
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'Prezime i ime', style: 'tableHeader' },
  //               { text: 'Vrsta', style: 'tableHeader' },
  //               { text: 'Broj termina', style: 'tableHeader' },
  //               { text: 'Broj časova', style: 'tableHeader' },
  //               { text: 'Ukupno', style: 'tableHeader' }
  //             ],
  //             ...tableData
  //           ]
  //         },
  //         margin: [0, 0, 0, 20]
  //       });
  //     });
  //   } else if (type === 'distributions') {
  //     // console.log('Implementacija za distribucije će biti dodata kasnije.');
  //   }
  //
  //   return content;
  // }


}
