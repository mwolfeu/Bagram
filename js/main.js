

// d3.json("https://gist.githubusercontent.com/mbostock/ca9a0bb7ba204d12974bca90acc507c0/raw/398136b7db83d7d7fd89181b080924eb76041692/energy.json").then(chart);
JPP = {};

width = 400;
height = 570;
rShift = 1;

sankey = function() {
  const sankey = d3.sankey()
      //.nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(0.2)
      .nodePadding(10)
      .extent([[1, 5], [width - (rShift * 2) - 1, height - 5]]);
  sankey.nodeId(d => d.name); // accessor

  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}();

format = function() {
  const f = d3.format(",.0f");
  return d => `${f(d)} Accounts`;
}();

//~ color = function() {
  //~ const color = d3.scaleOrdinal(d3.schemeSet3);
  //~ return name => color(name.replace(/ .*/, ""));
//~ }()

// n == name of .node
function scrollTo(n) {
  var svgHeight = $('#sankey svg').height();
  var viewportHeight = $('#sankey').height();
  var fraction = svgHeight / height;

  // get node y
  var nodeY = +$(`.node[data-name='${n}']`).attr("y");
  $('#sankey').animate( {scrollTop: nodeY * fraction }, 300);

  //~ var sankeyTop = $('#sankey').position().top;
  //~ var sankeyHeight = $('#sankey').height();
  //~ var nodeTop = $(`.node[data-name="${n}"]`).position().top;
  //~ var fraction = (height/sankeyHeight);

  //~ $('#sankey').animate( {scrollTop: 0 }, 0)
  //~ // $('#sankey').animate( {scrollTop: ((nodeTop+sankeyTop)*fraction) }, 500);
  //~ $('#sankey').animate( {scrollTop: ((nodeTop-sankeyTop)) }, 400);
  // $('#sankey').animate( {scrollTop: ((nodeTop*fraction)-sankeyTop) }, 500);
}

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

  BUG: when paths selected / delete them and draw on top
  x map

  ? order bars by some logic
  ? breathing path
  X click on bottom bar => scroll AND HIGHLIGHT OTHER node
  enhancement: relate scroll to viewport height
*/

var dispData = {
    "name":{icon:"user-regular.svg"},
    "age":{icon:"hourglass-half-solid.svg"},
    "job":{icon:"tools.svg"},
    "detained":{icon:"calendar-alt-regular.svg"},
    "num-words":{icon:"file-alt-regular.svg"}
};

function infoDisp(n,s) {

  $("#context #header #subject").html(s + ": ");
  $("#context #header #count").html(" 3 of 10 ");

  var d = JPP.accountsByName[n][0];
  dispData.name.val = d.name;
  dispData.age.val = d.detentionAge + " years";
  dispData.job.val = d.job;
  dispData.detained.val = d.detentionMonths + " months";
  dispData["num-words"].val = d.text.split(' ').length + " words";

  var xlateTxt = {
    name:"Name:",
    age:"Age:",
    job:"Work:",
    detained:"Detainment:",
    "num-words":"Length:"
  };

  var html = [];
  Object.keys(dispData).forEach(d => {
    if (d == 'name') {
      html.push(`<div id="${d}" class="info-xtra"> <b> ${dispData[d].val}'s Story: </b> </div>`);
      return;
    }
    html.push(`<div id="${d}"> <img class="info-icons" src="img/${dispData[d].icon}"><span class="info-xtra"><b>${xlateTxt[d]}</b></span> ${dispData[d].val}</div>`);
    });

  $("#context #info").html( $('<div>' + html.join(' ') + ' <img class="info-icons map" src="img/map-marked-alt-solid.svg"> </div>' ));
  tippy("#context #info .map", { // map popup
    content: "Destination: Jalalabad <br><img id='map-info' style='height:35vh;width:50vw' src='img/travel.png'>",
    animation: "shift-away",
    arrow: false,
    placement: "left-end",
    trigger: "click mouseenter",
    inertia: true,
    // followCursor: true
  });
}

$( document ).ready(function() {
  JPP.destKeys = Object.keys(codedInterview.accounts[0].destNodes);
  JPP.accountsByName = d3.nest().key(k => k.name).object(codedInterview.accounts);

  // start page
  var xToggle = true;
  $(".intro").css("background", (i,e) => `url(${"img/dawn/"+i+".jpg"}) no-repeat center`);
  $($(".intro").get().reverse()).each(function(i,e){
    var tOut = 1700;

    if (i==6) {
      $(this).css("opacity","1").css("background-size", "120%"); // show last picture
      // transition to color
      setTimeout(d => $(this).css("filter", "grayscale(0)"), (i+2)*tOut);
      // fade last picture
      // mw STOP DEMO - var pause = (i+4)*tOut;
      var pause = (3)*tOut;
      setTimeout(d => { $(this).fadeOut(2000, "linear"); $("#intro-background").fadeOut(1000);}, pause);
    } else {
      var rx = ($("body").width()*0.9)/2;
      var ry = ($("body").height()*0.9)/2;
      var x = d3.scaleRadial().domain([0, 1]).range([0,xToggle?rx:-rx])(Math.random());
      var y = d3.scaleRadial().domain([0, 1]).range([-ry,ry])(Math.random());
      xToggle = !xToggle;

      $(this).css("transform",`scale(0.5) translate(${x}px,${y}px)`);
      // MW - STOP CHEEZY DEMO
      // setTimeout(d => $(this).css("opacity", ".6"), (i)*tOut); // fade in
      // setTimeout(d => $(this).fadeOut(1000), (i+1)*tOut); // fade out
      $(this).css("display","none");// MW - STOP CHEEZY DEMO
    }
    });

  $("#intro-background").fadeOut(1000);
  // info
  $("#info").on("mouseover", d => $('#info .info-xtra').addClass("widen"));
  $("#info").on("mouseout", d => $('#info .info-xtra').removeClass("widen"));

  // sankey
  var destNodes = JPP.destKeys.map(d => {return {name:d};});
  var nodes = codedInterview.accounts.map(d => {return {name:d.name};}).concat(destNodes);
  var links = codedInterview.accounts.map((d,i) => {
    var ciaN = codedInterview.accounts[i];
    return JPP.destKeys.map(e => {return {source:ciaN.name, target:e, value:(ciaN.destNodes[e].length)};});
    }).flat();
  JPP.targetColors = {};
  JPP.destKeys.forEach((d,i) =>  JPP.targetColors[d] = d3.schemeSet3[i]);

  JPP.sankey = new sankeyVis({nodes, links}, JPP.targetColors);

  // context ui
  var cData = d3.nest().key(k => k.name).rollup(r => { return{corpus:r[0].text, context: r[0].destNodes};}).object(codedInterview.accounts);
  JPP.ctx = new context("#context", cData);

  // comparison chart
  comparisonChartInit();

  // click outside == reset vis
  $("#top").on("click", onResetInstance);

  tippy("#bottom #howto #about", {
      content: "Site &copy; 2019 Michael Wolf<br>Source Data &copy; 2019 JPP",
      animation: "shift-away",
      arrow: true,
      inertia: true,
      // followCursor: true
    });
});
