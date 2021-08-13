import { Component ,OnInit,Input} from '@angular/core';
import { Console } from 'console';
import { VirtualTimeScheduler } from 'rxjs';
import { divisas } from 'src/entidades/divisasGet';
import { DivisasService } from './services/divisas.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  
  public title = 'CambioDivsas' ;
  public dolar:string = "";
  public euro:string = "";
  public entidadDivisa:divisas;
  public cambioActual:number;
  time: number = 0;
  public interval:any;
  public play:boolean;
  public seleccionado:any;
  public listDivisas:any = [];

  constructor(public service:DivisasService){
      console.log("ad");
  }
 
  ngOnInit(): void {
    this.service.GetDivisas().subscribe(
      (e) => {
        this.entidadDivisa  = <divisas>e;
          if(this.entidadDivisa != null){
            for (var item in this.entidadDivisa.rates) {
              let json =  { id: item , value :  this.entidadDivisa.rates[item]};
                this.listDivisas.push(json);
              }
              console.log(this.listDivisas.find(x=>x.id == "USD"));
              
              this.seleccionado = this.listDivisas.find(x=>x.id == "USD").id;
             console.log(this.listDivisas);
            }
          });
  
  }
  numericOnly(event): boolean { // restrict e,+,-,E characters in  input type number
    debugger
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;

  }
  
  limpiar(){
    this.pauseTimer();
    this.euro = "";
    this.dolar = "";
  }
  startTimer() {
    this.play = true;
  
    this.interval = setInterval(() => {
      this.time++;
      if(this.time >= 20){
          //console.log("VENCIO");
          alert("Se volvera  a calcular la divisas");
          this.ChangeDivisas();
      }
    },1000)
  }
  
  pauseTimer() {
    this.play = false;
    this.time = 0;
    clearInterval(this.interval);
  }
  

  calcular(){
    console.log(this.euro);
    if(this.euro !== "" && this.euro !== undefined && this.euro !== null){
      this.pauseTimer();
      let cambioActual = this.entidadDivisa.rates[this.seleccionado];
      this.dolar = (Number(this.euro) * cambioActual).toString();
      this.startTimer();
    }else{
        alert("Ingrese un valor")
        this.dolar = "";
    }
 
  }

  ChangeDivisas(){
    this.pauseTimer();
      this.service.GetDivisas().subscribe(
        (e) => {
          this.entidadDivisa  = <divisas>e;
          this.startTimer();
        }
      )
    }
  
}

