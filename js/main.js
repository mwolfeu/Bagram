/*
  TODO  
  x left names outside
  x left nodes same color
  X paths colored
  X endpoints colored

  hover == link dep w ppl / dim others / highlight volume
  click == selects network / shows text
  click text == widens context

  show - flow
*/  
  
// d3.json("https://gist.githubusercontent.com/mbostock/ca9a0bb7ba204d12974bca90acc507c0/raw/398136b7db83d7d7fd89181b080924eb76041692/energy.json").then(chart);
JPP = {};

$( document ).ready(function() {
  JPP.destKeys = Object.keys(codedInterview.accounts[0].destNodes);
  
  var destNodes = JPP.destKeys.map(d => {return {name:d}});
  var nodes = codedInterview.accounts.map(d => {return {name:d.name}}).concat(destNodes);
  var links = codedInterview.accounts.map((d,i) => {
    var ciaN = codedInterview.accounts[i];
    return JPP.destKeys.map(e => {return {source:ciaN.name, target:e, value:ciaN.destNodes[e].length}});
    }).flat();
    
  sankeyVis({nodes, links});
});
