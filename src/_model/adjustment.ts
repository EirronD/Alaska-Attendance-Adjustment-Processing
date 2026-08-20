export class Adjustment {
    constructor (
        public employee: string,
        public employee_name: string,
        public work_shift: string,
        public target_date: any,
        public card_in: any,
        public card_out: any,
        public actual_work_hours: number,
        public work_hours: number,
        public late: number,
        public undertime: number ,
        public night_diff: number,
        public overtime: number,
        public overtime_ex: number,
        public overtime_nd: number,
        public night_diff_t2: number,
        public night_diff_t1: number,
        public links: string ,
        public errorMsg: string 
    ) {}
}
