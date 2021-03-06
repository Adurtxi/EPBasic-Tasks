import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentityGuard } from './guards/identity.guard';

import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TaskComponent } from './components/task/task.component';
import { AuthComponent } from './components/auth/auth.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BookComponent } from './components/book/book.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { ExamComponent } from './components/exam/exam.component';
import { MarksComponent } from './components/marks/marks.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent
    },
    {
        path: 'add-account',
        component: AuthComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'marks',
        component: MarksComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'timetable',
        component: TimetableComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'subject/:id',
        component: SubjectComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'subjects',
        component: SubjectsComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'task/:id',
        component: TaskComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'exam/:id',
        component: ExamComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'book/:id/:page',
        component: BookComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'book/:id',
        component: BookComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: '**',
        component: ErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
