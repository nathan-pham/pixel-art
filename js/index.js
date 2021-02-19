// initialize canvas
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const size = 50

let mouseDown = false
let pixels = []
let previous = {}
let settings = {
  color: "#000000",
  tool: "pen"
}

Object.assign(canvas, {
  width: 500,
  height: 500
})

// draw a line
const line = (x1=0, y1=0, x2, y2) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

// map x & y into grid space
const constrain = (coord) => {
  return Math.floor(coord / size) * size
}

// get mouse coordinates on canvas
const getMouse = (e) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

// clear everything
const removeGrid = () => {
  ctx.clearRect(0, 0, 500, 500)
}

// redraw lines
const refreshGrid = (clear) => {
  if(clear) {
    removeGrid()
  }

  ctx.strokeStyle = "#eee"
  for(let x = size; x < 500; x += size) {
    line(x, 0, x, 500)
  }

  for(let y = size; y < 500; y += size) {
    line(0, y, 500, y)
  }
}

// draw all pixels
const drawPixels = () => {
  for(const pixel of pixels) {
    const { x, y, color } = pixel
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
  }
}

// remove a pixel
const erasePixel = ({ x, y, color }) => {
  x = constrain(x)
  y = constrain(y)

  const exists = pixels.find(pixel => (
    pixel.x == x && pixel.y == y
  ))

  if(exists) {
    pixels = pixels.filter(v => v !== exists)
    previous = { type: "re-add", pixel: exists }
  }
  
  refreshGrid(true)
  drawPixels()
}

// add a pixel
const addPixel = ({ x, y, color }) => {
  x = constrain(x)
  y = constrain(y)

  const exists = pixels.find(pixel => (
    pixel.x == x && pixel.y == y
  ))

  if(exists) {
    pixels = pixels.filter(v => v !== exists)
  }

  const pixel = {
    x, y, color: color || settings.color
  }

  pixels.push(pixel)

  previous = { type: "remove", pixel }
 
  drawPixels()
}

// tool management
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

// clicking
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

// tools
const tools = document.querySelectorAll(".interact-canvas")
const saveTool = document.querySelector("button[title='save']")
const colorTool = document.querySelector("button[title='color']")
const colorOptions = colorTool.getElementsByClassName("colors")[0].querySelectorAll("div")

const removeActiveTools = () => {
  for(const tool of tools) {
    tool.classList.remove("active")
  }
}

const removeActiveColors = () => {
  for(const color of colorOptions) {
    color.classList.remove("active")
  }
}

// create color pallete
// initialize pen & eraser tool
const initializeTools = () => {
  for(const color of colorOptions) {
    const hex = "#" + color.dataset.color
    color.style.background = hex
    color.setAttribute("title", hex)
    color.addEventListener("click", () => {
      settings.color = hex
      removeActiveColors()
      color.classList.add("active")
    })
  }

  for(const tool of tools) {
    tool.addEventListener("click", (e) => {
      settings.tool = tool.getAttribute("title")
      removeActiveTools()
      tool.classList.add("active")
    })
  }
}

initializeTools()

// save pixel art
saveTool.onclick = () => {
  const anchor = document.createElement("a")
  Object.assign(anchor.style, {
    opacity: 0,
    display: "none"
  })
  document.body.appendChild(anchor)

  removeGrid()
  drawPixels()

  anchor.setAttribute("download", "pixel-art.png")
  anchor.setAttribute("href", 
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  )

  anchor.click()
  anchor.remove()

  refreshGrid()
  drawPixels()
}


document.addEventListener("keydown", (e) => {
  if (event.ctrlKey && event.key === 'z') {
    const { type, pixel } = previous
    type == "remove"
      ? erasePixel(pixel)
      : addPixel(pixel)
  }
})
