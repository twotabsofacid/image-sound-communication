import { PitchDetector } from 'https://esm.sh/pitchy@4';

class Receiver {
  constructor() {
    console.log('hello world');
    this.pitchArr = [];
    this.runAnalyzer();
  }
  runAnalyzer() {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    audioContext.resume();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      const input = new Float32Array(detector.inputLength);
      this.updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    });
  }
  updatePitch(analyserNode, detector, input, sampleRate) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    document.getElementById('pitch').textContent = `${
      Math.round(pitch * 10) / 10
    } Hz`;
    document.getElementById('clarity').textContent = `${Math.round(
      clarity * 100
    )} %`;
    if (clarity >= 0.99) {
      this.pitchArr.push(Math.round(pitch * 10) / 10);
    }
    console.log(this.pitchArr);
    window.setTimeout(
      () => this.updatePitch(analyserNode, detector, input, sampleRate),
      100
    );
  }
}

new Receiver();
