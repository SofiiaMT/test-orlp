import {Injectable} from '@angular/core';
import {ORLPService} from '../../../services/orlp.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {DTOConverter} from '../../../dto/dto.converter';
import {CoursePublic} from '../../../dto/CourseDTO/public.course.DTO';
import {CoursePageDTO} from '../../../dto/CourseDTO/linkToCourseByPageDTO';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UserCoursesService {

  constructor(private orlp: ORLPService,
              private logger: NGXLogger) {
  }

  getCoursesByPage(numberPage: number, selectedSortingParam: string, ascending: boolean) {
    return this.orlp.get('/api/courses?p=' + numberPage + '&sortBy=' + selectedSortingParam + '&asc=' + ascending)
      .map((response: Response) => <CoursePageDTO>
        DTOConverter.jsonToCourseByPage(response.json()))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    this.logger.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
