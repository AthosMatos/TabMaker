//perceptron to see if sound is a G MAJOR CHORD

//notes heard - separeted by the fourier sequencing
//each binary value is a string value to the G MAJOR chord //sol maior
//ORDER = 6th string to the 1th
//STRINGS (E-B-C-D-A-E) 
//which is G-D-G-D-C-G

const training = [
    {binValue:[0,0,0,0,0,0],itsG:0}, 
    {binValue:[0,0,0,0,0,1],itsG:0}, 
    {binValue:[0,0,0,0,1,0],itsG:0}, 
    {binValue:[0,0,0,0,1,1],itsG:1}, 
    {binValue:[0,0,0,1,0,0],itsG:0}, 
    {binValue:[0,0,0,1,0,1],itsG:1}, 
    {binValue:[0,0,0,1,1,0],itsG:1}, 
    {binValue:[0,0,0,1,1,1],itsG:1}, 

    {binValue:[0,0,1,0,0,0],itsG:0}, 
    {binValue:[0,0,1,0,0,1],itsG:0}, 
    {binValue:[0,0,1,0,1,0],itsG:0}, 
    {binValue:[0,0,1,0,1,1],itsG:1}, 
    {binValue:[0,0,1,1,0,0],itsG:0}, 
    {binValue:[0,0,1,1,0,1],itsG:1}, 
    {binValue:[0,0,1,1,1,0],itsG:1}, 
    {binValue:[0,0,1,1,1,1],itsG:1}, 
    
    {binValue:[0,1,0,0,0,0],itsG:0}, 
    {binValue:[0,1,0,0,0,1],itsG:0}, 
    {binValue:[0,1,0,0,1,0],itsG:0}, 
    {binValue:[0,1,0,0,1,1],itsG:1}, 
    {binValue:[0,1,0,1,0,0],itsG:0}, 
    {binValue:[0,1,0,1,0,1],itsG:1}, 
    {binValue:[0,1,0,1,1,0],itsG:1}, 
    {binValue:[0,1,0,1,1,1],itsG:1}, 

    {binValue:[0,1,1,0,0,0],itsG:0}, 
    {binValue:[0,1,1,0,0,1],itsG:1}, 
    {binValue:[0,1,1,0,1,0],itsG:1}, 
    {binValue:[0,1,1,0,1,1],itsG:1}, 
    {binValue:[0,1,1,1,0,0],itsG:0}, 
    {binValue:[0,1,1,1,0,1],itsG:1}, 
    {binValue:[0,1,1,1,1,0],itsG:0}, 
    {binValue:[0,1,1,1,1,1],itsG:1}, 

    {binValue:[1,0,0,0,0,0],itsG:0}, 
    {binValue:[1,0,0,0,0,1],itsG:0}, 
    {binValue:[1,0,0,0,1,0],itsG:0}, 
    {binValue:[1,0,0,0,1,1],itsG:1}, 
    {binValue:[1,0,0,1,0,0],itsG:0}, 
    {binValue:[1,0,0,1,0,1],itsG:1}, 
    {binValue:[1,0,0,1,1,0],itsG:0}, 
    {binValue:[1,0,0,1,1,1],itsG:1}, 

    {binValue:[1,0,1,0,0,0],itsG:0}, 
    {binValue:[1,0,1,0,0,1],itsG:1}, 
    {binValue:[1,0,1,0,1,0],itsG:0}, 
    {binValue:[1,0,1,0,1,1],itsG:1}, 
    {binValue:[1,0,1,1,0,0],itsG:0}, 
    {binValue:[1,0,1,1,0,1],itsG:1}, 
    {binValue:[1,0,1,1,1,0],itsG:0}, 
    {binValue:[1,0,1,1,1,1],itsG:1}, 
    
    {binValue:[1,1,0,0,0,0],itsG:0}, 
    {binValue:[1,1,0,0,0,1],itsG:1}, 
    {binValue:[1,1,0,0,1,0],itsG:0}, 
    {binValue:[1,1,0,0,1,1],itsG:1}, 
    {binValue:[1,1,0,1,0,0],itsG:0}, 
    {binValue:[1,1,0,1,0,1],itsG:1}, 
    {binValue:[1,1,0,1,1,0],itsG:1}, 
    {binValue:[1,1,0,1,1,1],itsG:1}, 

    {binValue:[1,1,1,0,0,0],itsG:1}, 
    {binValue:[1,1,1,0,0,1],itsG:1}, 
    {binValue:[1,1,1,0,1,0],itsG:0}, 
    {binValue:[1,1,1,0,1,1],itsG:1}, 
    {binValue:[1,1,1,1,0,0],itsG:0}, 
    {binValue:[1,1,1,1,0,1],itsG:1}, 
    {binValue:[1,1,1,1,1,0],itsG:1}, 
    {binValue:[1,1,1,1,1,1],itsG:1}, 
]

let endstate = {}

const TrainNeuron = () =>
{
    let indexesGone = []
    let index = 0
    let bias = 1;
    let w0 = 0;
    const taxa_aprendizado = 0.1
    let ws = []
    let pesos = []
    let epoca = 1
    let valuesEqual = 0
    
    for(let i = 0; i < training[index].binValue.length; i++)
    {
        ws.push(0)
    }

    while(true)
    {
        let xs = []
        
        if(indexesGone.length == training.length)
        {
            endstate = {...pesos[pesos.length-1]}
            //console.log(`epoca ${epoca}`,endstate)
            indexesGone = []
            pesos = []
            index = 0
            epoca++

            if(epoca==11)break
        }
        
        for(let i = 0; i < training[index].binValue.length; i++)
        {
            xs.push(training[index].binValue[i])
        }
       
        let result = 0

        for(let i=0;i<xs.length;i++)
        {
            result += parseFloat(xs[i].toFixed(3)) * parseFloat(ws[i].toFixed(3))
        }
        result +=  bias * w0
        //result += w0
        let idea;

        if(result<0)idea = 0;
        else idea = 1;

        const erro = training[index].itsG - idea;

        if(erro!=0)
        {
            for(let i = 0; i < ws.length; i++)
            {
                ws[i] = parseFloat(ws[i].toFixed(3)) + (taxa_aprendizado*erro*parseFloat(xs[i].toFixed(3)));
            }
            w0 = w0 + parseFloat((taxa_aprendizado*erro*bias).toFixed(3));
            //w0 = w0 + (taxa_aprendizado*erro);
        }
        else
        {
            valuesEqual++;
            let p = {}
            for(let i=0;i<ws.length;i++)
            {
                p = {...p,[`w${i+1}`]:ws[i]}
            }
            p = {...p,bias,w0}
            //p = {...p,w0}
            pesos.push(p)
            for(let i=0;i<ws.length;i++)
            {
                ws[i] = parseFloat(ws[i].toFixed(3))+ (taxa_aprendizado*erro*parseFloat(xs[i].toFixed(3)));
            }
            w0 = w0 + parseFloat((taxa_aprendizado*erro*bias).toFixed(3));
           // w0 = w0 + (taxa_aprendizado*erro);
            indexesGone.push(index) 

            while(true)
            {
                // Returns a random integer from 0 to 10:
                let ranNum = Math.floor(Math.random() * training.length);
                let goTrought = true;

                indexesGone.forEach((v)=>
                {
                    if(ranNum==index)
                    {
                        goTrought = false;
                    }
                })
                if(goTrought){index = ranNum; break;}
            }
           
        }

    }
}

const TestNeuron = (x1,x2,x3,x4,x5,x6) =>
{
    //const result = ((x1*endstate.w1 + x2*endstate.w2 + x3*endstate.w3) + endstate.bias * endstate.w0)
    const result = ((x1*endstate.w1 + x2*endstate.w2 + x3*endstate.w3 + x4*endstate.w4 + x5*endstate.w5 + x6*endstate.w6) + endstate.w0)
  
    if(result<0)console.log(0);
    else console.log(1);

    
}

//console.log(endstate)

for(let i=0;i< 20;i++)
{
    TrainNeuron()
    TestNeuron(0,0,0,1,1,1)
}