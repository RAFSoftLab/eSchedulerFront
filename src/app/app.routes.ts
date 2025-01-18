import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/Administration/home/home.component';
import {TeacherComponent} from './components/Administration/teacher/teacher.component';
import {SubjectComponent} from './components/Administration/subject/subject.component';
import {DistributionComponent} from './components/Administration/distribution/distribution.component';
import {LayoutComponent} from './components/Administration/layout/layout.component';
import {StandardUsersComponent} from './components/standard-users/standard-users.component';

export const routes: Routes = [
  {path: '', component: LayoutComponent, children: [
    {path: 'teachers', component: TeacherComponent},
    {path: 'subjects', component: SubjectComponent},
    {path: 'distribution', component: DistributionComponent},
    { path: '', component: HomeComponent },
  ]},
  { path: 'standardUser', component: StandardUsersComponent },
  { path: 'login', component: LoginComponent },
];
