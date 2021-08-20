import { BehaviorSubject, Observable } from 'rxjs';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {dateToString, postFetch} from '../../utils';

export interface EventsInfo {
  events: EventInfo[];
  total: number;
  offset: number;
  count: number;
}

export interface EventSubject {
  id: number;
  name: string;
  createdOn: string;
}

export interface EventFile
{
  id: number;
  name: string;
  createdAt: string;
  contentType: string;
  eventId: number;
}

export interface EventInfo{
  id: number
  subject: EventSubject;
  description:string;
  createdAt: string;
  files: string;
}

export class EventsDataSource implements DataSource<EventInfo> {

  private eventsSubject = new BehaviorSubject<EventInfo[]>([]);
  private loadingRelations = new BehaviorSubject<boolean>(false);

  public data : EventInfo[] = [];
  public loading$ = this.loadingRelations.asObservable();

  connect(collectionViewer: CollectionViewer): Observable<EventInfo[]> {
      return this.eventsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.eventsSubject.complete();
      this.loadingRelations.complete();
  }

  async loadEvents(pageIndex=0, pageSize=10) : Promise<EventsInfo|null> {

      this.loadingRelations.next(true);
      this.data = [];

      try {
        const result : EventsInfo = await postFetch({offset: pageIndex*pageSize, count:pageSize}, 'Events');

        this.eventsSubject.next(result.events.map(i => ({
          id:i.id,
          subject: i.subject,
          description: i.description,
          createdAt: i.createdAt ? dateToString(new Date(i.createdAt)) : '',
          files: i.files,
        })));

        this.loadingRelations.next(false);

        this.data = result.events;
        return result;
      }
      catch(e){
        this.eventsSubject.next([]);
      }

      this.loadingRelations.next(false);
      return null;
  }
}
