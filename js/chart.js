function comparisonChartInit() {
  
    JPP.comparisonChart = c3.generate({
    bindto: '#chart',
    size: {
      width: 400,
      height: 75
    },
    //~ padding: {
      //~ top: 20
    //~ },
    //~ onmouseover: function () { ... }
    //~ onmouseout: function () { ... }
    data: {
      columns: [
        ['data0', 0,0,0,0,0,0,0,0,0,0,0,0]
      ],
      type: 'bar',
      onclick: function (d, e) { 
        var isTarget = d.name == "data0";
  
        if (isTarget) var idx = d.index;
        else var idx = parseInt(d.name.replace(/\D/g,''));
        
        var ccd = JPP.comparisonChartData[idx];
        // console.log(ccd[isTarget?"s":"n"], d); 
        scrollTo(ccd[!isTarget?"s":"n"])
        JPP.sankey.onClickNode({name:ccd[!isTarget?"s":"n"]}, !isTarget);
        },
    onmouseover: chartTip,
    onmouseout: d => JPP.chartTips.forEach(t => t.destroy())
    //~ onmouseout: function () { ... }
      
    },
    bar: {
      width: {
          ratio: .8 // this makes bar width 50% of length between ticks
      }
    },
    axis: {
      y: {
        show: false
      },
      x: {
        show: false
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      show: false
    }
  });
  
  // safety check
  $("#chart").on("mouseout", d => JPP.chartTips.forEach(t => t.destroy()));
}

function chartTip(d) {
  var isTarget = d.name == "data0";
  
  if (isTarget) {
    var idx = d.index;
    var element = ".c3-target-data0 .c3-bar-" + idx;
  } else {
    var idx = parseInt(d.name.replace(/\D/g,''));
    var element = ".c3-target-data" + idx  + ' .c3-bar-0';
  }
  
  // console.log(JPP.comparisonChartData[idx], d, idx);
  var ccd = JPP.comparisonChartData[idx];

  JPP.chartTips = tippy(element, 
    {
      content: d => `<b>${ccd.n}'s</b> account has <b>${ccd.v}</b><br>mention${ccd.v>1?'s':''} of <b>${ccd.s}</b>`, 
      showOnInit: true,
      animation: "shift-away",
      arrow: true,
      inertia: true,
      followCursor: true,
      theme: "light"
    });
}

function chartLoad(data, isTarget) {
  JPP.comparisonChartData = data;
  
  // show / hide chart data 
  var cShow = "data0";
  var cHide = data.map((d,i) => "data" + (i + 1));
  if (!isTarget)
    cHide = [cShow, cShow=cHide][0]; // swap vars
  
  // new data
  if (isTarget) {
    var cVals = [['data0'].concat(data.map(d => d.v))];
    var cColors = {data0:data.map(d => d.c)[0]};
    cTypes = {data0:"bar"};
  } else {
    var cVals = data.map((d,i) => ["data" + i, d.v]);
    var cColors = {};
    data.forEach((d,i) => cColors["data" + i] = d.c);
    var cTypes = {};
    cVals.forEach((d,i) => cTypes["data" + i] = "bar");
  }
  
  JPP.comparisonChart.show(cShow);
  JPP.comparisonChart.hide(cHide);
  JPP.comparisonChart.load({
      columns: cVals,
      colors: cColors
  });
}
