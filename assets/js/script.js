

let divisasFetch = async(url)=>{
    const res = await fetch(url)
    const data = await res.json()
    return data;
};

let chartFetch = async(divisa)=>{
    try {
        const apiTenDaysBeforeURL = `https://www.mindicador.cl/api/${divisa}/2023`
        
        const res = await fetch(apiTenDaysBeforeURL)
        const data = await res.json().then(response=>{      
            let date = response.serie
            console.log(date)
            let daysValue = []
            let daysDate = []
            let i = 0;
            for(i=0; i<10; i++){
                    daysValue.push(date[i].valor)
                    daysDate.push(date[i].fecha)

                }
            return daysValue ;         
        })
        const labels = []

        const labelsGenerator = ()=>{
            let today = new Date();
            let tenDaysAfter = new Date();
            tenDaysAfter.setDate(today.getDate()-9)
            
            while (today >= tenDaysAfter) {
                labels.push(today.toLocaleDateString())
                today.setDate(today.getDate()-1);
            }
        }
        labelsGenerator();

        console.log(labels)
        const datasets = [
            {
            label: "Ultimos 10 dias",
            borderColor: "rgb(255, 99, 132)",
            data
            }
            ];
            return { labels, datasets };

    } catch (error) {
        alert(error)
        
        }
    }

async function renderChart(divisa) {
    const data = await chartFetch(divisa);
    const config = {
    type: "line",
    data
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
    }

        
let convertir = ()=>{
    let btnConvertir = document.getElementById('btnConvertir');
    const apiURL = 'https://mindicador.cl/api/'

    
    btnConvertir.addEventListener('click', ()=>{
        let montoInput = document.getElementById('monto')
        let divisaInput  = document.getElementById('divisa');
        let html = 0;
        try {
            divisasFetch(apiURL)
                    .then(response=>{
                        let resultadoHTML = document.getElementById('resultado')
                        let monto = Number(montoInput.value)
                        switch (divisaInput.value) {
                            case "dolar":
                                let divisaUSD = response.dolar.valor 
                                html = monto/divisaUSD
                                
                                renderChart("dolar")
                                break;
                                
                            case "euro":
                                let divisaEU = response.euro.valor 
                                html = monto/divisaEU
                                renderChart("euro")
                                break;
                                
                            case "uf":
                                let divisaUF = response.uf.valor 
                                html = monto/divisaUF
                                renderChart("uf")
                                break;               
                                         
                            default:
                                break;
                        }

                        resultadoHTML.innerHTML = `<h3> Resultado: ${html}<h3/>`   
                    })
            
            
    } catch (error) {
        alert(error)
    }
})


}
convertir();