import { Component, OnInit } from '@angular/core';
import { Subject, Timetable } from '../../models/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
    rows: number;
    rowIndex: number;

    modal;
    subjectSelectorModal;
    hoursSelectorModal;

    subjects: Subject[] = [];

    timetable: Timetable;

    selectedRowIndex: number;
    subjectSelected: number;
    subjectRow: number;
    subjectCol: number;

    hour_start = {
        hour: 10,
        minute: 0
    };

    hour_end = {
        hour: 10,
        minute: 0
    };

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        public toastService: ToastService
    ) { }

    ngOnInit() {
        this.getSubjects();
        this.getTimetable();
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

    getSubjects() {
        this.apiService.get('subjects').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects = resp.subjects;
                }
            }
        );
    }

    getTimetable() {
        this.apiService.get('timetable').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.timetable = resp.timetable;
                    this.timetable.subjects = resp.subjects;
                }
            }
        );
    }

    /**********/
    /* MODALS */
    /**********/

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

    openSubjectSelectorModal(content, data) {
        this.subjectRow = data[0];
        this.subjectCol = data[1];

        this.subjectSelectorModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    openHoursSelectorModal(content, index) {
        this.selectedRowIndex = index;

        this.hoursSelectorModal = this.modalService.open(content, { centered: true });
    }

    /*************/
    /* TIMETABLE */
    /*************/

    createTable() {
        if (+this.rows > 0) {
            this.timetable = {
                id: 0,
                user_id: 1,
                rows: this.rows,
                hours: [],
                subjects: []
            };

            this.addRows(+this.rows);
        }
    }

    addRows(rows) {
        let subjects;

        for (let i of Array(rows)) {
            subjects = [];

            this.timetable.hours.splice(this.rowIndex, 0,
                {
                    id: null,
                    hour_start: '00:00',
                    hour_end: '23:59',
                }
            );

            for (let e of Array(5)) {
                subjects.push(
                    {
                        id: null,
                        subject_id: this.subjects[0].id,
                    }
                );
            }

            this.timetable.subjects.splice(this.rowIndex, 0, subjects);
        }
    }

    updateCell(subject_id: number) {
        this.timetable.subjects[this.subjectRow][this.subjectCol].subject_id = subject_id;

        this.subjectSelectorModal.close();
    }

    deleteRow(index: number) {
        this.timetable.subjects.splice(index, 1);
        this.timetable.hours.splice(index, 1);

        if (this.timetable.subjects.length === 0) {
            this.timetable = null;
        }
    }

    setTime() {
        const hour_start = this.addZero(this.hour_start.hour) + ':' + this.addZero(this.hour_start.minute);
        const hour_end = this.addZero(this.hour_end.hour) + ':' + this.addZero(this.hour_end.minute);

        this.timetable.hours[this.selectedRowIndex].hour_start = hour_start;
        this.timetable.hours[this.selectedRowIndex].hour_end = hour_end;

        this.hoursSelectorModal.close();
    }

    addZero(number: number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }

    /******************/
    /* TIMETABLE CRUD */
    /*****************/

    storeTimetable() {
        this.apiService.post('timetable', this.timetable).subscribe(
            resp => {
                if (resp.status === 'success') {
                    if (this.timetable.id != 0) {
                        this.showToast('Horario actualizado correctamente', 'success');
                    } else {
                        this.showToast('Horario creado correctamente', 'success');
                    }

                    this.getTimetable();
                }
            }
        );
    }

    deleteTimetable() {
        this.apiService.delete('timetable').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.timetable = null;
                    this.showToast('Horario delete correctamente', 'success');
                }
            }
        );
    }

    /*********/
    /* OTROS */
    /*********/

    findSubject(subject_id: number) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

    findSubjectIndex(subject_id: number) {
        return this.subjects.findIndex(subject => subject.id === subject_id);
    }

    markSubjectInTimetable(subject_id) {
        this.subjectSelected = subject_id;
    }

    subjectIsSelected(subject_id) {
        if (this.subjectSelected === subject_id) {
            return true;
        } else {
            return false;
        }
    }

    showToast(text, type) {
        switch (type) {
            case 'success': {
                this.toastService.show(text, { classname: 'bg-dark text-light', delay: 5000 });
                break;
            }
            case 'danger': {
                this.toastService.show(text, { classname: 'bg-danger text-light', delay: 5000 });
                break;
            }
        }
    }
}
