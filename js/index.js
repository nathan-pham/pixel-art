const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const size = 50

let mouseDown = false
let pixels = []
let settings = {
  color: "#000",
  tool: "pen"
}

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

const constrain = (coord) => {
  return Math.floor(coord / size) * size
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

  ctx.strokeStyle = "#eee"
  for(let x = size; x < 500; x += size) {
    line(x, 0, x, 500)
  }

  for(let y = size; y < 500; y += size) {
    line(0, y, 500, y)
  }
}

const drawPixels = () => {
  for(const pixel of pixels) {
    const { x, y, color } = pixel
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
  }
}

const erasePixel = ({ x, y }) => {
  x = constrain(x)
  y = constrain(y)

  const exists = pixels.find(pixel => (
    pixel.x == x && pixel.y == y
  ))

  if(exists) {
    pixels = pixels.filter(v => v !== exists)
  }
  
  refreshGrid(true)
  drawPixels()
}

const addPixel = ({ x, y }) => {
  x = constrain(x)
  y = constrain(y)

  const exists = pixels.find(pixel => (
    pixel.x == x && pixel.y == y
  ))

  if(exists) {
    pixels = pixels.filter(v => v !== exists)
  }

  pixels.push({ x, y, color: settings.color })
  drawPixels()
}

const manageTool = (e) => {
  switch(settings.tool) {
    case "pen":
      addPixel(getMouse(e))
      break
    case "eraser": 
      erasePixel(getMouse(e))
      break
  }
}

canvas.addEventListener("mousemove", e => {
  if(mouseDown) {
    manageTool(e)
  }
})

canvas.addEventListener("mousedown", e => {
  mouseDown = true
  manageTool(e)
})

document.body.addEventListener("mouseup", e => {
  mouseDown = false
})

document.addEventListener("visibilitychange", e => {
  mouseDown = false
})

refreshGrid()

const tools = document.querySelectorAll(".interact-canvas")
const saveTool = document.querySelector("button[title='save']")
const colorTool = document.querySelector("button[title='color']")

const removeActive = () => {
  for(const tool of tools) {
    tool.classList.remove("active")
  }
}

const initializeTools = () => {
  for(const tool of tools) {
    tool.addEventListener("click", (e) => {
      settings.tool = tool.getAttribute("title")
      removeActive()
      tool.classList.add("active")
    })
  }
}

initializeTools()

saveTool.onclick = () => {
  console.log("TEST")
}

/*
        <button class="tool" title="pen">
          <i class="fas fa-pen"></i>
        </button>
        <button class="tool" title="color">
          <i class="fas fa-palette"></i>
        </button>
        <button class="tool" title="eraser">
          <i class="fas fa-eraser"></i>
        </button>
        <button class="tool align-self-end" title="save">
          <i class="far fa-save"></i>
        </button>
 */