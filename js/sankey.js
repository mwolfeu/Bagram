function onSankeyMouseOverClickNode(d, i) {
  JPP.destKeys.includes(d.name)?console.log('dest'):console.log('src');
}



class sankeyVis {
  constructor (data, targetColors) {
  
    const svg = d3.select("#sankey-svg")
      .attr("viewBox", [0, 0, width, height]);

    const {nodes, links} = sankey(data);

    // 
    const link = svg.append("g")
        .attr("fill", "none")
      .selectAll("g")
      .data(links)
      .join("g")
        .style("mix-blend-mode", "multiply");

    // var edgeColor = "none";
    
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

    // LINK PATHS
    link.append("path")
        // .style("opacity", 0.5)
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d,i) => d3.rgb(targetColors[d.target.name]).darker(1.7))// color(d.target.name))
        //.attr("stroke", d => edgeColor === "none" ? "blue" 
            //~ : edgeColor === "path" ? d.uid 
            //~ : edgeColor === "input" ? color(d.source.name) 
            //~ : color(d.target.name))
        .attr("stroke-width", d => Math.max(1, d.width))
        // .style("transform", "translateX(" + rShift + "px)")
        .attr("data-name", d => d.source.name)
        .attr("data-subj", d => d.target.name)
        .style('opacity', '0')
        .on("click", d => onSelectInstance(d.source.name, d.target.name))
        //.on("mouseover", d => onSelectInstance(d.source.name, d.target.name));

    // POPUP
    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

    // NODES
    svg.append("g")
        // .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
        .attr("class", "node")
        // .attr("x", d => d.x0 + rShift)
        .attr("x", d => d.x0 < width / 2 ?d.x0+2:d.x0-2)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => JPP.destKeys.includes(d.name)?targetColors[d.name]:"lightgray")
        .attr("stroke", d => JPP.destKeys.includes(d.name)?targetColors[d.name]:"lightgray")
        // .on("click", onSankeyMouseOverClickNode)
        // .on("mouseover", onSankeyMouseOverClickNode)
      .append("title")
        .text(d => `${d.name}\n${format(d.value)}`);

    // $('#sankey .node').css("width", "5px");

    // NODE LABELS
    svg.append("g")
        //.style("font", "8px sans-serif")
        .style("font", "4px Lato")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x0 < width / 2 ? (d.x1 + 6 + 2): (d.x0 - 6 + 10)) // + (rShift + JPP.destKeys.includes(d.name)?10:35 ) )
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);

    $('path').each( function(i,e,t){ setTimeout ((t) => {$(t).css('opacity', "") }, i*.2 * 100, this) } );
  }
  
  resetPaths() {
    $(`#vis #sankey path`).removeClass("selected unselected");
  }
  
  selectPath(n, s) { // name, subject
    $(`#vis #sankey path`).removeClass("selected").addClass("unselected");
    $(`#vis #sankey path[data-name='${n}']`).removeClass("unselected").addClass("selected");
    $(`#vis #sankey path[data-name='${n}']`).css("stroke", "");
    $(`#vis #sankey path[data-name='${n}'][data-subj='${s}']`).css("stroke", d3.rgb(JPP.targetColors[s]).darker(.5));
  }
}
