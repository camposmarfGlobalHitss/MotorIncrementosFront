export interface UsuarioResponse {
    id?:            number;
    username?:      string;
    descUsuario?:   string;
    contrasena?:    string;
    feciniusuario?: Date;
    fecfinusuario?: null;
    observaciones?: string;
    estado?:        number;
    codperfil?:     number;
    correo?:        string;
    nombrecompleto?:string;
    codigoverificacion?:string;
}
