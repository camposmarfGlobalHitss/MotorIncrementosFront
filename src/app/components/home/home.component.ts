import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Auditoria } from 'src/app/classes/auditoria';
import { ExtraccionInformacionService } from 'src/app/services/extraccion-informacion.service';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ChartComponent, ApexAxisChartSeries, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexGrid, ApexLegend } from 'ng-apexcharts';
import { CalculoincrementoService } from 'src/app/services/calculoincremento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculoIncremento } from 'src/app/classes/calculo-incremento';

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

  estratos: number[];

  estado: string;
  estrato: number;
  tipo: string;

  listCalculo: CalculoIncremento[] = [];


  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart2") chart2: ChartComponent;
  @ViewChild("chart3") chart3: ChartComponent;
  
  @ViewChild('content', { static: false }) content;
  @ViewChild('content1', { static: false }) content1;
  @ViewChild('content2', { static: false }) content2;
  
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;

  constructor(private extractInfoService: ExtraccionInformacionService,
    private calculoIncrementoService: CalculoincrementoService,
    private modal: NgbModal) {   
    this.calculoEstados();
  }

  async ngAfterViewInit(){
    this.estratos = (await this.calculoIncrementoService.estratosCFM());
    this.cuentas = (await this.calculoIncrementoService.cuentasIncNoInc());
    this.contratos = (await this.calculoIncrementoService.contratosDANE());
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
        width: 500,
        events: { 
          dataPointSelection: (event, chartContext, config) => {
            this.tipo = config.dataPointIndex == 0 ? 'INC' : 'NO_INC'
            this.onTipoCuenta(this.tipo)
          }
        }
      },
      labels: ["Cuentas Incrementadas", "Cuentas No Incrementadas"],
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
    console.log(this.contratos)
  }

  async ngOnInit(): Promise<void> {
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
      labels: ["Exito", "Rechazo", "Inicial", "Corregido"],
      chart: {
        width: 400,
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
              width: 200
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
    this.listCalculo = [];
    switch (index) {
      case 2:
        this.estado = 'INICIAL';
        this.listCalculo = (await this.calculoIncrementoService.calculoEstadoInicial());
        break;
      default:
        this.estado = (index == 0) ? 'EXITO' : (index == 1) ? 'RECHAZO' : 'CORREGIDO';
        this.listCalculo = (await this.calculoIncrementoService.calculoPorEstados(this.estado));
        break;
    }
    this.abrirModal(this.content)
  }

  async onEstrato(estrato: number){
    this.listCalculo = [];
    this.listCalculo = (await this.calculoIncrementoService.cfmPorEstrato(estrato))
    this.abrirModal(this.content1)
  }

  async onTipoCuenta(tipo: string){
    this.listCalculo = [];
    this.listCalculo = (await this.calculoIncrementoService.cuentasByTipo(tipo))
    this.abrirModal(this.content2)
  }

}
