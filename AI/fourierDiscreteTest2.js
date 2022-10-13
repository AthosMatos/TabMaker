const SamplesAmount = 8
const SamplingRate = SamplesAmount

const hzInterval = SamplingRate / SamplesAmount

const amplitudeSamples = [0,0.707,1,0.707,0,-0.707,-1,-0.707]

const w = (k,j) =>
{
    return (-(2 * Math.PI * k * j)/SamplesAmount)
}
let interval = 0
let values = []

for(let k = 0; k < SamplesAmount; k++)
{
    let s1 = 0
    let s2 = 0

    for(let j = 0; j < SamplesAmount; j++)
    {
        const sum1 = amplitudeSamples[j] * Math.cos(w(k,j))
        const sum2 = amplitudeSamples[j] * Math.sin(w(k,j))
 
        s1 = parseFloat(s1.toFixed(3)) + parseFloat(sum1.toFixed(3))
        s2 = parseFloat(s2.toFixed(3)) + parseFloat(sum2.toFixed(3))  

        console.log(sum1.toFixed(3),sum2.toFixed(3))
    }

    const fvalue = Math.sqrt(Math.pow(s1,2) + Math.pow(s2,2))
    
    if(k >= (SamplingRate/2))
    {
        for(let i = 0;i<values.length;i++)
        {
            values[i].amp *= 2
        }
        break
    }
    values.push({hz:interval,amp:fvalue})
    //console.log('k',k,'(Sampling/2)',(Sampling/2))
    //console.log(`${interval}hz --- amplitude ${fvalue}`)
    interval+=hzInterval
}

console.log(values)