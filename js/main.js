
  
// d3.json("https://gist.githubusercontent.com/mbostock/ca9a0bb7ba204d12974bca90acc507c0/raw/398136b7db83d7d7fd89181b080924eb76041692/energy.json").then(chart);
JPP = {};

width = 400
height = 600
rShift = 1

// $('path').each( function(i,e,t){ setTimeout ((t) => {$(t).css('opacity', "") }, i*.2 * 1000, this) } );
// https://paradite.com/2016/04/30/d3-js-chained-transitions/
// https://github.com/d3/d3-transition delay()

sankey = function() {
  const sankey = d3.sankey()
      //.nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(.1)
      .nodePadding(40)
      .extent([[1, 5], [width - (rShift * 2) - 1, height - 5]]);
  sankey.nodeId(d => d.name); // accessor
  
  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}()

format = function() {
  const f = d3.format(",.0f");
  return d => `${f(d)} Accounts`;
}()

color = function() {
  const color = d3.scaleOrdinal(d3.schemeSet3);
  return name => color(name.replace(/ .*/, ""));
}()


function onSelectInstance(name, subj) {
  //console.log(d.target.name);
  infoDisp(name);
  JPP.sankey.selectPath(name, subj);
  JPP.ctx.selectEntry(name, subj);
}

function onResetInstance() {
  //console.log(d.target.name);
  JPP.sankey.resetPaths();
  JPP.ctx.resetEntries();
}

/*
  TODO  
  intro page (words?)
  
  sankey labels
  sankey categories?
  sankey window resize
  closest-to algorithm
  
  pointer
  popper (info)
  
  no mg
  
  widen hovered entry in JS
  top info in context-text
  * BUG: visible does not do TOTAL visibility
  interleaving text
  
  
  expanded context
  map
  
  bottom bars
  
  proper chapeau, howto
  font 
  colors

  x hover == link dep w ppl / dim others / highlight volume
  x click == selects network / shows text
  x click text == widens context

  flow the paths on start
*/  

function infoInit() {
  $('#root #info > *:not(:first)').hide();
}

var firstDisp = true;
var dispData = {
    "name":{icon:"user-regular.svg"},
    "age":{icon:"hourglass-half-solid.svg"},
    "job":{icon:"tools.svg"},
    "detained":{icon:"calendar-alt-regular.svg"},
    "num-words":{icon:"file-alt-regular.svg"}
}

function infoDisp(n) {
  var duration = 300;
  
  if (dispData.name.val == n) return;
  
  var d = JPP.accountsByName[n][0];
  dispData["name"].val = d.name;
  dispData["age"].val = d.detentionAge + " years";
  dispData["job"].val = d.job;
  dispData["detained"].val = d.detentionMonths + " months";
  dispData["num-words"].val = d.text.split(' ').length + " words";
  
  var html = [];
  Object.keys(dispData).forEach(d => {
    html.push(`<div id="${d}"> <img class="info-icons" src="img/${dispData[d].icon}">${dispData[d].val}</div>`)
    });
    
  $("#root #info").append( $('<div>' + html.join(' ') + '</div>').hide() );
  
  if (!firstDisp) {
    $('#root #info *:first').remove();
  } 
  firstDisp = false;
  
  $('#root #info > *:first')
      .fadeOut(duration)
      .next()
      .fadeIn(duration)
      .end();
}



$( document ).ready(function() {
  JPP.destKeys = Object.keys(codedInterview.accounts[0].destNodes);
  JPP.accountsByName = d3.nest().key(k => k.name).object(codedInterview.accounts);
  
  // info
  infoInit()
  
  // sankey
  var destNodes = JPP.destKeys.map(d => {return {name:d}});
  var nodes = codedInterview.accounts.map(d => {return {name:d.name}}).concat(destNodes);
  var links = codedInterview.accounts.map((d,i) => {
    var ciaN = codedInterview.accounts[i];
    return JPP.destKeys.map(e => {return {source:ciaN.name, target:e, value:ciaN.destNodes[e].length}});
    }).flat();
  
  JPP.sankey = new sankeyVis({nodes, links});
    
  // context ui
  var cData = d3.nest().key(k => k.name).rollup(r => { return{corpus:r[0].text, context: r[0].destNodes}}).object(codedInterview.accounts);
  JPP.ctx = new conText("#root #vis #context-wrapper #context-text", cData);

  $("#top, #info, #bottom").on("mouseover", onResetInstance)
});
