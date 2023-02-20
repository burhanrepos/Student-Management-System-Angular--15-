import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  public studentList : Array<Student> =[];
  public studentObject : Student ={
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: ''
  }

  constructor(private authService: AuthService, private dataService: DataService){}
  ngOnInit(): void {
    this.getAllStudents();
  }

  public getAllStudents(){
    try {
      this.dataService.getAllStudents().subscribe((res) => {
        this.studentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      })
    } catch (error) {
      alert('Error while fetching students data');
    }
  }

  public addStudent(){
    if(this.studentObject.first_name == ''|| this.studentObject.last_name == '' || this.studentObject.email == '' || this.studentObject.mobile == '' ){
      alert("Fill all input fields");
      return;
    }
    this.dataService.addStudent(this.studentObject);
    for(let [key,value] of Object.entries(this.studentObject)){
      value='';
    }
  }

  public deleteStudent(student : Student){
    if(window.confirm('Are you sure you want to delete '+student.first_name+' '+student.last_name+' ?')){
      this.dataService.deleteStudent(student);
    }

  }

  public updateStudent(student : Student){

  }

}
