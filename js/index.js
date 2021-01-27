const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const size = 20
const pixels = []

let mouseDown = false

Object.assign(canvas, {
  width: 500,
  height: 500
})

const line = (x1=0, y1=0, x2, y2) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

const getMouse = (e) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const refreshGrid = (clear) => {
  if(clear) {
    ctx.clearRect(0, 0, 500, 500)
  }

  ctx.fillStyle = "#000"
  for(let x = size; x < 500; x += size) {
    line(x, 0, x, 500)
  }

  for(let y = size; y < 500; y += size) {
    line(0, y, 500, y)
  }
}

const drawPixels = () => {
  for(const pixel of pixels) {
    for(let x = 0; x < 500; x += size) {
      for(let y = 0; y < 500; y += size) {
        if(pixel.x > x && pixel.x < x + size && pixel.y > y && pixel.y < y + size) {
          ctx.fillStyle = pixel.color
          ctx.fillRect(x, y, size, size)
        }
      }
    }
  }
}

const addPixel = ({x, y}) => {
  pixels.push({
    x, y, 
    color: "#000"
  })
  drawPixels()
}

canvas.addEventListener("mousemove", e => {
  if(mouseDown) {
    addPixel(getMouse(e))
  }
})

canvas.addEventListener("mousedown", e => {
  mouseDown = true
  addPixel(getMouse(e))
})

canvas.addEventListener("mouseup", e => {
  mouseDown = false
})

refreshGrid()