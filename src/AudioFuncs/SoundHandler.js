import { FindNote, GetMinAndMaxGuitarNotes } from "../Notes/notes";
import { analyser, analyserNode, bufferLength, dataArray, detector, inputBuffer, sampleRate } from "./GetMicData";

export const volumeLimit = 10 ,minClarityPercent = 95,[MinFreq,MaxFreq] = GetMinAndMaxGuitarNotes({})
export var CurrentFreq, CurrentClarityPercent, CurrentVolume = 0, CurrentNote = 'OffLimits',TimePassedSinceLastNote = 0,notesPlayed = []

const SetVolume = () =>
{
    var volumePeak = 0

    for (let i = 0; i < bufferLength; i++) 
    {
        const lastVolumeData = dataArray[i] / 128.0;
        if(lastVolumeData > volumePeak) volumePeak = lastVolumeData
    }

    CurrentVolume = ((volumePeak * 100) - 100)
}
const SetPitchClarity = () =>
{
    analyserNode.getFloatTimeDomainData(inputBuffer);
    const pitch = detector.findPitch(inputBuffer, sampleRate)

    analyser.getByteTimeDomainData(dataArray);

    CurrentFreq = pitch[0]
    CurrentClarityPercent = 100 * pitch[1]
}
export const updatePitch = () => 
{
    if (!analyserNode || !detector || !sampleRate || !inputBuffer) return;
    
    TimePassedSinceLastNote++

    SetPitchClarity()

    SetVolume()

    if((CurrentFreq >= MinFreq && CurrentFreq <= MaxFreq) && (CurrentVolume >= volumeLimit) && (CurrentClarityPercent >= minClarityPercent))
    {
        const NewNote = FindNote(CurrentFreq)

        if(NewNote != CurrentNote && NewNote != undefined)
        {
            CurrentNote = NewNote
           // notesPlayed.push(CurrentNote)
    
            //console.log(TpassedSinceLastNote)
    
            TimePassedSinceLastNote = 0
        } 
    }
    else CurrentNote = 'OffLimits' 

    
}