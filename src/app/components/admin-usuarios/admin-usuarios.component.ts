import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { AdminusuariosService } from '../../services/adminusuarios.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  
  listUsuarios:UsuarioResponse[] = [];
  listUsuariosTotales:UsuarioResponse[] = [];
  listUsuariosPorEstado:UsuarioResponse[] = [];
  forma:FormGroup;
  usuario:UsuarioResponse={};
  usuarioSeleccionado:UsuarioResponse={};
  username:boolean = false;
  botonguardar:boolean = false;
  cantActivos:number=0;
  cantInactivos:number=0;
  cantBloqueados:number=0;
  cantBorrados:number=0;
  constructor(private adminusuarios:AdminusuariosService,
              public modal:NgbModal,
              private fb:FormBuilder) { 
    this.cargarListasIniciales();    
  }
  

  ngOnInit(): void {
  }

  cargarListasIniciales(){
    this.listUsuarios = [];
    this.cantActivos = this.cantInactivos = this.cantBloqueados = this.cantBorrados = 0 ;
    this.adminusuarios.getUsuarios().subscribe(resp =>{
      this.listUsuariosTotales = resp;
      for (const usuario of resp) {
        if(usuario.estado === 1){
          this.listUsuarios.push(usuario);
          this.cantActivos += 1;
        }else if(usuario.estado === 2){
          this.listUsuarios.push(usuario);
            this.cantInactivos += 1;
        }else if(usuario.estado ===3){
          this.listUsuarios.push(usuario);
            this.cantBloqueados += 1;
        }else if(usuario.estado === 4){
            this.cantBorrados += 1;
        }
      }
      
    });

    
    
  }



  cargarFormulario(usuario:UsuarioResponse){
    this.usuarioSeleccionado = usuario;
    this.forma = this.fb.group({
      username:[usuario.username,[Validators.required, Validators.minLength(5)]],
      contrasena:[usuario.contrasena,[Validators.required, Validators.minLength(6)]],
      descUsuario:[usuario.descUsuario, [Validators.required, Validators.minLength(2)]],
      observaciones:[usuario.observaciones],
      estado:[usuario.estado, Validators.required],
      codperfil:[usuario.codperfil, Validators.required],
      correo:[usuario.correo,[Validators.email,Validators.required]],
      nombrecompleto:[usuario.nombrecompleto, [Validators.required, Validators.minLength(8)]],
    });
  }

  openLG(contenido, usuario:UsuarioResponse){
    this.botonguardar = false;
    this.username = true;
    this.modal.open(contenido, {size:'lg', scrollable:true, centered:true});
    this.cargarFormulario(usuario);
  }

  abrirModalDecargas(content, estado:number) {
    this.listUsuariosPorEstado = [];
    this.modal.open(content, { size: 'lg', scrollable:true, centered:true });
    for (const usuario of this.listUsuariosTotales) {
      if(usuario.estado===estado){
        this.listUsuariosPorEstado.push(usuario);
      }
    }
  }

  openLGVacio(contenido){
    this.usuario = {}
    this.botonguardar = true;
    this.username = false;
    this.modal.open(contenido, {size:'lg', scrollable:true, centered:true});
    this.cargarFormulario(this.usuario)
  }

  

  get usuarionovalido(){
    return this.forma.get('username').invalid && this.forma.get('username').touched;
  }

  get contrasenanovalida(){
    return this.forma.get('contrasena').invalid && this.forma.get('contrasena').touched;
  }

  get descusuarionovalido(){
    return this.forma.get('descUsuario').invalid && this.forma.get('descUsuario').touched;
  }

  get correonovalido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }

  get nombrecompletonovalido(){
    return this.forma.get('nombrecompleto').invalid && this.forma.get('nombrecompleto').touched;
  }

  guardar(){    
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });
    Swal.showLoading();
    
    this.usuario = this.forma.value;
    this.usuario.id = this.usuarioSeleccionado.id;
    this.usuario.feciniusuario = this.usuarioSeleccionado.feciniusuario;
    this.usuario.fecfinusuario = this.usuarioSeleccionado.fecfinusuario;
    this.usuario.codigoverificacion = this.usuarioSeleccionado.codigoverificacion;
    
    if(this.forma.invalid){
      return;
    }else{
      this.adminusuarios.updateUsuario(this.usuario).subscribe(resp=>{
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Editado Correctamente!!',
          allowOutsideClick: false
        });
        this.cargarListasIniciales();
      },err=>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Error Interno, Intente mas tarde!',
          allowOutsideClick: false
        });
      });

      this.modal.dismissAll();
    }   
    
  }

  crear(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.usuario = this.forma.value;
    if(this.forma.invalid){
      return;
    }else{
      this.adminusuarios.creeateUsuario(this.usuario).subscribe(resp=>{
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Usuario Creado Correctamente!!',
          allowOutsideClick: false
        });
        this.cargarListasIniciales();

      },err=>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Error Interno, Intente mas tarde!',
          allowOutsideClick: false
        });
      });

      this.modal.dismissAll();
      this.forma.reset();

    }

    
  }

  borrarUsuario(usuario: UsuarioResponse){
    this.usuario = usuario; 
    const usuarioBorra = localStorage.getItem('usuario').toString();
    
    Swal.fire({
      title: `¿Realmente desea eliminar al usuario "${usuario.username}" ? `,
      confirmButtonColor:'#DC3545',
      showCancelButton: true,
      confirmButtonText: `Confirmar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.usuario.estado = 4;
        this.usuario.observaciones = `usuario borrado por: ${usuarioBorra}`;
        Swal.fire({
          icon: 'info',
          title: 'Espere...',
          text: 'Validando Informacion!',
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.adminusuarios.updateUsuario(this.usuario).subscribe(resp=>{
          Swal.fire('Usuario Borrado!', '', 'success');
          this.cargarListasIniciales();
        },err=>{
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Error Interno, Intente mas tarde!',
            allowOutsideClick: false
          });
        });


      }
    })
  }



  exportarReporteGeneralExcel(listaExport:UsuarioResponse[]){
    for (const objecto of listaExport) {
      objecto.contrasena = '**********'
      objecto.codigoverificacion = ''
    }
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(listaExport);
    ws['!cols'] = [
      {wpx: 40 },//id
      {wpx: 90},//username
      {wpx: 90},//desusuario
      {wpx: 90},//contraseña
      {wpx: 190},//feciniusuario
      {wpx: 190},//fecfinusuario
      {wpx: 150},//observaciones
      {wpx: 50},//estado
      {wpx: 50},//codperfil
      {wpx: 240},//correo
      {wpx: 220},//nombrecompleto
      {wpx: 90},//codigoverificacion
    ];    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
 
    /* save to file */  
    XLSX.writeFile(wb, `Rep_General_Usuarios_${new Date()}.xlsx`);
  }

  ExportarReportePorEstado(listaExport:UsuarioResponse[]){
    
    let nombreEstado = '';
    for (const objecto of listaExport) {
      objecto.contrasena = '**********'
      objecto.codigoverificacion = ''
      nombreEstado = objecto.estado === 1 ? 'ACTIVO' : objecto.estado === 2 ? 'INACTIVO' : objecto.estado === 3 ? 'BLOQUEADO' : 'BORRADO';
    }
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(listaExport);
    ws['!cols'] = [
      {wpx: 40 },//id
      {wpx: 90},//username
      {wpx: 90},//desusuario
      {wpx: 90},//contraseña
      {wpx: 190},//feciniusuario
      {wpx: 190},//fecfinusuario
      {wpx: 150},//observaciones
      {wpx: 50},//estado
      {wpx: 50},//codperfil
      {wpx: 240},//correo
      {wpx: 220},//nombrecompleto
      {wpx: 90},//codigoverificacion
    ];    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
 
    /* save to file */  
    XLSX.writeFile(wb, `Reporte_Usuarios_${nombreEstado}.xlsx`);
  
  }

}
