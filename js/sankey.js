function sankeyVis (data) {
  
  const svg = d3.select("svg")
    //~ .attr("width", width)
    //~ .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey(data);

  svg.append("g")
      // .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0 + rShift)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => JPP.destKeys.includes(d.name)?color(d.name):"brown")
      .attr("stroke", d => JPP.destKeys.includes(d.name)?color(d.name):"brown")
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");

  var edgeColor = "none";
  
  //~ if (edgeColor === "path") {
    //~ const gradient = link.append("linearGradient")
        //~ .attr("id", d => (d.uid = DOM.uid("link")).id)
        //~ .attr("gradientUnits", "userSpaceOnUse")
        //~ .attr("x1", d => d.source.x1)
        //~ .attr("x2", d => d.target.x0);

    //~ gradient.append("stop")
        //~ .attr("offset", "0%")
        //~ .attr("stop-color", d => color(d.source.name));

    //~ gradient.append("stop")
        //~ .attr("offset", "100%")
        //~ .attr("stop-color", d => color(d.target.name));
  //~ }

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => color(d.target.name))
      //.attr("stroke", d => edgeColor === "none" ? "blue" 
          //~ : edgeColor === "path" ? d.uid 
          //~ : edgeColor === "input" ? color(d.source.name) 
          //~ : color(d.target.name))
      .attr("stroke-width", d => Math.max(1, d.width))
      .style("transform", "translateX(" + rShift + "px)");

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6 + (rShift + 10) )
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start") // d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  return svg.node();
}
