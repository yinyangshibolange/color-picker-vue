<template>
  <div>
    <div class style="margin-left: 100px;">
      <div
        class="color_picker_panel"
        id="color_picker_panel"
        :style="{background: `rgb(${curc? curc.huebgrgb.join(','): '0, 0, 0'})`,
        width: `${size[sizeType].panel.width}px`,
        height: `${size[sizeType].panel.height}px`}"
      >
        <div class="saturation" style="background: linear-gradient(to right,white , #ffffff00);"></div>
        <div class="value" style="background: linear-gradient(to top, black, #ffffff00);"></div>
        <div class="trigger-c" v-on:mousedown.self="triggerSv($event)">
          <div
            class="pointer-c"
            :style="{left: (curc? curc.hsv[1] * size[sizeType].panel.width: 0)+ 'px', top: (curc? (1 - curc.hsv[2]) * size[sizeType].panel.height: 0) + 'px'}"
          >
            <div class="pointer" v-on:mousedown.self="triggerSvMove($event)"></div>
          </div>
        </div>
      </div>
      <div
        class="colors"
        id="color_picker_colors"
        :style="{
            background: 'linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red)',
            width: `${size[sizeType].colors.width}px`, 
            height: `${size[sizeType].colors.height}px`
        }"
      >
        <div class="colors-trigger-container" v-on:mousedown.self="triggerHue($event)">
          <div
            class="color-chooser"
            :style="{left: (curc ? curc.hsv[0]: 0) / 359 * size[sizeType].colors.width + 'px'}"
          ></div>
        </div>
      </div>
      <div
        class="alpha"
        id="color_picker_alpha"
        :style="{
            width: `${size[sizeType].alpha.width}px`,
            height: `${size[sizeType].alpha.height}px`,
            backgroundSize: `${size[sizeType].alpha.height}px ${size[sizeType].alpha.height}px`, backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==)'}"
      >
        <div
          class="alpha-bg"
          :style="{background: `rgba(0, 0, 0, 0) linear-gradient(to left, rgb(${curc? curc.rgb.join(','):'0, 0, 0'}), rgba(255, 255, 255, 0)) repeat scroll 0% 0%`}"
          v-on:mousedown.self="triggerAlpha($event)"
        >
          <div
            class="alpha-chooser"
            :style="{left: `${((curc? (curc.alpha? curc.alpha: 0): 0) * size[sizeType].alpha.width)}px`}"
          ></div>
          <!-- `${((curc? (curc.alpha? curc.alpha: 0): 0) * size[sizeType].alpha.width)}px` -->
          <!-- alpha * size[sizeType].alpha.width + 'px' --> 
        </div>
        <!-- ${curc? curc.rgb.join(','):'255, 255, 255'} -->
      </div>

      <div
        id="preview"
        class="preview"
      :style="{
          width: `${size[sizeType].preview.width}px`,
          height: `${size[sizeType].preview.height}px`
          }"
      ></div>
        <!-- :style="{ borderRadius: '30px',boxShadow: '0 0 2px #999', 
        background: `${curc? ((curc.alpha !== undefined && curc.alpha !== null? 'rgba(': 'rgb(')+curc.rgb.join(',') + curc.alpha !== undefined && curc.alpha !== null? curc.alpha: '' + ')'): 'rgb(0, 0, 0)'}`}" -->
    </div>
  </div>
</template>

<script>
// 原理及公式参考地址: https://www.rapidtables.com/convert/color/index.html
import { Rgb } from "@/classes/Rgb.js";
export default {
  data() {
     const curc = new Rgb("#ffffff");
    return {
      size: {
        small: {
          colors: {
            width: 120,
            height: 12
          },
          panel: {
            width: 120,
            height: 120
          },
          alpha: {
            width: 120,
            height: 12
          },
          preview: {
            width: 12,
            height: 12
          }
        },
        middle: {
          colors: {
            width: 160,
            height: 16
          },
          panel: {
            width: 160,
            height: 160
          },
          alpha: {
            width: 160,
            height: 16
          },
          preview: {
            width: 16,
            height: 16
          }
        },
        large: {
          colors: {
            width: 200,
            height: 20
          },
          panel: {
            width: 200,
            height: 200
          },
          alpha: {
            width: 200,
            height: 20
          },
          preview: {
            width: 20,
            height: 20
          }
        }
      },
      curc,
      alpha: 0,
    };nnnnnnnn
  },
  props: {
    sizeType: {
      default: "large" // small, middle, large
    }
  },
  methods: {
    clearEv(ev) {
      const oEvent = ev || event;
      if (oEvent.preventDefault) oEvent.preventDefault();
      if (oEvent.stopPropagation) oEvent.stopPropagation();
      oEvent.returnValue = false;
      oEvent.cancelBubble = true;
    },
    triggerSv(ev) {
      this.clearEv(ev);
      let left = ev.offsetX || ev.layerX;
      let top = ev.offsetY || ev.layerY;
      this.curc.updateColor({
          s: left / this.size[this.sizeType].panel.width,
          v: 1 - top / this.size[this.sizeType].panel.height
      })
      this.triggerSvMove(ev);
    },
    triggerSvMove(evd) {
        this.clearEv(evd)
      const width = this.size[this.sizeType].panel.width;
      const height = this.size[this.sizeType].panel.height;
      const downpagex = evd.pageX;
      const downpagey = evd.pageY;
      let origincurs = this.curc.hsv[1];
      let origincurv = this.curc.hsv[2];
      document.onmousemove = evm => {
        this.clearEv(evm);
        let xchange = evm.pageX - downpagex;
        let ychange = evm.pageY - downpagey;
        if (origincurs * width + xchange <= 0) {
          this.curc.updateColor({ s: 0 });
        } else if (origincurs * width + xchange >= width) {
          this.curc.updateColor({ s: 1 });
        } else {
          this.curc.updateColor({
            s: (origincurs * width + xchange) / width
          });
        }

        if (height - origincurv * height + ychange <= 0) {
          this.curc.updateColor({ v: 1 });
        } else if (height - origincurv * height + ychange >= height) {
          this.curc.updateColor({ v: 0 });
        } else {
          this.curc.updateColor({
            v: 1 - (height - origincurv * height + ychange) / height
          });
        }
      };
      document.onmouseup = evu => {
        this.clearEv(evu);
        document.onmousemove = null;
      };
    },
    triggerHue(ev) {
      this.clearEv(ev);
      const width = this.size[this.sizeType].colors.width;
      let left = ev.offsetX || ev.layerX;
      this.curc.updateColor({
        h: (left / width) * 359
      });
      this.triggerHueMove(ev);
    },
    triggerHueMove(evd) {
        this.clearEv(evd)
      const width = this.size[this.sizeType].colors.width;
      const downpagex = evd.pageX;
      let origincurh = this.curc.hsv[0];
      document.onmousemove = evm => {
        this.clearEv(evm);
        let xchange = evm.pageX - downpagex;
        if ((origincurh / 359) * width + xchange <= 0) {
          this.curc.updateColor({ h: 0 });
        } else if ((origincurh / 359) * width + xchange >= width) {
          this.curc.updateColor({ h: 359 });
        } else {
          this.curc.updateColor({
            h: (((origincurh / 359) * width + xchange) / width) * 359
          });
        }
      };
      document.onmouseup = evu => {
        this.clearEv(evu);
        document.onmousemove = null;
      };
    },
    triggerAlpha(ev) {
      this.clearEv(ev);
      const width = this.size[this.sizeType].alpha.width;
      let left = ev.offsetX || ev.layerX;
    //   this.alpha = left / width
      this.curc.updateColor({
        alpha: left / width
      });
      console.log(this.curc.alpha)
      this.triggerAlphaMove(ev);
    },
    triggerAlphaMove(evd) {
        this.clearEv(evd)
      const width = this.size[this.sizeType].alpha.width;
      const downpagex = evd.pageX;
      let originAlpha = this.curc.alpha;
    //   let originAlpha = this.alpha
      document.onmousemove = evm => {
        this.clearEv(evm);
        let xchange = evm.pageX - downpagex;
        if (originAlpha * width + xchange <= 0) {
          this.curc.updateColor({ alpha: 0 });
        // this.alpha = 0
        } else if (originAlpha * width + xchange >= width) {
          this.curc.updateColor({ alpha: 1 });
        // this.alpha = 1
        } else {
          this.curc.updateColor({
            alpha: (originAlpha * width + xchange) / width
          });
        // this.alpha = (originAlpha * width + xchange) / width
        }
      };
      document.onmouseup = evu => {
        this.clearEv(evu);
        document.onmousemove = null;
      };
    }
  },
  mounted() {
    const aRgb = [191, 191, 191];
    if (!this.curc) {
      this.curc = new Rgb("#fff");
    } else {
      this.curc.updateColor({
        rgb: aRgb
      });
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.color_picker_panel {
  position: relative;
}
.color_picker_panel .saturation {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.color_picker_panel .value {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.color_picker_panel .trigger-c {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  cursor: pointer;
}
.trigger-c .pointer-c {
  width: 1px;
  height: 1px;
  background: transparent;
  position: absolute;
  cursor: pointer;
}

.trigger-c .pointer-c .pointer {
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 2px #999;
}

.colors {
  position: relative;
  margin-top: 15px;
}

.colors .colors-trigger-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
}
.colors .colors-trigger-container .color-chooser {
  position: absolute;
  width: 1px;
  height: calc(100% + 6px);
  transform: translate(0, -3px);
  background: white;
  box-shadow: 0 0 2px #999;
  cursor: pointer;
}

.alpha {
  margin-top: 15px;
  position: relative;
}

.alpha .alpha-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
}

.alpha .alpha-bg .alpha-chooser {
  position: absolute;
  width: 1px;
  height: calc(100% + 6px);
  transform: translate(0, -3px);
  background: white;
  box-shadow: 0 0 2px #999;
  cursor: pointer;
}

.preview {
  float: left;
  margin-top: 10px;
}
</style>