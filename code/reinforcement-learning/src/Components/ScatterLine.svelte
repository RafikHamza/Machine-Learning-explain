<script>
  import { scaleLinear } from "d3-scale";
  import QChartLine from "./QChartLine.svelte";
  import { lineWidth } from "../data-store";

  export let numX = 8;
  export let numY = 1;

  let data = [];
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  $: width = $lineWidth * 8;
  $: height = $lineWidth;

  $: cellWidth = width / numX;
  $: cellHeight = height / numY;

  // // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, width]);
  $: yScale = scaleLinear().domain([0, numY]).range([0, height]);
</script>

<svg {width} {height}>
  {#each data as d, i}
    <g transform="translate({xScale(d.x)}, {yScale(d.y)})">
      <QChartLine index={i} width={cellWidth - 0} height={cellHeight - 0} />
    </g>
  {/each}
</svg>

<style>
  svg {
    border: 4px solid black;
    /* background-color: white; */
    margin: 20px;
  }
</style>
