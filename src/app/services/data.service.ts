import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Student } from '../model/student';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private angularFirestore: AngularFirestore) { }

  //add student
  public addStudent(student : Student){
    student.id = this.angularFirestore.createId();
    return this.angularFirestore.collection('/Students').add(student);
  }

  //get all students
  public getAllStudents(){
    return this.angularFirestore.collection('/Students').snapshotChanges();
  }

  //delete student
  public deleteStudent(student : Student){
    return this.angularFirestore.doc('/Students/'+student.id).delete();
  }

  //update student
  public updateStudent(student : Student){
    this.deleteStudent(student);
    this.addStudent(student);
  }
}

