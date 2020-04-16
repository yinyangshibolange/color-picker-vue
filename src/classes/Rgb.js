// 原理及公式参考地址: https://www.rapidtables.com/convert/color/index.html
export class Rgb {
  hsv = [0, 0, 0];
  rgb = [0, 0, 0];
  alpha = 1;
  huebgrgb = [0, 0, 0]; // 显示用rgb色相背景色,选择色相时用
  type = 'hex'; // 'hex' or 'rgb'

  hexmap = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{8})$/;
  rgbmap = /^[rR][gG][Bb][\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\)]|[rR][gG][Bb][Aa][\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){3}(0\.\d{1,2}|1|0)[\)]$/;

  constructor(color) {
    if(!color) color = '#fff'
    this.updateColor(color);
  }

  /**
   * 分解输入的颜色
   */
  breakInColor(color: any) {
    const temp: any = {};
    if (color instanceof Array) {
      if (color.length < 3) return color;
      temp.rgb = [color[0], color[1], color[2]];
      temp.alpha = 1;
      if (color[3] !== undefined) temp.alpha = color[3];
      this.type = 'rgb';
    } else if (typeof color === 'string') {
      // 替换空格
      color = color.replace(/\s/g, '');
      // 颜色正则表达式 验证
      if (!this.hexmap.test(color) && !this.rgbmap.test(color))
        // 验证失败 拦截
        return color;
      if (color.indexOf('rgba') > -1) {
        const rgba = color
          .split(',')
          .map(x =>
            typeof x === 'string' ? Number(x.replace(/[^0-9\.]/g, '')) : x,
          ) || [0, 0, 0, 1];
        temp.rgb = [rgba[0], rgba[1], rgba[2]];
        temp.alpha = rgba[3];
        this.type = 'rgb';
      } else if (color.indexOf('rgb') > -1) {
        temp.rgb = color
          .split(',')
          .map(x =>
            typeof x === 'string' ? Number(x.replace(/[^0-9\.]/g, '')) : x,
          ) || [0, 0, 0];
        temp.alpha = 1;
        this.type = 'rgb';
      } else if (color.indexOf('#') > -1) {
        const _rgb = this.hex2rgb(color);
        temp.rgb = [_rgb[0], _rgb[1], _rgb[2]];
        temp.alpha = 1;
        if (_rgb[3] !== undefined) temp.alpha = _rgb[3];
        this.type = 'hex';
      }
    } else {
      return color;
    }
    return temp;
  }

  updateColor(color) {
    color = this.breakInColor(color);

    console.log(color);

    let updatedFlag = false; // 判断颜色是否更新

    if (color.hsv) {
      if (!this.hsv || this.hsv[0] !== color.hsv[0])
        this.huebgrgb = this.hsv2rgb([color.hsv[0], 1, 1]);
      this.hsv = color.hsv;
      this.rgb = this.hsv2rgb(color.hsv);

      updatedFlag = true;
    }
    if (color.rgb) {
      this.rgb = color.rgb;
      this.hsv = this.rgb2hsv(color.rgb);
      this.huebgrgb = this.hsv2rgb([this.hsv[0], 1, 1]);

      updatedFlag = true;
    }
    if (color.alpha !== undefined) {
      const alphaTemp =
        typeof color.alpha === 'string'
          ? Number(color.alpha.replace(/[^0-9\.]/g, ''))
          : color.alpha;
      this.alpha = Math.floor(alphaTemp * 100) / 100;

      updatedFlag = true;
    }

    if (
      color.h !== undefined ||
      color.s !== undefined ||
      color.v !== undefined
    ) {
      if (!this.hsv || this.hsv[0] !== color.h)
        this.huebgrgb = this.hsv2rgb([color.h, 1, 1]);
      if (color.h !== undefined) this.hsv = [color.h, this.hsv[1], this.hsv[2]];
      if (color.s !== undefined) this.hsv = [this.hsv[0], color.s, this.hsv[2]];
      if (color.v !== undefined) this.hsv = [this.hsv[0], this.hsv[1], color.v];
      return this.updateColor({
        hsv: this.hsv,
      });
    }
    if (
      color.r !== undefined ||
      color.g !== undefined ||
      color.b !== undefined
    ) {
      if (color.r !== undefined) this.rgb = [color.r, this.rgb[1], this.rgb[2]];
      if (color.g !== undefined) this.rgb = [this.rgb[0], color.g, this.rgb[2]];
      if (color.b !== undefined) this.rgb = [this.rgb[0], this.rgb[1], color.b];
      this.type = 'rgb';
      return this.updateColor({
        rgb: this.rgb,
      });
    }

    if (updatedFlag === false) return color;

    console.log(this.rgb);
    console.log(this.alpha);
    if (this.type === 'hex') {
      if (this.alpha < 1) return this.rgb2hex([...this.rgb, this.alpha]);
      return this.rgb2hex(this.rgb);
    } else if (this.type === 'rgb') {
      if (this.alpha < 1) return `rgba(${this.rgb.join(',')},${this.alpha})`;
      return `rgb(${this.rgb.join(',')})`;
    }
  }

  rgb2hex(rgb) {
    let aRgb;
    if (rgb instanceof Array) {
      aRgb = rgb;
    } else if (typeof rgb === 'string') {
      aRgb = rgb.split(',');
    } else {
      aRgb = [0, 0, 0];
    }
    let temp;
    aRgb = aRgb.map(x =>
      typeof x === 'string' ? Number(aRgb[0].replace(/[^0-9\.]/g, '')) : x,
    );
    return (
      '#' +
      [
        (temp = aRgb[0].toString(16)).length === 1 ? '0' + temp : temp,
        (temp = aRgb[1].toString(16)).length === 1 ? '0' + temp : temp,
        (temp = aRgb[2].toString(16)).length === 1 ? '0' + temp : temp,
        aRgb[3] !== undefined
          ? (temp = Math.round(aRgb[3] * 255).toString(16)).length === 1
            ? '0' + temp
            : temp
          : '',
      ].join('')
    );
  }

  hex2rgb(hex) {
    hex = hex.trim();
    if (hex[0] === '#') hex = hex.substr(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 4) {
      hex =
        hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex.length === 6
      ? [
          parseInt(hex[0] + hex[1], 16),
          parseInt(hex[2] + hex[3], 16),
          parseInt(hex[4] + hex[5], 16),
        ]
      : hex.length === 8
      ? [
          parseInt(hex[0] + hex[1], 16),
          parseInt(hex[2] + hex[3], 16),
          parseInt(hex[4] + hex[5], 16),
          parseInt(hex[6] + hex[7], 16) / 255,
        ]
      : [0, 0, 0];
  }

  hsv2rgb([h, s, v]) {
    const hi = Math.floor(h / 60);
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let _r;
    let _g;
    let _b;
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
      Math.floor((_b + m) * 255),
    ];
  }
  rgb2hsv([r, g, b]) {
    const _r = r / 255;
    const _g = g / 255;
    const _b = b / 255;
    const cmax = Math.max(_r, _g, _b);
    const cmin = Math.min(_r, _g, _b);
    const theta = cmax - cmin;
    let h;
    let s;
    let v;
    if (theta === 0) {
      h = 0;
    } else {
      if (cmax === _r) h = 60 * (((_g - _b) / theta) % 6);
      if (cmax === _g) h = 60 * ((_b - _r) / theta + 2);
      if (cmax === _b) h = 60 * ((_r - _g) / theta + 4);
    }
    s = cmax === 0 ? 0 : theta / cmax;
    // if (cmax === 0) {
    //   s = 0;
    // } else {
    //   s = theta / cmax;
    // }
    v = cmax;
    return [h, s, v];
  }
}
