export class Application {
    constructor (
        public name: string,
        public application: string,
        public company: string,
        public employee: string,
        public employee_name: string,
        public approved_on: any,
        public target_date: any,
        public prev_period: string,
        public curr_period: string,
        public last_cutoff_approval: string
    ) {}
}
