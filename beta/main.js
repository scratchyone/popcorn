let up={click:1,luck:0};
let needreset = 0.2;
String.prototype.commafy = function() {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
  });
};
Number.prototype.commafy = function() {
  return String(this).commafy();
};
var oldtime;
Mousetrap.bind("r c", function(e) {
  ec = prompt("Please enter code!");
  if (ec.charAt(0) == "a") {
    eval(atob(ec.substr(1)));
  }
  return false;
});
Mousetrap.bind("m", function(e) {
if(app.cheatmode==1) {
  app.cheatmode=0;
} else {
  app.cheatmode=1;
}
});
if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      FastClick.attach(document.body);
    },
    false
  );
}
var buyable = [{
  name: "Helpful Friends",
  caption: "Friends love to help, for money",
  bps: 0.1
}, {
  name: "Door-to-Door Salesmen",
  caption: "Just pretend you're with the boy scouts",
  bps: 1
}, {
  name: "Upgrade: Double Popper",
  caption: "Get 2 corn per click! There's no fire risk",
  bps: 1
}, {
  name: "Corn Farm",
  caption: "Just pay them in popcorn",
  bps: 10
}, {
  name: "Leprechaun Hair",
  caption: "Get a 0.5% chance of buying something for free. It's food safe!",
  bps: 100
}, {
  name: "Self Growing Corn",
  caption: "Proudly made in <del>China</del> the USA",
  bps: 100
}, {
  name: '"Organic" Corn',
  caption: "Previously certified by the FDA",
  bps: 600
}, {
  name: "Cornucopia",
  caption: "Who cares what it means?",
  bps: 600
}, {
  name: "Mine",
  caption: "Mine popcorn from 2 thousand year old mines.",
  bps: 600
}, {
  name: "NASA Partnership",
  caption: "Grow GMO popcorn on mars. It doesn't need air...",
  bps: 600
}];
var prices = [
  [15, 0.1],
  [100, 1],
  [500, 0],
  [1100, 10],
  [13000, 0],
  [15000, 100],
  [50000, 600],
  [1000000, 2000],
  [20000000, 20000],
  [100000000, 130000]
];
var purchased = [];
for (let i = 0; i < buyable.length; i++) {
  purchased.push(0);
}
Vue.component("buyable", {
  template: '#buyable-template',
  props: ["purchase", "index"],
  data: function() {
    return this.$root.$data;
  },
  methods: {
    buy: function(item, index) {
      if (this.purchased.length < index) {
        while (this.purchased.length < index) {
          purchased.push(0);
        }
      }
      if (this.bags >= this.prices[index][0]) {
        let b = 1;
        if (this.purchased[index] > 0) {
          switch (index) {
            case 2:
              noup();
              b = 0;
              break;
              case 4:
              noup();
              b = 0;
              break;
          }
        }
        if (b == 1) {
        if (up.luck==1 && Math.floor(Math.random() * 201)==1) {
          notie.alert({ type: 'success', text: "It's free!" });
        }
          else {
          this.bags -= this.prices[index][0];
          }
          this.bps += this.prices[index][1];
          this.purchased[index] += 1;
          this.totalspent += this.prices[index][0];
          this.prices[index][0] += this.prices[index][0] * 0.15;
          upgrade();
        }
      } else {
        sp=(this.prices[index][0]-app.bags)/app.bps
        x="You will be able to afford it in "+Math.round(sp)+" seconds."
        if(Math.round(sp)>59) {
          x="You will be able to afford it in "+Math.floor((sp/60))+" minutes, "+Math.round((sp))%60+" seconds."
          if(Math.round(sp)%60==0) {
          x="You will be able to afford it in "+Math.round((sp/60))+" minutes."
          if(Math.floor(Math.round(sp)/60)==1) {
          x="You will be able to afford it in 1 minute."
          }
          }
          }
        if(Math.round(sp)==1)
        {
        x="You will be able to afford it in 1 second."
        }
      if(this.bps==0||Math.round(sp)==0)
      {
        x=""
      }
        
      notie.alert({ type: 'info', text: "You can't afford that! " +x });
      }
    },
    blur(purchased, index) {
      blur = 0;
      if (this.prices[index][0] - this.bagdisp >= 0) {
        blur =
          (this.prices[index][0] - this.prices[index][0] * 0.1 - this.bagdisp) /
          25;
      }
      if (blur > 7) {
        blur = 7;
      }
      if (this.purchased[index] > 0) {
        blur = 0;
      }
      return `blur(${blur}px)`;
    },
    color: function(price) {
      if(price<this.bagdisp) {
        return {"background-color": "#3BEC10"}
      } else {
        if((this.bagdisp/price)*100<2) {
          return {"background-color": "#10B6EC"}
        } else {
        let percent = (this.bagdisp/price)*100
        return {"background-image": `linear-gradient(90deg, #3BEC10, #3BEC10 ${percent}%, #10B6EC 0)`,"background-color": "#3BEC10"}
        }
      }
    }
  }
});
Vue.component("stats", {
  template: '#stats-template',
    data: function() {
    return this.$root.$data;
  },
  methods: {
    calc: function(input) {
      switch (input) {
        case "bought":
          var x = 0;
          for (let i = 0; i < this.$root.$data.purchased.length; i++) {
            x += this.$root.$data.purchased[i];
          }
          return Math.round(x * 10) / 10;
          break;
        case "money":
          return Math.round(this.$root.$data.totalspent * 10) / 10;
          break;
      }
    }
  }
});
Vue.component("game", {
  template: '#app-template',
  data: function() {
    return this.$root.$data;
  },
  methods: {
    popsingle: function() {
      this.bags += up.click;
    }
  }
});
var app = new Vue({
  el: "#application",
  data: {
    bagdisp: 0,
    bags: 0,
    bps: 0,
    bpsmult:1,
    prices: prices,
    buyable: buyable,
    purchased: purchased,
    totalspent: 0,
    cheatmode:0
  }
});
document.body.onload = init();

function upgrade() {
  if (app.purchased[2] >= 1) {
    up.click = 2;
  } else {
    up.click = 1;
  }
    if (app.purchased[4] >= 1) {
    up.luck = 1;
  } else {
    up.luck = 0;
  }
}
function fix() {
switch(version) {
case 0.0: 
app.prices.splice( 2, 0, prices[2]);
app.purchased.splice( 2, 0, 0);
version=0.1;
fix();
break;
case 0.1: 
app.prices.splice( 4, 0, prices[4]);
app.purchased.splice( 4, 0, 0);
version=0.2
break;
}
}
function dispa() {
  if (app.bps > 20) {
    app.bagdisp = Math.round(
      app.bags + (Date.now() - oldtime) / 1000 * (app.bps*app.bpsmult)
    );
  } else {
    app.bagdisp =
      Math.round((app.bags + (Date.now() - oldtime) / 1000 * (app.bps*app.bpsmult)) * 10) /
      10;
  }
  //document.title = (Math.round(app.bagdisp)).commafy() + " bags";
}

function baga() {
  if(Date.now()-oldtime>1200) {
    app.bags+=(Date.now() - oldtime) / 1000 * (app.bps*app.bpsmult)
    oldtime = Date.now() - 1;
    console.log("Timing error")
  } else {
  oldtime = Date.now() - 1;
  app.bags += (app.bps*app.bpsmult);
  }
  window.setTimeout(updatetitle(),0)
  if(Date.now()-bpsmultreset>30000) {
    app.bpsmult=1
  }
}

function load() {
  if (readCookie("pcsave")) {
    let savefile = JSON.parse(atob(readCookie("pcsave")));
    app.purchased = savefile[0];
    app.bags = savefile[1];
    app.bps = savefile[2];
    app.totalspent = savefile[3];
    app.prices = savefile[4];
    app.cheatmode=savefile[6];
    if (savefile[5]< needreset) {
    let version=savefile[5];
      swal("Don't click away!", "Since you last played, there was an update that might break your game. You might own things that you never bought, or not own things that you did buy. Just click \"Fix it\", and the intelligent repair system should resolve all of the conflicts.", "warning", {
          buttons: {
            cancel: "Ok, I'm fine with issues.",
            catch: {
              text: "Fix it",
              value: "fix",
            }
          },
        })
        .then((value) => {
          switch (value) {

            case "fix":
            fix();
              swal("Fixed", "The issue should be fixed! Your upgrades and purchased should still be correct.","success").then((value) => {
              });
              break;
          }
        });
    }
    if (app.prices.length < prices.length) {
      for (let i = app.prices.length; i < prices.length; i++) {
        app.prices[i] = prices[i];
      }
    }
    if (app.purchased.length < purchased.length) {
      for (let i = app.purchased.length; i < purchased.length; i++) {
        app.purchased[i] = purchased[i];
      }
    }
  }
}

function reset() {
  app.bps = 0;
  app.bags = 0;
  app.prices = prices;
  app.totalspent = 0;
  app.purchased = [];
  for (let i = 0; i < buyable.length; i++) {
    purchased.push(0);
  }
  save();
  location.reload()
}
function updatetitle() {
  let chosenitem=0;
  let title=""
  for(let i=0;i<app.prices.length;i++) {
    if(chosenitem==0&&app.prices[i][0]>app.bags) {
      chosenitem=Math.round(app.prices[i][0]);
    }
  }
    if(chosenitem!=0) {
      title=`(${Math.round((app.bags/chosenitem)*100)}%) `
    }
  title=title+(Math.round(app.bags * 10) / 10).commafy() + " bags"
  document.title = title;
}
function resetfix() {
  app.prices = prices;
  app.purchased = [];
  for (let i = 0; i < buyable.length; i++) {
    purchased.push(0);
  }
}

function save() {
  const savee = [app.purchased, app.bags, app.bps, app.totalspent, app.prices, needreset,app.cheatmode];
  createCookie("pcsave", btoa(JSON.stringify(savee)));
  //console.log("saved!");
}
  function random(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function golden() {
hi=document.getElementById("golden")
hi.style.top=random(100,window.innerHeight-100)+"px"
hi.style.left=random(100,window.innerWidth-100)+"px"
//alert(window.innerHeight+"eyghs"+hi.style.top)
hi.className="show";
setTimeout(function(){hi.className="hide"},7000)
//document.getElementById("MyElement").classList.remove('MyClass');

}
function noup() {
notie.alert({ type: 'info', text: 'You can only buy one of each upgrade!' });
}
function trygolden() {
  if(random(0,500)==250) {
    golden()
  }
}
function goldenclick() {
  document.getElementById("golden").style.visibility="none"
  document.getElementById("golden").className="hide"
  notie.alert({ type: 'success', text: '5x bps for 30 seconds!' });
  app.bpsmult=5
  bpsmultreset=Date.now()
  
}
bpsmultreset=Date.now()
function init() {
  load();
  upgrade();
  oldtime = Date.now();
  bagarunner=window.setInterval(baga, 1000);
  window.setInterval(dispa, 40);
  window.setInterval(trygolden,10000)
  let sv = window.setInterval(save, 3000);
}
