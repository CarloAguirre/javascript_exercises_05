

const divisasFetch = async(url)=>{
    try {
        const res = await fetch(url)
        const data = await res.json()
        return data;
       
    } catch (error) {
        alert(error)
    }
};

const chartFetch = async(divisa)=>{
    try {
        const apiTenDaysBeforeURL = `https://www.mindicador.cl/api/${divisa}/2023`
        
        const res = await fetch(apiTenDaysBeforeURL)
        const data = await res.json().then(response=>{      
            let date = response.serie;
            let daysValue = [];
            let i = 0;
            for(i=0; i<10; i++){
                    daysValue.unshift(date[i].valor);
                }
            return daysValue;         
        })
        const labels = [];

        const labelsGenerator = ()=>{
            let today = new Date();
            let tenDaysAfter = new Date();
            tenDaysAfter.setDate(today.getDate()-9);
            
            while (today >= tenDaysAfter) {
                labels.unshift(today.toLocaleDateString());
                today.setDate(today.getDate()-1);
            };
        };
        labelsGenerator();

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

const renderChart = async(divisa)=>{
    try {
        const data = await chartFetch(divisa);
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
                    let htmlTemplate = (divisa)=>{
                        let divisaValor = response.serie[0].valor;                     
                        html = (monto/divisaValor).toFixed(3);                                                          
                        renderChart(divisa);   
                    };
                    switch (value) {
                        case "dolar":                             
                            htmlTemplate("dolar")                                                        
                            renderChart("dolar");                                                            
                            break;
                            
                        case "euro":  
                            htmlTemplate("euro")                                                                                        
                            renderChart("euro");                            
                            break;
                            
                        case "uf":
                            htmlTemplate("uf") 
                            renderChart("uf");
                            break;               
                                        
                        default:
                            break;
                    }

                    resultadoHTML.innerHTML = `<h3> Resultado: ${html}<h3/>`;   
                });                       
    });
};
convert();