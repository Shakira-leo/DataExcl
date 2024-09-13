$(document).ready(function () {
    $('#desingButton').on('click', function () {
        // Limpiar el contenedor de predimensionamiento
        $('#predimenension').empty();

        // Obtener valores de los inputs
        const obar = parseFloat(document.getElementById("obar").value);
        const bst = parseFloat(document.getElementById("bst").value);
        const bar3 = parseFloat(document.getElementById("bar3").value);
        const cpn = parseFloat(document.getElementById("cpn").value);
        const Art = parseFloat(document.getElementById("Art").value);
        const RL = parseFloat(document.getElementById("RL").value);
        const DBC = parseFloat(document.getElementById("DBC").value);
        const ECC = parseFloat(document.getElementById("ECC").value);
        const RCC = parseFloat(document.getElementById("RCC").value);
        const XX = parseFloat(document.getElementById("XX").value);
        const ass = parseFloat(document.getElementById("ass").value);
        const app = parseFloat(document.getElementById("app").value);
        const ldd = parseFloat(document.getElementById("ldd").value);
        const E = 3.165; // Valor calculado para X1
        const D = 2.5; // Valor fijo para X2
        const C = 41.87; // Valor fijo para X
        const B = 0.062; // Valor calculado para f
        const num = 2.596; // Valor fijo

        // CALCULOS

        // Inicialización de Variables
        let cb = RL;
        let Ktr = Art;
        let db = DBC;
        let X2 = D; // X2 es fijo en 2.5
        let fy = ECC;
        let fc = RCC;
        let Ap = app;
        let Ldmin = ldd;
        let As = ass;

        // Cálculo de X1
        let X1 = (cb + Ktr) / db; // (5 + 0) / 1.58 = 3.165

        // Cálculo de X como el mínimo entre X1 y X2
        let X = Math.min(X1, X2); // Min(3.165, 2.5) = 2.5

        // Cálculo de Ld utilizando la fórmula corregida
        let Ld1 = (fy * obar * bst * bar3 * cpn) / (3.5 * X * Math.pow(fc,0.5)) * db; // (1 * 0.8 * 1 * 4200 * 1.58) / (3.5 * 210 * Math.sqrt(10)) = 418.7

        // Cálculo del factor f
        let f = As / Ap; // 0.62 / 10 = 0.062

        // Cálculo de Ld utilizando la segunda fórmula
        let Ld2 = Ld1 * f; // 0.062 * 2.5 = 25.96

        // Plantilla de la tabla de resultados
        let template = `
                <tr class="text-center">
                    <td>Otras barras</td>
                    <td>t</td>
                    <td>-</td>
                    <td>${obar}</td>
                </tr>
                <tr class="text-center">
                    <td>Barras sin tratamiento superficial</td>
                    <td>e</td>
                    <td>-</td>
                    <td>${bst}</td>
                </tr>
                <tr class="text-center">
                    <td>Barras de 3/4'' y menores</td>
                    <td>s</td>
                    <td>-</td>
                    <td>${bar3}</td>
                </tr>
                <tr class="text-center">
                    <td>Concreto de peso normal</td>
                    <td>A</td>
                    <td>-</td>
                    <td>${cpn}</td>
                </tr>
                <tr class="text-center">
                    <td>Art. 12.2.3</td>
                    <td>Ktr</td>
                    <td>-</td>
                    <td>${Art}</td>
                </tr>
                <tr class="text-center">
                    <td>Recubrimiento lateral</td>
                    <td>cb</td>
                    <td>-</td>
                    <td>${RL}</td>
                </tr>
                <tr class="text-center">
                    <td>Diámetro de la barra corrugada</td>
                    <td>db</td>
                    <td>-</td>
                    <td>${DBC}</td>
                </tr>
                <tr class="text-center">
                    <td>Esfuerzo de compresión del concreto</td>
                    <td>fy</td>
                    <td>-</td>
                    <td>${ECC}</td>
                </tr>
                <tr class="text-center">
                    <td>Esfuerzo de compresión del concreto</td>
                    <td>fc</td>
                    <td>-</td>
                    <td>${RCC}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>x2</td>
                    <td>-</td>
                    <td>${XX}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>As</td>
                    <td>-</td>
                    <td>${ass}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>Ap</td>
                    <td>-</td>
                    <td>${app}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>Ldmin</td>
                    <td>-</td>
                    <td>${ldd}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>X1</td>
                    <td>let X1 = (cb + Ktr) / db;</td>
                    <td>${X1.toFixed(3)}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>X</td>
                    <td>let X = Math.min(X1, X2);</td>
                    <td>${X}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>Ld1</td>
                    <td>let Ld1 = ((BTS * BM * CPN * fy * db) / (3.5 * fc * Math.sqrt(Ap))) * Ldmin;</td>
                    <td>${Ld1.toFixed(2)}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>f</td>
                    <td>f = As / Ap</td>
                    <td>${f.toFixed(3)}</td>
                </tr>
                <tr class="text-center">
                    <td>-</td>
                    <td>Ld2</td>
                    <td>Ld2 = f * X </td> 
                    <td>${Ld2.toFixed(2)}</td>
                </tr>
        `;

        // Insertar la tabla en el contenedor
        $('#predimenension').append(template);
    });
});

