import { average, rangeFit } from './helpers';

class Sound {
  constructor(audioSource, mediaStream) {
    const ctx = new window.AudioContext();
    // const src = ctx.createMediaElementSource(audioSource);
    // const src = ctx.createMediaStreamSource(audioSource.srcObject);
    const src = ctx.createMediaStreamSource(mediaStream);
    this.analyzer = ctx.createAnalyser();
    
    console.log("Source", src);

    src.connect(this.analyzer);
    // this.analyzer.connect(ctx.destination);
    this.analyzer.fftSize = 512;
  
    const bufferLength = this.analyzer.frequencyBinCount;
    this.audioData = new Uint8Array(bufferLength);
  }

  // Runs every loop
  process() {
    this.analyzer.getByteFrequencyData(this.audioData);
    const data = this.audioData;

    // Using first third for low frequencies
    // and 2/3s for high frequencies
    const lowFreqArray  = data.slice(0, Math.floor(data.length / 3) - 1);
    const highFreqArray = data.slice(Math.ceil(data.length / 3) - 1, data.length - 1);

    const averageFreq = average(data);
    const maxLow      = Math.max(...lowFreqArray);
    const maxHigh     = Math.max(...highFreqArray);
    const avgLow      = average(lowFreqArray);
    const avgHigh     = average(highFreqArray);

    return {
      // beatMagnitude: avgLow / lowFreqArray.length,
      // trebleMagnitude: avgHigh / highFreqArray.length,
      beatMagnitude: rangeFit(avgLow / lowFreqArray.length, 0, 2.3, 0, 3),
      trebleMagnitude: rangeFit(avgHigh / highFreqArray.length, 0, 0.5, 0, 5)
    }
  }
}

export default Sound;