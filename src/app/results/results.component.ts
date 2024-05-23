import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit{

  constructor(private http: HttpClient, private router: Router, private location: Location, private backend: BackendService) {}
  @Input() selectedExecutionId: any;
  @Output() totalKwUsed = new EventEmitter<any>();
  @Output() executionDetail = new EventEmitter<any>();

  user: any;
  results: any;
  tableHead: any;
  tableBody: any[] = [];
  totalKw: any = 0;
  executions: any;
  selectedExecution: any;

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.getExecutions();
    this.getTotalKw();
  }

  getTotalKw() {
    for (let i = 0; i < this.tableBody.length; i++) {
      const element = this.tableBody[i];
      this.totalKw += parseFloat(element[10]);
      this.totalKwUsed.emit(this.totalKw);
      console.log(parseFloat(element[10]))
      console.log(this.totalKw)
    }
  }

  getExecutions() {
    this.backend.getExecutions().subscribe((resp) => {
      console.log(resp)
      this.executions = resp;
      this.getSelectedExecution(this.selectedExecutionId);
    })
  }

  getSelectedExecution(id: any) {
    console.log(id)
    this.selectedExecution = this.executions.find((execution: { id: any; }) => execution.id == id);
    console.log("this.selectedExecution in getSelectedExecution: ",this.selectedExecution)
    if (this.selectedExecution) {
      if(this.selectedExecution.csv_name)
      {
        this.results = this.selectedExecution.csv_name.split(",");
        this.executionDetail.emit(this.results)
        console.log("this.results in selectedExecution: ",this.results)
        for (let i = 0; i < this.results.length; i++) {
          if (i == 0) {
            this.tableHead = this.results[i].split(";");
            console.log(this.tableHead);
          } else {
            this.tableBody.push(this.results[i].split(";"));
          }
        }
        console.log(this.tableHead);
      }
    }
    this.getTotalKw();
  }

}
