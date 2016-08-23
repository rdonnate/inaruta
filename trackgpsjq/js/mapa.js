/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
  var db = initDataBase();
  var directorio=[];
 function mostrarVentana()
{
   
    var ventana = document.getElementById("modal");
	ventana.style.top = ((document.body.clientHeight-50) / 2) +  "px";
    ventana.style.left = ((document.body.clientWidth-150) / 2) +  "px";
    ventana.style.display = "block";
}
function ocultarVentana()
{
    var ventana = document.getElementById("modal");
    ventana.style.display = "none";
}
  function isTouchDevice(){
    try{
        document.createEvent("TouchEvent");
        return true;
    }catch(e){
        return false;
    }
}
 function abrir_espera () {
  var ventanaModal = $("#modal").dialog({
      autoOpen:false,
      resizable: false,
	  width: 250, 
	  height: 100,
	  position: { my: "center", at: "center", of: "#map" },
      modal:true
	  
	 
	 /*  open: function(event, ui){
        $(".ui-dialog-titlebar").show();
},  */
	  /* close: function(event, ui) {

         // borra el div con sus eventos y datos
         dialog.remove();
      } */
});
   var zindex = $("#resultados").css('zIndex');
   ventanaModal.parent().css('zIndex',zindex+20);
   ventanaModal.css('zIndex',zindex+20);
   return ventanaModal;
}
 
 
 
function touchScroll(id){
    if(isTouchDevice()){ //if touch events exist...
        var el=document.getElementById(id);
        var scrollStartPos=0;
 
        document.getElementById(id).addEventListener("touchstart", function(event) {
            scrollStartPos=this.scrollTop+event.touches[0].pageY;
            event.preventDefault();
		   // event.stopPropagation();
        },false);
 
        document.getElementById(id).addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPos-event.touches[0].pageY;
            event.preventDefault();
			//event.stopPropagation();
        },false);
    }
}
  function pointBuffer (pt, radius, units, resolution) {
              var ring = []
              var resMultiple = 360/resolution;
              for(var i  = 0; i < resolution; i++) {
                var spoke = turf.destination(pt, radius, i*resMultiple, units);
                ring.push(spoke.geometry.coordinates);
              }
              if((ring[0][0] !== ring[ring.length-1][0]) && (ring[0][1] != ring[ring.length-1][1])) {
                ring.push([ring[0][0], ring[0][1]]);
              }
              return turf.polygon([ring])
            }
         
            function replacer(key, value) {
             if (key=="HSUPERF") {
                return value/10000;
              }
              return value;
            }
     
            function zoomIni(map) {
               map.setView([41.64, -0.87], 10);
			           
            }
            function zoomIn(numberzoon,center,map) {
              map.setZoom(numberzoon);
              map.panTo(center);
            }
            function getzoomact(map) {
              
              var zoomactual= map.getZoom();
              return zoomactual;
            }
 function getHHMMSS() {
  var fecha= new Date();
  var horas= fecha.getHours();
  var minutos = fecha.getMinutes();
  var segundos = fecha.getSeconds();
  return horas+"*"+minutos+"*"+segundos;
  }
 function hoy() {
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      return curr_date + "/" + curr_month + "/" + curr_year;
}

function redondear(number,places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
}
function validaFecha(fecha){
                  
            var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
            var fechaCompleta = fecha.match(datePat);
            if (fechaCompleta == null) {
                    return false;
            }

            dia = fechaCompleta[1];
            mes = fechaCompleta[3];
            anio = fechaCompleta[5];

            if (dia < 1 || dia > 31) {

                    return false;
            }
            if (mes < 1 || mes > 12) { 

                    return false;
            }
            if ((mes==4 || mes==6 || mes==9 || mes==11) && dia==31) {

                    return false;
            }
            if (mes == 2) { // bisiesto
                    var bisiesto = (anio % 4 == 0 && (anio % 100 != 0 || anio % 400 == 0));
                    if (dia > 29 || (dia==29 && !bisiesto)) {

                            return false;
                    }
            }
            return true;

}
function desnivelRelativo(db) {
  var registros = parseInt(maxRegistros(db));
  
  var alturaIni;
  var alturaFin;
  var desnivel;
  
  for (var j=1; j<= registros;j++) {
     var result = leer1Dato(db,j);
	 if ( result.altura != -1 && result.altura != 0) {
	      alturaIni = result.altura;
		  break;
     }
  }
  
  for ( var w = registros; w > 0; w--) {
      var result3 = leer1Dato(db,w);
	  if ( result3.altura != -1 && result.altura != 0) {
	      alturaFin = result3.altura;
		  break;
     }
  }
   
   if ( !(alturaIni === undefined || alturaFin === undefined) ) {
       desnivel = alturaFin - alturaIni;
   } else {
       desnivel = "No disponible";
   }
  
   return desnivel;
 }
        
function pintaRuta(map,db,myLayer, pintaRutaGeo,registros) {
	  var polyline;
	  var puntos=[];
	  var k;
	  var dateIni;
	  var dateFin;
	  var elapsed;
	  var velocidad;
	  var fechaIngles;
	  var desnivel;
    for (var j=1; j< registros ;j++) {
      k= j - 1;
	 
      var result = leer1Dato(db,j);
	   if  (j==1) {
	      fechaIngles = result.fecha.split("/");
		  dateIni = new Date(fechaIngles[1] +"/"+fechaIngles[0]+"/"+fechaIngles[2]);
		  dateIni.setHours(result.horas);
		  dateIni.setMinutes(result.minutos);
		  dateIni.setSeconds(result.segundos);
		  
	  }
	
	  puntos[k] = [result.lng,result.lat];
	  var latlng = L.latLng([result.lat,result.lng]);
	  var result2 = leer1Dato(db,j+1);
	  var latlng1 = L.latLng([result2.lat,result2.lng]);
      //polyline = new L.polyline([latlng,latlng1], {color: 'red',smoothFactor:1.10});
	  //myLayer.addLayer(polyline); 
  }
  
  var result2 = leer1Dato(db,j);
  fechaIngles = result2.fecha.split("/");
  dateFin = new Date(fechaIngles[1] +"/"+fechaIngles[0]+"/"+fechaIngles[2]);
  dateFin.setHours(result2.horas);
  dateFin.setMinutes(result2.minutos);
  dateFin.setSeconds(result2.segundos);
  
  
  desnivel = desnivelRelativo(db);	
  elapsed = (dateFin.getTime() - dateIni.getTime())/ 1000;
  var tolerance = 0.001;
  var line = turf.linestring(puntos);
  var simplificado = turf.simplify(line,tolerance,true);
  var lineajson =  JSON.stringify(simplificado);
  var distancia = turf.lineDistance(line, 'kilometers');
  var bounds;
  if (pintaRutaGeo.ruta) {
	map.removeLayer(pintaRutaGeo.ruta); }
			     
   pintaRutaGeo.ruta = L.geoJson(false,{
							                   onEachFeature:function( feature,layer) {
											   if (feature.properties) {
													   try {
														feature.properties.color= "#660080";
														bounds = layer.getBounds();
														//map.fitBounds(bounds);
													  } catch(err) {
														 alert("error");
														 $("#error").append(err.message);
													  }
												}
					                    } }).addTo(map); 
						   
   pintaRutaGeo.ruta.addData(line);
   pintaRutaGeo.ruta.setStyle(estiloRuta);  
   map.fitBounds(bounds);
   /* myLayerGeo.addData(simplificado);
   myLayerGeo.setStyle(estiloRuta); */ 
  // myLayer.addTo(map);
  
 
 // map.fitBounds(myLayer.getBounds());
  velocidad = (distancia * 1000) / elapsed;
  var velocidadkh = velocidad * 3.6
  var calorias;
  if ( velocidadkh <= 2 ) {
       calorias = 50 * elapsed / 1800;
  } else if ( velocidadkh > 2 && velocidadkh <= 3 ) { 
        calorias = 60 * elapsed / 1800;
  } else if ( velocidadkh > 3 && velocidadkh < 4.8 ) {
      calorias = 75 * elapsed / 1800;
  } else if ( velocidadkh >= 4.8 && velocidadkh < 6) {
      calorias = 150 * elapsed / 1800;
  } else if ( velocidadkh >= 6 && velocidadkh < 7.5) {
       calorias = 175 * elapsed / 1800;
  } else if ( velocidadkh >= 7.5 && velocidadkh < 8) {
         calorias = 220 * elapsed / 1800;
 } else {
         calorias = 330 * elapsed / 1800;
 }
	 
         
  $("#datosruta").empty();
  $("#datosruta").append("<div>Distancia: "+ redondear(distancia * 1000,3) + " metros<br>");
  $("#datosruta").append("Tiempo Total: "+ elapsed + " segundos - " + redondear(elapsed/60,3) +" minutos<br>");
  $("#datosruta").append("Velocidad Media: "+ redondear(velocidad,3) + " m/s - "+ redondear(velocidadkh,2) +" km/h <br></div>");
  $("#datosruta").append("Calorias Quemadas: "+ Math.round(calorias)+ "<br></div>");
  
  var pos;
  pos = $.isNumeric(desnivel);
  if ( !pos ) {
       $("#datosruta").append("Desnivel Acumulado: "+ desnivel+"<br>");
	   } else {
	       $("#datosruta").append("Desnivel Acumulado: "+ desnivel+ " metros<br>");
	}
	$.mobile.loading( 'hide');	
  }
function drawRuta(map,db,myLayer, pintaRutaGeo) {
  var registros = parseInt(maxRegistros(db));
  var polyline;
  var puntos=[];
  var k;
  var dateIni;
  var dateFin;
  var elapsed;
  var velocidad;
  var fechaIngles;
  var desnivel;
 
   $.mobile.loading( 'show', { theme: "a", text: "dibujando ruta...", textonly: false,textVisible:true });
  if ( isNaN(registros) || registros == 0 ){
      $.mobile.loading( 'hide'); 
      return;
  }
  setTimeout(function(){ pintaRuta (map,db,myLayer, pintaRutaGeo,registros); }, 100);
  setTimeout(function(){ $.mobile.loading( 'hide'); }, 2000);
  
  }
  
 function borrarDB(db) {
    db.close();
    window.localStorage.removeItem('ruta.sqlite');
	$("#info").empty();
	$("#datosruta").empty();
	db = initDataBase();
	return db;
	
 }
 function recuperarStorage (db) {
       
		var tabla=leerXY(db);
	    
		return tabla;
	
}
function retardo() {
   alert("hola");
   var x=1;
   return x;
}
 function recuperarDB () {
   
    var db;
	var tabla;
	$.mobile.loading( 'show', { theme: "a", text: "recuperando...", textonly: false,textVisible:true });
	var dbstr = window.localStorage.getItem("ruta.sqlite");
	
	
	if ((dbstr ==null)) { $.mobile.loading( 'hide'); return -1; }
	 db = new SQL.Database(toBinArray(dbstr));
	 
	 tabla =recuperarStorage(db);
	
	
	$("#info").empty();
	$("#info").append(tabla);
	setTimeout(function(){ $.mobile.loading( 'hide'); }, 2000);
    return db;
}
function toBinArray (str) {
	var l = str.length,
			arr = new Uint8Array(l);
	for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
	return arr;
}	
function toBinString (arr) {
	var uarr = new Uint8Array(arr);
	var strings = [], chunksize = 0xffff;
	// There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
	for (var i=0; i*chunksize < uarr.length; i++){
		strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
	}
	return strings.join('');
}

 function guardaDatos (db) {
	var dbstr = toBinString(db.export());
	window.localStorage.setItem("ruta.sqlite", dbstr);
}
function initDataBase() {
	var db = new SQL.Database();
    // Run a query without reading the rescults
    db.run("CREATE TABLE ruta (id INTEGER ,fecha TEXT ,horas TEXT ,minutos TEXT ,segundos TEXT ,lat TEXT ,lng TEXT,altura TEXT);");
	db.run("CREATE INDEX idx_id ON ruta(id);");
	return db;
}
function txt2db( textData) {
  
  var db = initDataBase();
  var registro;
  var indice = 0;
  while ( textData.indexOf("\n") != -1 ) {
      
     registro = textData.substr(0, textData.indexOf("\n"));
	 var longitud = registro.length;
	 textData = textData.substr(longitud+1);
	 var campos = registro.split("\t");
	 indice++;
	 db.run("INSERT INTO ruta VALUES (?,?,?,?,?,?,?,?)", [indice,campos[0],campos[1].split(":")[0],campos[1].split(":")[1],campos[1].split(":")[2],
	 campos[2],campos[3], campos[4]]);
	 
  }
   
  return db;
} 
function insertXY(db,e,numorden) {
    var altura = -1;
    if (e.altitude === undefined) {
	     altura = -1;
		} else {
		altura = e.altitude;
		//altura = 100 * Math.random();
     }
	 var HHMMSS = getHHMMSS().split("*");
    db.run("INSERT INTO ruta VALUES (?,?,?,?,?,?,?,?)", [numorden,hoy(),HHMMSS[0],HHMMSS[1],HHMMSS[2],e.latlng.lat,e.latlng.lng,altura]);
	
}
function maxRegistros(db) {
	 var stmt = db.prepare("SELECT max(id) AS numreg FROM ruta");
	 stmt.step();
	 var result = stmt.get(); 
	 stmt.free();
	 return result;
}
function contarRegistros (db) {
     var stmt = db.prepare("SELECT count(*) AS numreg FROM ruta");
	 stmt.step();
	 var result = stmt.get(); 
	 stmt.free();
	 return result;
}
function leer1Dato(db,id) {
      var stmt = db.prepare("SELECT * FROM ruta where id = $valor");
	   var result = stmt.getAsObject({$valor:id}); 
	  /* stmt.bind([id]);
		stmt.step();
	  var result = stmt.getAsObject(); */ 
	  stmt.free();
	  return result;
}
function downloadDb ( db) {
    
    var salto = "\r\n";
	var tab = "\t";
	var text ="";
	 var stmt = db.prepare("SELECT * FROM ruta");
      stmt.getAsObject(); 
      while(stmt.step()) { //
        var row = stmt.getAsObject();
		text += row.fecha+tab+row.horas+":" +row.minutos+":"+row.segundos+tab+row.lat+tab+row.lng+tab+row.altura+salto;
		
    }
	
	stmt.free();
	return text;
}	
function leerXY(db) {
     var tabla = "<table><tr><th>Fecha</th><th>hh:mm:ss</th><th>Latitud</th><th>Longitud</th><th>Altura</th></tr>";
	 
     var stmt = db.prepare("SELECT * FROM ruta");
      stmt.getAsObject(); 
      while(stmt.step()) { //
        var row = stmt.getAsObject();
		tabla += "<tr><td>"+row.fecha+"</td>"+ "<td>"+row.horas+":" +row.minutos+":"+row.segundos+"</td>"+  "<td>"+row.lat+"</td>"+"<td>"+row.lng+"</td>"+"<td>"+row.altura+"</td></tr>";
		
    }
	tabla += "</table>";
	stmt.free();
	return tabla;
	
}
 function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getDirectory, fail);
    }
function getDirectory(fileSystem) {
         fileSystem.root.getDirectory("datosRuta", {create: true, exclusive: false}, getDirectorySuccess,fail);

    }
function getDirectorySuccess(parent) {
    console.log("Creando directorio en: " + parent.fullPath);
	

}
function checkIfFileExists(fichero){
   
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(fichero.path, { create: false }, function fileExists(fileEntry) {
		fichero.existe = true;
		}, function fileDoesNotExist() {
		   fichero.existe=false;} );
    }, getFSFail); //of requestFileSystem
}


function getFSFail(evt) {
    console.log(evt.target.error.code);
}
function existeFichero(fichero) {
    fichero.existe = false;
	fichero.procesado = 1;
   for ( var i = 0 ; i<directorio.length; i++) { 
    if (fichero.filename == directorio [i] ) {
			fichero.existe = true;
	}
   }  
}
function checkDirectory () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      fileSystem.root.getDirectory("datosRuta", {
           create: false
       }, function(directory) {
         
         var directoryReader = directory.createReader();
		
         directoryReader.readEntries(function(entries) {
            var i;
			 directorio =[]	
            for (i=0; i<entries.length; i++) {
			  
			   directorio [i] = entries[i].name
               
            }
			
			
        }, function (error) {
            alert(error.code);
        });

       } ); 
 }, function(error) {
   alert("No se puede leer el directorio: " + error.code);
});

} 

function writeFile ( filename,data) {
    
    document.addEventListener("deviceready", onDeviceReady, false);
   // filename= "datosRuta" +"/"+ filename;
	var fichero = new Object();
	fichero.path = filename + ".txt";
	fichero.existe =false;
	fichero.directorio = "datosRuta";
	fichero.filename = filename;
	fichero.procesado = 0;
	var i = 0;
	checkDirectory();
	setTimeout(function(){ var x=1; }, 2000);
    do {
	   
		var candidato = filename + i;
		fichero.path =  "datosRuta" +"/"+candidato + ".txt";
		fichero.filename = candidato + ".txt";
		fichero.procesado = 0;
		existeFichero(fichero);
		i++;
	}
	 while ( fichero.existe  );
	//filename += ".txt";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    console.log('file system open: ' + fs.name);
    fs.root.getFile(fichero.path, { create: true, exclusive: false }, function (fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        writeTxt(fileEntry, data);
       
    }, fail);

}, fail);
}
 function writeTxt( fileEntry,data) {
     fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
		     /* $("#upload").focus();
			 $('select').selectmenu('refresh');	  */
			
            console.log("escritura correcta...");
            //readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("error de escitura: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!data) {
            data = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(data);
    });
}
function asignaDataBase(database) {
     db = database;
}
function readFile ( filename,geodb,callback ) {
         
    $.mobile.loading( 'show', { theme: "a", text: "Leyendo fichero...", textonly: false,textVisible:true });
    filename= "datosRuta" +"/"+ filename;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    console.log('file system open: ' + fs.name);
    fs.root.getFile(filename, { create: false, exclusive: false }, function (fileEntry) {

        //console.log("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
		
         readTxt(fileEntry,geodb,callback);
        
		
    }, fail);

}, fail);

}

function readTxt( fileEntry, geodb,callback) {
    
     fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
		     geodb.mygeo=txt2db(this.result);
			 var tabla =leerXY(geodb.mygeo);
			 $("#info").empty();
			 $("#info").append(tabla);
			 setTimeout(function(){ $.mobile.loading( 'hide'); }, 1000);
			 callback(geodb.mygeo);
        };

        reader.readAsText(file);

    }, fail);
	
}
/* function readDirectorio(directorio) {
      var data ={"fichero1.txt":"fichero1.txt","fichero2.txt":"fichero2.txt","fichero3.txt":"fichero3.txt"};
	 	 
	 var select = $('#upload');

	$('option', select).remove();
	$.each(data, function(text, key) {
		var option = new Option(key, text);
		select.append($(option));
	});
	$('select').selectmenu('refresh');	 

} */

 
 function readDirectorio ( directorio ) {
  
   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
   fileSystem.root.getDirectory(directorio, {
           create: false
       }, function(directory) {

        var directoryReader = directory.createReader();
		var data={};
        directoryReader.readEntries(function(entries) {
            var i;
            for (i=0; i<entries.length; i++) {
			    data[entries[i].name] = entries[i].name;
               
            }
			var select = $('#upload');

			$('option', select).remove();
			$.each(data, function(text, key) {
				var option = new Option(key, text);
				select.append($(option));
			});
			$('select').selectmenu('refresh');	 
			
        }, function (error) {
            alert(error.code);
        });

       } ); 
 }, function(error) {
   alert("No se puede leer el directorio: " + error.code);
});

} 
 
 function fail(error) {
     var msg = "";
      
	switch(error.code) { 
		case 1:	msg ="fichero no encontrado"; break;
		case 2: msg = "Error de seguridad"; break;
		case 3:  msg = "Operacion abortada"; break;
		case 4: msg = "fichero protegido";break;
		case 5: msg = "Error de codificación";break;
		case 6: msg = "fichero solo de lectura ";break;
		case 7: msg = "fichero en estado invaélido";break;
		case 8: msg = "error de sintáxis";break;
		case 9: msg = "modificación no válida";break;
		case 10: msg = "cuota excedida";break;
		case 11: msg = "error de tipo de fichero";break;
		case 12: msg = "path existente";break;
    }	
	  alert("Error lectura/escritura:"+error.code+ "-"+ msg);
}
function downloadInnerHtml(filename, elId, mimeType) {
        var elHtml = document.getElementById(elId).innerHTML;
		 var txtData = new Array();
		 txtData.push(elHtml);
		 var buffer = txtData.join();
		 var blob = new Blob([buffer], {
            "type": "text/plain;charset=utf8;"
        });
		//----
		
		writeFile(filename,blob);
		
		//----
		/* var link = document.createElement('a');
		 if (link.download !== undefined) { 
				mimeType = mimeType || 'text/plain';
				link.setAttribute('download', filename);
				//link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
				 link.setAttribute("href", window.URL.createObjectURL(blob));
	    }
        else if (navigator.msSaveBlob) {
		     link.setAttribute("href", "#");
             link.addEventListener("click", function (event) {
                navigator.msSaveBlob(blob, fileName);
            }, false);
	    }
		document.body.appendChild(link);
        link.click();  */
    }
function closeAPP(db) {
 db.close();  
 navigator.app.exitApp();
} // solo android

function loadXMLDoc(url) {
          var xmlhttp;
          if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
            }
          else
            {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
          xmlhttp.onreadystatechange=function()
            {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
                  {
                  document.getElementById("orto").innerHTML=xmlhttp.responseText;
                  alert(xmlhttp.responseText);
                  }
            }
          xmlhttp.open("get",url,true);
         // xmlhttp.setRequestHeader('Access-Control-Allow-Origin','*');
          xmlhttp.setRequestHeader('Content-Type', 'application/jsonp');
         // xmlhttp.setRequestHeader('X-PINGOTHER', 'pingpong');

          xmlhttp.send();	

     }		
	  function estiloRuta(feature) {
			       
					return {color:feature.properties.color,weight: 4};			
				 //return {color: "#00ff00",weight: 100};
			 };
			 
	 //function trataFeatures( feature,layer,mp
			 
      function onEachFeature(feature, layer,map) {
				
				if (feature.properties) {
				   try {
				    feature.properties.color= "#862d2d";
					var bounds = layer.getBounds();
					map.fitBounds(bounds);
				  } catch(err) {
				     alert("error");
				     $("#error").append(err.message);
				  }
				}
			};
     function initMap() {
	 
	       function onEachFeature(feature, layer) {
				
				if (feature.properties) {
				   try {
				    feature.properties.color= "#00FF00";
					var bounds = layer.getBounds();
					map.fitBounds(bounds);
				  } catch(err) {
				     alert("error");
				     $("#error").append(err.message);
				  }
				}
			};
 
	        
	        function onLocationFound(e) {
			      numorden= parseInt(maxRegistros(db)) + 1;
				  if ( isNaN(numorden) ) {
				      numorden = 1;
				  }
				 
			      $("#error").empty();
                  insertXY(db,e,numorden); 
				  onPositionFound(e);
			}
            function onPositionFound(e) {
			      $("#error").empty();
                  var radius = e.accuracy / 2;
				  var altura;
				  var textoGeoLocaliza = "<b>Esta dentro de un radio de " + radius + " metros de este punto <br> Latitud: "+e.latlng.lat +"<br>"+ " Longitud: " +e.latlng.lng;
				 
				   if (!(e.altitude===undefined || e.altitude == -1) ) {
				     altura = e.altitude;
					 textoGeoLocaliza+= "<br>"+"Altura: " + altura;
				  }
   				  if (marcaLocate) {
					map.removeLayer(marcaLocate); }
				  if (circuloLocate) {
					map.removeLayer(circuloLocate); }
			     
                  marcaLocate = L.marker(e.latlng).addTo(map)
                          .bindPopup(textoGeoLocaliza).openPopup();

                  circuloLocate = L.circle(e.latlng, radius).addTo(map);
				  
				 
			}
			function onLocationError(e) {
			          $("#error").empty();
                      $("#error").append("Error al intentar el posicionamiento: "+e.message);
			}		
			
           
			var geodb = {
			    mygeo: db
			};
			var distancia;
			var numorden = 0;
			var numFeatures;
		    var myLayer = new L.FeatureGroup();
		    var marcaLocate;
			var circuloLocate;
	        var zoomactual;
            var center;
            var rectangulo;
			var matricula;
			var whereClause;
		    var markCotos=[];
			$('#txt').hide();
			var map = L.map("map",{doubleClickZoom:false,minZoom:6,
			maxZoom: 20,
			bounceAtZoomLimits:false,
			maxBounds: L.latLngBounds(L.latLng(43.19316, -3.24646), L.latLng(39.54218, 2.21924))});
			var myLayerGeo = L.geoJson(false).addTo(map);
			var pintaRutaGeo= {
                 ruta: 	myLayerGeo	
             };			 
			//var marcas =  new L.FeatureGroup();
			touchScroll('panelinfo');
			$("#clear").click(function(e) {
			   L.DomEvent.stopPropagation(e);
			   $("#error").empty();
               if (marcaLocate) {
					map.removeLayer(marcaLocate); }
			   if (circuloLocate) {
					map.removeLayer(circuloLocate); }
			    if (myLayer) {
					map.removeLayer(myLayer); }
				 if (pintaRutaGeo.ruta) {
				    //alert(JSON.stringify(pintaRutaGeo.ruta));
					map.removeLayer(pintaRutaGeo.ruta); }
			     
			    if ( circle ) {
                    map.removeLayer(circle);
                }
				if ( marker ) {
                    map.removeLayer(marker);
                }
			   //map.on("click");
             });
            $("#zoonini").click(function(e) {
			    L.DomEvent.stopPropagation(e);
				 zoomactual=map.getZoom();
				 center = map.getCenter(); 
                zoomIni(map);
             });
            $("#zoonant").click(function(e) {
			   L.DomEvent.stopPropagation(e);
			   map.setZoom(zoomactual);
               map.panTo(center);
             });
             
			  $("#viewtrack").click(function() {
			       var tabla =leerXY(db);
				   $("#info").empty();
				   $("#info").append(tabla);
			  } );
   	         /*  $("#cerrar").click(function() { 
					    
					    if ($('#resultados').is (':visible')) {
       						$('#resultados').hide();
						} else { $('#resultados').show() } } ); */
			   $("#stop").click(function() { 			
			            map.stopLocate();
						numorden = maxRegistros(db);
				}	);	
				
			   $("#ruta").click(function() {
					drawRuta(map,db,myLayer, pintaRutaGeo);
					 $( "#myPanel" ).panel( "open"  );
				     $("#resultados").collapsible('expand');
					
			   });
		   
		       $("#guardar").click(function(e) {
			        L.DomEvent.stopPropagation(e);
			        guardaDatos(db);
			   } );
			   
		       $("#recuperar").click(function(e) {
			        L.DomEvent.stopPropagation(e);
					var dbAct = db;
			        db = recuperarDB();
					if (db==-1) { db = dbAct;}
					var tabla =leerXY(db);
				   $("#info").empty();
				   $("#info").append(tabla);
				   $( "#myPanel" ).panel( "open"  );
				   $("#resultados").collapsible('expand');
					
			   } );
				$("#download").click(function(e) {
				            $.mobile.loading( 'show', { theme: "a", text: "Leyendo ruta...", textonly: false,textVisible:true });
				            L.DomEvent.stopPropagation(e);
							var txt="";
							
							txt = downloadDb(db);
							$("#registros").empty();
							$("#registros").append(txt);
							downloadInnerHtml("ruta", 'registros','text/plain');
							setTimeout(function(){ $.mobile.loading( 'hide'); }, 1000);
							
					} );
					
			  /* $("#download").click(function(e) {
			        L.DomEvent.stopPropagation(e);
					var txt="";
					
			        txt = downloadDb(db);
					$("#registros").empty();
					$("#registros").append(txt);
					$("#exporttxt").click();
					
				
			   } ); */
			 $("#upload").focus(function(e) {
			      readDirectorio ( "datosRuta" ) ;
				  $(this).change();
			  });
				  
			 $("#upload").change(function(e) {
			   var filename =   $(this).val();
			   if (!(filename==null)) {
				   readFile (filename,geodb,asignaDataBase);
				  
			  }
		});
             $("#papelera").click(function(e) {
			        L.DomEvent.stopPropagation(e);
			        db = borrarDB(db);
			   } );
			
			 $("#locate").click(function(e) {
			        map.off('locationfound',onPositionFound);
			        map.on('locationfound', onLocationFound);
			        L.DomEvent.stopPropagation(e);
					map.locate({watch:true ,maximumAge:30000,setView:true, maxZoom:16,enableHighAccuracy:true});   
                    //enableHighAccuracy:true					
            });
            
			$("#posicion").click(function(e) {
			        map.off('locationfound', onLocationFound);
					map.on('locationfound',onPositionFound);
			        L.DomEvent.stopPropagation(e);
					map.locate({watch:true ,setView: true, maxZoom:16,enableHighAccuracy:true});   
                    //enableHighAccuracy:true					
            });
          
	        
            
            var circle;
            var marker;
            var markposition;
            
            map.setView([41.64, -0.87], 10);
			
			zoomactual=map.getZoom();
			center = map.getCenter(); 
         
            L.control.zoom({
                position:'bottomright'
            }).addTo(map);	
           
            var layerGroup = L.layerGroup().addTo(map);  
		    var results = L.featureGroup();
            
            var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma", {
                layers: "OI.OrthoimageCoverage",//layer name (see get capabilities)
                format: 'image/png',
                transparent: true,
                version: '1.3.0',//wms version (see get capabilities)
                attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
            }).addTo(layerGroup);
                             
            var openmap= L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                transparent: true,	
                opacity: 0.7,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });
            
             var ignraster = L.tileLayer.wms("http://www.ign.es/wms-inspire/mapa-raster", {
                layers: "mtn_rasterizado",//layer name (see get capabilities)
                format: 'image/png',
                opacity: 0.6,
                transparent: true,
                version: '1.3.0',//wms version (see get capabilities)
                attribution: "Fondo Cedido por © Instituto Geográfico Nacional de España"
            }).addTo(layerGroup);
            
           

                        
            var igntodo = L.tileLayer.wms("http://www.ign.es/wms-inspire/ign-base", {
                layers: "IGNBaseTodo",//layer name (see get capabilities)
                format: 'image/png',
                transparent: true,
                version: '1.3.0',//wms version (see get capabilities)
                attribution: "carreteras. Cedido por © Instituto Geográfico Nacional de España"
            });
                        
           
            var grupo_BASE = {'Raster IGN':ignraster };
            var overlay = { 'Ortofoto PNOA':pnoa,'IGNBASE':igntodo, 'Openmap':openmap};
           
            map.addControl(new L.Control.Layers( overlay,grupo_BASE, {position:'topleft'}));
            L.control.scale({imperial:false}).addTo(map);
			
			  
		 	  /*  formatSuggestion: function(feature){
			       
					return feature.properties.LABELS; // format suggestions like this.
					} */
            
           var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({countries:"ESP"});
           var searchControl = L.esri.Geocoding.geosearch({providers: [arcgisOnline],useMapBounds:false,zoomToResult:false,position:'topleft'}).addTo(map);
            
           
           
            searchControl.on("results", function(data){
			results.eachLayer(function (layer) {
					
				   map.removeLayer(layer);
				 
				  });  
            results.clearLayers();
			searchControl.clear();
			var numResultados = 0;
            for (var i = data.results.length - 1; i >= 0; i--) {
                  markposition= L.marker(data.results[i].latlng,{opacity:1,title:'Marcador de búsqueda',alt:'Marcador de posición'});
                  markposition.bindPopup(data.results[i].text);
                  markposition.addTo(results);
                  numResultados++;
				  
                }
			  
			     results.eachLayer(function (layer) {
					
				   layer.addTo(map);
				 
				  });  
			      if (numResultados == 1 ) {
                      map.setView(markposition.getLatLng(),15);
                  }					  
			   
            });
                       
             

     // var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";
        
              
               
            map.on('zoomstart', function() {
					zoomactual=map.getZoom();
					center = map.getCenter();
				});
      
                     
            map.on('dblclick', function (e) {
              
			  
               if ( marker) {
                    map.removeLayer(marker);
               }     
                marker = L.marker([0, 0],{title:'Centro del radio',alt:'marcador de radio',riseOnHover:true});

                marker.bindPopup("");
                marker.addTo(map);
              
                if ( circle ) {
                    map.removeLayer(circle);
                }
                                
                circle = L.circle([ e.latlng.lat, e.latlng.lng ], 1000, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.4
                }).addTo(map);
                
                            // ----
            

                
                //---
                
                var x,y,z;
                x=  e.latlng.lat;
                y= e.latlng.lng;
                
                             
//.................           
               // circle.bindPopup("coordenadas del centro: "+e.latlng.lat + ", " + e.latlng.lng  );
                marker.setLatLng(e.latlng);
                marker.setPopupContent("Coordenadas gps: " + e.latlng.lat + ", " + e.latlng.lng + "<br />buscando dirección..");
                marker.update();
                marker.openPopup();
                map.panTo(e.latlng);
				map.setView(e.latlng,15);
                //   $.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + e.latlng.lat + "&lon=" + e.latlng.lng + "&json_callback=?",
                $.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + x + "&lon=" + y + "&json_callback=?",
                function (response) {
                    marker.setPopupContent(response.display_name+"<br/> coordenadas: "+x+","+y); 
                    marker.update();
                }
                
                );
               
                    
            });
   // click        
		    
             
           
        	    
		  
     }	 
		    
    
             
