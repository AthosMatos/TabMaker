import React, { useEffect, useRef, useState } from "react"
import './App.css'
import { PitchDetector } from "pitchy";
import { ClosestFinger, closestNote, FindNote, GetMinAndMaxGuitarNotes, GetPossibleGuitarNotes } from "../Notes/notes";
import useWindowDimensions from "../windowDimensions";


const App = () =>
{
    const [Canvas,setCanvas] = useState(null)
    const [Canvas2,setCanvas2] = useState(null)
    const {height,width} = useWindowDimensions()
    
    const minClarityPercent = 95;
    const inputBufferSize = 2048;
    const canvasRef = useRef(null)
    const canvasRef2 = useRef(null)
    let notePosi = []
    var dashs = []
    var mesureMedia = false

    var lastFreq 
    var lastClarity
    var notePlayin = 'OffLimits' 
    var notesPlayed = []
    var [overrideSampleRate, desiredSampleRate, sampleRate] = [false,44100,null];
    var micStream, analyserNode, detector, inputBuffer;
    const [MinFreq,MaxFreq] = GetMinAndMaxGuitarNotes({})
    const PossibleGuitarNotes = GetPossibleGuitarNotes()

    const volumeLimit = 10
    var lastVolume = 0
    var somMedia = 0
    var somHistory = 0

    var bufferLength
    var dataArray
    var analyser

    let xTest = 0
    let LastxTest = 0
    let drawingNote = ''

    var TpassedSinceLastNote = 0

    useEffect(()=>
    {   
        setCanvas(canvasRef.current)
        setCanvas2(canvasRef2.current)
    },[])
     
    useEffect(()=>
    {
        if(Canvas)
        {
            setUpdatePitchInterval();

            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => 
            {
                micStream = stream;
                resetAudioContext();
            });
        }
    },[Canvas,Canvas2])

    function drawGraph()
    {
        if (!Canvas) return;

        const [w, h] = [Canvas.width, Canvas.height];
        const ctx = Canvas.getContext("2d");
        if (!ctx ) return;

        TpassedSinceLastNote++

        ctx.clearRect(0, 0, w, h);

        const headingHeight = 100;

        const lastPitch = lastFreq ? lastFreq.toFixed(1) : 'NoNote'
        const lastClarityPercent = lastClarity * 100
        
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = "60px system-ui, -apple-system";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        //ctx.textBaseline = "middle";
        ctx.fillText(
            `${notePlayin} ${lastPitch} Hz (${lastClarityPercent.toFixed(1)}%)`,
            w / 2,
            headingHeight / 2,
            w
        );
        
        ctx.fillText(
            `Media de volume: ${somMedia ? parseInt(somMedia/somHistory) : 0}`,
            w / 2,
            2.2 * headingHeight / 2,
            w
        );
        ctx.fillText(
            `lastVolume: ${parseInt(lastVolume)}`,
            w / 2,
            3.4 * headingHeight / 2,
            w
        );

        ctx.font = "20px system-ui, -apple-system";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        
        //console.log(dashs)
        ctx.setLineDash(dashs);
        ctx.lineDashOffset = -5;
        
        if(lastVolume > volumeLimit && notePlayin != 'OffLimits' && ((drawingNote != notePlayin) ))
        {
            drawingNote = notePlayin
           
           
            if(dashs.length>0)
            {
                dashs.pop()
                dashs.pop()
            }
            let r = xTest - 12 - LastxTest
            if(r<0)
            {
                r=0
            }
            dashs.push(r)
            dashs.push(12)
            dashs.push(100000)
            dashs.push(12)
            
            let cf = ClosestFinger(notePlayin,PossibleGuitarNotes)
            notePosi.push([xTest,notePlayin,cf[1],cf[0]])

            LastxTest = xTest
        }

        //console.log(string,fret)

        let stringsaved = undefined

        if(notePosi.length)
        {
            for(let string = 0,stringHBtween = 100 ;string < 6; string++,stringHBtween-=20)
            {
                for(let i = 0; i < notePosi.length; i++)
                {
                    const v = notePosi[i]
                    //console.log(v[3])
                    if(v[0]>=0 && string == v[3])
                    {
                        ctx.fillText( `${v[1]}`, 
                        v[0], h/2 - 20);

                        ctx.fillText( `${v[2]}`, 
                        v[0], h/2 + stringHBtween);

                        stringsaved = string
                    }
                }
            }
        }
        
        //console.log(stringsaved)

        for(let string = 0,stringHBtween = 0 ;string < 6; string++,stringHBtween+=20)
        {
           
            ctx.moveTo(0, h/2 + stringHBtween);
            ctx.lineTo(xTest, h/2 + stringHBtween);
        }


        if(xTest==w)
        {
            //console.log(dashs)
            dashs = []
            notePosi = []
            xTest=0
            LastxTest = 0
            drawingNote = ''
        }
        else 
        {
            xTest++;
        }
        ctx.stroke();

    }

    function drawGraph2()
    {
        if (!Canvas2) return;

        const [w, h] = [Canvas2.width, Canvas2.height];
        const ctx = Canvas2.getContext("2d");
        if (!ctx ) return;

        ctx.clearRect(0, 0, w, h);
        
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, w, h);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();

        const sliceWidth = w * 1.0 / bufferLength;
        var x = 0;
        var peak = 0

        for (let i = 0; i < bufferLength; i++) 
        {
            const v = dataArray[i] / 128.0;

            if(v>peak)peak=v

            const y = v * h/2;
        
            if (i === 0) 
            {
                ctx.moveTo(x, y);
            } else 
            {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        if(mesureMedia)
        {
            somHistory++
            somMedia += (peak * 100)-100
        }
       
        lastVolume = (peak * 100)-100

        
        ctx.stroke();
    
    }

    function updatePitch() {
        if (!analyserNode || !detector || !sampleRate || !inputBuffer) return;

        analyserNode.getFloatTimeDomainData(inputBuffer);
        let pitch = detector.findPitch(inputBuffer, sampleRate)

        analyser.getByteTimeDomainData(dataArray);

        lastFreq = pitch[0]
        lastClarity = pitch[1]

        let note
        if(lastFreq>=MinFreq && lastFreq<=MaxFreq && lastVolume >= volumeLimit)
        {
            note = FindNote(pitch[0])
        }
        else notePlayin = 'OffLimits' 

        if(note!=notePlayin && note!=undefined && ((100 * lastClarity) >= minClarityPercent))
        {
            notePlayin = note
            notesPlayed.push(notePlayin)

            //console.log(TpassedSinceLastNote)

            TpassedSinceLastNote = 0
        } 
    }

    async function setUpdatePitchInterval() {

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        while(true)
        {
            updatePitch();
            drawGraph();
            drawGraph2()
            await sleep(5);
        }
    }

    function resetAudioContext() 
    {
       // console.log('reseted Audio')

        sampleRate = analyserNode = inputBuffer = null;
       
        const audioCtx = new (window.AudioContext)();
        analyser = audioCtx.createAnalyser();

        const source = audioCtx.createMediaStreamSource(micStream);
        source.connect(analyser);

        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray= new Uint8Array(bufferLength);
        
        
        const audioContextOptions = {};
        if (overrideSampleRate) {
            audioContextOptions.sampleRate = desiredSampleRate;
        }
        //
        const audioContext = new AudioContext(audioContextOptions);
        sampleRate = audioContext.sampleRate;
            
        analyserNode = new AnalyserNode(audioContext, {
            fftSize: inputBufferSize,
        });
        
        audioContext.createMediaStreamSource(micStream).connect(analyserNode);
        detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        
        inputBuffer = new Float32Array(detector.inputLength);
    }

    return (
        <div style={{margin:10}}>
            <div style={{display:'grid',justifyContent:'flex-end',alignItems:'flex-end'}}>
                <canvas
                width={width}
                height={height/1.8}
                ref={canvasRef}
                aria-label="Recorded pitch graph"
                >No pitches recorded
                </canvas>

                <canvas
                ref={canvasRef2}
                aria-label="Recorded pitch graph2"
                width={width}
                height={height/4}
                >No pitches recorded
                </canvas>
            </div>
            <button className="button" onClick={()=>
            {
                if(mesureMedia)somMedia = 0
                mesureMedia = !mesureMedia
            }}>
                <div style={{display:'grid'}}>
                    <text style={{fontSize:22}}>Toogle</text>
                    <text style={{fontSize:22}}>Medir Media</text>
                </div>
            </button>
        </div>
        
    )
}

export default App