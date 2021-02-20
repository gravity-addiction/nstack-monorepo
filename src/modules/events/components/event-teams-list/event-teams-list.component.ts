import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EventVideoScorecardService } from '../../services';

import { IEventComp } from '@typings/event';

@Component({
  selector: 'app-event-teams-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-teams-list.component.html',
  styleUrls: ['event-teams-list.component.scss'],
})
export class EventTeamsListComponent implements OnInit, OnDestroy {
  @Input() startOpened = false;
  @Input() eventSlug!: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() set EventComp(comp: IEventComp) {
    this.rndInfo = [];
    for (let rnd = 0; rnd < comp.roundCnt; rnd++) {
      this.rndInfo.push({
        name: (rnd + 1).toString(),
        val: rnd + 1,
        draw: (comp.draw || [])[rnd] || [],
      });
    }

    for (let rnd = 0; rnd < comp.exRoundCnt; rnd++) {
      this.rndInfo.push({
        name: comp.exRoundPre + (rnd + 1).toString(),
        val: comp.roundCnt + rnd + 1,
        draw: (comp.draw || [])[comp.roundCnt + rnd] || [],
      });
    }

    comp.teams = (comp.teams || []).map(t => {
      if (!t.hasOwnProperty('score') || t.score === null) {
        t.score = [];
      }
      if (!Array.isArray(t.score)) {
        try {
          t.score = JSON.parse(t.score);
        } catch (e) {
          t.score = [];
        }
      }
      if (t.score.length < comp.roundCnt) {
        for (let tI = t.score.length; tI < comp.roundCnt; tI++) {
          t.score.push(-1);
        }
      }
      return t;
    });
    this.eventComp = comp;
    this.rndInfo$B.next(this.rndInfo);
    // console.log(this.rndInfo);
    // this.changeDetectorRef.detectChanges();
  }

  public eventComp: IEventComp = {
    name: '',
    roundCnt: 10,
    exRoundCnt: 1,
    exRoundPre: 'JO',
    draw: [],
    status: '',
    notes: '',
    shown: false,
    complete: false,
    teams: [],
  };

  public rndInfo$B: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public rndInfo$ = this.rndInfo$B.asObservable();
  public rndInfo: any[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private evsService: EventVideoScorecardService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  eventTeamNew(newTeam: any) {
    if (this.eventComp && Array.isArray(this.eventComp.teams)) {
      this.eventComp.teams.push(newTeam);
    }
  }

  fetchScorePacket(team: any, round?: number) {
    // qVideo.loadScores = true;
    // team.scorePacket = [];
    if (team.scorePacket && team.scorePacket.length) {
      team.scorePacket = [];
      return;
    }
    team.scorePacketRndStr = 'Rnd: ' + team.scorePacketRnd + ' ...Loading Rnd: ' + round;
    team.scorePacketLoading += 1;
    this.subscriptions.add(
      this.evsService.getTeamEventVideoScorecard('admin', team.id, round).pipe(
        tap((data: any) => {
          team.scorePacket = data;
          team.scorePacketRnd = round;
          team.scorePacketRndStr = 'Rnd: ' + team.scorePacketRnd;
          team.scorePacketLoading -= 1;
          // qVideo.scores = data;
          // qVideo.loadScores = false;
          // console.log(qVideo.scores);
          this.changeDetectorRef.detectChanges();
        }),
        catchError((_err: any) => {
          // qVideo.loadScores = false;
          team.scorePacketLoading -= 1;
          throw _err;
        })
      ).subscribe()
    );
  }
}
