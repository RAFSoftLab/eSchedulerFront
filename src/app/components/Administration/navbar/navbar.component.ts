import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import pdfMake from 'pdfmake/build/pdfmake';
import {TeacherSummary} from '../../../models/teacherSummary.model';
import {Subject} from '../../../models/subject.model';
import {Teacher} from '../../../models/teacher.model';
import {Distribution} from '../../../models/distribution.model';
import {TeachersService} from '../../../services/teacher/teachers.service';
import {SubjectService} from '../../../services/subject/subject.service';
import {DistributionService} from '../../../services/distribution/distribution.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  distributions: Distribution[] = [];
  teacherSummary: TeacherSummary[] = [];

  constructor(
    private authService: AuthService,
    private teacherService: TeachersService,
    private subjectService: SubjectService,
    private distributionService: DistributionService

  ) {
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
      }))
        .sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          return lastNameComparison !== 0 ? lastNameComparison : a.firstName.localeCompare(b.firstName);
        });
    });

    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects.sort((a,b) =>{
        if(a.semester !== b.semester){
          return a.semester - b.semester;
        }
        return a.studyProgram.localeCompare(b.studyProgram);
      });
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
    });
  }


  onLogout(): void {
    this.authService.logout();
  }


  exportData(type: 'teachers' | 'subjects' | 'distributions', format: 'json' | 'pdf') {
    if (format === 'json') {
      this.exportDataToJson(type)
    } else if (format === 'pdf') {
      this.exportDataToPdf(type)
    }
  }

  exportDataToJson(type: 'teachers' | 'subjects' | 'distributions'): void {
    let data;
    let fileName = '';

    switch (type) {
      case 'teachers':
        data = this.teachers;
        fileName = 'nastavnici.json';
        break;
      case 'subjects':
        data = this.subjects;
        fileName = 'predmeti.json';
        break;
      case 'distributions':
        data = this.distributions;
        fileName = 'raspodela.json';
        break;
    }

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportDataToPdf(type: 'teachers' | 'subjects' | 'distributions'): void {
    let data: any[];
    let fileName = '';
    let naslov = '';

    switch (type) {
      case 'teachers':
        data = this.teacherSummary;
        fileName = 'nastavnici.pdf';
        naslov = 'Izveštaj - Profesori';
        break;
      case 'subjects':
        data = this.subjects;
        fileName = 'predmeti.pdf';
        naslov = 'Izveštaj - Predmeti';
        break;
      case 'distributions':
        data = this.distributions;
        fileName = 'raspodela.pdf';
        naslov = 'Izveštaj - Raspodela';
        break;
      default:
        console.warn(`Nepoznat tip podataka: ${type}`);
        return;
    }

    if (!data || data.length === 0) {
      console.warn(`Nema podataka za ${type}`);
      return;
    }

    const docDefinition = {
      content: [
        {text: naslov, style: 'header'},
        ...this.generateContentForPdf(type, data)
      ],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          alignment: 'center' as const,
          margin: [0, 0, 0, 2] as [number, number, number, number]
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 2, 0, 2] as [number, number, number, number]
        },
        tableHeader: {
          bold: true,
          fontSize: 6,
          color: 'white',
          fillColor: '#2980b9',
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number]
        }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 6
      },
      fonts: {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  }

  generateContentForPdf(type: string, data: any[]): any[] {
    const content: any[] = [];

    if (type === 'teachers') {
      data.forEach((teacherSummary: TeacherSummary) => {
        const teacher = this.teachers.find(t => t.id === teacherSummary.id);

        content.push(
          {
            text: `${teacherSummary.lastName} ${teacherSummary.firstName} - ${teacher?.title || 'N/A'}`,
            style: 'subheader',
            margin:[0,2,0,2]
          },
          {
            text: `Fond časova: ${teacherSummary.summaryLectureHours + teacherSummary.summaryExerciseHours}`,
            alignment: 'right',
            margin: [0, -10, 0, 2]
          }
        );

        const teacherDistributions = this.distributions.filter(dist => dist.teacher.id === teacherSummary.id);
        const tableData = teacherDistributions.map(dist => [
          dist.subject.name,
          dist.subject.studyProgram,
          dist.subject.semester,
          dist.classType === 'vezbe' ? 'Vežbe' : 'Predavanja',
          dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours,
          dist.sessionCount,
          (dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours) * 13 * dist.sessionCount
        ]);

        content.push({
          table: {
            headerRows: 1,
            widths: ['30%', '20%', '10%', '10%', '10%', '10%', '10%'],
            body: [
              [
                {text: 'Naziv', style: 'tableHeader'},
                {text: 'Stud. program', style: 'tableHeader'},
                {text: 'Semestar', style: 'tableHeader'},
                {text: 'Vrsta', style: 'tableHeader'},
                {text: 'Fond', style: 'tableHeader'},
                {text: 'Termini', style: 'tableHeader'},
                {text: 'Ukupno', style: 'tableHeader'}
              ],
              ...tableData
            ]
          },
          margin: [0, 0, 0, 5]
        });
      });
    } else if (type === 'subjects') {
      data.forEach((subject: Subject) => {
        content.push(
          {text: `${subject.name} - ${subject.studyProgram}, semestar: ${subject.semester}, Termini Predavanja: ${subject.lectureSessions}, Termini Vežbi: ${subject.exerciseSessions}`,
            style: 'subheader',
            margin:[0,0,0,5]
          });

        const subjectDistributions = this.distributions.filter(dist => dist.subject.id === subject.id);
        const tableData = subjectDistributions.map(dist => [
          `${dist.teacher.lastName} ${dist.teacher.firstName}`,
          dist.classType === 'vezbe' ? 'Vežbe' : 'Predavanja',
          dist.sessionCount,
          dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours,
          (dist.classType === 'vezbe' ? dist.subject.exerciseHours : dist.subject.lectureHours) * 13 * dist.sessionCount
        ]);

        content.push({
          table: {
            headerRows: 1,
            widths: ['30%', '15%', '20%', '20%', '15%'],
            body: [
              [
                {text: 'Nastavnik', style: 'tableHeader'},
                {text: 'Vrsta', style: 'tableHeader'},
                {text: 'Broj termina', style: 'tableHeader'},
                {text: 'Broj časova', style: 'tableHeader'},
                {text: 'Ukupno', style: 'tableHeader'}
              ],
              ...tableData
            ]
          },
          margin: [0, 0, 0, 5]
        });
      });
    } else if (type === 'distributions') {
      // console.log('Implementacija za distribucije će biti dodata kasnije.');
    }

    return content;
  }
}
