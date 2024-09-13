let datos_m;
$(document).ready(function () {
  document.getElementById("excelFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Tomamos la primera hoja de cálculo
      const sheetName = "datos m";
      const worksheet = workbook.Sheets[sheetName];

      // Convertimos los datos de la hoja a formato JSON
      // [1.5, 'x', 2, '2', 'x', 1, 3, 1, 1, 0.6, 0.7]
      datos_m = XLSX.utils.sheet_to_json(worksheet, { header: ["realb", "", "realh", "bcom", "", "hcom", "area", "lx", "Zx", "ly", "Zy"], range: "H5:R68" });
    };

    reader.readAsArrayBuffer(file);
  });
  const calcs = {};

  document.getElementById("grups").addEventListener("change", function (e) {
    calcs.grups = document.getElementById("grups").value;
    if (calcs.grups == "A") {
      document.getElementById("men").value = 95000;
      document.getElementById("esf").value = 210;
      document.getElementById("ead").value = 145;
      document.getElementById("etp").value = 145;
      document.getElementById("ecp").value = 15;
    }

    if (calcs.grups == "B") {
      document.getElementById("men").value = 75000;
      document.getElementById("esf").value = 150;
      document.getElementById("ead").value = 110;
      document.getElementById("etp").value = 105;
      document.getElementById("ecp").value = 12;
    }

    if (calcs.grups == "C") {
      document.getElementById("men").value = 55000;
      document.getElementById("esf").value = 100;
      document.getElementById("ead").value = 80;
      document.getElementById("etp").value = 75;
      document.getElementById("ecp").value = 8;
    }
  });

  $("#desingButton").on("click", function () {
    $("#predimenension").empty();
    const consDatos = [
      { nombre: "Módulo de elasticidad mínimo", simbolo: "Emin", formula: "-", valor: parseFloat($("#men").val()) },
      { nombre: "Esfuerzo admisible a la flexión", simbolo: "fm", formula: "-", valor: parseFloat($("#esf").val()) },
      { nombre: "Esfuerzo admisible a la compresión paralela", simbolo: "fc", formula: "-", valor: parseFloat($("#ead").val()) },
      { nombre: "Esfuerzo admisible a la tracción paralela", simbolo: "ft", formula: "-", valor: parseFloat($("#etp").val()) },
      { nombre: "Esfuerzo admisible al corte paralela", simbolo: "fv", formula: "-", valor: parseFloat($("#ecp").val()) },
      { nombre: "Longitud efectiva (lef)", simbolo: "lef", formula: "let  = 4 * 1.5;", valor: parseFloat($("#lon").val()) },
      { nombre: "AXIAL", simbolo: "-", formula: "-", valor: parseFloat($("#axi").val()) },
      { nombre: "Momento", simbolo: "-", formula: "-", valor: parseFloat($("#mom").val()) },
      { nombre: "Suponiendo una sección", simbolo: "-", formula: "-", valor: parseFloat($("#sup").val()) },
      { nombre: "AXIAL", simbolo: "-", formula: "-", valor: parseFloat($("#axi1").val()) },
      { nombre: "Longitud efectiva =0.8 Id", simbolo: "-", formula: "let = 0.8 * lon;", valor: (0.8 * parseFloat($("#lon").val())).toFixed(2) },
      { nombre: "Suponiendo una sección", simbolo: "-", formula: "-", valor: parseFloat($("#susc").val()) },
      { nombre: "GRUPO", simbolo: "-", formula: "-", valor: parseFloat($("#grup").val()) },
      { nombre: "AXIAL", simbolo: "-", formula: "-", valor: parseFloat($("#axi2").val()) },
      { nombre: "AXIAL", simbolo: "-", formula: "-", valor: parseFloat($("#axi3").val()) },
      { nombre: "MOMENTO", simbolo: "-", formula: "-", valor: parseFloat($("#mmt").val()) },
      { nombre: "Suponiendo una sección", simbolo: "-", formula: "-", valor: parseFloat($("#spc").val()) },
    ];

    let template = consDatos
      .map(
        (dato) => `
              <tr class="text-center">
                  <td>${dato.nombre}</td>
                  <td>${dato.simbolo}</td>
                  <td>${dato.formula}</td>
                  <td>${dato.valor}</td>
              </tr>
          `
      )
      .join("");

    $("#predimenension").append(template);
    let D125 = 4 * 1.5;

    // datos entrada
    calcs.susc = parseFloat(document.getElementById("susc").value);
    calcs.men = parseFloat(document.getElementById("men").value);

    calcs.sup = parseFloat(document.getElementById("sup").value);
    calcs.spc = parseFloat(document.getElementById("spc").value);
    calcs.excelFile = parseFloat(document.getElementById("excelFile").value);
    calcs.esf = parseFloat(document.getElementById("esf").value);
    calcs.ead = parseFloat(document.getElementById("ead").value);
    calcs.etp = parseFloat(document.getElementById("etp").value);
    calcs.ecp = parseFloat(document.getElementById("ecp").value);
    calcs.lon = parseFloat(document.getElementById("lon").value);
    calcs.axi = parseFloat(document.getElementById("axi").value);
    calcs.mom = parseFloat(document.getElementById("mom").value);
    calcs.axi1 = parseFloat(document.getElementById("axi1").value);
    calcs.log = parseFloat(document.getElementById("log").value);
    calcs.axi2 = parseFloat(document.getElementById("axi2").value);
    calcs.axi3 = parseFloat(document.getElementById("axi3").value);
    calcs.mmt = parseFloat(document.getElementById("mmt").value);
    calcs.grup = parseFloat(document.getElementById("grup").value);

    //FLEXOCOMPRENCIÓN
    calcs.flexcom_b = parseFloat(datos_m[calcs.sup].bcom);
    calcs.FC1_cm = calcs.flexcom_b * 2.54;
    calcs.flexcom_d = parseFloat(datos_m[calcs.sup].hcom);
    calcs.FC2_cm = calcs.flexcom_d * 2.54;
    calcs.flexcom_A = parseFloat(datos_m[calcs.sup].area);
    calcs.flexcom_lx = parseFloat(datos_m[calcs.sup].lx);
    calcs.flexcom_Zx = parseFloat(datos_m[calcs.sup].Zx);
    calcs.cint = (calcs.lon * 100) / calcs.FC2_cm;
    calcs.colum_FC = calcs.cint < 10 ? "Columna corta" : calcs.cint > 10 ? "Columna intermedia" : "Columna larga";
    calcs.ck = calcs.grup;
    calcs.F_crt = calcs.ead * calcs.flexcom_A;
    calcs.F_int = calcs.ead * calcs.flexcom_A * (1 - (1 / 3) * Math.pow(calcs.cint / calcs.ck, 4));
    calcs.F_lrg = (0.329 * calcs.men * calcs.flexcom_A) / Math.pow(calcs.cint, 2);
    calcs.FC_nadm1 = calcs.cint <= 10 ? calcs.F_crt : calcs.cint <= calcs.ck ? calcs.F_int : calcs.F_lrg;
    calcs.ok1_FC = calcs.FC_nadm1 < calcs.axi ? "Cambiar sección" : "ok";
    calcs.eep = (Math.pow(Math.PI, 2) * calcs.men * calcs.flexcom_lx) / Math.pow(calcs.lon * 100, 2);
    calcs.cef_FC = 1 / (1 - 1.5 * (calcs.axi / calcs.eep));
    calcs.ok2_FC = calcs.axi / calcs.F_lrg + (calcs.cef_FC * calcs.mom * 100) / (calcs.flexcom_Zx * calcs.esf);
    calcs.ok_fc = calcs.ok2_FC > 1 ? "Cambiar sección" : "ok";
    calcs.esp = calcs.cint * calcs.FC1_cm;
    calcs.usar1 = `${calcs.flexcom_b}x${calcs.flexcom_d}`;

    //COMPRENCION
    calcs.comp_b = parseFloat(datos_m[calcs.susc].bcom);
    calcs.C1_cm = calcs.comp_b * 2.54;

    calcs.comp_d = parseFloat(datos_m[calcs.susc].hcom);
    calcs.C2_cm = calcs.comp_d * 2.54;

    calcs.comp_A = parseFloat(datos_m[calcs.susc].area);

    calcs.comp_lx = parseFloat(datos_m[calcs.susc].lx);

    calcs.comp_Zx = parseFloat(datos_m[calcs.susc].Zx);

    calcs.colum1 = (calcs.log * 100) / calcs.C1_cm;

    calcs.coIn1 = calcs.colum1 < 10 ? "Columna corta" : calcs.colum1 > 10 ? "Columna intermedia" : "Columna larga";

    calcs.c1_int = calcs.grup;

    calcs.coIn2 = calcs.colum1 < 10 ? "Columna corta" : calcs.colum1 > 10 ? "Columna intermedia" : "Columna larga";

    calcs.C_crt = calcs.ead * calcs.comp_A;

    calcs.C_int = calcs.ead * calcs.comp_A * (1 - (1 / 3) * Math.pow(calcs.colum1 / calcs.c1_int, 4));

    calcs.C_lrg = (0.329 * calcs.men * calcs.comp_A) / Math.pow(calcs.colum1, 2);

    calcs.C_nadm = calcs.colum1 <= 10 ? calcs.C_crt : calcs.colum1 <= calcs.c1_int ? calcs.C_int : calcs.C_lrg;

    calcs.ok_C = calcs.C_nadm < calcs.esp ? "Cambiar sección" : "ok";

    calcs.usar2 = `${calcs.comp_b}x${calcs.comp_d}`;

    //TRACCION
    calcs.A_trac = calcs.etp * calcs.comp_A;

    calcs.trac = calcs.axi2;

    calcs.trac5 = calcs.A_trac > calcs.trac ? "ok" : "Cambiar sección";
    //FLEXOTRACCION
    calcs.FT_b = parseFloat(datos_m[calcs.spc].bcom);
    calcs.cm3_FT = calcs.FT_b * 2.54;

    calcs.FT_d = parseFloat(datos_m[calcs.spc].hcom);
    calcs.cm4_FT = calcs.FT_d * 2.54;

    calcs.FT_A = parseFloat(datos_m[calcs.spc].area);

    calcs.FT_lx = parseFloat(datos_m[calcs.spc].lx);

    calcs.FT_Zx = parseFloat(datos_m[calcs.spc].Zx);
    calcs.dond = calcs.axi3 / (calcs.etp * calcs.FT_A) + (calcs.mmt * 100) / (calcs.FT_Zx * calcs.esf);

    calcs.ok_FT = calcs.dond < 1 ? "ok" : "Cambiar sección";

    calcs.FT_elmt = `${calcs.FT_b}x${calcs.FT_d}`;

    const salidas = `
                                        
  
    <tr class="bg-gray-200 dark:bg-gray-700">
          <th colspan="4" class="text-left py-2 px-4 font-bold">FLEXOCOMPRENSIÓN</th>
  </tr>
  <tr class="bg-gray-500 text-white dark:bg-gray-500 dark:text-white">
                                          <th class="text-lg py-4 px-4" scope="col">Nombre</th>
                                          <th class="text-lg py-4 px-4" scope="col">Símbolo</th>
                                          <th class="text-lg py-4 px-4" scope="col">Fórmula</th>
                                          <th class="text-lg py-4 px-4" scope="col">Resultado</th>
                                      </tr>
  
     <tr class="bg-gray-100 dark:bg-gray-600 text-center">
      <td class="py-2 px-4 text-center">b =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.flexcom_b} pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
      <td class="py-2 px-4 text-center">d =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.flexcom_d} pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
      <td class="py-2 px-4 text-center">A =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.flexcom_A} cm2</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
      <td class="py-2 px-4 text-center">lx =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.flexcom_lx} cm4</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
      <td class="py-2 px-4 text-center">Zx =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.flexcom_Zx} cm3</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
    <td class="py-2 px-4 text-center">b</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center"></td>
    <td class="py-2 px-4text-center">${calcs.FC1_cm}cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600 text-center">
    <td class="py-2 px-4 text-center">d</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">${calcs.FC2_cm}cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Esbeltez:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.cint.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.colum_FC}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Ck =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.ck}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Columnas cortas</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">λ &lt; 10</td>
      <td class="py-2 px-4 text-center">${calcs.F_crt}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Columnas intermedias</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">10&lt; λ &lt;Ck</td>
      <td class="py-2 px-4 text-center">${calcs.F_int.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Columnas largas</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">Ck&lt; λ &lt;50</td>
      <td class="py-2 px-4 text-center">${calcs.F_lrg.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Nadm</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FC_nadm1.toFixed(2)} ${calcs.ok_C}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.ok1_FC}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Carga Crítica de Euler</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.eep.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Cuando existe Flexión</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.cef_FC.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Entonces tienes</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.ok2_FC.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.ok_fc}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">espaciamiento_correas</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.esp}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Usar:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.usar1}pulg</td>
  </tr>
  
  <tr class="bg-gray-200 dark:bg-gray-700">
      <th colspan="4" class="text-left py-2 px-4 font-bold">COMPRENSIÓN</th>
  </tr>
  <tr class="bg-gray-500 text-white dark:bg-gray-500 dark:text-white">
                                          <th class="text-lg py-4 px-4" scope="col">Nombre</th>
                                          <th class="text-lg py-4 px-4" scope="col">Símbolo</th>
                                          <th class="text-lg py-4 px-4" scope="col">Fórmula</th>
                                          <th class="text-lg py-4 px-4" scope="col">Resultado</th>
                                      </tr>
    <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">longitud efec</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.log}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">b=</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_b}pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">d =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_d}pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">A=</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_A}cm2</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Ix=</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_lx}cm4</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Zx =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_Zx}cm3</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">b</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.C1_cm}cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">d</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.C2_cm}cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Esbeltez:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.colum1.toFixed(2)}</td>
  </tr>
   <tr class="bg-gray-100 dark:bg-gray-600">
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">${calcs.coIn1}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Ck =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.c1_int}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">${calcs.coIn2}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
  <td class="py-2 px-4 text-center">Columnas cortas</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">λ &lt; 10</td>
      <td class="py-2 px-4 text-center">${calcs.C_crt}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
  <td class="py-2 px-4 text-center">Columnas intermedias</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">10&lt; λ &lt;Ck</td>
      <td class="py-2 px-4 text-center">${calcs.C_int.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Columnas largas</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">Ck&lt; λ &lt;50</td>
      <td class="py-2 px-4 text-center">${calcs.C_lrg.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">-</td>
    <td class="py-2 px-4 text-center">${calcs.trac5}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Nadm</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.C_nadm.toFixed(2)}kg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Usar:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.usar2}pulg</td>
  </tr>
  
  
  
  <tr class="bg-gray-200 dark:bg-gray-700">
     <th colspan="4" class="text-left py-2 px-4 font-bold">TRACCIÓN</th>
  </tr>
  <tr class="bg-gray-500 text-white dark:bg-gray-500 dark:text-white">
                                          <th class="text-lg py-4 px-4" scope="col">Nombre</th>
                                          <th class="text-lg py-4 px-4" scope="col">Símbolo</th>
                                          <th class="text-lg py-4 px-4" scope="col">Fórmula</th>
                                          <th class="text-lg py-4 px-4" scope="col">Resultado</th>
                                      </tr>
  
  
  
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">AXIAL </td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">&gt;</td>
      <td class="py-2 px-4 text-center">${calcs.trac}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">NftA</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.A_trac}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">ok</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.trac}</td>
  </tr>
  
  
     <tr class="bg-gray-200 dark:bg-gray-700">
       <th colspan="4" class="text-left py-2 px-4 font-bold">FLEXOTRACCIÓN</th>
  </tr>
  <tr class="bg-gray-500 text-white dark:bg-gray-500 dark:text-white">
                                          <th class="text-lg py-4 px-4" scope="col">Nombre</th>
                                          <th class="text-lg py-4 px-4" scope="col">Símbolo</th>
                                          <th class="text-lg py-4 px-4" scope="col">Fórmula</th>
                                          <th class="text-lg py-4 px-4" scope="col">Resultado</th>
                                      </tr>
  
  
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.trac5}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">b =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_b}pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">d =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_d}pulg</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">A =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_A}cm2</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Ix =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_lx}cm4</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Zx =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_Zx}cm3</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">b =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.cm3_FT}cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">d =</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.cm4_FT} cm</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Donde:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">&lt;</td>
      <td class="py-2 px-4 text-center">${calcs.dond.toFixed(2)}</td>
  </tr>
  <tr class="bg-gray-100 dark:bg-gray-600">
      <td class="py-2 px-4 text-center">Usar:</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">-</td>
      <td class="py-2 px-4 text-center">${calcs.FT_elmt}pulg</td>
  </tr>
  
      `;
    $("#predimenension").append(salidas);
  });
});
