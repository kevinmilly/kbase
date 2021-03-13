import {AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'kb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() data$:Observable<any> = new Observable<any>();
  @Input() columns:string[] = [];
  @Input() filterChoices:string[][] = []; //options the below filters can be, order of this filter Choices array based on order of filters array
  @Input() filters:string[] = []; //different things you can filter by
  @Input() displayNames:string[] = [];
  @Input() action = false;
  @Input() actionButtonIcon?:string;

  @Output() onApproved = new EventEmitter();

  dataSaved:any[] = [];
  data: any[] = [];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  refColumns:string[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSub?:Subscription;

  

  constructor() {
    
   }

  ngOnInit(): void {
    this.dataSub = this.data$.subscribe( d => {

        console.dir(d);
        this.dataSaved = [...d];
        this.data = [...d];
        this.dataSource = new MatTableDataSource([...this.data]);
        this.setupSortAndPagination();
      
    })

    this.displayedColumns = this.displayNames;
    this.columns = this.columns.filter(c => c !== "_id");


  }

  // ngAfterViewInit() {

  //   this.setupSortAndPagination();
  // }

  applySearchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilter(filterType:string, filterChoice:string) {
    this.data = this.dataSaved.filter(d => d[`${filterType}`] === filterChoice );
    this.dataSource = new MatTableDataSource(this.data);
    this.setupSortAndPagination();
  }

  onClicked(event:any) {
    this.onApproved.emit({event:event, length:this.data.length - 1});

  }

  setupSortAndPagination() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if(this.dataSub) this.dataSub.unsubscribe();
  }

}
