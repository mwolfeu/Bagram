
  
// d3.json("https://gist.githubusercontent.com/mbostock/ca9a0bb7ba204d12974bca90acc507c0/raw/398136b7db83d7d7fd89181b080924eb76041692/energy.json").then(chart);
JPP = {};

width = 400
height = 700
rShift = 1

// $('path').each( function(i,e,t){ setTimeout ((t) => {$(t).css('opacity', "") }, i*.2 * 1000, this) } );
// https://paradite.com/2016/04/30/d3-js-chained-transitions/
// https://github.com/d3/d3-transition delay()

sankey = function() {
  const sankey = d3.sankey()
      //.nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(.2)
      .nodePadding(10)
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

//~ color = function() {
  //~ const color = d3.scaleOrdinal(d3.schemeSet3);
  //~ return name => color(name.replace(/ .*/, ""));
//~ }()


function onSelectInstance(name, subj) {
  //console.log(d.target.name);
  infoDisp(name, subj);
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
  
  X sankey fix label location
  X click on dest path to change hilight text / undarken path
  
  X pointer
  popper info, path, map, about
  
  X highlight txt
  X scroll to text

  map
  bottom bars / clicking on nodes / rid of reset
  X proper howto
  
  X font 
  X colors

  x hover == link dep w ppl / dim others / highlight volume
  x click == selects network / shows text
  x click text == widens context

  X flow the paths on start
*/  

//~ function infoInit() {
  //~ $('#root #info > *:not(:first)').hide();
//~ }

// var firstDisp = true;
var dispData = {
    "name":{icon:"user-regular.svg"},
    "age":{icon:"hourglass-half-solid.svg"},
    "job":{icon:"tools.svg"},
    "detained":{icon:"calendar-alt-regular.svg"},
    "num-words":{icon:"file-alt-regular.svg"}
}

function infoDisp(n,s) {
  // var duration = 300;
  
  // if (dispData.name.val == n) return;
  
  $("#context #header #subject").html(s + ": ");
  $("#context #header #count").html(" 3 of 10 ");
  
  var d = JPP.accountsByName[n][0];
  dispData["name"].val = d.name;
  dispData["age"].val = d.detentionAge + " years";
  dispData["job"].val = d.job;
  dispData["detained"].val = d.detentionMonths + " months";
  dispData["num-words"].val = d.text.split(' ').length + " words";
  
  var html = [];
  Object.keys(dispData).forEach(d => {
    if (d == 'name') {
      html.push(`<div id="${d}"> <b> ${dispData[d].val}'s Story: </b> </div>`)
      return;
    }
    html.push(`<div id="${d}"> <img class="info-icons" src="img/${dispData[d].icon}">${dispData[d].val}</div>`)
    });
    
  $("#context #info").html( $('<div>' + html.join(' ') + ' <img class="info-icons map" src="img/map-marked-alt-solid.svg"> </div>' ));
  
  //~ if (!firstDisp) {
    //~ $('#context #info *:first').remove();
  //~ } 
  //~ firstDisp = false;
  
  //~ $('#context #info > *:first')
      //~ .fadeOut(duration)
      //~ .next()
      //~ .fadeIn(duration)
      //~ .end();
}



$( document ).ready(function() {
  JPP.destKeys = Object.keys(codedInterview.accounts[0].destNodes);
  JPP.accountsByName = d3.nest().key(k => k.name).object(codedInterview.accounts);
  
  // info
  // infoInit()
  
  // sankey
  var destNodes = JPP.destKeys.map(d => {return {name:d}});
  var nodes = codedInterview.accounts.map(d => {return {name:d.name}}).concat(destNodes);
  var links = codedInterview.accounts.map((d,i) => {
    var ciaN = codedInterview.accounts[i];
    return JPP.destKeys.map(e => {return {source:ciaN.name, target:e, value:(ciaN.destNodes[e].length)}});
    }).flat();
  JPP.targetColors = {};
  JPP.destKeys.forEach((d,i) =>  JPP.targetColors[d] = d3.schemeSet3[i]); 
  
  JPP.sankey = new sankeyVis({nodes, links}, JPP.targetColors);
    
  // context ui
  var cData = d3.nest().key(k => k.name).rollup(r => { return{corpus:r[0].text, context: r[0].destNodes}}).object(codedInterview.accounts);
  JPP.ctx = new context("#context", cData);

  $("#top, #bottom").on("mouseover", onResetInstance)
});
