import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    signal,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product, ProductService } from '@/pages/service/product.service';
import { Column, ExportColumn } from '@/commons/type/app.table.type';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-table',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        ReactiveFormsModule
    ],
    templateUrl: './table.html',
    styleUrl: './table.scss',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class AppTable implements OnInit {
    @Input("title") title!: string;
    @Input("data") data!: (any|undefined)[];
    @Input("id") id!: string;
    @Input("columns") columns!: Column[];

    @Output("onSave") onSaveEvent = new EventEmitter<any>;
    @Output("onEdit") onEditEvent = new EventEmitter<any>;
    @Output("onDelete") onDeleteEvent = new EventEmitter<any>;
    @Output("onDeleteList") onDeleteListEvent = new EventEmitter<any[]>;
    @Output("onSearch") onSearchEvent = new EventEmitter<{field: string, operator: string, value: string}>;
    @Output("onNew") onNewEvent = new EventEmitter<any>;
    @Output("onExport") onExportEvent = new EventEmitter<any>;
    @Output() selectionChanged = new EventEmitter<any[]>();
    @Output() onPageChangeEvent = new EventEmitter<any>();

    @Input() width = '450px';
    @Input() showExport = true;

    @Input() rowHover: boolean = false;
    @Input() paginator: boolean = true;

    @Input() searchOperator:string = "like";
    @Input() searchField!:string;

    @Input() rowsPerPageOptions: any[] = [5, 10, 15];
    selectedItems: any[] = [];
    selectedIds: string[] = [];
    item!: any;

    @Input()total: number = 10;
    pageSize!: number;
    searchControl = new FormControl('');
    searchSubject = new Subject<{field: string, operator: string, value: string}>();



    exportCSV() {
        this.onExportEvent.emit()
    }

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.onSearchEvent.emit({
                    field: this.searchField,      // hoặc cột bạn muốn lọc
                    operator: this.searchOperator,  // có thể linh động
                    value: value || '',
                });
            });
    }

    onPageChange(item: any){
        this.pageSize = item.row;
    }

    onSelectionChange(selected: any[]) {
        this.selectedItems = selected;
        this.selectedIds = selected.map(item => item[this.id]);
        this.selectionChanged.emit(this.selectedIds);
    }


    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchSubject.next({
            field: this.searchField,
            operator: this.searchOperator,
            value
        });
    }

    openNew() {
        this.onNewEvent.emit();
    }

    onEdit(item: any) {
        this.onEditEvent.emit(item);
    }

    onDeleteList() {
        this.onDeleteListEvent.emit(this.selectedItems)
    }


    onDelete(item: any) {
        this.onDeleteEvent.emit(item);
    }

}
