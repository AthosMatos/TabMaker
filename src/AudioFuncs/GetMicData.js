import { PitchDetector } from "pitchy";

const inputBufferSize = 2048;

export var [overrideSampleRate, desiredSampleRate, sampleRate] = [false,44100,null]
export var micStream, analyserNode, detector, inputBuffer, bufferLength, dataArray, analyser

const StartAudioContext = () =>
{
    sampleRate = analyserNode = inputBuffer = null;
   
    const audioCtx = new (window.AudioContext)();
    analyser = audioCtx.createAnalyser();

    const source = audioCtx.createMediaStreamSource(micStream);
    source.connect(analyser);

    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
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

export const GetMicData = ()=>
{
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => 
    {
        micStream = stream;
        StartAudioContext();
    });
}
