export const Notes = [
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
            let note = FindNote(Notes[0][1] * Math.pow((Math.pow(2,1/12)),i))
            //if(note)console.log('Note',note)
            if(note == STDtunning[index])
            {
                for(let i2 = i ; i2 < numTrastes + i; i2++)
                {
                    PossibilitiesCorda.push([FindNote(Notes[0][1] * Math.pow((Math.pow(2,1/12)),i2)),Notes[0][1] * Math.pow((Math.pow(2,1/12)),i2)])
                }
                break
            }
        }
        AllPossibilities.push([STDtunning[index],PossibilitiesCorda])
    }
    return AllPossibilities
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
        const freq = Notes[0][1] * Math.pow((Math.pow(2,1/12)),i)
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
        const freq = Notes[0][1] * Math.pow((Math.pow(2,1/12)),i)
        let note = FindNote(freq)
        //if(note)console.log('Note',note)
        if(note == STDtunning[STDtunning.length - 1])
        {
            Max = Notes[0][1] * Math.pow((Math.pow(2,1/12)),22 + i)
            break
        }
    }   
    
    return [Min,Max]
}

export const closestNote = (Freq)=>
{
   
    let closestNote = ''
    let closestNoteFreq = 8000 //hz max

    for(let i = 0 ;i<Notes.length; i++)
    {
        let RefNumber = Notes[i][1]
        
        for(let i2 = 0; i2 < 9; i2++)
        {
            //console.log('RefNumber' ,RefNumber,'Freq',Freq,'Math.abs' ,Math.abs(RefNumber - Freq))

            if(Math.abs(RefNumber - Freq) < closestNoteFreq)
            {
                closestNoteFreq = Math.abs(RefNumber - Freq)
                closestNote = Notes[i][0] + i2
            }

            RefNumber = RefNumber * 2
            
        }
       // console.log('closestNote '+ closestNote + ' closestNoteFreq ' + closestNoteFreq)
    }
  
    //console.log('closestNote',closestNote)

    return closestNote
    
}

export const FindNote = (Freq)=>
{

    let n = (Math.log10(Freq/Notes[0][1]).toFixed(3) / Math.log10(Math.pow(2,1/12)).toFixed(3))

    let x = (n/12).toFixed(3).toString()

    x = x.split('.')

    //console.log(x)

    let s
    if(x.length > 1)
    {
        s = (parseInt(x[1]) * (Math.pow(10,-x[1].length + 2).toFixed(3))).toFixed(3)
        s = ((s*12)/100)
    }
    else s = 0

    //console.log(s)

    return Notes[parseInt(s)][0]+x[0]
}

export const ClosestFinger = (Note,PossibleGuitarNotes) =>
{
    //console.log(Note)
    let string = 0
    let fret = 0;
    for(let index = 0; index<PossibleGuitarNotes.length;index++)
    {
        const GN = PossibleGuitarNotes[index]
        let found = false
        fret = 0
        for(let i = 0; i < GN[1].length; i++,fret++)
        {
            if(GN[1][i][0] == Note)
            {
                //console.log('found')
                found = true
                break
            }
        }
        if(found)
        {
            break
        }
        string++
    }

    //console.log(string,fret)

    return [string,fret]
}