let up = { click: 1, luck: 0 };
let needreset = 0.3;
var oldtime;
let cheater = 0;
//functions to make it easier to read numbers. Thanks stackoverflow.
String.prototype.commafy = function() {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
  });
};
Number.prototype.commafy = function() {
  return String(this).commafy();
};
//Weird thing I added to run base64 encoded javascript
Mousetrap.bind("r c", function(e) {
  ec = prompt("Please enter code!");
  if (ec.charAt(0) == "a") {
    eval(atob(ec.substr(1)));
  }
  return false;
});
//Cheatmode. Adds some buttons so that you can set bags, bps, run code, etc.
Mousetrap.bind("m", function(e) {
  if (app.cheatmode == 1) {
    app.cheatmode = 0;
  } else {
    app.cheatmode = 1;
  }
});
//fastclick allows fast repeated tapping of the popcorn on mobile devices.
if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      FastClick.attach(document.body);
    },
    false
  );
}
//everything you can buy
var buyable = [
  {
    name: "Helpful Friends",
    caption: "Friends love to help, for money"
  },
  {
    name: "Door-to-Door Salesmen",
    caption: "Just pretend you're with the boy scouts"
  },
  {
    name: "Upgrade: Double Popper",
    caption: "Get 2 corn per click! There's no fire risk",
  },
  {
    name: "Corn Farm",
    caption: "Just pay them in popcorn"
  },
  {
    name: "Leprechaun Hair",
    caption: "Get a 0.5% chance of buying something for free. It's food safe!"
  },
  {
    name: "Self Growing Corn",
    caption: "Proudly made in <del>China</del> the USA"
  },
  {
    name: '"Organic" Corn',
    caption: "Previously certified by the FDA"
  },
  {
    name: "Cornucopia",
    caption: "Who cares what it means?"
  },
  {
    name: "Mine",
    caption: "Mine popcorn from 2 thousand year old mines."
  },
  {
    name: "NASA Partnership",
    caption: "Grow GMO popcorn on mars. It doesn't need air..."
  }
];
//prices
var prices = [
  {price: 15, bps: 0.1},
  {price: 100, bps: 1},
  {price: 500, bps: 0},
  {price: 10000, bps: 10},
  {price: 13000, bps: 0},
  {price: 15000, bps: 100},
  {price: 50000, bps: 600},
  {price: 1000000, bps: 2000},
  {price:20000000 , bps: 20000},
  {price: 100000000, bps: 130000},
];
//reset purchases array
var purchased = [];
for (let i = 0; i < buyable.length; i++) {
  purchased.push(0);
}
//component for the list of things you can buy
Vue.component("buyable", {
  template: "#buyable-template",
  props: ["purchase", "index"],
  data: function() {
    return this.$root.$data; //import the main instinces variables
  },
  methods: {
    buy: function(item, index) { //runs when you click buy
      if (this.purchased.length < index) { //if the purchases array is too short, fix it
        while (this.purchased.length < index) {
          purchased.push(0);
        }
      }
      if (this.bags >= this.prices[index].price) { //check if you can afford it
        let b = 1; //if you can buy it
        if (this.purchased[index] > 0) { //if you already own at least one of the item you want to buy
          switch (index) { 
            case 2: //it's an upgrade, you can only buy one
              noup(); //display error
              b = 0; //you can't buy it
              break;
            case 4: //it's an upgrade, you can only buy one
              noup(); //display error
              b = 0; //you can't buy it
              break;
          }
        }
        if (b == 1) { //if you can buy it
          if (up.luck == 1 && Math.floor(Math.random() * 201) == 1) { //if you have the luck upgrade and a random function gets the correct number
            notie.alert({ type: "success", text: "It's free!" }); // you get it for free
          } else {
            this.bags -= this.prices[index].price; // remove the bags
          }
          this.bps += this.prices[index].bps; //add the purchase's bps to your bps. It's not calculated...
          this.purchased[index] += 1; //remember you purchased it
          this.totalspent += this.prices[index].price; // add the price to your total amount of money spent, for stats
          this.prices[index].price += this.prices[index].price * 0.05; //make it more expensive
          upgrade(); // check if you bought an upgrade. If so, fix the upgrades object
        }
      } else { //you can't afford it
        sp = (this.prices[index].price - app.bags) / app.bps; //detect how long it will take to be able to afforf it
        x = "You will be able to afford it in " + Math.round(sp) + " seconds."; //set output
        if (Math.round(sp) >= 60) { //if it's at least a minute until you can afford it
          x =
            "You will be able to afford it in " +
            Math.floor(sp / 60) +
            " minutes, " +
            Math.round(sp) % 60 +
            " seconds."; //split it into minutes and seconds, for easy readability
          if (Math.round(sp) % 60 == 0) { //if it evenly splits into minutes
            x =
              "You will be able to afford it in " +
              Math.round(sp / 60) +
              " minutes."; //generate the message
            if (Math.floor(Math.round(sp) / 60) == 1) { //if it is exactly one minute
              x = "You will be able to afford it in 1 minute."; //dont make it plural
            }
          }
        }
        if (Math.round(sp) == 1) { //if it's exactly one second
          x = "You will be able to afford it in 1 second."; //dont make it plural
        }
        if (this.bps == 0 || Math.round(sp) == 0) { //if you don't make any bps
          x = ""; // just say "you cant afford that", so it doesnt say infinity seconds
        }

        notie.alert({ type: "info", text: "You can't afford that! " + x }); //actually say the message, with the time message added to the end
      }
    },
    blur(purchased, index) { //function to blur out the things you cant afford
      blur = 0; //no blur
      if (this.prices[index].price - this.bagdisp >= 0) { //make sure it's not infinity
        blur =
          (this.prices[index].price - this.prices[index].price * 0.1 - this.bagdisp) /
          25;
      }
      if (blur > 7) { //make sure it isnt too blurred
        blur = 7;
      }
      if (this.purchased[index] > 0) { //if you've already bought it, don't blur
        blur = 0;
      }
      return `blur(${blur}px)`; //return the blur amount
    },
    color: function(price) { //gradient for button
      if (price < this.bagdisp) { //if you can afford it, just be completely green
        return { "background-color": "#3BEC10" };
      } else {
        if (this.bagdisp / price * 100 < 2) { //if it's a really small percentage, just make it blue to reduce lag
          return { "background-color": "#10B6EC" };
        } else {
          let percent = this.bagdisp / price * 100;
          return {
            "background-image": `linear-gradient(90deg, #3BEC10, #3BEC10 ${percent}%, #10B6EC 0)`, //weird gradent code. I have no clue how it works. ask mdn
            "background-color": "#3BEC10" //fallback to prevent blue flash when you go over 100%
          };
        }
      }
    }
  }
});
Vue.component("stats", { //statistics sidebar
  template: "#stats-template",
  data: function() {
    return this.$root.$data; //import the main vue intences variables
  },
  methods: {
    calc: function(input) { //function to grab all the needed variables and round them, etc
      switch (input) {
        case "bought": //if you want to grab how many items you own
          var x = 0;
          for (let i = 0; i < this.$root.$data.purchased.length; i++) { //add together all the numbers of purchased items. Probably should be foreach
            x += this.$root.$data.purchased[i];
          }
          return Math.round(x * 10) / 10; //round it
        case "money": //get totalspent
          return Math.round(this.$root.$data.totalspent * 10) / 10; //round it
      }
    }
  }
});
Vue.component("game", { //main page
  template: "#app-template",
  data: function() {
    return this.$root.$data; //import main vue instances data
  },
  methods: {
    popsingle: function() { //pop a single bag. what more is there to add?
      this.bags += up.click; //how many bags you get per pop
    }
  }
});
var app = new Vue({ //main instance. NOW I SPELL IT RIGHT. I'm to lazy to go fix the other misspellings
  el: "#application",
  data: { //SO. MANY. VARIABLES. WITH. SUCH. BAD. NAMES.
    bagdisp: 0,
    bags: 0,
    bps: 0,
    bpsmult: 1,
    prices: prices,
    buyable: buyable,
    purchased: purchased,
    totalspent: 0,
    cheatmode: 0
  }
});
document.body.onload = init(); //trigger init function on body load

function upgrade() { //detect upgrades
  if (app.purchased[2] >= 1) { //if you own item 2
    up.click = 2; //make the bags per click 2
  } else {
    up.click = 1;
  }
  if (app.purchased[4] >= 1) { //if you own item 4
    up.luck = 1; //used in buyable component
  } else {
    up.luck = 0;
  }
}
function fix() { //fix version incompatabilities. TAKE THAT COOKIE CLICKER
  switch (version) { //get version of save file
    case 0.0: //code to move stuff around to fix problems
      app.prices.splice(2, 0, prices[2]);
      app.purchased.splice(2, 0, 0);
      version = 0.1;
      fix();
      break;
    case 0.1: //same as above
      app.prices.splice(4, 0, prices[4]);
      app.purchased.splice(4, 0, 0);
      version = 0.2;
      break;
    case 0.2: //same as above
    console.log("0.2")
app.prices=prices;
      break;
  }
}
function dispa() { //set the constantly updating bags counter. ONLY FOR SHOW. Not used for purchases
  if (app.bps > 20) { //if you get more than 20 bps, dont show decimals
    app.bagdisp = Math.round(
      app.bags + (Date.now() - oldtime) / 1000 * (app.bps * app.bpsmult)
    ); 
    /*
    Get how long it has been since the last app.bags update in seconds
    Then, multiply that by the bps (multiplied the the bps multiplier in case of a golden popcorn)
    Then, add the app.bags to it
    Basically, guess how far along it should be based on how long it has been since the last app.bags update
    */
  } else {
    app.bagdisp =
      Math.round(
        (app.bags + (Date.now() - oldtime) / 1000 * (app.bps * app.bpsmult)) *
          10
      ) / 10; //same as abouve, but roundes to nearest tenth
  }
}

function baga() { //code to calculate the REAL bag counter. This one is used for purchases and stuff
  if (Date.now() - oldtime > 1200) {// if it's been more than 1.2 seconds since the last update, you were probably in another tab. That can stop this from updating.
    app.bags += (Date.now() - oldtime) / 1000 * (app.bps * app.bpsmult); //the same code as in the function for app.bagdisp. Just guess based on the bps and how long it has been since the last update
    oldtime = Date.now() - 1; //set the last updated time. It's set to 1 millesecond ago to prevent possible errors
    console.log("Timing error");
  } else {
    oldtime = Date.now() - 1; //set the last updated time. It's set to 1 millesecond ago to prevent possible errors
    app.bags += app.bps * app.bpsmult; //set app.bags to the bps times the bps multiplier
  }
  window.setTimeout(updatetitle(), 0); //update the title async. This is really bad code but why write good code when you can use settimeout?
  if (Date.now() - bpsmultreset > 30000) {//if you have had multiplied bps for 30 seconds, shut it off. Bad code again. This should be somewhere else. I'll fix it later.
    app.bpsmult = 1;
  }
}

function load() { //load savefiles
  if (readCookie("pcsave")) { //if the cookie exist
    let savefile = JSON.parse(atob(readCookie("pcsave"))); //json.parse the save
    app.purchased = savefile[0]; //the savefile is an array
    app.bags = savefile[1];
    app.bps = savefile[2];
    app.totalspent = savefile[3];
    app.prices = savefile[4];
    app.cheatmode = savefile[6];
    cheater = savefile[7];
    if (cheater) { //remember if you cheated and display it for all to see
      document.body.style.backgroundImage = "url('cheaterwhite.png')";
    }
    if (savefile[5] < needreset) { //if the savefile was saved on a previous version
      let version = savefile[5]; 
      swal( //warn that your save is messed up and ask if you want the game to automatiaclly fix it
        "Don't click away!",
        'Since you last played, there was an update that might break your game. You might own things that you never bought, or not own things that you did buy. Just click "Fix it", and the intelligent repair system should resolve all of the conflicts.',
        "warning",
        {
          buttons: {
            cancel: "Ok, I'm fine with issues.",
            catch: {
              text: "Fix it",
              value: "fix"
            }
          }
        }
      ).then(value => {
        switch (value) {
          case "fix":
            fix(); //if you say yes, fix it
            swal( //tell the user it's fixed
              "Fixed",
              "The issue should be fixed! Your upgrades and purchased should still be correct.",
              "success"
            ).then(value => {});
            break;
        }
      });
    }
    if (app.prices.length < prices.length) { //Still trying to fix savefile issues
      for (let i = app.prices.length; i < prices.length; i++) {
        app.prices[i] = prices[i];
      }
    }
    if (app.purchased.length < purchased.length) { //Still trying to fix savefile issues
      for (let i = app.purchased.length; i < purchased.length; i++) {
        app.purchased[i] = purchased[i];
      }
    }
  }
}

function reset() { //reset everything
  app.bps = 0;
  app.bags = 0;
  app.prices = prices;
  cheater = 0;
  app.totalspent = 0;
  app.purchased = [];
  for (let i = 0; i < buyable.length; i++) {
    purchased.push(0);
  }
  save(); //save
  location.reload(); //reload the page. Fixes everything
}
function updatetitle() {
  let chosenitem = 0; //next item you can afford
  let title = ""; // title to be set
  for (let i = 0; i < app.prices.length; i++) { //detect the next item you can afford
    if (chosenitem == 0 && app.prices[i].price > app.bags) {
      chosenitem = Math.round(app.prices[i].price);
    }
  }
  if (chosenitem != 0) { //if there is a next item you can afford
    title = `(${Math.round(app.bags / chosenitem * 100)}%) `; //calculate the percentage of how close you are to being able to afford it
  }
  title = title + (Math.round(app.bags * 10) / 10).commafy() + " bags"; //add the number of bags you have
  document.title = title; //add it to the title
}

function save() { //code to save
  const savee = [ //array of items to save
    app.purchased,
    app.bags,
    app.bps,
    app.totalspent,
    app.prices,
    needreset,
    app.cheatmode,
    cheater
  ];
  createCookie("pcsave", btoa(JSON.stringify(savee))); //turn it to a string, base64 encode it, and save it
  //console.log("saved!");
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function golden() { //golden cookies
  hi = document.getElementById("golden"); //get the golden popcorn element
  hi.style.top = random(100, window.innerHeight - 100) + "px"; //move it to a random height
  hi.style.left = random(100, window.innerWidth - 100) + "px"; //move it to a random width
  hi.className = "show"; //make it show up and animate
  setTimeout(function() {
    hi.className = "hide"; //hide it
  }, 7000);
}
function noup() { //tell you that you can't buy more than one of each upgrade
  notie.alert({ type: "info", text: "You can only buy one of each upgrade!" });
}
function trygolden() { //try to get a golden popcorn. 1 in 500 chance
  if (random(0, 500) == 250) {
    golden();
  }
}
function goldenclick() { //triggered when you click a golden popcorn
  //document.getElementById("golden").style.visibility = "none"; //hide it so you can't click it again
  document.getElementById("golden").className = "hide"; //give it the "hide" class
  notie.alert({ type: "success", text: "5x bps for 30 seconds!" });  //tell you what you got
  app.bpsmult = 5; //set the bps multiplier
  bpsmultreset = Date.now(); //start the timer
}
bpsmultreset = Date.now();
function init() { //init function
  load(); //load save
  upgrade(); //detect upgrades
  oldtime = Date.now(); //prevent bagdisp from being broken
  bagarunner = window.setInterval(baga, 1000); //start setting bags
  window.setInterval(dispa, 40); //start setting bagdisp
  window.setInterval(trygolden, 10000); //try golden popcorn every 10 seconds
  let sv = window.setInterval(save, 3000); //save every 3 seconds
}
