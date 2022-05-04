import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Auditoria } from 'src/app/classes/auditoria';
import { ExtraccionInformacionService } from 'src/app/services/extraccion-informacion.service';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ChartComponent, ApexAxisChartSeries, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexGrid, ApexLegend, ApexStroke, ApexTitleSubtitle, ApexMarkers, ApexAnnotations, ApexFill, ApexTooltip } from 'ng-apexcharts';
import { CalculoincrementoService } from 'src/app/services/calculoincremento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculoIncremento } from 'src/app/classes/calculo-incremento';
import { LoadingService } from 'src/app/services/loading.service';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  labels: any;
  chart: ApexChart;
  responsive: ApexResponsive[];
};

export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptions4 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};

export type ChartOptions5 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  markers: ApexMarkers;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {

  listAuditoria: Auditoria[] = [];
  listAuditoriaAnterior: Auditoria[] = [];

  clientes: any;
  contratos: any;
  ofertas: any;
  tarifas: any;
  estados: any;
  cuentas: any;
  contratosDane: any[];
  variaciones: any[];
  estratos: number[];
  dane: any[];

  estado: string;
  estrato: number;
  tipo: string;

  identificacion: string;

  listCalculo: CalculoIncremento[] = [];
  listCalculoCopia: CalculoIncremento[] = [];

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart2") chart2: ChartComponent;
  @ViewChild("chart3") chart3: ChartComponent;
  @ViewChild("chart4") chart4: ChartComponent;
  @ViewChild("chart5") chart5: ChartComponent;

  @ViewChild('content', { static: false }) content;
  @ViewChild('content1', { static: false }) content1;
  @ViewChild('content2', { static: false }) content2;
  
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;
  public chartOptions4: Partial<ChartOptions>;
  public chartOptions5: Partial<ChartOptions5>;

  constructor(private extractInfoService: ExtraccionInformacionService,
    private calculoIncrementoService: CalculoincrementoService,
    private modal: NgbModal,
    private loadingService: LoadingService) {}

  async ngAfterViewInit(){

    this.calculoEstados();
    this.estratos = (await this.calculoIncrementoService.estratosCFM());
    this.cuentas = (await this.calculoIncrementoService.cuentasIncNoInc());
    this.contratosDane = (await this.calculoIncrementoService.contratosDANE());
    this.variaciones = (await this.calculoIncrementoService.variacionPreincremento());

    this.variaciones = this.variaciones.map(m => {
      m = m.split(',');
      m = {x: new Date(m[0]), y: Number(m[1])}
      return m;
    });
    
    this.variaciones = this.variaciones.sort((a, b) => a.x - b.x)

    this.variaciones = this.variaciones.map(v=> {    
      let fecha = v.x;
      v.x.setDate(fecha.getDate() + 1);
      v = {x: v.x.toLocaleDateString("es-ES"), y: v.y}
      return v;
    });

    this.chartOptions2 = {
      series: [
        {
          name: "CFM",
          data: this.estratos
        }
      ],
      chart: {
        type: "bar",
        events: {
          click: (chart, w, e) => {
            this.estrato = e.dataPointIndex+1;
            this.onEstrato(this.estrato);
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [
          ["Estrato", "1"],
          ["Estrato", "2"],
          ["Estrato", "3"],
          ["Estrato", "4"],
          ["Estrato", "5"],
          ["Estrato", "6"]
        ],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      }
    };

    this.chartOptions3 = {
      series: [0,0],
      chart: {
        type: "donut",
        width: 330,
        events: { 
          dataPointSelection: (event, chartContext, config) => {
            this.tipo = config.dataPointIndex == 0 ? 'INC' : 'NO_INC'
            this.onTipoCuenta(this.tipo)
          }
        }
      },
      labels: ["Incrementadas", "No Incrementadas"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.cuentas.forEach(m => {
      switch (m.estado) {
        case 'INC':
          this.chartOptions3.series[0] = m.cantidad
          break;
        case 'NO_INC':
          this.chartOptions3.series[1] = m.cantidad
          break;
      }
    });

    this.contratosDane = this.contratosDane.map(c => {
      c = c.split(',');
      return c;
    });

    this.chartOptions4 = {
      series: [Number(this.contratosDane[0][0]), Number(this.contratosDane[1][0]), Number(this.contratosDane[2][0]), Number(this.contratosDane[3][0]), Number(this.contratosDane[4][0])],
      labels: [this.contratosDane[0][1], this.contratosDane[1][1], this.contratosDane[2][1], this.contratosDane[3][1], this.contratosDane[4][1]],
      chart: {
        width: 330,
        type: "pie"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.chartOptions5 = {
      series: [
        {
          name: "Registros",
          data: this.variaciones
        }
      ],
      chart: {
        type: "line",
        height: 350
      },
      stroke: {
        curve: "stepline"
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: "",
        align: "left"
      },
      markers: {
        hover: {
          sizeOffset: 4
        }
      }
    };

    this.loadingService.hideLoading();
  }

  async ngOnInit(): Promise<void> {
    this.loadingService.startLoading();
    this.listAuditoria = (await this.extractInfoService.traerInformacion());
    this.listAuditoriaAnterior = (await this.extractInfoService.traerInformacionAnterior());
    this.calculoIncDec(this.listAuditoria, this.listAuditoriaAnterior);
  }

  calculoIncDec(actual: Auditoria[], anterior: Auditoria[]) {
    this.clientes = Number(anterior[0].cantidadRegistros) == 0 ? 0 : ((Number(actual[0].cantidadRegistros) / Number(anterior[0].cantidadRegistros)) / 100) * 100;
    this.clientes == 0 ? this.clientes = 0 : this.clientes = (this.clientes / 100).toFixed(5);
    this.contratos = Number(anterior[1].cantidadRegistros) == 0 ? 0 : ((Number(actual[1].cantidadRegistros) / Number(anterior[1].cantidadRegistros)) / 100) * 100;
    this.contratos == 0 ? this.contratos = 0 : this.contratos = (this.contratos / 100).toFixed(5);
    this.ofertas = Number(anterior[2].cantidadRegistros) == 0 ? 0 : ((Number(actual[2].cantidadRegistros) / Number(anterior[2].cantidadRegistros)) / 100) * 100;
    this.ofertas == 0 ? this.ofertas = 0 : this.ofertas = (this.ofertas / 100).toFixed(5);
    this.tarifas = Number(anterior[3].cantidadRegistros) == 0 ? 0 : ((Number(actual[3].cantidadRegistros) / Number(anterior[3].cantidadRegistros)) / 100) * 100;
    this.tarifas == 0 ? this.tarifas = 0 : this.tarifas = (this.tarifas / 100).toFixed(5);
  }

  async calculoEstados() {
    
    this.estados = (await this.calculoIncrementoService.calculoEstados());
    this.chartOptions = {
      series: [0, 0, 0, 0],
      labels: ["EXITO", "RECHAZO", "INICIAL", "CORREGIDO"],
      chart: {
        width: 300,
        type: "pie",
        events: {
          dataPointSelection: (event, chartContext, config) => {
            this.onEstado(config.dataPointIndex)
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.estados.forEach(m => {
      switch (m.estado) {
        case 'INICIAL':
          this.chartOptions.series[2] = m.cantidad
          break;
        case 'EXITO':
          this.chartOptions.series[0] = m.cantidad
          break;
        case 'RECHAZO':
          this.chartOptions.series[1] = m.cantidad
          break;
        case 'CORREGIDO':
          this.chartOptions.series[3] = m.cantidad
          break;
      }
    });
  }

  abrirModal(content: any) {
    this.modal.open(content, { size: 'lg', scrollable: true, centered: true });
  }

  async onEstado(index: number) {
    this.loadingService.startLoading();
    this.listCalculo = this.listCalculoCopia = [];
    switch (index) {
      case 2:
        this.estado = 'INICIAL';
        this.listCalculo = this.listCalculoCopia = (await this.calculoIncrementoService.calculoEstadoInicial());
        break;
      default:
        this.estado = (index == 0) ? 'EXITO' : (index == 1) ? 'RECHAZO' : 'CORREGIDO';
        this.listCalculo = this.listCalculoCopia = (await this.calculoIncrementoService.calculoPorEstados(this.estado));
        break;
    }
    this.loadingService.hideLoading();
    this.abrirModal(this.content)
  }

  async onEstrato(estrato: number){
    this.loadingService.startLoading();
    this.listCalculo = this.listCalculoCopia = [];
    this.listCalculo = this.listCalculoCopia = (await this.calculoIncrementoService.cfmPorEstrato(estrato))
    this.loadingService.hideLoading();
    this.abrirModal(this.content1)
  }

  async onTipoCuenta(tipo: string){
    this.loadingService.startLoading();
    this.listCalculo = this.listCalculoCopia = [];
    this.listCalculo = this.listCalculoCopia = (await this.calculoIncrementoService.cuentasByTipo(tipo))
    this.loadingService.hideLoading();
    this.abrirModal(this.content2)
  }

  search(event: any){
    if(event.length > 0){
      this.listCalculo =  this.listCalculoCopia.filter(m=> m.iden_CLIE.toUpperCase().indexOf(event.toUpperCase()) !== -1 && m.iden_CLIE.toUpperCase().indexOf(this.identificacion.toUpperCase()) !== -1);
      this.identificacion = null;
    }
  }

}