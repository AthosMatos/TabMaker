export const NotesRef = 
[
    ['C',16.35],
    ['C#',17.32],
    ['D',18.35],
    ['D#',19.45],
    ['E',20.60],
    ['F',21.83],
    ['F#',23.12],
    ['G',24.50],
    ['G#',25.96],
    ['A',27.50],
    ['A#',29.14],
    ['B',30.87],
]
export const corda6 = 0, corda5 = 1, corda4 = 2, corda3 = 3, corda2 = 4, corda1 = 5
export const STDFreqRef = NotesRef[0][1]

export const GetPossibleGuitarNotes = (tunning,trastes)=>
{
    var STDtunning
    var numTrastes

    if(trastes)numTrastes = trastes
    else numTrastes = 22

    if(tunning)STDtunning = tunning
    else STDtunning = ['E2','A2','D3','G3','B4','E4']

    //using A0 as ref
    var AllPossibilities = []
    for(let index = 0; index < STDtunning.length; index++)
    {
        var PossibilitiesCorda = []
        for(let i = 0;; i++)
        {
            //console.log('notes2')
            //if(STDtunning[index])console.log('STDtunning[index]',STDtunning[index])
            let note = FindNote(STDFreqRef * Math.pow((Math.pow(2,1/12)),i))
            //if(note)console.log('Note',note)
            if(note == STDtunning[index])
            {
                for(let i2 = i ; i2 < numTrastes + i; i2++)
                {
                    PossibilitiesCorda.push([FindNote(STDFreqRef * Math.pow((Math.pow(2,1/12)),i2)),STDFreqRef * Math.pow((Math.pow(2,1/12)),i2)])
                }
                break
            }
        }
        AllPossibilities.push([STDtunning[index],PossibilitiesCorda])
    }
    return AllPossibilities
}

export const GetPossibleGuitarNotesv2 = (tunning,trastes)=>
{
    var STDtunning = undefined
    var numTrastes = undefined

    if(trastes)numTrastes = trastes
    else numTrastes = 22

    if(tunning)STDtunning = tunning
    else STDtunning = ['E2','A2','D3','G3','B3','E4']

    //using A0 as ref
    var Cordas = {}
    for(let corda = 0; corda < STDtunning.length; corda++)
    {
        var Casas = {}

        for(let casa = 0;casa <numTrastes; casa++)
        {
            let mathIndex = 0
            while(true)
            {
                if(FindNote(STDFreqRef * Math.pow((Math.pow(2,1/12)),mathIndex)) === STDtunning[corda]) break
                mathIndex++
            }
            for(let casa = 0; casa < numTrastes; mathIndex++,casa++)
            {
                const Freqcalc = (STDFreqRef * Math.pow((Math.pow(2,1/12)),mathIndex))
                Casas[casa] = {note:FindNote(Freqcalc),freq:Freqcalc}
            }
        }
        Cordas[corda] = Casas
    }
    return Cordas
}

export const GetMinAndMaxGuitarNotes = ({tunning,trastes})=>
{
    var STDtunning = []
    
    var numTrastes

    if(trastes)numTrastes = trastes
    else numTrastes = 22

    if(tunning)STDtunning = tunning
    else STDtunning = ['E2','A2','D3','G3','B4','E4']

    //using A0 as ref
    var Min 
    var Max

    for(let i = 0;; i++)
    {
        //if(STDtunning[index])console.log('STDtunning[index]',STDtunning[index])
        const freq = STDFreqRef * Math.pow((Math.pow(2,1/12)),i)
        let note = FindNote(freq)
        //if(note)console.log('Note',note)
        if(note == STDtunning[0])
        {
            Min = freq
            break
        }
    }
    for(let i = 0;; i++)
    {
        //if(STDtunning[index])console.log('STDtunning[index]',STDtunning[index])
        const freq = STDFreqRef * Math.pow((Math.pow(2,1/12)),i)
        let note = FindNote(freq)
        //if(note)console.log('Note',note)
        if(note == STDtunning[STDtunning.length - 1])
        {
            Max = STDFreqRef * Math.pow((Math.pow(2,1/12)),22 + i)
            break
        }
    }   
    
    return [Min,Max]
}

export const FindNote = (Freq)=>
{

    let n = (Math.log10(Freq/STDFreqRef).toFixed(3) / Math.log10(Math.pow(2,1/12)).toFixed(3))

    let x = (n/12).toFixed(3).toString()

    x = x.split('.')

    //console.log(x)

    let s = 0
    if(x.length > 1)
    {
        s = (parseInt(x[1]) * (Math.pow(10,-x[1].length + 2).toFixed(3))).toFixed(3)
        s = ((s*12)/100)
    }

    //console.log(s)

    return NotesRef[parseInt(s)][0]+x[0]
}

export const ClosestFinger = (Note,PossibleGuitarNotes) =>
{
    //console.log(Note)
    let string = 0
    let fret = 0;
    for(let index = 0; index<PossibleGuitarNotes.length;index++)
    {
        const GN = PossibleGuitarNotes[index]
        fret = 0
        for(let i = 0; i < GN[1].length; i++,fret++)
        {
            if(GN[1][i][0] == Note)
            {
                //console.log('found')
                return [string,fret]  
            }
        }
        string++
    }
    //console.log(string,fret)
}
