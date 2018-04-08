/* Tabla de Cliente */

create table Cliente
( 
nombre text,
apellidos text,
cedula text,
direccion text,
telefono_trabajo text,
telefono_casa text,
celular text,
correo_personal text,
correo_empresarial text,
constraint pkCliente primary key (cedula) 
);

/* Tabla de Empleado */

create table Empleado
( 
nombre text,
apellidos text,
cedula text,
direccion text,
telefono text,
correo text,
usuario text,
contrasena text,
privilegios int,

constraint pkEmpleado primary key (cedula) 
);

/* Tabla de Proyecto */

create table Proyecto
( 
nombreProyecto text,
direccion text,
tipoProyecto text,
tipoObra text,
descripcion text,
fechaInicio text,
fechaFinaliza text,
estado text,
banco text,
cliente text,
ruta text,
constraint pkProyecto primary key (nombreProyecto),
constraint fkCliente foreign key (cliente) references Cliente
);

create table Carpeta(
    nombre_carpeta text,
    ruta_padre text,
    publico boolean,
    primary key (ruta_padre, nombre_carpeta)
)

create table Archivos(
    nombre_archivo text,
    nombre_carpeta text,
    ruta_padre text,
    publico boolean,
    enlazado boolean DEFAULT TRUE,
    primary key (ruta_padre, nombre_carpeta, nombre_archivo),
    constraint fkCarpeta foreign key (ruta_padre, nombre_carpeta) references Carpeta
);

/* Tabla de Proveedor */

create table Proveedor
( 
empresa text,
contacto text,
telefono text,
correo text,
producto text,

constraint pkProveedor primary key (empresa) 
);

/* Tabla de Planilla */

create table Planilla
( 
nombre text,
apellidos text,
dni text,
puesto text,
telefono text,
fechaEntrada text,
fechaSalida text,
tipoSalario text,
montoSalario text,

constraint pkPlanilla primary key (dni) 
);