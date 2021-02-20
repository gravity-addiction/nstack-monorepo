import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EventsService } from '@modules/events/services/events.service';
import { Observable, Subscription } from 'rxjs';

import { EventsFormComponent } from '../form/form.component';

import { Event } from '@typings/event';

@Component({
  selector: 'app-event-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @ViewChild('formComponent', { static: true }) formComponentElem!: EventsFormComponent;
  @Input() eventInfo!: Event;

  noEventFound = false;
  showTemplate = false;
  showEditor = false;
  findingEvent = false;
  origEventHtml = '';
  eventHtml = '';
  sub!: Subscription;
  sharedData: any;
  eventInfoSave$!: Subscription;
  searchVal = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _eventsService: EventsService,
    private _router: Router
  ) {
    /*

        this._activatedRoute.params.subscribe((params: Params) => {
          this.noEventFound = false;
          this.findingEvent = true;
          // console.log('Got Params', params);
          this.eventInfo$ = this._eventsService.getEvent(params.event).subscribe(data => {
            this.findingEvent = false;
            if (data) {
              this.eventInfo = data;

    //          this._storage.get('evt_' + this.eventInfo.event).then(
    //            data => this.searchVal = data || ''
    //          );

              this.eventHtml = this.eventInfo.event_registration_html;
            } else {
              this.noEventFound = true;
            }
          }, (_err: Error) => {
            this.findingEvent = false;
            this.noEventFound = true;
          });
        });
    */
  }

  ngOnInit() {
    this.eventHtml = this.eventInfo.registration_html;

    /*
    this.eventInfo.subscribe(data => {
      this.findingEvent = false;
      if (data) {
        this.eventData = data;

//          this._storage.get('evt_' + this.eventInfo.event).then(
//            data => this.searchVal = data || ''
//          );


      } else {
        this.noEventFound = true;
      }
    }, (_err: Error) => {
      this.findingEvent = false;
      this.noEventFound = true;
    });*/
  }

  openShort(code: string) {
    const sCode = code.replace(/[^A-Z0-9\-\_]+/gi, '');
    if (sCode !== code) {
      console.log('Invalid Short Code'); return;
    }
    /***
    this._storage.set('evt_' + this.eventInfo.event, sCode);
    ***/
    this._router.navigate([sCode], { relativeTo: this._activatedRoute });
  }

  openSheet() {
    /*** (window as any).open('https://docs.google.com/spreadsheets/d/1AUAj2QExlOhluf1k80e98UDZNWUh2raM4EDF7LOebYQ', '_blank'); ***/
  }
  scroll(el: any) {
    try {
      el.scrollIntoView();
    } catch (e) { }
    /*** try { this.formComponent.teamNameElem.setFocus(); } catch (e) { } ***/
  }

  cancelEditor() {
    this.eventHtml = this.eventInfo.registration_html;
    this.showEditor = false;
  }

  saveEventHeader(html: string) {
    this.eventInfoSave$ = this._eventsService.updateEvent(this.eventInfo.slug, {
      /* eslint-disable @typescript-eslint/naming-convention */
      short_id: 'E3THNVZVE',
      registration_html: html,
    }).subscribe((data: any) => {
      this.eventInfo.registration_html = data.event_registration_html;
      this.eventHtml = this.eventInfo.registration_html;
      this.showEditor = false;
    });
    // this.origEventHtml = html;
    // this.showEditor = false;

  }
}
