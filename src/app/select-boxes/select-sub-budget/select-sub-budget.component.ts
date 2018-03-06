import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';  
import { IBudgetSub } from 'app/interfaces';
import { StandardService } from 'app/services/standard.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-select-sub-budget',
  templateUrl: './select-sub-budget.component.html',
  styles: []
})
export class SelectSubBudgetComponent implements OnInit {

  _year: any;
  _budgetTypeId: any;

  @Input() public selectedId: any;
  @Input() public disabled: any;

  @Input('year')
  set setYear(value: any) { this._year = value; }  

  @Input('budgetTypeId')
  set setBudgetTypeId(value: any) {
    this._budgetTypeId = value;
    this.getItems();
  }  

  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: IBudgetSub[] = [];

  constructor(private stdService: StandardService, private alertService: AlertService) { }

  async ngOnInit() {
    // await this.getItems();
  }

  async getItems() {

    try {
      this.loading = true;
      let rs: any = await this.stdService.getBudgetSub(this._budgetTypeId, this._year);
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.items, { bgdetail_id: this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              this.onChange.emit(this.items[0]);
            }
          } else {
            this.selectedId = this.items[0].bgdetail_id;
            this.onChange.emit(this.items[0]);
          }
        }

      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error()
    }
  }

  setBudgetType(budgetType: any) {
    this._budgetTypeId = budgetType;
  }

  setSelected(event: any) {
    const idx = _.findIndex(this.items, { bgdetail_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.items[idx]);
    }
  }

}