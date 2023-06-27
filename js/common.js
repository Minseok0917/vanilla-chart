const random = (max, min) => Math.round(Math.random() * (max - min)) + min;
const createData = (label) => ({ label, value: random(1000, 0) });
const createGraphCanvas = () => {
  const $canvas = document.createElement("canvas");
  const context = $canvas.getContext("2d");
  return {
    $canvas,
    context,
    setWidth: (width) => ($canvas.width = width),
    setHeight: (height) => ($canvas.height = height),
  };
};

function renderBarGraph({ width, height, textWidth, borderStyle, borderWeight, paddingLeft, paddingRight, paddingTop, paddingBottom, datas }) {
  const graph = createGraphCanvas();
  const { $canvas, context } = graph;
  graph.setWidth(width);
  graph.setHeight(height);

  const getStartX = () => borderWeight;
  const getEndX = () => width - borderWeight * 2;
  const getTextX = () => getStartX() + textWidth;
  const getGraphStartX = () => getTextX() + paddingLeft;
  const getGraphEndX = () => getEndX() - paddingRight;

  const getStartY = () => borderWeight;
  const getEndY = () => height - borderWeight * 2;
  const getGraphStartY = () => getStartY() + paddingTop;
  const getGraphEndY = () => getEndY() - paddingBottom;

  const graphWidth = getGraphEndX() - getGraphStartX();
  const graphHeight = getGraphEndY() - getGraphStartY();

  // renderRow
  const fontSize = 14;
  const numberLimit = 100;
  const maxValue = Math.max(...datas.map(({ value }) => value));
  const maxGraphCount = Math.ceil(maxValue / numberLimit);
  const rowLineLimit = graphHeight / maxGraphCount;

  // renderGraph
  const columnWidth = graphWidth / datas.length;
  const columnRatio = columnWidth / 10;
  const barWidth = columnRatio * 8;
  const gapWidth = columnRatio * 2;
  const barLimitY = graphHeight / maxValue;

  function renderCanvasLine() {
    context.beginPath();
    context.fillStyle = borderStyle;
    context.fillRect(0, 0, width, height);
    context.clearRect(getStartX(), getStartY(), getEndX(), getEndY());
  }

  function renderRow() {
    context.beginPath();
    context.fillStyle = borderStyle;
    context.fillRect(getTextX(), getGraphStartY(), borderWeight, graphHeight);

    for (let index = 0; index <= maxGraphCount; index++) {
      const y = getGraphEndY() - borderWeight - rowLineLimit * index;

      context.beginPath();
      context.textAlign = "end";
      context.font = `${fontSize}px serif`;
      context.fillText(index * numberLimit, textWidth - borderWeight - 5, y + fontSize / 2, textWidth);

      context.beginPath();
      context.fillStyle = borderStyle;
      context.fillRect(getTextX(), y, getGraphEndX() - getTextX(), borderWeight);
    }
  }
  function renderGraph() {
    datas.reduce((currentGraphX, { label, value }) => {
      const height = barLimitY * value;
      context.beginPath(); // bar
      context.fillStyle = "#333";
      context.fillRect(currentGraphX, getGraphEndY() - height, barWidth, height);

      context.beginPath(); // value
      context.textAlign = "center";
      context.font = `bold ${fontSize}px serif`;
      context.fillText(value, currentGraphX + barWidth / 2, getGraphEndY() - height - fontSize / 2);

      context.beginPath(); // label
      context.textAlign = "center";
      context.font = `${fontSize}px serif`;
      context.fillText(label, currentGraphX + barWidth / 2, getGraphEndY() + fontSize * 1.5);

      return currentGraphX + barWidth + gapWidth;
    }, getGraphStartX());
  }

  renderCanvasLine();
  renderRow();
  renderGraph();

  document.body.append($canvas);
}
function renderLineGraph({ width, height, textWidth, borderStyle, borderWeight, paddingLeft, paddingRight, paddingTop, paddingBottom, datas }) {
  const graph = createGraphCanvas();
  const { $canvas, context } = graph;
  graph.setWidth(width);
  graph.setHeight(height);

  const getStartX = () => borderWeight;
  const getEndX = () => width - borderWeight * 2;
  const getTextX = () => getStartX() + textWidth;
  const getGraphStartX = () => getTextX() + paddingLeft;
  const getGraphEndX = () => getEndX() - paddingRight;

  const getStartY = () => borderWeight;
  const getEndY = () => height - borderWeight * 2;
  const getGraphStartY = () => getStartY() + paddingTop;
  const getGraphEndY = () => getEndY() - paddingBottom;

  const graphWidth = getGraphEndX() - getGraphStartX();
  const graphHeight = getGraphEndY() - getGraphStartY();

  // renderRow
  const fontSize = 12;
  const numberLimit = 100;
  const maxValue = Math.max(...datas.map(({ value }) => value));
  const maxGraphCount = Math.ceil(maxValue / numberLimit);
  const rowLineLimit = graphHeight / maxGraphCount;

  // renderGraph
  const columnWidth = graphWidth / datas.length;
  const columnRatio = columnWidth / 10;
  const barWidth = columnRatio * 8;
  const gapWidth = columnRatio * 2;
  const barLimitY = graphHeight / maxValue;

  function renderCanvasLine() {
    context.beginPath();
    context.fillStyle = borderStyle;
    context.fillRect(0, 0, width, height);
    context.clearRect(getStartX(), getStartY(), getEndX(), getEndY());
  }

  function renderRow() {
    context.beginPath();
    context.fillStyle = borderStyle;
    context.fillRect(getTextX(), getGraphStartY(), borderWeight, graphHeight);

    for (let index = 0; index <= maxGraphCount; index++) {
      const y = getGraphEndY() - borderWeight - rowLineLimit * index;

      context.beginPath();
      context.textAlign = "end";
      context.font = `${fontSize}px serif`;
      context.fillText(index * numberLimit, textWidth - borderWeight - 5, y + fontSize / 2, textWidth);

      context.beginPath();
      context.fillStyle = borderStyle;
      context.fillRect(getTextX(), y, getGraphEndX() - getTextX(), borderWeight);
    }
  }
  function renderGraph() {
    context.beginPath();

    datas.reduce((currentGraphX, { label, value }, index) => {
      const height = barLimitY * value;
      if (index === 0) {
        context.moveTo(currentGraphX + barWidth / 2, getGraphEndY() - height);
      } else {
        context.lineTo(currentGraphX + barWidth / 2, getGraphEndY() - height);
      }
      return currentGraphX + barWidth + gapWidth;
    }, getGraphStartX());
    context.stroke();

    datas.reduce((currentGraphX, { label, value }, index) => {
      const height = barLimitY * value;
      context.beginPath();
      context.arc(currentGraphX + barWidth / 2, getGraphEndY() - height, 5, 0, Math.PI * 2);
      context.fill();

      context.beginPath(); // value
      context.textAlign = "center";
      context.font = `bold ${fontSize}px serif`;
      context.fillText(value, currentGraphX + barWidth / 2, getGraphEndY() - height - fontSize);

      context.beginPath(); // label
      context.textAlign = "center";
      context.font = `${fontSize}px serif`;
      context.fillText(label, currentGraphX + barWidth / 2, getGraphEndY() + fontSize * 1.5);
      return currentGraphX + barWidth + gapWidth;
    }, getGraphStartX());
  }

  renderCanvasLine();
  renderRow();
  renderGraph();

  document.body.append($canvas);
}

renderBarGraph({
  width: 1200,
  height: 400,
  textWidth: 50,
  borderStyle: "#999",
  borderWeight: 1,
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 30,
  paddingBottom: 50,
  datas: Array.from(Array(random(40, 3))).map((_, index) => createData(index + 1)),
});

renderLineGraph({
  width: 1200,
  height: 400,
  textWidth: 50,
  borderStyle: "#999",
  borderWeight: 1,
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 30,
  paddingBottom: 50,
  datas: Array.from(Array(random(40, 3))).map((_, index) => createData(index + 1)),
});
