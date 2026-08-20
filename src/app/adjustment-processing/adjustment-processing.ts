import { Injectable } from '@angular/core';
import { GlobalApiService } from '../../_service/global-api-service';
import { PayrollPeriod } from '../../_model/payroll-period';
import { Application } from '../../_model/application';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NumberValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root' // Optional: Makes this service available application-wide
})
export class AdjustmentProcessing {

    decimalPipe: DecimalPipe = new DecimalPipe("en-US");
    datepipe: DatePipe = new DatePipe('en-US');

    payrollperiod_fields = '["name", "company", "payroll_date", "approval_cutoff","attendance_from", "attendance_to", "period_group"]';
    application_fields = '["name", "company", "employee", "full_name", "approved_on", "target_date"]';
    application_fields2 = '["name", "company", "employee", "employee_name", "approved_on", "target_date"]';
    
    constructor(private apiservice: GlobalApiService) { }


    async GetPayrollPeriodList(company: string = ''): Promise<PayrollPeriod[]> {
        let request: PayrollPeriod[] = [];
        try {
            const res_payrol_period = await this.apiservice.getPNData(
                `Payroll Period?fields=${this.payrollperiod_fields}&filters=[["company","=","${company}"],["is_special","!=","1"]]&limit_page_length=0`
            );

            if (res_payrol_period && res_payrol_period.data) {
                for (let v of res_payrol_period.data) {
                    let setPeriod = new PayrollPeriod(v.name, v.company, v.payroll_date, v.approval_cutoff,v.attendance_from, v.attendance_to, v.period_group);
                    request.push(setPeriod);
                }
            }
        } catch (error) {
            console.error('Error fetching payroll period list:', error);
        }
        return request;
    }


    // Return Only Single Row
    async GetPayrollPeriod(payroll_period: string = ''): Promise<PayrollPeriod | null> {
        try {
            const res_payrol_period = await this.apiservice.getPNData(
                `Payroll Period?fields=${this.payrollperiod_fields}&filters=[["name","=","${payroll_period}"],["is_special","!=","1"]]&limit_page_length=0`
            );

            if (res_payrol_period && res_payrol_period.data && res_payrol_period.data.length > 0) {
                const v = res_payrol_period.data[0]; // Get the first matching record
                return new PayrollPeriod(v.name, v.company, v.payroll_date, v.approval_cutoff, v.attendance_from, v.attendance_to, v.period_group);
            } else {
                return null; // No matching record found
            }
        } catch (error) {
            console.error('Error fetching payroll period:', error);
            return null; // Return null if there's an error
        }
    }



    async GetApplication(application: string, company: string, period_group: string): Promise<Application[]> {
        let request: Application[] = [];
        let filteredApplication: Application[] = [];


        try {

            console.log('period_group', period_group)
            let res_employee = await this.apiservice.getPNData(`Employee?fields=["name", "company", "period_group", "full_name"]&filters=[["company","=","${company}"], ["period_group", "=", "${period_group}"]]&limit_page_length=0&as_dict=False`);
            console.log('employee', res_employee.data)
            const emps = res_employee.data.map((emp: any) => emp.name);
            console.log('employee data:', emps);


            let fields = ['DTR Problem Application'].includes(application) 
            ? this.application_fields2 
            : this.application_fields;

            console.log(application, fields)
            let res_application = await this.apiservice.getPNData(
                `${application}?fields=${fields}&filters=[["company","=","${company}"],["approved_on","!=",""],["workflow_state","=","Approved"]]&limit_page_length=0`
            );

            if (res_application && res_application.data) {
                for (let v of res_application.data) {
                    // Check for 'DTR Problem Application'
                    let employee_name = ['DTR Problem Application'].includes(application)  ? v.employee_name : v.full_name;

                    // Create Application instance
                    let setApplication = new Application(v.name, application, v.company, v.employee, employee_name, v.approved_on, v.target_date, '', '', '');
                    request.push(setApplication);
                }

                
                filteredApplication = request.filter(
                    pp => emps.includes(pp.employee)
                );

                console.log("GetLeaveApplication", filteredApplication)

            }
        } catch (error) {
            console.error('Error fetching payroll period:', error);
        }

        return filteredApplication;
    }
    

    async GetAdjsutmentData(payroll_period: string): Promise<any[]> {
        // let request: [];
        let res_employee = await this.apiservice.getIntegData(`${encodeURIComponent(payroll_period)}`);
        // console.log(res_employee)

        return res_employee;
    }

    async GetLeaveApplication(company: string, _attendance_from: any, _date_from: any, _date_to: any, period_group: string): Promise<Application[]> {
        let request: Application[] = [];
        let leaveApplication: Application[] = [];

        try {
            let application: string = 'Leave Application'
            let fields = '["name", "company", "employee", "full_name", "approved_on"]';
            console.log(application, fields)

            console.log('period_group', period_group)
            let res_employee = await this.apiservice.getPNData(`Employee?fields=["name", "company", "period_group", "full_name"]&filters=[["company","=","${company}"], ["period_group", "=", "${period_group}"]]&limit_page_length=0&as_dict=False`);
            console.log('employee', res_employee.data)
            const emps = res_employee.data.map((emp: any) => emp.name);
            console.log('employee data:', emps);


            let date_from = this.datepipe.transform(_date_from, 'yyyy-MM-dd') || '';;
            let date_to = this.datepipe.transform(_date_to, 'yyyy-MM-dd') || '';;
            let attendance_from = this.datepipe.transform(_attendance_from, 'yyyy-MM-dd') || '';;

            let res_application = await this.apiservice.getPNData(
                `${application}?fields=${fields}&filters=[["company","=","${company}"],
                                                          ["approved_on","!=",""],
                                                          ["workflow_state","=","Approved"]]&limit_page_length=0`
            );

            if (res_application && res_application.data) {
                for (let v of res_application.data) {
                    let setApplication = new Application(v.name, application, v.company, v.employee, v.full_name, v.approved_on, '', '', '', '');
                    request.push(setApplication);
                }
            }
            console.log("GetLeaveApplication", request)

            leaveApplication = request.filter(
                pp => pp.approved_on >= date_from && 
                      pp.approved_on <= date_to &&
                      emps.includes(pp.employee)
              );

              const leaves = leaveApplication.map((lvs: any) => lvs.name);

              // Array to hold all the promises
              const leavePromises = leaves.map(async (v: string) => {
                // Fetch the data for each leave
                const setleave = await this.apiservice.getPNData(`Leave Application/${v}`);
                return setleave.data;  // Assuming `setleave.data` is the desired result
              });
              
              // Resolve all the promises in parallel
              const leaveData = await Promise.all(leavePromises) || null;
              
              for (let v of leaveData) {
                console.log(v.leave_application_table)
              }

            // const filteredItems = setleave.leave_application_table.filter((item: any) => item.leave_date < attendance_from);

            
            // console.log("res_application_table", leaves)
            // console.log("filteredItems", filteredItems)

        } catch (error) {
            console.error('Error fetching leave application:', error);
        }

        return leaveApplication;
    }
}
