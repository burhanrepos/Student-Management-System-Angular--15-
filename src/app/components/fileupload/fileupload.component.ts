import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  public selectedFiles !: FileList;
  public currentFileUpload !: FileMetaData;
  public percentage : number = 0;

  public listOfFiles : FileMetaData[] = [];


  constructor(private fileService:FileService, private fireStorage : AngularFireStorage){}

  ngOnInit(): void {
    this.getAllFiles()
  }

  public selectFile(event : any){
    this.selectedFiles = event.target.files;
  }

  public uploadFile(){
    this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
    const path = 'Uploads/'+this.currentFileUpload.file.name;
    const storageRef = this.fireStorage.ref(path);

    const uploadTask = storageRef.put(this.selectedFiles[0]);

    uploadTask.snapshotChanges().pipe(finalize(()=>{
      storageRef.getDownloadURL().subscribe(downloadLink => {
        this.currentFileUpload.url = downloadLink;
        this.currentFileUpload.size = this.currentFileUpload.file.size;
        this.currentFileUpload.name = this.currentFileUpload.file.name;
        this.fileService.saveMetaDataOfFile(this.currentFileUpload)
        this.ngOnInit()
      })
    })).subscribe( (res : any)=>{
      this.percentage = ( res.bytesTransferred * 100 / res.totalBytes)
    }, err => {
      console.error(err)
    })

  }

  public getAllFiles(){

    this.fileService.getAllFiles().subscribe(res => {
      this.listOfFiles = res.map((e : any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
    console.log(this.listOfFiles)

    },
    err =>{
      console.log("Error while fetching all the files")
    })
  }

  public deleteFile(file : FileMetaData){
    if(window.confirm('Are you sure you want to delete '+file.name + "?")){
      this.fileService.deleteFile(file);
      this.ngOnInit();
    }
  }

}
