function equation_X(k,m,N) 
{
    const result = (-(2*Math.PI * k * m)) / (N / 4)
    return result;
}

function equation_X2(k,N)
{
    const result = (-(4 * Math.PI * k)) / N
    return result;
}
function equation_X22(k,N)
{
    const result = (-(2 * Math.PI * k)) / N
    return result;
}

function EulersFormula(j,x)
{
    const result = Math.cos(x) + (j*Math.sin(x))
    return result;
}

let N
let x = []

var freqsEven = []
var freqsOdd = []
var freqs = []

if (k > (N/2))
{
    
}
else
{
    var x0, x1, x2, x3

    for(let m = 0 ;m < ((N/2)-1);m++)
    {
        x0 = x[4*m] * EulersFormula(j,equation_X(k,m,N))
        x1 = x[4*m+1] * EulersFormula(j,equation_X(k,m,N))
        x2 = x[4*m+2] * EulersFormula(j,equation_X(k,m,N))
        x3 = x[4*m+3] * EulersFormula(j,equation_X(k,m,N))
    }

    const freqEven = x0 + (EulersFormula(j,equation_X2(k,N)) * x2)
    freqsEven.push(freqEven)

    const freqOdd = (EulersFormula(j,equation_X22(k,N)) * (x1 + (EulersFormula(j,equation_X2(k,N)) * x3)))
    freqsOdd.push(freqOdd)

    const currentFreq = freqEven + freqOdd
    freqs.push(currentFreq)
}




