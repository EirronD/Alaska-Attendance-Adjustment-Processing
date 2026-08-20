export class PayrollPeriod {
    constructor (
        public name: string,
        public company: string,
        public payroll_date: any,
        public approval_cutoff: any,
        public attendance_from: any,
        public attendance_to: any,
        public period_group: string
    ) {}
}
