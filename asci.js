const canvas = document.getElementById("myCanvas");
const tcanvas = document.getElementById("textCanvas");
const scanvas = document.getElementById("sobCanvas");
const ctx = canvas.getContext("2d");
const ctx2 = tcanvas.getContext("2d");
const sctx = scanvas.getContext("2d");
const image = document.getElementById("scream");

// let texture2 = "█@?OPoc:.■"
let texture2 = " .:coPO?@■"
// let conTexture = "\\_//|"
let conTexture = "\\|/_"
// let conTexture = "_/|\\"
// let texture2 = " .:coPO?@■"

function lum2char(lum) {
  lum = lum / 255
  // let bucket = Math.floor(lum * 10) / 10
  // console.log(bucket)
  return texture2[Math.floor(lum * 10)]
}

function getKernel(ksize, sigma) {
  let ret = []
  let s2 = Math.pow(sigma, 2)
  for (let i = parseInt(-ksize / 2); i <= parseInt(ksize / 2); i++) {
    let val = Math.pow(Math.E, -1 * ((i * i) / (2 * s2))) / (Math.sqrt(2 * Math.PI * s2))
    ret.push(val)
  }

  let sum = ret.reduce((a, b) => a + b, 0)
  return ret
}

let argn = 1;
function applyKernel(kernel, data, x) {
  let ksize = kernel.length
  let w = Math.floor(Math.sqrt(data.length))
  let sum = 0
  for (let k = parseInt(-ksize / 2); k <= parseInt(ksize / 2); k++) {
    let ind = Math.max((parseInt(x / w) * w), Math.min(x + (k * argn), ((parseInt(x / w) + 1) * (w)) - 1))
    // console.log(
    //   w,
    //   parseInt(x / w) * w,
    //   x + (k * argn),
    //   (parseInt(x / w) + 1),
    //   ind, data[ind], data
    // )
    let cont = kernel[k + parseInt(ksize / 2)] * data[ind]
    sum += Math.min(cont, 255)
    // data[x] = Math.min(data[x] + cont, 255)
    // console.log(data[x], "h")
  }
  data[x] = sum

  // console.log(data[x], "f")

  // for (let k = parseInt(-ksize / 2); k <= parseInt(ksize / 2); k++) {
  //   let ind = Math.max(0, Math.min(x + (k * (w - 1)), data.length - 1))
  //   data[x] += kernel[k + parseInt(ksize / 2)] * data[ind]
  // }
}
function applyKernelY(kernel, data, x) {
  let ksize = kernel.length
  let w = Math.floor(Math.sqrt(data.length))
  let sum = 0
  // for (let k = parseInt(-ksize / 2); k <= parseInt(ksize / 2); k++) {
  //   let ind = Math.max((parseInt(x / w) * w), Math.min(x + (k * argn), ((parseInt(x / w) + 1) * w) - 1))
  //   // console.log(
  //   //   w,
  //   //   parseInt(x / w) * w,
  //   //   x + (k * argn),
  //   //   (parseInt(x / w) + 1),
  //   //   ind, data[ind], data
  //   // )
  //   let cont = kernel[k + parseInt(ksize / 2)] * data[ind]
  //   if (cont !== NaN) {

  //   }
  //   sum += Math.min(cont, 255)
  //   // data[x] = Math.min(data[x] + cont, 255)
  //   // console.log(data[x], "h")
  // }
  for (let k = parseInt(-ksize / 2); k <= parseInt(ksize / 2); k++) {
    let ind = Math.max(x % w, Math.min(x + (k * (w)), data.length - (w - (x % w))))
    // console.log(x % w, x + (k * (w)), data.length - (w - (x % w)))
    sum += kernel[k + parseInt(ksize / 2)] * data[ind]
    // console.log(data[x], data[ind], ind, k)
  }
  data[x] = sum

  // console.log(data[x], "f")

}

let test = [50, 60, 70, 80, 90, 100, 110, 120, 130]
// .map(x => [x, x, x, x]).flat(3)

// console.log(test)
let kernelt = [0.25, 0.5, 0.25]

// for (let ind = 0; ind < test.length; ind++) {
//   applyKernel(kernelt, test, ind)
// }
// for (let ind = 0; ind < test.length; ind++) {
//   applyKernelY(kernelt, test, ind)
// }

// console.log(test)

// 1, 2, 3
// 1, 2, 3
// => 1, 2, 3, 1, 2, 3 => 1 -- 4
// => 1.r,1.g,1.b,1.a 2.r,2.g,2.b,2.a 3.r,3.g,3.b,3.a 1.r,1.g,1.b,1.a 2.r,2.g,2.b,2.a 3.r,3.g,3.b,3.a


// console.log(getKernel(7, 1))
//
function conv2d(kernel, data) {
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += kernel[i] * data[i]
  }
  return sum
}

function applyOp(data) {
  // console.log(data)
  let w = Math.floor(Math.sqrt(data.length))
  let kw = 3 - 1
  let x = 0
  let y = 0
  let ret = []
  let angs = []
  for (let i = 0; i < data.length - (kw * w); i++) {
    if (((i % w) + kw) >= w) {
      continue
    }
    console.log("iteration: ", `y: ${parseInt(i / w)}, x: ${i % w}`)
    let chunk = []
    for (let j = 0; j <= kw; j++) {
      for (let m = 0; m <= kw; m++) {
        chunk.push(data[j * w + i + m])
      }
    }
    let kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    let kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    let gx = conv2d(kernelX, chunk)
    let gy = conv2d(kernelY, chunk)
    let theta = ((Math.atan2(gy, gx) / Math.PI) * 0.5) + 0.5
    let mg = Math.sqrt((gx * gx) + (gy * gy))
    // console.log(theta, mg)
    angs.push(theta)
    ret.push(mg)
  }

  let ma = Math.max(...ret)
  ret = ret.map(x => (x / ma) * 255)
  // angs = angs.map((x, i) => {
  //   console.log(ret[i], angs[i])
  //   if (ret[i] < 2) {
  //     return 0
  //   } else {
  //     return x
  //   }
  // })
  console.log(angs)
  return [ret, angs]
}

let kerng = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
let optest = [
  150, 150, 150, 255, 255, 255,
  150, 150, 255, 255, 255, 255,
  150, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255,
]

function putGBlur(sigma, rsa, gsa, bsa, data) {
  let rs = Array.from(rsa)
  let gs = Array.from(gsa)
  let bs = Array.from(bsa)
  console.log([rs, gs, bs])

  let kerneltr = getKernel(6 * sigma + 1, sigma)
  for (let li of [rs, gs, bs]) {
    for (i = 0; i < li.length; i++) {
      applyKernel(kerneltr, li, i)
    }
    for (i = 0; i < li.length; i++) {
      applyKernelY(kerneltr, li, i)
    }
  }


  return [rs, gs, bs]
  // console.log(data.length, rs, gs, bs)
  // for (let i = 0; i < data.length; i += 4) {
  //   data[i] = rs[i / 4];
  //   data[i + 1] = gs[i / 4];
  //   data[i + 2] = bs[i / 4];
  //   // data[i + 3] = 1;
  // }
}

function putdiffOfGaussians(sg1, sg2, rs, gs, bs, data) {
  let outs1 = putGBlur(sg1, rs, gs, bs, data)
  let outs2 = putGBlur(sg2, rs, gs, bs, data)
  let rf = [], gf = [], bf = [];
  let chs = [rf, gf, bf]
  for (let j = 0; j < outs1.length; j++) {
    let ch1 = outs1[j]
    let ch2 = outs2[j]
    console.log(ch1, ch2)

    // loop for these 2 channels and subtract the values
    // new loop return value is the rs for the final pic
    for (let i = 0; i < ch1.length; i++) {
      chs[j].push(ch1[i] - ch2[i])
    }
  }

  console.log(rf, gf, bf)
  // for (let i = 0; i < data.length; i += 4) {

  //   if (rf[i / 4] < 10) {
  //     data[i] = 0;
  //     data[i + 1] = 0;
  //     data[i + 2] = 0;
  //     data[i + 3] = 255;
  //   } else {
  //     data[i] = 255;
  //     data[i + 1] = 255;
  //     data[i + 2] = 255;
  //     data[i + 3] = 255;
  //   }
  // }

  return [rf, gf, bf]

}


// console.log(applyOp(optest))

ctx.drawImage(image, 0, 0, dwidth = 50, dheight = 50);
const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imgData.data;
image.addEventListener("load", (e) => {



  // ctx2.fillText("Hello World",10,80);
  // console.log(data)

  ctx2.fillStyle = "#036fba";
  ctx2.fillRect(0, 0, tcanvas.width, tcanvas.height);
  sctx.fillStyle = "black";
  sctx.fillRect(0, 0, scanvas.width, scanvas.height);


  // enumerate all pixels
  //
  // each pixel's r,g,b,a datum are stored in separate sequential array elements
  let buf = []
  let curr = []
  console.log(data.length)

  let rs = []
  let gs = []
  let bs = []
  let lums = []
  let inj = 0
  let ini = 0
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3];
    rs.push(red)
    gs.push(green)
    bs.push(blue)
    // console.log(red, green, blue, alpha)
    let gamma = 1.3
    // let gamma = 1.069
    let lum = (0.2126 * Math.pow(red, gamma)) + (0.7152 * Math.pow(green, gamma)) + (0.0722 * Math.pow(blue, gamma))
    // let lum = (red + blue + green) / 3
    // data[i] = data[i + 1] = data[i + 2] = lum
    lums.push(lum)
    let ch = lum2char(Math.min(lum, 254))
    console.log(ch, lum)
    if (!ch) {
      console.log(lum)
    }
    if (ini % 50 == 0 && ini !== 0) {
      ini = 0
      inj++
      buf.push(curr)
      curr = []
    }
    // console.log(curr)
    curr.push(ch)
    // ini++
    // console.log(inj, ini)
    // if( inj % 49 == 0) {
    //   inj = 0
    // }

    // ctx2.font = "8px Monospace";
    // ctx2.fillStyle = "#1651f0";
    // ctx2.fillText(ch, (ini++ * 8) + 2, (inj * 8) + 5);
    ini++
  }

  if (curr.length > 0) {
    buf.push(curr)
  }

  console.log("sobeling87")

  let diffs = putdiffOfGaussians(1, 2, rs, gs, bs, data)
  console.log(diffs)
  const lumFn = (red, green, blue, gamma) => (0.2126 * Math.pow(red, gamma)) + (0.7152 * Math.pow(green, gamma)) + (0.0722 * Math.pow(blue, gamma))

  console.log(diffs.length, rs.length)
  let diffedLums = diffs[0].map((x, i) => {
    let v = lumFn(diffs[0][i], diffs[1][i], diffs[2][i], 1)
    v = isNaN(v) ? 0 : v
    console.log(v, diffs[0][i], diffs[1][i], diffs[2][i])
    return v
  })

  console.log(diffedLums)


  let sobel = applyOp(lums)
  let sobeled = sobel[0]
  let w = Math.floor(Math.sqrt(data.length / 4))
  let sobImg = ctx.createImageData(w - 2, w - 2)
  let sdata = sobImg.data
  let ws = Math.floor(Math.sqrt(sdata.length / 4))
  let ini1 = 0
  let inj1 = 0

  let str = []
  for (let i = 0; i < sobeled.length; i++) {
    if (ini1 % ws == 0 && ini1 !== 0) {
      ini1 = 0
      inj1++
      str.push(curr)
    }
    sctx.font = "8px Monospace";
    sctx.fillStyle = `#f6ff00`;
    // console.log(ini1, inj1)
    // console.log(conTexture[Math.min(3, Math.max(0, Math.floor(sobel[1][i] * 4)))], Math.floor(sobel[1][i] * 4), sobel[1][i], i)
    //
    let ind = Math.min(3, Math.max(0, Math.floor(sobel[1][i] * 4)))

    // console.log(i * 4)
    // sdata[i * 4] = sobeled[i];
    // sdata[i * 4 + 1] = sobeled[i];
    // sdata[i * 4 + 2] = sobeled[i];
    // sdata[i * 4 + 3] = 255;

    // "_ / | \"
    // 120
    if (sobeled[i] > 90) {
      sctx.fillText(conTexture[ind], ini1++ * 8, inj1 * 8);
      buf[inj1][ini1] = conTexture[ind]
    } else {
      sctx.fillText(" ", ini1++ * 8, inj1 * 8);
    }

  }
  console.log(sdata, w)

  // sctx.putImageData(sobImg, 0, 0)

  ctx2.fillStyle = "#35213e";
  ctx2.fillRect(0, 0, tcanvas.width, tcanvas.height);
  for (let row = 0; row < w; row++) {
    for (let col = 0; col < w; col++) {
      // Calculate cell position
      const x = col * 8;
      const y = row * 8;

      // Draw the array value

      ctx2.font = "8px Monospace";
      // 036fba
      ctx2.fillStyle = "#c30550";

      if (buf[row][col].toString() == texture2[texture2.length - 1]) {
        ctx2.fillStyle = "#fec6dc";
      }
      else if (buf[row][col].toString() == texture2[texture2.length - 2]) {
        ctx2.fillStyle = "#fdbdd7";
      }
      else if (buf[row][col].toString() == texture2[texture2.length - 3]) {
        ctx2.fillStyle = "#fd9fc4";
      }
      else if (buf[row][col].toString() == texture2[texture2.length - 4]) {
        ctx2.fillStyle = "#fc81b2";
      }
      else if (buf[row][col].toString() == texture2[texture2.length - 5]) {
        ctx2.fillStyle = "#fb68a2";
      }
      else if (buf[row][col].toString() == texture2[texture2.length - 6]) {
        ctx2.fillStyle = "#fa478e";
      }

      else if (buf[row][col].toString() == texture2[texture2.length - 7]) {
        ctx2.fillStyle = "#fa2b7c";
      }

      else if (buf[row][col].toString() == texture2[texture2.length - 8]) {
        ctx2.fillStyle = "#f9126d";
      }

      else if (buf[row][col].toString() == texture2[texture2.length - 9]) {
        ctx2.fillStyle = "#e0065c";
      }

      else if (conTexture.includes(buf[row][col].toString())) {
        ctx2.fillStyle = "#936a8d";
      }
      // console.log(buf, ctx2)
      ctx2.fillText(buf[row][col].toString(), x - 1, y - 2);
    }
  }
  // let kerneltr = getKernel(19, 3)
  // for (let li of [rs, gs, bs]) {
  //   for (i = 0; i < li.length; i++) {
  //     applyKernel(kerneltr, li, i)
  //   }
  //   for (i = 0; i < li.length; i++) {
  //     applyKernelY(kerneltr, li, i)
  //   }
  // }

  // // console.log(data.length, rs, gs, bs)

  // for (let i = 0; i < data.length; i += 4) {
  //   data[i] = sobeled[i / 4];
  //   data[i + 1] = sobeled[i / 4];
  //   data[i + 2] = sobeled[i / 4];
  //   data[i + 3] = 255;
  // }
  ctx.putImageData(imgData, 0, 0);

  // console.log(buf)
});

const downloadCanvasAsImage = (canvas, fileName) => {
  let downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', `${fileName}.png`);
  // let canvas = document.getElementById(canvasName);
  canvas.toBlob(blob => {
    let url = URL.createObjectURL(blob);
    downloadLink.setAttribute('href', url);
    downloadLink.click();
  });
}

// downloadCanvasAsImage(tcanvas)

// let sobed =
