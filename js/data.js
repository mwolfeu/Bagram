// Interview Coded Text
var codedInterview = {
  accounts: [
  {
    /* General */
    name:"Malak Jaan",
    job:["Carpenter"],
    detentionAge:[24],
    detentionMonths:[8],
    homeName:["Peshwar", "Pakistan"],
    destName:["Jalabad", "Afghanistan"],
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    destNodes:{
      "Economic Status":["B.","A."],
      "Terrorist Connection":["B.","C.", "A."],
      "Posession of Passport":["A."],
      /* Personal */
      "Interogation Tactics":["C.",""],
      "Physical Abuse":["",""],
      "Mental Abuse":["",""],
      "Health Abuse":["","",""],
      "Waiting":["",""],
      "Misinformation Tactics":["","",""],
      "Detention":["",""],
      "Detention Force":["","","",""],
      /* Family */
      "Family Impact":["","",""],
      "Livelyhood Impact":["","","",""],
      "Reacclimation":["",""],
      "Property Destruction":["","",""],
    },
  },
  {
    /* General */
    name:"Imran Khan",
    job:["Odd Jobs"],
    detentionAge:[36],
    detentionMonths:[15],
    homeName:["Peshwar", "Pakistan"],
    destName:["Jalabad", "Afghanistan"],
    text: "Laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    destNodes:{
      "Economic Status":["B.","A."],
      "Terrorist Connection":["B.","C.", "A."],
      "Posession of Passport":["A."],
      /* Personal */
      "Interogation Tactics":["C.",""],
      "Physical Abuse":["",""],
      "Mental Abuse":["",""],
      "Health Abuse":["",""],
      "Waiting":["",""],
      "Misinformation Tactics":["",""],
      "Detention":["",""],
      "Detention Force":["",""],
      /* Family */
      "Family Impact":["",""],
      "Livelyhood Impact":["",""],
      "Reacclimation":["",""],
      "Property Destruction":["",""],
    },
  }
  ]
};

// builds prototyping test example
function mkTestData() {
  codedInterview.accounts.forEach((d,i) => {
    var text = d.text.split(' ');
    var tLen = text.length;
    var dn = Object.keys(d.destNodes);
    dn.forEach(e => {
      var items = [];
      var passes = Math.floor((Math.random() * 3) + 1);
      
      Array.from(Array(passes)).forEach(() => {
        var beg = Math.floor((Math.random() * tLen));
        var end = beg + Math.floor((Math.random() * 5) + 1);
        if (end > tLen) end = tLen;
        items.push(text.slice(beg,end).join(' '));
        });
      d.destNodes[e] = items;
      });
    
    });
}

mkTestData();
