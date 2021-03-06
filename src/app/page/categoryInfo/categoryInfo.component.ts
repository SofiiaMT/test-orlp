import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ORLPService} from '../../services/orlp.service';
import {CategoryLink} from '../../dto/CategoryDTO/link.category.DTO';
import {CategoryInfoService} from './categoryInfo.service';

@Component({
    templateUrl: ('./categoryInfo.component.html'),
    styleUrls: ['./categoryInfo.css']
})

export class CategoryInfoComponent implements OnInit {
    private url: string;
    public category: CategoryLink;
    private sub: Subscription;
    private errorMessage: string;
    public table1 = true;
    public table2 = false;

    constructor(private route: ActivatedRoute,
                private orlp: ORLPService,
                private categoryService: CategoryInfoService) { }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(
            params => {
                this.url = params['url'];
            }
        );
        this.takeCategory();
    }

    private takeCategory() {
        this.decodeLink();
        this.categoryService.getCategory(this.url).subscribe(
            category => this.category = category,
            error => this.errorMessage = <any>error
        );
    }

    private decodeLink() {
        this.url = this.orlp.decodeLink(this.url);
    }

    tabClick(id: number) {
        if (id === 0) {
            this.table1 = true;
            this.table2 = false;
        } else {
            this.table2 = true;
            this.table1 = false;
        }
    }

    public getLinkForCourses(): string {
        return this.orlp.getShortLink(this.category.courses);
    }

    public getLinkForDecks(): string {
        return this.orlp.getShortLink(this.category.decks);
    }
}
