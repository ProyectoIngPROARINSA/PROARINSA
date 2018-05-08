import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class DataService {

    private ruta_proyecto = new BehaviorSubject<string>("");
    current_ruta_proyecto = this.ruta_proyecto.asObservable();

    constructor(){}

    Set_Ruta_Proyecto(ruta_proyecto: string){
        console.log("rutaaa: ", ruta_proyecto)
        this.ruta_proyecto.next(ruta_proyecto);
    }

}