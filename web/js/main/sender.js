const dims = {
  w: 3000,
  h: 2833
};

class Sender {
  constructor() {
    console.log('hello world');
    this.transport = Tone.Transport;
    this.synth = new Tone.Synth().toDestination();
    this.colorValues = [];
    this.colorCounter = 0;
    this.midiOut = [];
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.image = document.getElementById('image');
    this.addListeners();
    // this.initDevices();
    this.setupImage();
    this.scheduleRepeat();
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midi) => {
        this.initDevices(midi);
      });
    }
    this.synth.triggerAttackRelease('C4', '1n');
    this.draw();
  }
  addListeners() {
    document.getElementById('toggle').addEventListener('click', (e) => {
      e.preventDefault();
      this.transport.toggle();
    });
  }
  initDevices(midi) {
    const outputs = midi.outputs.values();
    for (
      let output = outputs.next();
      output && !output.done;
      output = outputs.next()
    ) {
      this.midiOut.push(output.value);
    }
    console.log('midi devices', this.midiOut);
  }
  setupImage() {
    this.ctx.drawImage(image, 0, 0);
    const data = this.ctx.getImageData(0, 0, dims.w, dims.h);
    this.colorValues = data.data.filter((item, index) => (index + 1) % 4);
  }
  draw() {
    this.ctx.clearRect(0, 0, dims.w, dims.h);
    this.ctx.drawImage(image, 0, 0);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.rect(10, 20, 150, 100);
    this.ctx.fill();
  }
  scheduleRepeat() {
    this.transport.scheduleRepeat((time) => {
      this.playMusic(time);
    }, '4n');
  }
  playMusic(time) {
    this.synth.triggerAttackRelease(
      [this.colorValues[this.colorCounter]],
      '16n',
      time
    );
    // this.midiOut[0].send([
    //   0x90,
    //   Math.min(
    //     127,
    //     Math.max(21, Math.floor(this.colorValues[this.colorCounter] / 2))
    //   ),
    //   0x7f
    // ]);
    // setTimeout(() => {
    //   this.midiOut[0].send([
    //     0x80,
    //     Math.min(
    //       127,
    //       Math.max(21, Math.floor(this.colorValues[this.colorCounter] / 2))
    //     ),
    //     0x7f
    //   ]);
    // }, 250);
    this.colorCounter++;
    console.log(
      this.colorValues[this.colorCounter],
      this.colorCounter,
      dims.w * dims.h * 3
    );
    // DRAW A WHITE RECT AT THE POINT WE ARE PLAYING
  }
}

new Sender();
