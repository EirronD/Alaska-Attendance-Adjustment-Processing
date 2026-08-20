import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
// import {   } from '@docs-components/public-api';
import Swal from 'sweetalert2'

import {
  BorderDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective,
  GridModule
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import {
  InputGroupComponent, InputGroupTextDirective, FormControlDirective,
  FormLabelDirective, FormCheckInputDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective, FormSelectDirective
} from '@coreui/angular';

import { TableDirective, TableColorDirective, TableActiveDirective, AlignDirective } from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgForm, ReactiveFormsModule } from '@angular/forms';


import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  PopoverDirective,
  TooltipDirective
} from '@coreui/angular';

import { AppConfig } from 'src/_config/app-config';
import { GlobalApiService } from 'src/_service/global-api-service';

// Modal Import
import { Employee } from 'src/_model/employee';
import { Company } from 'src/_model/company';
import { PayrollPeriod } from 'src/_model/payroll-period';

// Library Class
import { AdjustmentProcessing } from './adjustment-processing';
import { Application } from 'src/_model/application';
import { Adjustment } from 'src/_model/adjustment';

type CardColor = {
  color: string
  textColor?: string
}

@Component({
  selector: 'app-adjustment-processing',
  standalone: true,
  imports: [CommonModule, GridModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, 
    // DocsExampleComponent, 
    NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective,
    TabsComponent, TabsListComponent, IconDirective, TabDirective, TabsContentComponent, TabPanelComponent,
    InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective,
    FormCheckInputDirective, ThemeDirective,
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective, FormSelectDirective,
    TableDirective, TableColorDirective, TableActiveDirective, AlignDirective, ReactiveFormsModule,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    PopoverDirective,
    TooltipDirective],

  templateUrl: './adjustment-processing.component.html',
  styleUrl: './adjustment-processing.component.scss',
  providers: [AdjustmentProcessing] // Provide it here if only needed in this component
})
export class AdjustmentProcessingComponent implements OnInit {


  companyList: Company[] = [];
  periodList: PayrollPeriod[] = [];
  employeeList: Employee[] = [];
  applicationList: Application[] = [];
  adjustmentList: Adjustment[] = [];

  employeeDetails: any = {};

  employee: string = ''
  company: string = ''
  payrollperiod: string = ''

  documentForm = new FormGroup({
    employee: new FormControl(''),
    company: new FormControl(''),
    payrollperiod: new FormControl('')
  });

  constructor(
    private apiservice: GlobalApiService,
    private adjprocessing: AdjustmentProcessing) {

  }

  onDataChange(): void {

  }

  ngOnInit(): void {

    this.view();
  }

  async view() {

    // let res_login: any;
    // res_login = await this.apiservice.getPNLogin();
    // console.log(res_login)
    

    

    let res_company: any;
    // res_company = await this.apiservice.getPNData('Company?limit_page_length=0');
    res_company = await this.apiservice.getPNIntegData('getCompany');
    console.log(res_company)
    this.companyList = [];
    for (var v of res_company) {
      let setCompany = new Company(v.name);
      this.companyList.push(setCompany);
    }
    console.log(this.companyList)


    // let res_payrol_period: any;
    // res_payrol_period = await this.apiservice.getPNIntegData('getPayrollPeriod');
    // this.periodList = [];
    // for (var v of res_payrol_period) {
    //   let setPeriod = new PayrollPeriod(v.name, '', null, null, null, null, '');
    //   this.periodList.push(setPeriod);
    // }
    // console.log(this.periodList)



    // let res_employee: any;
    // res_employee = await this.apiservice.getPNData('Employee?fields=["name", "full_name", "company"]&limit_page_length=0');
    // this.employeeList = [];
    // for (var v of res_employee.data) {
    //   let setEmployee = new Employee(v.name, v.full_name, v.company);
    //   this.employeeList.push(setEmployee);
    // }
    // console.log(this.employeeList)
  }
  filteredEmployees = this.employeeList;
  filteredCompanies = this.companyList;
  filteredPeriods = this.periodList;

  isEmployeeDropdownVisible = false;
  isCompanyDropdownVisible = false;
  isPeriodDropdownVisible = false;
  inputStateEmployee: 'danger' | 'warning' | 'normal' = 'normal';
  inputStateCompany: 'danger' | 'warning' | 'normal' = 'normal';
  inputStatePeriod: 'danger' | 'warning' | 'normal' = 'normal';

  lastFocusedInput: 'company' | 'period' | 'employee' | null = null;

  filterList<T>(value: string, list: T[], keys: (keyof T)[]): T[] {
    if (!value) {
      return list; // Return the original list if the input value is empty
    }

    return list.filter(item =>
      keys.some(key =>
        item[key]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  updateDropdownVisibility(list: Array<{ name: string }>, value: string): boolean {
    return list.length > 0 && value !== '';
  }

  onEmployeeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Filter the employee list based on the input value
    this.filteredEmployees = this.filterList(value, this.employeeList, ['name', 'full_name']);
    this.isEmployeeDropdownVisible = this.updateDropdownVisibility(this.filteredEmployees, value);
    this.updateInputState('employee', value); // Update input state
  }

  onCompanyInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Filter the company list based on the input value
    this.filteredCompanies = this.filterList(value, this.companyList, ['name']);
    this.isCompanyDropdownVisible = this.updateDropdownVisibility(this.filteredCompanies, value);
    this.updateInputState('company', value); // Update input state
  }

  onPeriodInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Filter the period list based on the input value
    this.filteredPeriods = this.filterList(value, this.periodList, ['name']);
    this.isPeriodDropdownVisible = this.updateDropdownVisibility(this.filteredPeriods, value);
    this.updateInputState('period', value); // Update input state
  }

  onEmployeeSelect(name: string, selRow: {}) {
    // console.log(selRow)
    this.documentForm.get('employee')?.setValue(name);
    this.isEmployeeDropdownVisible = false;
    this.inputStateEmployee = 'normal'; // Reset state to normal on selection

    this.employeeDetails = selRow;

  }

  async onCompanySelect(name: string, selRow: {}) {
    // console.log(selRow)
    this.documentForm.get('company')?.setValue(name);
    this.isCompanyDropdownVisible = false;
    this.inputStateCompany = 'normal'; // Reset state to normal on selection


    console.log("company", name)

    let res_payrol_period: any;
    res_payrol_period = await this.apiservice.getPNIntegData(`getPayrollPeriod/${name}`);

    console.log("company", res_payrol_period)    
    this.periodList = [];
    for (var v of res_payrol_period) {
      let setPeriod = new PayrollPeriod(v.name, '', null, null, null, null, '');
      this.periodList.push(setPeriod);
    }
    console.log(this.periodList)

  }

  async onPeriodSelect(name: string, selRow: {}) {
    // console.log(selRow)
    this.documentForm.get('payrollperiod')?.setValue(name);
    this.isPeriodDropdownVisible = false;
    this.inputStatePeriod = 'normal'; // Reset state to normal on selection



    let res_employee: any;
    res_employee = await this.apiservice.getPNIntegData(`getEmpoyeeWithAdjustment/${name}`);
    console.log("period", res_employee)

    this.employeeList = [];
    for (var v of res_employee) {
      let setEmployee = new Employee(v.employeeID, v.employeeFullName, this.company);
      this.employeeList.push(setEmployee);
    }
    console.log(this.employeeList)


  }

  updateInputState(type: 'company' | 'period' | 'employee', value: string) {
    const list = type === 'company' ? this.filteredCompanies : type === 'employee' ? this.filteredEmployees : this.filteredPeriods;

    if (value === '') {
      if (type === 'company') {
        this.inputStateCompany = 'normal'; // Reset state if input is empty
      } else if (type === 'employee') {
        this.inputStateEmployee = 'normal';
      } else {
        this.inputStatePeriod = 'normal';
      }
    } else if (list.length === 0) {
      if (type === 'company') {
        this.inputStateCompany = 'danger'; // No matches
      } else if (type === 'employee') {
        this.inputStateEmployee = 'danger';
      } else {
        this.inputStatePeriod = 'danger';
      }
    } else if (list.length > 1) {
      if (type === 'company') {
        this.inputStateCompany = 'warning'; // Multiple matches
      } else if (type === 'employee') {
        this.inputStateEmployee = 'warning';
      } else {
        this.inputStatePeriod = 'warning';
      }
    } else {
      if (type === 'company') {
        this.inputStateCompany = 'normal'; // Exactly one match
      } else if (type === 'employee') {
        this.inputStateEmployee = 'normal';
      } else {
        this.inputStatePeriod = 'normal';
      }
    }
  }

  onInputFocus(event: Event, type: 'company' | 'period' | 'employee') {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.lastFocusedInput = type; // Track the last focused input



    if (type === 'company') {
      this.employeeDetails = [];
      this.filteredCompanies = this.filterList(value, this.companyList, ['name']);
      this.isCompanyDropdownVisible = value === '' || this.updateDropdownVisibility(this.filteredCompanies, value);
    } else if (type === 'employee') {

      console.log(type)
      this.filteredEmployees = this.filterList(value, this.employeeList, ['full_name']);
      this.isEmployeeDropdownVisible = value === '' || this.updateDropdownVisibility(this.filteredEmployees, value);
      console.log(this.filteredEmployees )

    } else if (type === 'period') {
      this.filteredPeriods = this.filterList(value, this.periodList, ['name']);
      // Show the dropdown even if the value is empty
      this.isPeriodDropdownVisible = value === '' || this.updateDropdownVisibility(this.filteredPeriods, value);
    }
  }

  onInputBlur(event: Event, type: 'company' | 'period' | 'employee') {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Only update input state if the last focused input matches the current type
    if (this.lastFocusedInput === type) {
      this.updateInputState(type, value);
    }

    // Hide the dropdown
    setTimeout(() => {
      if (type === 'company') {
        this.isCompanyDropdownVisible = false;
      } else if (type === 'employee') {
        this.isEmployeeDropdownVisible = false;
      } else {
        this.isPeriodDropdownVisible = false;
      }
    }, 200);
  }

  
  async ProcessData(data: { employee: string, company: string, payrollperiod: string }) {
    try {
        console.group('Processing data');
        let totalSteps = 0; // Set the total number of steps
        let progress = 0;
        const startTime = new Date();
        this.adjustmentList = [];
        this.applicationList = [];
        // Show loading popup with percentage
        Swal.fire({
            title: 'Processing Data...',
            html: `Progress: <b>0%</b>`,
            allowOutsideClick: false,
            showConfirmButton: false, // Initially hide the OK button
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // // Function to update the progress
        // const updateProgress = () => {
        //     return new Promise<void>((resolve) => {
        //         progress += 1;
        //         const percentage = Math.round((progress / totalSteps) * 100);
        //         const currentTime = new Date();
        //         const elapsedTime = currentTime.getTime() - startTime.getTime();
        //         const elapsedTimeInSeconds = Math.round(elapsedTime / 1000);


        //         const averageTimePerStep = elapsedTime / progress; // Average time per step in milliseconds
        //         const remainingTimeInMs = (totalSteps - progress) * averageTimePerStep;
        //         const expectedCompletionTime = new Date(currentTime.getTime() + remainingTimeInMs);

        //         const formattedExpectedCompletionTime = expectedCompletionTime.toLocaleTimeString();


        //         const endTime = new Date();
        //         const duration = endTime.getTime() - startTime.getTime(); // Duration in milliseconds
        //         const durationInSeconds = Math.round(duration / 1000); // Convert to seconds

        //         const hours = Math.floor(durationInSeconds / 3600);
        //         const minutes = Math.floor((durationInSeconds % 3600) / 60);
        //         const remainingSeconds = durationInSeconds % 60;

        //         const hoursdur = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        //         const remminutes = remainingTimeInMs;
        //         const remInSeconds = remminutes * 60;
        //         const remhours = Math.floor(remInSeconds / 3600);
        //         const remSeconds = remInSeconds % 60;

        //         const remhoursdur = `${String(remhours).padStart(2, '0')}:${String(remminutes).padStart(2, '0')}:${String(remSeconds).padStart(2, '0')}`;

        //         Swal.update({
        //             html: `Progress: <b>${percentage}%</b>
        //                    <br/>Duration: ${hoursdur}
        //                    <br/>Remaining Time: ${remhoursdur}
        //                    <br/>Expected Completion: ${formattedExpectedCompletionTime}`
        //         });

        //         resolve();
        //     });
        // };

        // Function to update the progress
        
        const updateProgress = () => {
          return new Promise<void>((resolve) => {
              progress += 1;
              const percentage = Math.round((progress / totalSteps) * 100); // Calculate percentage progress
              const currentTime = new Date();
              
              // Calculate elapsed time in milliseconds
              const elapsedTime = currentTime.getTime() - startTime.getTime();

              // Calculate average time per step
              const averageTimePerStep = elapsedTime / progress;

              // Calculate remaining time in milliseconds
              const remainingTimeInMs = (totalSteps - progress) * averageTimePerStep;

              // Calculate the expected completion time
              const expectedCompletionTime = new Date(currentTime.getTime() + remainingTimeInMs);
              const formattedExpectedCompletionTime = expectedCompletionTime.toLocaleTimeString();

              // Format elapsed time (duration)
              const durationInSeconds = Math.round(elapsedTime / 1000); // Convert to seconds
              const durationHours = Math.floor(durationInSeconds / 3600);
              const durationMinutes = Math.floor((durationInSeconds % 3600) / 60);
              const durationSeconds = durationInSeconds % 60;
              const formattedDuration = `${String(durationHours).padStart(2, '0')}:${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;

              // Format remaining time
              const remainingTimeInSeconds = Math.round(remainingTimeInMs / 1000); // Convert milliseconds to seconds
              const remainingHours = Math.floor(remainingTimeInSeconds / 3600);
              const remainingMinutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
              const remainingSeconds = remainingTimeInSeconds % 60;
              const formattedRemainingTime = `${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

              // Update the SweetAlert modal
              Swal.update({
                  html: `Progress: <b>${percentage}%</b>
                        <br/>Duration: ${formattedDuration}
                        <br/>Remaining Time: ${formattedRemainingTime}
                        <br/>Expected Completion: ${formattedExpectedCompletionTime}`
              });

              resolve();
          });
        };

        // Fetching applications data (Step 1)
        const applications = await this.adjprocessing.GetAdjsutmentData(data.payrollperiod);
        const app_data = applications.map(v => new Application(
            v.applicationID, 
            v.applicationType, 
            '', 
            v.employeeID, 
            v.employeeFullName, 
            v.approvedOn, 
            v.targetDate, 
            v.targetPayrollPeriod, 
            v.currentPayrollPeriod, 
            v.lastApprovalCutoff
        ));

        // Sort app_data by employeeFullName, then by targetDate
        app_data.sort((a, b) => {
            const nameComparison = a.employee_name.localeCompare(b.employee_name);
            return nameComparison !== 0 
                ? nameComparison 
                : new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        });

        // Filter the application list based on employee
        this.applicationList = data.employee === "" 
            ? app_data 
            : this.filterList(data.employee, app_data, ['employee_name']);

        // Process adjustments for each employee in employeeList
        if (data.employee === "") {

            totalSteps += this.employeeList.length; // Calculate total steps
            for (const emp of this.employeeList) {
              
                console.log('Employee List For', emp);
                const res_adjustment: any[] = await this.apiservice.getPNIntegData(`getAdjustments/${data.payrollperiod}/${emp.name}`);
                console.log("res_adjustment", res_adjustment);

                console.log('Total Steps:', totalSteps);

                // Process adjustments and update progress
                const adjustmentPromises = res_adjustment.map(async (v: any) => {
                    console.log('Res Adjustment:', v);
                    if (v.employeeID !== null) 
                    {
                      const setAdjust = new Adjustment(
                        v.employeeID, 
                        v.fullName, 
                        v.workShift, 
                        v.targetDate, 
                        v.cardIn, 
                        v.cardOut, 
                        v.actualWorkHours, 
                        v.workerHours, 
                        v.late, 
                        v.undertime, 
                        v.nightDiff, 
                        v.overtime, 
                        v.overtimeEx, 
                        v.overtimeNd, 
                        v.nightDiffT2, 
                        v.nightDiffT1, 
                        v.links,
                        v.errorRemarks
                      );
                      this.adjustmentList.push(setAdjust);
                    }
                });
                await updateProgress(); // Await progress update

                // Wait for all promises to resolve
                await Promise.all(adjustmentPromises);
            }
        } else {
            // Process adjustments for a specific employee
            const emp = this.employeeDetails;
            const res_adjustment: any[] = await this.apiservice.getPNIntegData(`getAdjustments/${data.payrollperiod}/${emp.name}`);
            console.log("res_adjustment", res_adjustment);

            totalSteps += res_adjustment.length; // Calculate total steps
            console.log('Total Steps:', totalSteps);

            // Process adjustments and update progress
            const adjustmentPromises = res_adjustment.map(async (v: any) => {
                console.log('Res Adjustment:', v);
                if (v.employeeID !== null) {
                  const setAdjust = new Adjustment(
                      v.employeeID, 
                      v.fullName, 
                      v.workShift, 
                      v.targetDate, 
                      v.cardIn, 
                      v.cardOut, 
                      v.actualWorkHours, 
                      v.workerHours, 
                      v.late, 
                      v.undertime, 
                      v.nightDiff, 
                      v.overtime, 
                      v.overtimeEx, 
                      v.overtimeNd, 
                      v.nightDiffT2, 
                      v.nightDiffT1, 
                      v.links,
                      v.errorRemarks
                  );
                  this.adjustmentList.push(setAdjust);
                }
            });

            // Wait for all promises to resolve
            await Promise.all(adjustmentPromises);
        }
        
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime(); // Duration in milliseconds
        const durationInSeconds = Math.round(duration / 1000); // Convert to seconds

        // Close loading popup
        Swal.close();
        // Format the start and end times for display
        const formattedStartTime = startTime.toLocaleString();
        const formattedEndTime = endTime.toLocaleString();

        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const remainingSeconds = durationInSeconds % 60;
    
        // Pad the values with leading zeros if necessary
        const hoursdur = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        // Show success message with duration, start time, and end time
        Swal.fire({
          icon: 'success',
          title: 'Data Processed',
          html: `All data has been successfully posted! 
                 <br/>Duration: ${hoursdur} seconds. 
                 <br/>Start Time: ${formattedStartTime}.
                 <br/>End Time: ${formattedEndTime}.`,
        });

        console.groupEnd();
    } catch (error) {
        console.error('Error processing data:', error);

        // Close loading popup
        Swal.close();

        // Show error message
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error processing the data. Please try again.',
        });
    }
}



  async UploadData(){
    for (var v of this.adjustmentList) {
      console.log(v)

      let res_employee = await this.apiservice.postData(v, `postAdjustment`);
      console.log(res_employee)
    } 
  }

  async ProcessData1(data: { employee: string, company: string, payrollperiod: string }) {
    console.log('Employee:', data.employee);
    console.log('Company:', data.company);
    console.log('Payroll Period:', data.payrollperiod);


    let payroll_periods = await this.adjprocessing.GetPayrollPeriodList(data.company);
    console.log('payroll_periods :', payroll_periods)

    let period = await this.adjprocessing.GetPayrollPeriod(data.payrollperiod)
    console.log('curr_period', period)
    let period_group = period?.period_group || '';

    // Filter the list of payroll periods where approval_cutoff < period.approval_cutoff
    let prev_period: PayrollPeriod | null = null;
    if (period) {
      let filteredPeriods = payroll_periods.filter(pp => pp.payroll_date < period.payroll_date);
      if (period.period_group != '') {
        filteredPeriods = [];
        filteredPeriods = payroll_periods.filter(pp => pp.payroll_date < period.payroll_date && pp.period_group === period.period_group);
      }
      // Sort the filtered list by payroll_date in ascending order
      filteredPeriods.sort((a, b) => new Date(b.payroll_date).getTime() - new Date(a.payroll_date).getTime());
      console.log('Filtered Payroll Periods:', filteredPeriods);

      prev_period = filteredPeriods[0] || null;
      console.log('prev_period', prev_period)
    }

    let curr_attendance_from = period?.attendance_from;
    let curr_payroll_period = period?.approval_cutoff;
    let prev_payroll_period = prev_period?.approval_cutoff;

    console.log('curr_attendance_from', curr_attendance_from);
    console.log('curr_payroll_period', curr_payroll_period);
    console.log('prev_payroll_period', prev_payroll_period);

    this.applicationList = [];

    let apptypelist = [{'name': 'Overtime Application'},
                       {'name': 'DTR Problem Application'},
                       {'name' : 'Leave Application'}]

    // let apptypelist = [
    //   {'name' : 'Leave Application'}]


    for (let v of apptypelist) {
      console.log('apps', v.name)

      // let applicationList: Application[] = [];
      let application: Application[] = [];
      let filteredApplication: Application[] = [];
      
      if (v.name === 'Leave Application') {
        application = await this.adjprocessing.GetLeaveApplication(data.company, curr_attendance_from, prev_payroll_period, curr_payroll_period, period_group);
      } else {
        application = await this.adjprocessing.GetApplication(v.name, data.company, period_group);
      }
      
      filteredApplication = application.filter(
        pp => pp.target_date < curr_attendance_from && 
              pp.approved_on >= prev_payroll_period && 
              pp.approved_on <= curr_payroll_period
      );

      console.log("filteredApplication", filteredApplication);

      for (let v of filteredApplication) {
        
        let pp: any;
        let prev_period: string = '';
        pp = await this.apiservice.getPNData(`Payroll Period?filters=[["attendance_from","<=","${v.target_date}"],["attendance_to",">=","${v.target_date}"],["is_special","!=","1"]]&limit_page_length=0`);
        for (var p of pp.data) {
            prev_period = p.name
            console.log('prev_period', prev_period)
        }

        let setApplication = new Application(v.name, v.application, v.company, v.employee, v.employee_name, v.approved_on, v.target_date, prev_period, data.payrollperiod, '');
        
        console.log(v.name, setApplication)
        this.applicationList.push(setApplication);
      }

    }




    // application = await this.adjprocessing.GetApplication('DTR Problem Application', data.company);
    // console.log("DTR Problem Application", application);

    // filteredApplication = [];
    // filteredApplication = application.filter(pp => pp.target_date < curr_attendance_from 
    //                                               && pp.approved_on >= prev_payroll_period 
    //                                               && pp.approved_on <= curr_payroll_period);

    // console.log("filteredApplication", filteredApplication);

    // for (let v of filteredApplication) {

    //   let setApplication = new Application(v.name, v.application , v.company, v.employee, v.employee_name, v.approved_on, v.target_date);
    //   this.applicationList.push(setApplication);
    // }

    
    console.log("applicationList", this.applicationList);
    // Your processing logic here
  }


}
