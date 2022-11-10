import React, { useEffect, useRef, useState } from "react"
import useWindowDimensions from "../windowDimensions";
import { bufferLength, dataArray, GetMicData } from "../AudioFuncs/GetMicData";
import { fourierDiscrete } from "../AI/fourierDiscreteTest";

const FourierColumns = () =>
{
    const [Canvas,setCanvas] = useState(null)
    const {height,width} = useWindowDimensions()
    const canvasRef = useRef(null)

    useEffect(()=>
    {   
        setCanvas(canvasRef.current)
        
    },[canvasRef.current])
    
    useEffect(()=>
    {
        if(Canvas)
        {
            setUpdatePitchInterval()
        }
    },[Canvas])

    async function setUpdatePitchInterval() {

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        while(true)
        {
            drawGraph();
            await sleep(5);
        }
    }

    function drawGraph()
    {
        if (!Canvas) return;

        const [w, h] = [Canvas.width, Canvas.height];
        const ctx = Canvas.getContext("2d");
        if (!ctx ) return;

        ctx.clearRect(0, 0, w, h);
        
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, w, h);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();

        let arr = []
        if(dataArray)
        {
            for(let i = 0;i<dataArray.length;i++)
            {
                arr.push(dataArray[i]/128)
            }

            const fD = fourierDiscrete(arr)
            //console.log(fD)

            const sliceWidth = w / fD.length;
            var x = 0; 

            for (let i = 0; i < fD.length; i++) 
            {
                const y = fD[i].amp * (h/4);
                
                //console.log(i,y)

                if (i === 0)
                {
                    ctx.moveTo(x, h - y);//time wave analysys interval
                } else 
                {
                    ctx.lineTo(x, h - y);
                }
                x += sliceWidth;
            }

            
            ctx.stroke();

        }
    }

 
    return (
        <div>
            <canvas
            ref={canvasRef}
            aria-label="Recorded pitch graph2"
            width={width}
            height={height/2}
            >No pitches recorded
            </canvas>
        </div>
    )
}

export default FourierColumns

