

const divisasFetch = async(url)=>{
    try {
        const res = await fetch(url)
        console.log(res)
        const data = await res.json()
        return data;
       
    } catch (error) {
        alert(error)
    }
};

const chartFetch = async(response)=>{
    try {       
        const labels = [];
        const data = [];
        const dataGenerator = ()=>{
            let date = response.serie;
            let daysValue = [];
           let i = 0;
           for(i=0; i<10; i++){
                   data.unshift(date[i].valor);
                   labels.unshift(date[i].fecha.slice(0, 10))
               }         
        }
        dataGenerator();   
        
        const datasets = [
            {
            label: "Ultimos 10 dias",
            borderColor: "rgb(255, 99, 132)",
            data
            }
            ];
            
            return { labels, datasets };

    } catch (error) {
        alert(error);       
        };
};

const renderChart = async(response)=>{
    try {
        const data = await chartFetch(response);
        const config = {
        type: "line",
        data
        };        

        let chartStatus = Chart.getChart("myChart"); 
        if (chartStatus != undefined) {
        chartStatus.destroy();
        }
        let myChart = document.getElementById("myChart");
        myChart.style.backgroundColor = "white";
        new Chart(myChart, config);     

    } catch (error) {
        alert(error);
    };
};
        
const convert = ()=>{
    let btnConvertir = document.getElementById('btnConvertir');
    
    btnConvertir.addEventListener('click', async()=>{
        let montoInput = document.getElementById('monto')
        let divisaInput  = document.getElementById('divisa');
        let {value} = divisaInput;
        const apiURL = `https://mindicador.cl/api/${value}`
        let html = 0;
        
        await divisasFetch(apiURL)
                .then(response=>{
                    let resultadoHTML = document.getElementById('resultado');
                    let monto = Number(montoInput.value);
                    let htmlTemplate = ()=>{
                        let divisaValor = response.serie[0].valor;                     
                        html = (monto/divisaValor).toFixed(3);                                                          
                    };
                    if(value != "placeholder") {                       
                        htmlTemplate()                                                        
                        renderChart(response);                                                            
                    }else{
                        alert("no haz seleccionado ninguna divisa")
                        return;
                    }
                    resultadoHTML.innerHTML = `<h3> Resultado: ${html}<h3/>`;   
                });                       
    });
};
convert();