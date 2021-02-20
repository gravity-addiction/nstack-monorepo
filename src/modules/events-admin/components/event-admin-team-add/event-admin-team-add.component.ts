import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';

import { EventAdminService } from '../../services/index';

@Component({
  selector: 'app-event-admin-team-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin-team-add.component.html',
  styleUrls: ['event-admin-team-add.component.scss'],
})
export class EventAdminTeamAddComponent implements OnInit {
  @Input() eventSlug!: string;
  @Input() eventComp!: any;
  @Output() eventTeamNew: EventEmitter<any> = new EventEmitter();

  public newTeam = {
    teamNumber: '',
    teamName: '',
  };

  private isSaving = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventAdminService: EventAdminService
  ) { }
  ngOnInit() { }

  onSubmit() {
    if (this.newTeam.teamNumber === '' && this.newTeam.teamName === '') {
      return;
    }
    if (this.eventSlug === '' || (this.eventComp || {}).compId === '') {
      return;
    }
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;

    this.eventAdminService.addEventTeam(this.eventSlug, this.eventComp.id, this.newTeam).pipe(
      tap((newTeamRet: any) => {
        this.isSaving = false;
        this.newTeam.teamNumber = '';
        this.newTeam.teamName = '';
        this.eventTeamNew.emit(newTeamRet);
        this.changeDetectorRef.detectChanges();
      }),
      catchError((_err: any) => {
        this.isSaving = false;
        throw _err;
      })
    ).subscribe();
  }
}
