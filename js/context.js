// text with context explorer

class conText {

  constructor(e, d) { // element, data
    $(e).append("<div id='context-root' style='position:relative;'></div>");
    var nameKeys = Object.keys(d);
    nameKeys.forEach(x => {
      var corpus = d[x].corpus;
      var ctxtKeys = Object.keys(d[x].context);
      ctxtKeys.forEach(y => {
        d[x].context[y].forEach(z => {
          // do text highlighting
          var markBeg = corpus.substring(0, corpus.indexOf(z)).split(' ').length - 1;
          var markEnd = markBeg + z.split(' ').length - 1;
          var cp = corpus.split(' ').map((d, i) => `<span class='word ${i>=markBeg&&i<=markEnd?"mark":"normal"}'>${d}</span>`).join(' ');
          $(e).find("#context-root").append(`<div class='context-item' data-name='${x}' data-subj='${y}' data-sentence='${z}'>${cp}</div>`);
          });
        });
      });
    
    var fontSz = 24; // parseInt(getComputedStyle($(".context-item")[0])["font-size"]); // in px
    
    $('.context-item').each(function(e){  // scroll
      var scrollPx = $(this).find('.mark').first().position().top
      $(this).animate( {scrollTop: scrollPx }, 500); 
      });
    
    $('.context-item').on("mouseover", function(){onSelectInstance($(this).data("name"), $(this).data("subj")) })
  }
  
  addEntries() {
  }

  resetEntries() {
    $(`.context-item`).removeClass("selected unselected");
  }
  
  //prevOffset = 0;
  checkIfInView(element){
    var parent = $(element).parent();
    var offset = $(element).position().top - parent.find(">:first-child").position().top ;
    
    var midViewport = parent.innerHeight() / 2;
    if(!$(element).visible()){
        parent.animate({scrollTop: (offset-midViewport)> 0?(offset-midViewport):offset }, 1000);
        return false;
    }
   return true;
  }
  
  selectEntry(n, s) { // name, subject
    $(`.context-item`).removeClass("selected").addClass("unselected");
    $(`.context-item[data-name='${n}'][data-subj='${s}']`).removeClass("unselected").addClass("selected");
    
    //setTimeout(() => this.checkIfInView(`.context-item[data-name='${n}'][data-subj='${s}']`), 2000); // allow DOM to reflow
    this.checkIfInView(`.context-item[data-name='${n}'][data-subj='${s}']`)
  }
}
