

const divisasFetch = async(url)=>{
    try {
        const res = await fetch(url)
        const data = await res.json()
        return data;
       
    } catch (error) {
        alert(error)
    }
};

const chartFetch = async(url)=>{
    try {       
        const labels = [];
        const res = await fetch(url)
        const data = await res.json().then(response=>{    
            console.log(response)  
            let date = response.serie;
            let daysValue = [];
            let i = 0;
            for(i=0; i<10; i++){
                    daysValue.unshift(date[i].valor);

                    labels.unshift(date[i].fecha.slice(0, 10))
                }
            return daysValue;         
        });

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

const renderChart = async(url)=>{
    try {
        const data = await chartFetch(url);
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
                    switch (value) {
                        case "dolar":                             
                            htmlTemplate("dolar")                                                        
                            renderChart(apiURL);                                                            
                            break;
                            
                        case "euro":  
                            htmlTemplate("euro")                                                                                        
                            renderChart(apiURL);                            
                            break;
                                  
                        default:
                            break;
                    }

                    resultadoHTML.innerHTML = `<h3> Resultado: ${html}<h3/>`;   
                });                       
    });
};
convert();