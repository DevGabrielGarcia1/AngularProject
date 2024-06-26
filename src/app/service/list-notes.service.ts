import { Injectable, ViewChild, viewChild } from '@angular/core';
import { Note } from '../Note';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exit } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ListNotesService {

  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  get(id: number): Observable<Note>{
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  add(note: Note, execAfter: Function = ()=>{}){
    let notes!: Note[];
    let obs: Observable<Note[]>;
    obs = this.http.get<Note[]>(this.apiUrl);

    obs.subscribe((_notes) => {notes = _notes; this.asyncAdd(note, notes, execAfter)});
    
  }

  private asyncAdd(note: Note, notes: Note[], execAfter: Function = ()=>{}){
    notes = notes.sort((a,b) => (a.id < b.id ? -1 : 1))
    let index = 1;
    if(notes.length > 0){
      index = Number(notes[notes.length-1].id) + 1;
    }
    note.id = index;
    this.dbAdd(note, execAfter);
  }

  private dbAdd(note: Note, execAfter: Function = ()=>{}){
    this.http.post<Note>(this.apiUrl, {id: `${note.id}`, titulo: note.titulo, conteudo: note.conteudo}).subscribe(() => {execAfter();});
  }

  remove(index: number, execAfter: Function = ()=>{}){
    this.http.delete<Note>(`${this.apiUrl}/${index}`).subscribe(() => {execAfter();});
  }

  edit(index: number, note: Note, execAfter: Function = ()=>{}){
    this.remove(index,() => {
      this.dbAdd(note, () => execAfter());
    });
  }
}
