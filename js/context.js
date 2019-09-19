
class context {
  constructor(e, d){
    this.element = e;
    this.dataByName = d; 
    this.name = "";
  }
  
  markContext(n, s) {
    var sentences = this.dataByName[n].context[s];
    var corpus = this.dataByName[n].corpus.replace(/\n/g, "<br/>");;
    //~ sentences.forEach(y => {
        sentences.forEach(d => {
          // do text highlighting
          var markBeg = corpus.substring(0, corpus.indexOf(d)).split(' ').length - 1;
          var markEnd = markBeg + d.split(' ').length - 1;
          var cp = corpus.split(' ').map((d, i) => `<span class='word ${i>=markBeg&&i<=markEnd?"mark":"normal"}'>${d}</span>`).join(' ');
          $("#context #text").html(`<div class='context-item' data-name='${n}' data-subj='${s}' data-sentence='${d}'>${cp}</div>`);  // fix so all are on same page
          $("#context #text .mark").css("color", d3.rgb(JPP.targetColors[s]).darker(1.7));
          });
        //~ });
  }
  
  resetEntries() {
    $('#context').animate({ opacity: 0 }).delay(0).css("z-index", "-1")
  }
  
  selectEntry(name, subj) {
    
    $('#context').animate({ opacity: .90 }).delay(0).css("z-index", "2");
    // if (this.name != name) 
    // $(this.element + " #text").html(this.dataByName[name].corpus);
    this.markContext(name, subj);
  }
}
