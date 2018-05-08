var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//var connectionString = 'postgres://postgres:database@localhost:5432/PROARINSADB';
var connectionString = 'postgres://postgres:l53s@localhost:5432/PROARINSADB';
//onnectionString = 'postgres://postgres:mio@localhost:8485/PROARINSADB';
// var connectionString = 'postgres://postgres:mio@localhost:5432/PROARINSADB';

var db = pgp(connectionString);

// METER CADA QUERIE DE CADA TABLA EN UNA .JS POR SEPARADO !!!!!!!!!!!!!!!!!!!!!!!!!

/*********************************************************************************
***************************** TRANSACCIONES DE LA BASE ***************************
************************************* DE DATOS ***********************************
**********************************************************************************/

//  ******************************** REPORTES ************************************
function limpiaReporte(req, res, next) {
  console.log('LIMPIANDO REPORTES')
  db.any('Delete from Historial where fecha < NOW() - INTERVAL \'31 days\'')
    .then(function (data) {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllReportes(req, res, next) {
  db.any('select  to_char(fecha, \'yyyy/mm/dd\') as fecha, to_char(fecha, \'hh:mi:ss am\') as hora, nombre, accion, modulo, alterado from historial order by fecha desc, hora desc')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveReporte(req, res, next) {
  db.none('insert into historial values(now(), ${nombre}, ${accion},${modulo},${alterado})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}
//  ******************************** PLANILLA ************************************

function getAllWorkers(req, res, next) {
  db.any('select * from planilla where nombreProyecto = ${proyecto}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveWorker(req, res, next) {

  db.none('insert into Planilla values(${nombre}, ${apellidos}, ${dni}, ${puesto}, ${telefono}, ${fechaEntrada}, ${fechaSalida}, ${tipoSalario}, ${montoSalario}, ${nombreproyecto})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editWorker(req, res, next) {

  db.none('update Planilla set nombre = ${nombre}, apellidos = ${apellidos}, puesto = ${puesto}, telefono = ${telefono}, fechaEntrada = ${fechaEntrada}, fechaSalida = ${fechaSalida}, tipoSalario = ${tipoSalario}, montoSalario=${montoSalario} where dni = ${dni}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function getWorker(req, res, next) {

  db.any('select * from Planilla where dni=${dni}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteWorker(req, res, next) {

  db.none('DELETE FROM Planilla WHERE dni = ${dni}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchWorkers(req, res, next) {

  db.any('select * from Planilla where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

//  ******************************** PROVEEDORES ************************************

function getAllProviders(req, res, next) {
  db.any('select * from Proveedor')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function SaveProvider(req, res, next) {

  db.none('insert into Proveedor values(${empresa}, ${contacto}, ${telefono}, ${correo} , ${producto})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function EditProvider(req, res, next) {

  db.none('UPDATE Proveedor SET empresa = ${empresa}, contacto = ${contacto}, telefono = ${telefono}, correo = ${correo}, producto = ${producto} where empresa = ${pk}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function GetProvider(req, res, next) {

  db.any('select * from Proveedor where empresa=${empresa}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function DeleteProvider(req, res, next) {

  db.none('DELETE FROM Proveedor WHERE empresa = ${empresa}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function SearchProviders(req, res, next) {

  db.any('select * from Proveedor where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}


//  ******************************** CLIENTES ************************************

function getAllCustomers(req, res, next) {
  db.any('select nombre, apellidos, cedula from Cliente')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getdetailcustomer(req, res, next) {
  db.any('select direccion, telefono_trabajo, telefono_casa, celular, correo_personal, correo_empresarial from Cliente where cedula = ${cedula}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function SaveCustomer(req, res, next) {

  db.none('insert into Cliente values(${nombre}, ${apellidos}, ${cedula}, ${direccion},${telefono_trabajo}, ${telefono_casa}, ${celular}, ${correo_personal}, ${correo_empresarial})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function EditCustomer(req, res, next) {

  db.none('UPDATE Cliente SET nombre = ${nombre}, apellidos = ${apellidos}, direccion = ${direccion}, telefono_trabajo = ${telefono_trabajo}, telefono_casa = ${telefono_casa}, celular = ${celular}, correo_empresarial = ${correo_empresarial}, correo_personal = ${correo_personal} where cedula = ${cedula}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function GetCustomer(req, res, next) {

  db.any('select * from Cliente where cedula=${cedula}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function DeleteCustomer(req, res, next) {

  db.none('DELETE FROM cliente WHERE cedula = ${cedula}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function SearchCustomers(req, res, next) {

  db.any('select * from Cliente where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getCNA(req, res, next) {
  db.any('select cedula, nombre, apellidos from Cliente')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}


//  ******************************** EMPLEADOS ************************************

function login(req, res, next) {
  db.any('select * from Usuario where usuario=${user} and contrasena=${password}',
    req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json({
          success: true, data: { nombre: data[0].nombre, dni: data[0].dni, isgerente: data[0].isgerente }
        });
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getAllEmployees(req, res, next) {
  console.log('Req: ', req)
  db.any('select * from Usuario')
    .then(function (data) {
      console.log(data)
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getEmployeesCNA(req, res, next) {
  db.any('select cedula, nombre, apellidos from Empleado')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveEmployee(req, res, next) {

  db.none('insert into Usuario values(${nombre}, ${apellidos}, ${dni}, ${direccion}, ${telefono}, ${correo}, ${usuario}, ${contrasena}, ${isgerente}, ${fechaentrada}, ${fechasalida}, ${tiposalario}, ${montosalario})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editEmployee(req, res, next) {

  db.none('update Usuario set nombre = ${nombre}, apellidos = ${apellidos}, direccion = ${direccion}, correo = ${correo}, telefono = ${telefono}, contrasena = ${contrasena}, isgerente = ${isgerente}, fechaentrada = ${fechaentrada}, fechasalida = ${fechasalida}, tiposalario = ${tiposalario}, montosalario = ${montosalario} where dni = ${dni}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function getEmployee(req, res, next) {

  db.any('select * from Usuario where dni=${dni}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteEmployee(req, res, next) {

  db.none('DELETE FROM Usuario WHERE dni = ${dni}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchEmployee(req, res, next) {

  db.any('select * from Empleado where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

//  ********************************* PROYECTO ************************************
function getAllProject(req, res, next) {
  db.any('select nombreProyecto, ruta from Proyecto where cliente = ${cedula}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}
// ---------- ARBOL DE CARPETAS ----------
var exec = require('child_process').exec;

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) { callback(stdout); });
};

function saveProject(req, res, next) {


  //EL NOMBRE SE JUNTA EN UNA SOLA CADENA
  var nomProy = req.body.nombreProyecto;
  //Separador: el split elimina los caracteres asignados a lo separadores
  var separador = " ";
  var nomJunto = nomProy.split(separador).join('');

  //LAS FECHAS SE JUNTA EN UNA SOLA CADENA
  var fecha = req.body.fechaInicio;
  //Separador: el split elimina los caracteres asignados a lo separadores
  var separador1 = " ";
  var separador2 = ", ";
  // Se logra el formato mes y año de las carpetas
  var mes = fecha.split(separador2).splice(0, 1).toString().split(separador1).pop();
  var anio = fecha.split(separador1).pop();

  var path = '%userprofile%\\Documents\\SistemaPROARINSA\\' + anio + '\\' + mes + '\\' + nomJunto 
  var data_path = `userprofile.Documents.SistemaPROARINSA.${anio}.${mes}.${nomJunto}`

  db.none('insert into Proyecto values(${nombreProyecto}, ${direccion}, ${tipoProyecto}, ${tipoObra}, ${descripcion}, ${fechaInicio}, ${fechaFinaliza}, ${estado}, ${banco}, ${cliente})',
    req.body)
    .then(() => {
      //EJECUTAR EL COMANDO AQUI
      //CREAR DIRECTORIO
      db.none('UPDATE Proyecto SET ruta = $1 WHERE nombreProyecto = $2', [data_path, req.body.nombreProyecto]);
      execute('mkdir ' + path, function (output) {
        console.log(output);

        execute('mkdir ' + path + '\\publico', function (output) {
          console.log(output);
        });

        execute('mkdir ' + path + '\\privado', function (output) {
          console.log(output);
        });

        // db.none("insert into Carpeta values('publico', '" + path + "')")
        // db.none("insert into Carpeta values('privado', '" + path + "')")

        db.none("insert into Carpeta values('" + data_path + ".publico" + "')")
        db.none("insert into Carpeta values('" + data_path + ".privado" + "')")

      });
      res.status(200)
        .json({
          success: true,
          ruta: path
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function detailproject(req, res, next){

  db.any('select direccion, tipoProyecto, tipoObra, descripcion, fechaInicio, fechaFinaliza, estado, banco from Proyecto where nombreProyecto = ${id}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function editProject(req, res, next) {
  db.none('UPDATE proyecto SET nombreProyecto = ${nombreProyecto}, direccion = ${direccion}, tipoproyecto = ${tipoProyecto}, tipoobra = ${tipoObra}, descripcion = ${descripcion}, fechainicio = ${fechaInicio}, fechafinaliza = ${fechaFinaliza}, estado = ${estado}, banco = ${banco}  where nombreproyecto = ${key}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false, err: err
        });
    })
}

function getProject(req, res, next) {

  db.any('select * from Proyecto where nombreproyecto=${nombreProyecto}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteProject(req, res, next) {

  db.none('DELETE FROM Proyecto WHERE nombreproyecto = ${nombreProyecto}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchProject(req, res, next) {

  db.any('select * from Proyecto where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function savefiles(req, res, next) {

  db.task(function* (t) {
    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let query_res = yield t.none('insert into Archivos values(${nombre_archivo}, ${ruta_padre})',
        file).then(val => {
          execute(`copy \"${file.realPath}\" \"${file.ruta}\"`, function (output) {
            console.log(output);
          });
          return { success: true }
        }).catch(err => {
          return { success: false, err: err }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });

}

function openfile(req, res, next) {

  let path = `start ${req.body.ruta}`;
  console.log(path);

  execute(path, function (output) {
    console.log(output);
  });

  res.status(200)
    .json({
      success: true
    });

}
function unlink(req, res, next) {//VALIDAR PARA POSIBLES ROLLBACKS

  db.task(function* (t) {
    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let id = yield t.one("insert into archivos_papelera values (${nombre_archivo}, ${nombre_proyecto}, ${ruta_padre}) RETURNING id", file)
        .then(data => {
          return data
        })
        .catch(err => {
          return { success: false, err: err, nombre_archivo: file.nombre_archivo }
        });


      let query_res = yield t.any("delete from archivos where ruta_padre = ${ruta_padre} and nombre_archivo = ${nombre_archivo}", file)
        .then(() => {
          return { success: true, nombre_archivo: file.nombre_archivo }
        })
        .catch(err => {
          return { success: false, err: err, nombre_archivo: file.nombre_archivo }
        });

      let ax = yield execute(`move ${file.real_path}\\\"${file.nombre_archivo}\" %userprofile%\\Documents\\SistemaPROARINSA\\papelera`, output => {
        return output
      });

      let bx = yield execute(`ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${file.nombre_archivo}\" \"${string_val(file.nombre_archivo, id.id)}\"`, output2 => {
        return output2
      });

      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });

}

function deletefile(req, res, next) {

  db.task(function* (t) {

    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let query_res = yield t.any('delete from Archivos_Papelera where id = ${id}',
        file).then(val => {
          execute(`del %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${string_val(file.nombre_archivo, file.id)}\"`, function (output) {
            console.log(output);
          });
          return { success: true, nombre_archivo: file.nombre_archivo }
        }).catch(err => {
          return { err: err, nombre_archivo: file.nombre_archivo }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });
}

function searchfiles(req, res, next) {
  console.log(req.body)
  db.any('select * from Archivos where ruta_padre = ${ruta_padre}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getunlinkfiles(req, res, next) {
  db.any('select * from archivos_papelera')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function verifyduplicatefiles(req, res, next) {
  db.task(function* (t) {

    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let query_res = yield t.any('select * from archivos where ruta_padre = ${ruta_padre} and nombre_carpeta = ${nombre_carpeta} and nombre_archivo = ${nombre_archivo}',
        file).then(vals => {
          return (vals.length == 1)
            ? { repeat: true, file: file }
            : { repeat: false, file: file }
        }).catch(err => {
          return { err: err, nombre_archivo: file.nombre_archivo }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });
}

function recoveryfile(req, res, next) {
  db.task(function* (t) {

    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      /*!!!!!!!!!!!!!!!!!!!!!!!*/
      if (file.reemplazar) {

        let del = yield t.any('delete from Archivos_Papelera where id = ${id}',
          file).then(val => {
            return { success: true }
          }).catch(err => {
            return { success: false }
          });

        let ax = yield execute(`del ${file.ruta_padre}\\${file.nombre_carpeta}\\\"${file.nombre_archivo}\"`, output => {
          return output
        });

        let aux_name = string_val(file.nombre_archivo, file.id)

        let bx = yield execute(`move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${aux_name}\" ${file.ruta_padre}\\${file.nombre_carpeta}`, output => {
          return output
        });

        let cx = yield execute(`ren ${file.ruta_padre}\\${file.nombre_carpeta}\\\"${aux_name}\" \"${file.nombre_archivo}\"`, output2 => {
          return output2
        });
      }
      /*!!!!!!!!!!!!!!!!!!!!!!!*/
      else {
        var carpeta_arr = []
        while (true) {
          let query_res = yield t.any('select * from Carpeta where ruta_padre = ${ruta_padre} and nombre_carpeta = ${nombre_carpeta}',
            file).then(vals => {
              return (vals.length == 1)
                ? { father: true }
                : { father: false }
            })

          if (query_res.father) break;
          else {
            let ins = t.none('insert into Carpeta values(${nombre_carpeta}, ${ruta_padre})', file)

            carpeta_arr.push({ ruta_padre: file.ruta_padre, nombre_carpeta: file.nombre_carpeta })

            // let mkdir = execute(`mkdir ${file.ruta_padre}\\${file.nombre_carpeta}`, output => output);
            var values = get_folder_name(file.ruta_padre)
            file.ruta_padre = values.ruta_padre
            file.nombre_carpeta = values.nombre_carpeta
          }
        }

        if (carpeta_arr.length != 0) {
          for (var j = carpeta_arr.length - 1; j > -1; j--) {
            let mkdir = execute(`mkdir ${carpeta_arr[j].ruta_padre}\\${carpeta_arr[j].nombre_carpeta}`, output => output);
          }
        }

        file = req.body[i];
        let insert = yield t.none('insert into Archivos values(${nombre_archivo}, ${nombre_carpeta}, ${ruta_padre})',
          file).then(val => {
            //aca se recupera el archivo 
            return { success: true, name: file.nombre_archivo }
          }).catch(err => {
            return { success: false, file: file }
          });

        if (!insert.success) {
          insert["pos"] = i
          res.status(200).json(insert);
          return;
        }

        let del = yield t.any('delete from Archivos_Papelera where id = ${id}',
          file).then(val => {
            return { success: true }
          }).catch(err => {
            return { success: false }
          });

        let aux_name = string_val(file.nombre_archivo, file.id)

        let ax = yield execute(`move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${aux_name}\" ${file.ruta_padre}\\${file.nombre_carpeta}`, output => {
          return output
        });

        let bx = yield execute(`ren ${file.ruta_padre}\\${file.nombre_carpeta}\\\"${aux_name}\" \"${file.nombre_archivo}\"`, output2 => {
          return output2
        });
      }

    }

    res.status(200).json({ success: true });
  })
    .then(events => { })
    .catch(error => { });
}

function movefiles(req, res, next) {
  db.task(function* (t) {
    for (let i = 0; i < req.body.files.length; i++) {
      var destiny = req.body.destiny
      var file = req.body.files[i];
      if (file.reemplazar) {
        let del = yield t.none(`delete from archivos where ruta_padre = '${file.ruta_padre}' and nombre_archivo = '${file.nombre_archivo}'`)

        let ax = yield execute(`del ${req.body.destino}\\\"${file.nombre_archivo}\"`, output => {
          return output
        });

        let bx = yield execute(`move ${file.origen}\\\"${file.nombre_archivo}\" ${req.body.destino}`, output => {
          return output
        });

      }
      else {
        let query_res = yield t.none(`update archivos set ruta_padre = '${destiny}' where ruta_padre = '${file.ruta_padre}' and nombre_archivo = '${file.nombre_archivo}'`)
          .then(() => {
            return { success: true }
          }).catch(err => {
            return { success: false, nombre_archivo: file.nombre_archivo, pos: i }
          });

        if (!query_res.success) {
          res.status(200).json(query_res);
          return;
        }
        else {
          let ax = yield execute(`move ${file.origen}\\\"${file.nombre_archivo}\" ${req.body.destino}`, output => {
            return output
          });
        }
      }
    }
    res.status(200).json({ success: true });
  })
    .then(events => { })
    .catch(error => { });
}

function changefilename(req, res, next) {
  db.none("update archivos set nombre_archivo = ${new_name} where ruta_padre = ${ruta_padre} and nombre_archivo = ${nombre_archivo}", req.body)
    .then(() => {
      let file = req.body
      let path = `ren ${file.real_path}\\\"${file.nombre_archivo}\" \"${file.new_name}\"`
      execute(path, output2 => { });
      res.status(200)
        .json({ success: true });
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editfoldername(req, res, next){
  let folder = req.body
  db.func('Update_Folders', [folder.origin_point, folder.destiny_point])
    .then(data => {
        let path = `ren ${folder.origin_slash} ${folder.new_name}`
        execute(path, output2 => {});

        res.status(200)
          .json({ success: true });
    })
    .catch(error => {
      res.status(200)
      .json({
        success: false
      });
    });
}

function getfolders(req, res, next) {
  db.any("select * from carpeta where ruta ~ '"+ req.body.ruta +".*{1}'")
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getpublicfolder(req, res, next) {
  db.any("select * from carpeta where ruta_padre = ${ruta} and nombre_carpeta = 'publico'", req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function savefolder(req, res, next) {
  db.none('insert into Carpeta values(${ruta})', req.body)
    .then(() => {

      execute(`mkdir ${req.body.real_path}`, function (output) {
        console.log(output);
      });

      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          err: err
        });
    })
}

function deletefolder(req, res, next) {
  db.task(function* (t) {
    let folder = req.body
    let children = yield t.any("select * from carpeta where ruta ~ '"+ req.body.ruta +".*{1}'")
      .then(vals => {
        return (vals.length == 1) ? true : false
      }).catch(err => err);

    if (children) {
      res.status(200).json({ success: false });
    }
    else {
      let file_children = yield t.none("delete from carpeta where ruta = ${ruta}", req.body)
        .then(() => false).catch(err => true);

      if (file_children) {
        res.status(200).json({ success: false });
      }

      execute(`rd /s /q ${folder.real_path}`, function (output) {
        console.log(output);
      });

      res.status(200).json({ success: true });
    }
  })
    .then(events => { })
    .catch(error => { });
}

function getfoldertree(req, res, next) {

  db.any("SELECT ruta, nlevel(ruta),"+
         "subpath(ruta,nlevel(ruta)-1) as nombre_carpeta,"+
         "subltree(ruta,nlevel(ruta)-2 ,nlevel(ruta)-1) as padre "+
         "FROM carpeta WHERE ruta <@ '"+ req.body.ruta +"' order by nlevel")
    .then((data) => {
      
      db.any("select * from subpath('"+ req.body.ruta +"', nlevel('"+ req.body.ruta +"')-1)")
      .then((nombre) => {
        res.status(200)
        .json({tree: data, nombre: nombre[0].subpath});
      })
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}


/*FUNCIONES AUXILIARES*/


function string_val(name, id) {
  var i;
  for (i = name.length - 1; i > -1; i--) {
    if (name.charAt(i) == '.') break
  }
  var pos = i
  var p1 = name.substring(0, pos);
  var p2 = name.substring(pos, name.length);
  return `${p1}papelera${id}${p2}`
}

function get_folder_name(path) {
  var name = ""
  var i
  for (i = path.length - 1; i > -1; i--) {
    if (path.charAt(i) == '\\') break
    else name += path.charAt(i)
  }

  var new_path = path.substring(0, i)

  let res = { nombre_carpeta: name.split("").reverse().join(""), ruta_padre: new_path }
  return res
}

//  ********************************* ARCHIVOS ************************************

module.exports = {
  // REPORTES
  getAllReportes: getAllReportes,
  saveReporte: saveReporte,
  limpiaReporte: limpiaReporte,
  // PLANILLA 
  getAllWorkers: getAllWorkers,
  SaveWorker: saveWorker,
  EditWorker: editWorker,
  GetWorker: getWorker,
  DeleteWorker: deleteWorker,
  SearchWorkers: searchWorkers,
  // PROVEEDORES 
  getAllProviders: getAllProviders,
  SaveProvider: SaveProvider,
  EditProvider: EditProvider,
  GetProvider: GetProvider,
  DeleteProvider: DeleteProvider,
  SearchProviders: SearchProviders,
  // CLIENTES
  getAllCustomers: getAllCustomers,
  getdetailcustomer: getdetailcustomer,
  SaveCustomer: SaveCustomer,
  EditCustomer: EditCustomer,
  GetCustomer: GetCustomer,
  DeleteCustomer: DeleteCustomer,
  SearchCustomers: SearchCustomers,
  getCNA: getCNA,
  // EMPLEADOS
  login: login,
  getAllEmployees: getAllEmployees,
  saveEmployee: saveEmployee,
  editEmployee: editEmployee,
  getEmployee: getEmployee,
  deleteEmployee: deleteEmployee,
  searchEmployee: searchEmployee,
  getEmployeesCNA: getEmployeesCNA,
  // PROYECTOS
  getAllProject: getAllProject,
  saveProject: saveProject,
  editProject: editProject,
  getProject: getProject,
  deleteProject: deleteProject,
  searchProject: searchProject,
  detailproject: detailproject,
  savefiles: savefiles,
  searchfiles: searchfiles,
  openfile: openfile,
  deletefile: deletefile,
  unlink: unlink,
  getunlinkfiles: getunlinkfiles,
  recoveryfile: recoveryfile,
  verifyduplicatefiles: verifyduplicatefiles,
  changefilename: changefilename,
  getfolders: getfolders,
  savefolder: savefolder,
  getpublicfolder: getpublicfolder,
  deletefolder: deletefolder,
  getfoldertree: getfoldertree,
  movefiles: movefiles,
  editfoldername: editfoldername
}