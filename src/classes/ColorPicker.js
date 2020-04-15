// 原理及公式参考地址: https://www.rapidtables.com/convert/color/index.html
export class ColorPicker {
  hsv;
  rgb;
  alpha;

  huebgrgb; // 显示用rgb色相背景色,选择色相时用

  constructor(color, alpha = null) {
    let src = {
      alpha
    }
    if (color instanceof Array) {
      src.rgb = color
    } else {
      if (color.indexOf('rgb') > -1) {
        src.rgb = color.split(',').map(x => Number(x.replace(/[^0-9]/ig, ""))) || [0, 0, 0]
      } else if (color.indexOf('#') > -1) {
        src.rgb = this.hex2rgb(color)
      }
    }
    this.updateColor(src)
  }

  updateColor(color) {
    switch (this.switchColorType(color)) {
      case 'argb':
        color = {
          rgb: color
        }
        break;
      case 'rgb':
        color = {
          rgb: color.split(',').map(x => Number(x.replace(/[^0-9]/ig, ""))) || [0, 0, 0]
        }
        break;
      case 'hex':
        color = {
          rgb: this.hex2rgb(color)
        }
        break;
      default:
    }
    if (color.hsv) {
      if (!this.hsv || this.hsv[0] !== color.hsv[0]) this.huebgrgb = this.hsv2rgb([color.hsv[0], 1, 1])
      this.hsv = color.hsv
      this.rgb = this.hsv2rgb(color.hsv)
    }
    if (color.rgb) {
      this.rgb = color.rgb
      this.hsv = this.rgb2hsv(color.rgb)
      this.huebgrgb = this.hsv2rgb([this.hsv[0], 1, 1])
    }
    if (color.alpha !== undefined &&color.alpha !== null ) {
      this.alpha = Number(color.alpha)
    }
    if (color.h !== undefined || color.s !== undefined || color.v !== undefined) {
      if (!this.hsv || this.hsv[0] !== color.h) this.huebgrgb = this.hsv2rgb([color.h, 1, 1])
      if (color.h !== undefined) this.hsv = [color.h, this.hsv[1], this.hsv[2]]
      if (color.s !== undefined) this.hsv = [this.hsv[0], color.s, this.hsv[2]]
      if (color.v !== undefined) this.hsv = [this.hsv[0], this.hsv[1], color.v]
      this.updateColor({
        hsv: this.hsv
      })
    }
    if (color.r !== undefined || color.g !== undefined || color.b !== undefined) {
      if (color.r !== undefined) this.rgb = [color.r, this.rgb[1], this.rgb[2]]
      if (color.g !== undefined) this.rgb = [this.rgb[0], color.g, this.rgb[2]]
      if (color.b !== undefined) this.rgb = [this.rgb[0], this.rgb[1], color.b]
      this.updateColor({
        rgb: this.rgb
      })
    }
  }


  switchColorType(color) {
    if (color instanceof Array) return 'argb'
    if (color instanceof String) {
      if (color.indexOf('rgb') > -1) {
        return 'rgb'
      } else if (color.indexOf('#') > -1) {
        return 'hex'
      }
    }
    return
  }

  rgb2hex(rgb) {
    var aRgb = rgb instanceof Array ? rgb : (rgb.split(',') || [0, 0, 0]);
    var temp;
    return '#' + [
      (temp = Number(aRgb[0].replace(/[^0-9]/ig, "")).toString(16)).length == 1 ? ('0' + temp) : temp,
      (temp = Number(aRgb[1].replace(/[^0-9]/ig, "")).toString(16)).length == 1 ? ('0' + temp) : temp,
      (temp = Number(aRgb[2].replace(/[^0-9]/ig, "")).toString(16)).length == 1 ? ('0' + temp) : temp,
    ].join('');
  }

  hex2rgb(hex) {
    hex = hex.trim()
    if (hex[0] === '#') hex = hex.substr(1)
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
      parseInt(hex[0] + hex[1], 16),
      parseInt(hex[2] + hex[3], 16),
      parseInt(hex[4] + hex[5], 16),
    ]
  }

  hsv2rgb([h, s, v]) {
    let hi = Math.floor(h / 60);
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let _r, _g, _b;
    switch (hi) {
      case 0:
        _r = c;
        _g = x;
        _b = 0;
        break;
      case 1:
        _r = x;
        _g = c;
        _b = 0;
        break;
      case 2:
        _r = 0;
        _g = c;
        _b = x;
        break;
      case 3:
        _r = 0;
        _g = x;
        _b = c;
        break;
      case 4:
        _r = x;
        _g = 0;
        _b = c;
        break;
      case 5:
        _r = c;
        _g = 0;
        _b = x;
        break;
      default:
    }
    return [
      Math.floor((_r + m) * 255),
      Math.floor((_g + m) * 255),
      Math.floor((_b + m) * 255)
    ];
  }
  rgb2hsv([r, g, b]) {
    let _r = r / 255;
    let _g = g / 255;
    let _b = b / 255;
    let cmax = Math.max(_r, _g, _b);
    let cmin = Math.min(_r, _g, _b);
    let theta = cmax - cmin;
    let h, s, v;
    if (theta === 0) {
      h = 0;
    } else {
      if (cmax === _r) h = 60 * (((_g - _b) / theta) % 6);
      if (cmax === _g) h = 60 * ((_b - _r) / theta + 2);
      if (cmax === _b) h = 60 * ((_r - _g) / theta + 4);
    }
    if (cmax === 0) {
      s = 0;
    } else {
      s = theta / cmax;
    }
    v = cmax;
    return [h, s, v];
  }
}
