import { CurrentNote } from "./SoundHandler"

export const corda6 = 0, corda5 = 1, corda4 = 2, corda3 = 3, corda2 = 4, corda1 = 5
export const STDFreqRef = 16.35

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

export const STDtunning = ['E2','A2','D3','G3','B3','E4']
export const STDTrastes = 22

export var lastCorda,lastCasa

export const GetPossibleGuitarNotes = (tunning ,trastes)=>
{
    //using A0 as ref
    var Cordas = {}
    for(let corda = 0; corda < tunning.length; corda++)
    {
        var Casas = {}

        for(let casa = 0;casa <trastes; casa++)
        {
            let mathIndex = 0
            while(true)
            {
                if(FindNote(STDFreqRef * Math.pow((Math.pow(2,1/12)),mathIndex)) === tunning[corda]) break
                mathIndex++
            }
            for(let casa = 0; casa < trastes; mathIndex++,casa++)
            {
                const Freqcalc = (STDFreqRef * Math.pow((Math.pow(2,1/12)),mathIndex))
                Casas[casa] = {note:FindNote(Freqcalc),freq:Freqcalc}
            }
        }
        Cordas[corda] = Casas
    }
    return Cordas
}

export const GetMinAndMaxGuitarFreqs = (tunning ,trastes)=>
{
    //using A0 as ref
    var Min
    var Max

    Min = FindFreq(tunning[0]).freq
    Max = STDFreqRef * Math.pow((Math.pow(2,1/12)), trastes + FindFreq(tunning[5]).mathIndex)

    return [Min,Max]
}

export const FindNote = (Freq)=>
{
    const n = Math.log10(Freq/STDFreqRef).toFixed(3) / Math.log10(Math.pow(2,1/12)).toFixed(3)

    let n2 = (n/12).toFixed(3).toString()
    const x = n2.split('.')

    let s = 0

    if(x.length > 1)
    {
        s = (parseInt(x[1]) * (Math.pow(10,-x[1].length + 2).toFixed(3))).toFixed(3)
        s = ((s*12)/100)
    }
    return NotesRef[parseInt(s)][0]+x[0]
}

export const FindFreq = (Note)=>
{
    const bedRockLimit = 7902.13
    let mathIndex = 0
    while(true)
    {
        const freq = STDFreqRef * Math.pow((Math.pow(2,1/12)),mathIndex)
        if(FindNote(freq) == Note)
        {
            return {freq,mathIndex};
        }
        else if(freq>=bedRockLimit) return {freq,mathIndex};
    }   
}

export const FingerPos = () =>
{
    let MenorPeso = undefined
    let BestPos = {}

    for(let corda = 5 ; corda >= 0; corda--)
    {
        for(let casa = 0; casa < 22 ;casa++)
        {
            const analysingNote = PossibleGuitarNotes[corda][casa].note
            if(analysingNote === CurrentNote)
            {
                const currPeso = corda + lastCorda + casa + lastCasa
                if(MenorPeso == undefined || currPeso < MenorPeso) 
                {
                    MenorPeso = currPeso
                    BestPos = {corda,casa}
                    lastCorda = corda
                    lastCasa = casa
                }
               
                //console.log('pesoDistCorda',corda+lastCorda, 'pesoDistCasa', casa + lastCasa)
                //console.log('peso',currPeso)
                //console.log(`Nota ${analysingNote} corda ${corda + 1} casa ${casa}`)
            }
        }
    }
    return BestPos
}

export const Easyest = () =>
{
    //PossibleGuitarNotes = GetPossibleGuitarNotes(STDtunning,STDTrastes)
    //CurrentNote = 'E2'
    //lastCorda = 0
    //lastCasa = 0

    //console.log('currentNote',currentNote,FingerPos())

    //currentNote = 'B2'

    //console.log('currentNote',currentNote,FingerPos())

    //currentNote = 'E3'
   
    //console.log('currentNote',currentNote,FingerPos())
}

export const PossibleGuitarNotes = GetPossibleGuitarNotes(STDtunning,STDTrastes)