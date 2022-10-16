const dims = {
  w: 3000,
  h: 2833
};

class Sender {
  constructor() {
    console.log('hello world');
    this.transport = Tone.Transport;
    this.synth = new Tone.Synth().toDestination();
    this.transport.scheduleRepeat((time) => {
      this.playMusic(time);
    }, '16n');
    this.colorValues = [];
    this.colorCounter = 0;
    this.setupImage();
    document.getElementById('toggle').addEventListener('click', (e) => {
      e.preventDefault();
      this.transport.toggle();
    });
  }
  setupImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = document.getElementById('image');
    console.log(canvas, ctx);
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, dims.w, dims.h);
    this.colorValues = data.data.filter((item, index) => (index + 1) % 4);
    console.log(this.colorValues);
    this.transport.start();
  }
  playMusic(time) {
    this.synth.triggerAttackRelease(
      [this.colorValues[this.colorCounter]],
      '16n',
      time
    );
    this.colorCounter++;
    console.log(this.colorValues[this.colorCounter], this.colorCounter, dims.w * dims.h * 3);
  }
}

new Sender();
