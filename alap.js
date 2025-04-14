let long = document.getElementById("long").value;
let lat = document.getElementById("lat").value;

fetchFuggveny();

function fetchFuggveny() {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`)
    .then(x => x.json())
    .then(y => megjelenit(y));

}


function megjelenit(y) {
    console.log(y);


    document.getElementById("koordinatak").innerHTML = `Szélesség: ${y.longitude} Hosszúság: ${y.latitude}`;

    let sz = `

    <table>
        <tr>
            <th>Dátum</td>
            <th>Idő</td>
            <th>Hőmérséklet</td>
        </tr>
    `;


    for (let i = 0; i < y.hourly.time.length; i++) {
            let kecske = y.hourly.time[i].split('T');

            if (i % 2 != 0) {
                sz += `
            <tr>
                <td>${kecske[0]}</td>
                <td>${kecske[1]}</td>
                <td>${y.hourly.temperature_2m[i]}</td>
            </tr>
            `
            } else {
                sz += `
            <tr>
                <td style="background-color: white">${kecske[0]}</td>
                <td style="background-color: white">${kecske[1]}</td>
                <td style="background-color: white">${y.hourly.temperature_2m[i]}</td>
            </tr>
            `
            }
            
        
    }

    sz += "</table>"
    document.getElementById("tablazat").innerHTML = sz;

    //Diagram óránként

    var data = [
        {
          x: y.hourly.time,
          y: y.hourly.temperature_2m,
          type: 'bar'
        }
      ];
      
      Plotly.newPlot('myDiv', data);

      //Diagram minhőmérséklet
      let minIdoTomb = [];
      let minHomTomb = [];

      let legkisebbIdo=y.hourly.time[0]
    let legkisebbHom=y.hourly.temperature_2m[0]

    for (let i = 0; i < y.hourly.time.length; i++) {
        if (i%24!=0 &&  y.hourly.temperature_2m[i]<legkisebbHom){
            kecske=y.hourly.time[i].split("T")
            legkisebbIdo=kecske[0]
            //legkisebbIdo= y.hourly.time[i]
            legkisebbHom=y.hourly.temperature_2m[i]
        }
        if ((i%24==0 && i!=0) || i==y.hourly.time.length-1){
            console.log(i+legkisebbIdo+legkisebbHom)
            minIdoTomb.push( legkisebbIdo)
            minHomTomb.push( legkisebbHom)
            legkisebbIdo=y.hourly.time[i]
            legkisebbHom=y.hourly.temperature_2m[i]
            
        }
        
    }

    console.log(minIdoTomb)
    console.log(minHomTomb)
    var dataMin = [
        {
          x: minIdoTomb,
          y: minHomTomb,
          type: 'bar'
        }
      ];
      
      Plotly.newPlot('minDiv', dataMin);


    //Maximum diagram

    let maxIdoTomb = [];
    let maxHomTomb = [];
    let legnagyobbHom = y.hourly.temperature_2m[0];
    let legnagyobbIdo = "";


    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 24; j++) {
            if (y.hourly.temperature_2m[i * 24 + j] > legnagyobbHom) {
                legnagyobbHom = y.hourly.temperature_2m[i *24 + j];
                kecske = y.hourly.time[i * 24 + j].split('T');
                legnagyobbIdo = kecske[0];

            }
            
        }

        maxIdoTomb.push(legnagyobbIdo);
        maxHomTomb.push(legnagyobbHom);
        legnagyobbHom = y.hourly.temperature_2m[0];
        legnagyobbIdo = "";
        
    }

    var dataMax = [
    {
        x: maxIdoTomb,
        y: maxHomTomb,
        type: 'bar'
    }
    ];
      
    Plotly.newPlot('maxDiv', dataMax);
      
    //összehasonlít min és max

    var trace1 = {
        x: minIdoTomb,
        y: minHomTomb,
        marker: {
            color: 'blue'
          },
        name: "minimum hőmérsékletek",
        type: 'bar'
    };
      
    var trace2 = {
        x: maxIdoTomb,
        y: maxHomTomb,
        marker: {
            color: 'red'
          },
        name: "maximum hőmérsékletek",
        type: 'bar'

    };
      
    var dataHasonlit = [trace1, trace2];
      
    var layout = {barmode: 'group'};
      
    Plotly.newPlot('hasonlitDiv', dataHasonlit, layout);


    //térkép


    var dataTerkep = [
            {
                type: "scattermap",
                text: "Szöveg",
                lon: [long],
                lat: [lat],
                marker: { color: "fuchsia", size: 4 }
            }
    ];

    var layout = {
        dragmode: "zoom",
        map: { style: "open-street-map", center: { lat: lat, lon:  long}, zoom: 10 },
        margin: { r: 0, t: 0, b: 0, l: 0 }
    };

    Plotly.newPlot("myDivTerkep", dataTerkep, layout);
}
    
function keres() {
    let ujLat = document.getElementById("lat").value
    let ujLong = document.getElementById("long").value

    lat = ujLat;
    long = ujLong;
    fetchFuggveny();
}







