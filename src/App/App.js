import React, { useEffect, useRef, useState } from "react"
import './App.css'
import { ClosestFinger } from "../Notes/notes";
import useWindowDimensions from "../windowDimensions";
import { bufferLength, dataArray, GetMicData } from "../AudioFuncs/GetMicData";
import { CurrentClarityPercent, CurrentFreq, CurrentNote, updatePitch, volumeLimit } from "../AudioFuncs/SoundHandler";
import { Easyest, FingerPos, GetPossibleGuitarNotes, PossibleGuitarNotes, STDTrastes, STDtunning } from "../AudioFuncs/NoteHandler";
import FourierColumns from "./FourierColumns";

const App = () =>
{
    const [Canvas,setCanvas] = useState(null)
    const [Canvas2,setCanvas2] = useState(null)

    const {height,width} = useWindowDimensions()
    
    const canvasRef = useRef(null)
    const canvasRef2 = useRef(null)

    let notePosi = []
    var dashs = []
    var mesureMedia = false
    
    var lastVolume = 0
    var somMedia = 0
    var somHistory = 0

    let xTest = 0
    let LastxTest = 0
    let drawingNote = ''


    useEffect(()=>
    {   
       
        setCanvas(canvasRef.current)
        setCanvas2(canvasRef2.current)
    },[])
     
    useEffect(()=>
    {
        if(Canvas)
        {
            GetMicData()
            setUpdatePitchInterval();
        }
    },[Canvas])

    function drawGraph()
    {
        if (!Canvas) return;

        const [w, h] = [Canvas.width, Canvas.height];
        const ctx = Canvas.getContext("2d");
        if (!ctx ) return;

        ctx.clearRect(0, 0, w, h);

        const headingHeight = 100;
        
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = "60px system-ui, -apple-system";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        //ctx.textBaseline = "middle";
        ctx.fillText(
            `${CurrentNote} ${CurrentFreq ? CurrentFreq.toFixed(1) : 'NoNote'} Hz (${CurrentClarityPercent? CurrentClarityPercent.toFixed(1) : 0}%)`,
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
        
        if(lastVolume > volumeLimit && CurrentNote != 'OffLimits' && ((drawingNote != CurrentNote) ))
        {
            drawingNote = CurrentNote
           
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
            
            const cf = FingerPos()

            notePosi.push([xTest,CurrentNote,cf.casa,cf.corda])

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
            let u=[]
            for(let i=0;i<dataArray.length;i++)
            {
                u.push((dataArray[i] / 128.0)-1)
            }
            console.log(u[0])
            
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

        //bufferLength = Samples amounts //time wave analysys interval

        for (let i = 0; i < bufferLength; i++) 
        {
            const v = dataArray[i] / 128.0; 

            if(v>peak)
            { 
                peak=v; 
                
                if((v - 1) < 0)
                {
                    //console.log('v',v - 1)
                }
            }

            const y = v * h/2;
        
            if (i === 0) 
            {
                ctx.moveTo(x, y);//time wave analysys interval
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

            <FourierColumns/>

            {/*
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
            */}
        </div>
        
    )
}

export default App