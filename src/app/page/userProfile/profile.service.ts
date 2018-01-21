import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {ORLPService} from '../../services/orlp.service';
import {UserDetailsDto} from '../../dto/UserDetailsDto';
import {DTOConverter} from '../../dto/dto.converter';
import {Person} from '../../dto/Person';
import {PasswordDTO} from '../../dto/PasswordDTO';
import {NGXLogger} from 'ngx-logger';
import {RememberingLevelDTO} from '../../dto/remembering.level.dto';

@Injectable()
export class ProfileService {
  private url = '/api/private/user' ;
  constructor(private orlp: ORLPService,
              private logger: NGXLogger) {
  }

  getUserProfile(): Observable<UserDetailsDto> {
    return this.orlp.get(this.url + '/details')
      .map((response: Response) => <UserDetailsDto> DTOConverter.jsonToUserDetails(response.json()))
      .catch(this.handleError);
  }

  changePersonalData(person: Person) {
    return this.orlp.put(this.url + '/data', person)
      .map((response: Response) => this.logger.log(response))
      .catch(this.handleError);
  }

  changePassword(password: PasswordDTO): Observable<Response> {
    return this.orlp.put(this.url + '/password-change', password)
      .map((response: Response) => this.logger.log(response))
      .catch(this.handleError);
  }

  deleteProfile() {
    return this.orlp.get(this.url + '/delete')
      .map((response: Response) => this.logger.log(response))
      .catch(this.handleError);
  }

  addImage(file: any) {
    return this.orlp.post(this.url + '/image', file)
      .map((response: Response) => this.logger.log(response));
  }

  private handleError(error: Response) {
    this.logger.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  getLearningRegime(): Observable<string> {
    return this.orlp.get('api/private/account/learning-regime').map((response: Response) => response.json());
  }

  updateLearningRegime(regime: string) {
    return this.orlp.put('api/private/account/learning-regime', regime);
  }

  getCardsNumber(): Observable<number> {
    return this.orlp.get('api/private/account/cards-number').map((response: Response) => response.json());
  }

  updateCardsNumber(cardsNumber: number): Observable<Response> {
    return this.orlp.put('api/private/account/cards-number', cardsNumber);
  }

  getRememberingLevels(): Observable<RememberingLevelDTO[]> {
    return this.orlp.get('api/private/account/remembering-levels').map((response: Response) =>
      DTOConverter.jsonArrayToCollection(DTOConverter.jsonToRememberingLevel, response.json()));
  }

  updateRememberingLevel(id: number, numberOfPostponedDays: number): Observable<Response> {
    return this.orlp.put('api/private/account/remembering-levels/' + id, numberOfPostponedDays);
  }
}
