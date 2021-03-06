import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {ORLPService} from '../../services/orlp.service';
import {DTOConverter} from '../../dto/dto.converter';
import {DeckPublic} from '../../dto/DeckDTO/public.deck.DTO';
import {CourseLinkWithId} from '../../dto/CourseDTO/linkWithId.course.DTO';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CourseInfoService {
  private urlAddCourseToUser = 'api/user/courses/';
  private urlGettingListOfIdOfTheCourses = 'api/private/user/courses';

  constructor(private orlp: ORLPService,
              private logger: NGXLogger) {
  }

  getCourse(url: string): Observable<CourseLinkWithId> {
    return this.orlp.get(url)
      .map((response: Response) => DTOConverter.jsonToPublicLinkCourseWithId(response.json()))
      .catch(this.handleError);
  }

  getDecks(course: CourseLinkWithId): Observable<DeckPublic[]> {
    const url = this.orlp.decodeLink(this.orlp.getShortLink(course.decks));
    return this.orlp.get(url)
      .map((response: Response) => <DeckPublic[]>(DTOConverter
        .jsonArrayToCollection(DTOConverter.jsonToPublicDeck, response.json())))
      .catch(this.handleError);
  }

  addCourseToUser(courseId: number) {
    return this.orlp.put(this.urlAddCourseToUser + courseId, {})
      .map((response: Response) => this.logger.log(response))
      .catch(this.handleError);
  }
  getIdCoursesOfTheCurrentUser(): Observable<number[]> {
    return this.orlp.get(this.urlGettingListOfIdOfTheCourses)
      .map((response: Response) => response.json());
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.message || error);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }
}
