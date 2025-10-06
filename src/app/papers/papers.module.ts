import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PapersListComponent } from './papers-list/papers-list.component';
import { PaperDetailComponent } from './paper-detail/paper-detail.component';

const routes: Routes = [
  { path: ':examId', component: PapersListComponent },
  { path: 'details/:id', component: PaperDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PapersModule { }
