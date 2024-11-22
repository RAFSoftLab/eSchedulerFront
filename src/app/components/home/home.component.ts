import {Component, OnInit} from '@angular/core';
import {Teacher} from '../../models/teacher.model';
import {User} from '../../models/user.model';
import {TeachersService} from '../../services/teacher/teachers.service';
import { CommonModule } from '@angular/common';
import {UsersService} from '../../services/users/users.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  teachers: Teacher[] = [];
  user: User | null = null;

  constructor(private teacherService: TeachersService,private userService:UsersService) { }

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers;
    });

    // this.userService.getUser('ivan.cicka.ic@gmail.com',"seriko69").subscribe((response) => {
    //   if(response.success){
    //     console.log("User Found ",response.data);
    //     this.user = response.data;
    //   }else {
    //     console.log("User Not Found");
    //     this.user = null;
    //   }
    // });
  }
}
