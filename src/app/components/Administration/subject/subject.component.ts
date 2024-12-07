import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Teacher} from '../../../models/teacher.model';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {TeachersService} from '../../../services/teacher/teachers.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Modal, Tooltip} from 'bootstrap';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule],
  templateUrl: './subject.component.html',
  standalone: true,
  styleUrl: './subject.component.css'
})
export class SubjectComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  teacherForm: FormGroup;
  createNewTeacher: boolean = true;
  teachers : Teacher[] = [];
  teacherId: number = 0;
  teacherName: string = '';
  teacherTitles: Array<string> = [];
  useDropdown: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  columnNamesMap: { [key: string]: string } = {
    firstName: 'Ime',
    lastName: 'Prezime',
    title: 'Zvanje',
    actions: 'Akcije'
  };

  constructor(private teacherService: TeachersService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<any>();
    this.teacherForm = formBuilder.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      title:['',Validators.required]
    })
  }

  openAddTeacherModal() {
    this.createNewTeacher = true;
    this.teacherForm.reset();
    this.teacherTitles = Array.from(new Set(this.teachers.map(teacher => teacher.title)));

    const modalElement = document.getElementById('addTeacherModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  editTeacher(teacher: any) {
    this.teacherId = teacher.id;
    this.createNewTeacher = false;
    this.teacherTitles = Array.from(new Set(this.teachers.map(teacher => teacher.title)));


    const modalElement = document.getElementById('addTeacherModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();

      this.teacherForm.setValue({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        title: teacher.title,
      });
    }
  }

  openDeleteModal(teacher: Teacher): void {
    this.teacherId = teacher.id;
    this.teacherName = teacher.firstName;
    const modal = new Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  deleteTeacher() {
    this.teacherService.deleteTeacher(this.teacherId).subscribe(
      () => {
        this.teachers = this.teachers.filter(teacher => teacher.id !== this.teacherId);
        this.dataSource.data = this.teachers;
        Modal.getInstance(document.getElementById('confirmDeleteModal')!)?.hide();
        this.snackBar.open('Uspesno ste obrisali korisnika!', 'Zatvori', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      (error) => {
        this.snackBar.open(`Niste uspeli da obrisete korisnika. Error: ${error.message}`, 'Zatvori', {
          duration: 8000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }


  submitTeacher() {
    if(this.createNewTeacher){
      if(this.teacherForm.valid) {
        const teacher = this.teacherForm.value;
        this.teacherService.saveTeacher(teacher).subscribe(
          () => {
            Modal.getInstance(document.getElementById('addTeacherModal')!)?.hide();
            this.snackBar.open('Uspesno ste uneli korisnika!', 'Zatvori', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            // Update teacher in the table
            this.teachers.unshift(teacher);
            this.dataSource.data = this.teachers;

          },
          (error)=> {
            this.snackBar.open(`Niste uspeli da kreirate korisnika. Error: ${error.message}`, 'Zatvori', {
              duration: 8000,
              panelClass: ['error-snackbar']
            });
          }
        );
      }
    }else{
      if(this.teacherForm.valid) {
        const teacher = this.teacherForm.value;
        teacher.id = this.teacherId;
        this.teacherService.updateTeacher(teacher).subscribe(
          () => {
            Modal.getInstance(document.getElementById('addTeacherModal')!)?.hide();
            this.snackBar.open('Uspesno ste izmenili korisnika!', 'Zatvori', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            // Update teacher in the table
            const index = this.teachers.findIndex(tmp => tmp.id === this.teacherId);
            if (index !== -1) {
              this.teachers[index] = teacher;
              this.dataSource.data = this.teachers;
            }
          },
          (error)=> {
            this.snackBar.open(`Niste uspeli da izmenite korisnika. Error: ${error.message}`, 'Zatvori', {
              duration: 8000,
              panelClass: ['error-snackbar']
            });
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
    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers;
      this.dataSource.data = this.teachers;
    });
    this.displayedColumns = ['firstName', 'lastName', 'title','actions'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  changeVisibility(){
    this.useDropdown = !this.useDropdown;
  }
}
