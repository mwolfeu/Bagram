
class context {
  constructor(e, d){
    this.element = e;
    this.dataByName = d; 
    this.name = "";
    
    $("#context #header #left-arrow").on('click', this.backContext);
    $("#context #header #right-arrow").on('click', this.nextContext);
  }
  
  backContext() {
    JPP.ctx.markContext(undefined, undefined, -1);
  }
  
  nextContext() {
    JPP.ctx.markContext(undefined, undefined, 1);
  }
  
  markContext(n, s, direction) { // direction == back < 0 > fwd
    if (n != undefined) this.curName = n;
    if (s != undefined) this.curSubj = s;
    
    var sentences = this.dataByName[this.curName].context[this.curSubj];
    var corpus = this.dataByName[this.curName].corpus.replace(/\n/g, "<br/>");
    
    if (direction > 0) this.idx++;
    if (direction < 0) this.idx--;
    if (this.idx < 0 || direction == undefined) this.idx = 0;
    if (this.idx >= sentences.length) this.idx = sentences.length - 1;
    
    $("#context #header #count").html(`${this.idx+1} of ${sentences.length}`);
    var d = sentences[this.idx];
    
    // mark appropriate text
    var markBeg = corpus.substring(0, corpus.indexOf(d)).split(' ').length - 1;
    var markEnd = markBeg + d.split(' ').length - 1;
    var cp = corpus.split(' ').map((d, i) => `<span class='word ${i>=markBeg&&i<=markEnd?"mark":"normal"}'>${d}</span>`).join(' ');
    $("#context #text").html(`<div class='context-item' data-name='${this.curName}' data-subj='${this.curSubj}' data-sentence='${d}'>${cp}</div>`);  
    $("#context #text .mark").css("color", d3.rgb(JPP.targetColors[this.curSubj]).darker(1.7));
    
    // scroll
    var scrollPx = $('#context .mark').first().position().top - $('#context .word').first().position().top;
    $('#context #text').animate( {scrollTop: scrollPx }, 500);
  }
  
  resetEntries() {
    $('#context').animate({ opacity: 0 }).delay(0).css("z-index", "-1")
  }
  
  selectEntry(name, subj) {
    
    $('#context').animate({ opacity: .90 }).delay(0).css("z-index", "2");
    this.markContext(name, subj);
  }
}
