$(function() {
  let dealercards= [];
  let playercards= [];
  let dealerscore=0;
  let playerscore=0;
  let deckid = 0;
  let result = "";
  let round = 0;
  let totalcoin = 1000;
  let totalcoinbase = 1000;
  let bet = 100;
  let betbase = 100;
  let remaining = 52;
  let playercardcount = 2;
  const deck="https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  
  
  //----------------------------------------------------------------------------Modals---------------------------------------------------------------------------------

  $("#modalbet").modal();
  $("#modalroundresult").modal();

  $("#btnmodalStartGame").click(()=>{
    $("#btnPlay").text("Restart");
    $("#coverphoto").css("display","none");
    $("#roundandcoin").css("visibility","visible");
    $(".hide").removeClass("hide");
    $("#modalbet").modal("close");
    startnewgame();
  });
  
  $("#betup").click(()=>{
    if(bet<totalcoin)
    {
      bet+=betbase;
    }
    if(bet>9999)
    {
      $("#betholder").css("width","200px");
    }
    $("#betamount").html(setcoininplaceof0(bet));
  });

  $("#betdown").click(function(){
    if(bet > betbase)
    {
      bet-=betbase;
    }    
    $("#betamount").html(setcoininplaceof0(bet));
  });  

  $("#btnmodalnextround").click(()=>{
    $("#modalroundresult").modal("close");
    nextround();
  });

  $("#btnmodalrestart").click(()=>{
    $("#modalroundresult").modal("close");
    $("#btnPlay").trigger("click");
  });  

  $("#btnmodalraisebet").click(()=>{
    $("#betamount").html(setcoininplaceof0(bet));
    $("#totalcoinown").html(setcoininplaceof0(totalcoin));
    $("#modalroundresult").modal("close");
  });

  function setcoininplaceof0(value){
    return value.toString(10).replace(/0/g,`<img src="coin.png">`);
  }

  //----------------------------------------------------------------------------Buttons---------------------------------------------------------------------------------
  $("#btnPlay").click(()=>{
    bet = betbase;
    totalcoin = totalcoinbase;
    $("#betamount").html(setcoininplaceof0(bet));
    $("#totalcoinown").html(setcoininplaceof0(totalcoin));         
  });

  

  $("#btnHit").click(()=>{
    hit();
  });

  $("#btnStay").click(()=>{
    stay();
  });

  $("#btnNext").click(()=>{
    nextround();
  });

  $("#btnHit").css("display","none");
  $("#btnStay").css("display","none");
  $("#btnNext").css("display","none");
  
//----------------------------------------------------------------------------Functions---------------------------------------------------------------------------------


//---------------------------------------------------------------------------Bind Animation----------------------------------------------------------------------------- 

  $("#animationdealercard").bind("animationend",function(){
    $("#animationdealercard").toggleClass("popIn");
    $("#dealer_score").toggleClass("popOut popIn");
    $("#dealer_score").text(dealerscore);  
    $("#animationdealercard2").toggleClass("popIn");
    console.log("hit3");
  })

  $("#animationdealercard2").bind("animationend",function(){
    $("#animationdealercard2").toggleClass("popIn");
    winorlose();
    $("#dealer_score").removeClass("popIn");
    console.log("hit4");
  })


  $("#animation").bind("animationend",function(){
    $("#animation").toggleClass("popIn");
    $("#player_score").removeClass("popIn");
    didplayerlose();
    console.log("hit");
  })

  $("#animation2").bind("animationend",function(){
    $("#animation2").toggleClass("popIn");
    $("#player_score").removeClass("popOut");
    playerscoreresult();
    console.log("hit2");
  })


  function startnewgame(){
    getnewdeck(nextround);
  }

  function getnewdeck(_callback){
    fetch(deck)
    .then(response => response.json())
    .then(data =>
    {        
      deckid = data.deck_id;      
    })
    .then(()=>{
      _callback();
    })    
  }

  function didplayerlose()
  {
    if(playerscore>21)
    {
      result = "You Lose";         
    }
    showorhidebutton();
  }

  function winorlose(){

    if(dealerscore>21 && playerscore<=21)
    {
      result = "You Won";
      totalcoin+=bet*2;
      round++;
    }
    else if(21-dealerscore > 21-playerscore)
    {
      result = "You Won";
      totalcoin+=bet*2;
      round++;
    }
    else if(21-dealerscore < 21-playerscore){
      result = "You Lose";
      round++;
    }
    else{
      result = "Draw";
      totalcoin+=bet;
      round++;
    }    

    $("#coin").text(totalcoin);
    $("#totalcoinown").html(setcoininplaceof0(totalcoin));
    showorhidebutton();    
  };

  function showorhidebutton(){
    if(result=="Draw" || result=="You Won" || result=="You Lose")
    { 
      $("#coinafter").text(totalcoin);
      $("#roundresult").text(result);

      if(totalcoin==0)
      {
        $("#btnmodalraisebet").css("display","none");
        $("#btnmodalnextround").css("display","none");
      }else{
        $("#btnNext").css("display","inline");
      }
       
      $("#btnHit").css("display","none");
      $("#btnStay").css("display","none");
      
      if(bet>totalcoin)
      {
        bet=totalcoin;
        if(bet<betbase){
          bet=betbase;
        }
      }

      $("#modalroundresult").modal("open");
           
    }
    else{
      $("#btnHit").css("display","inline");
      $("#btnStay").css("display","inline");
      $("#btnNext").css("display","none");
    }
  }

  function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  function nextround(){
    dealercards= [];
    playercards= [];
    dealerscore= 0;
    playerscore= 0;
    totalcoin-=bet;
    round++;
    result = "";

    $("#coin").text(totalcoin);
    $("#round").text(round);    
    $("#betting").text(bet)
    $("#btnNext").css("display","none");

    $("#dealercards").empty();
    $("#playercards").empty();
    $("#dealer_score").text("");
    $("#player_score").text("");

    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=4")
      .then(response => response.json())
      .then(data => 
      {
        remaining = data.remaining;

        $("#playercards").append(`<img class="cardgiven" id="playercard1" src="${data.cards[0].image}">&nbsp;&nbsp;`)
        playercards.push(data.cards[0].value);

        $("#dealercards").append(`<img class="cardgiven" id="dealercard1" src="${data.cards[1].image}">&nbsp;&nbsp;`)
        dealercards.push(data.cards[1].value);

        $("#playercards").append(`<img class="cardgiven" id="playercard2" src="${data.cards[2].image}">&nbsp;&nbsp;`)
        playercards.push(data.cards[2].value);

        $("#dealercards").append(
          `<div class="scene cardgiven" id="dealercard2">
            <div class="tcard">
              <img class="card__face card__face--front" src="cardback.png">
              <img class="card__face card__face--back" src="${data.cards[3].image}">
            </div>
          </div>&nbsp;&nbsp;`)
        dealercards.push(data.cards[3].value);        

        $("#playercard1").toggleClass("driveInTop");

        $("#playercard1").bind("animationend",function(){
          $("#dealercard1").toggleClass("driveInTop");
        })

        $("#dealercard1").bind("animationend",function(){
          $("#playercard2").toggleClass("driveInTop");
        })

        $("#playercard2").bind("animationend",function(){
          $("#dealercard2").toggleClass("driveInTop");
        })

        $("#dealercard2").bind("animationend",function(){
          dealerscoreresult();
          playerscoreresult();
        })       
      
        // for(let i=0; i<data.cards.length;i++)
        // {
        //   if(i%2 == 0)
        //   {
        //     playercards.push(data.cards[i].value);
        //     $("#playercards").append(`<img src="${data.cards[i].image}">&nbsp;&nbsp;`)
        //   }   
        //   else{
        //     dealercards.push(data.cards[i].value);
        //     if(i==1)
        //     {
        //       $("#dealercards").append(
        //         `<div class="scene driveInTop">
        //           <div class="tcard">
        //             <img class="card__face card__face--front" src="cardback.png">
        //             <img class="card__face card__face--back" src="${data.cards[1].image}">
        //           </div>
        //         </div>&nbsp;&nbsp;`)
        //     }
        //     else{
        //       $("#dealercards").append(`<img class="driveInTop" src="${data.cards[i].image}">&nbsp;&nbsp;`);
        //     }
        //   }
        //}

        // $(".tcard").click(function(){
        //   $(this).toggleClass('is-flipped');
        // })

        // dealerscoreresult();
        // playerscoreresult();
        // didplayerlose();
      })
  }

  function cardenteranimation(){

  }

  function hit(){

    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=1")
      .then(response => response.json())
      .then(data =>
      {
        if(data.success){
          playercardcount++;
          playercards.push(data.cards[0].value);
          $("#playercards").append(`<img class="cardgiven" id="playercards${playercardcount}" src="${data.cards[0].image}">&nbsp;&nbsp;`);
          $(`#playercards${playercardcount}`).toggleClass("driveInTop"); 
          $(`#playercards${playercardcount}`).bind("animationend",function(){
            $("#player_score").toggleClass("popIn popOut");
            $("#animation2").toggleClass("popIn");                      
          })          
        }
      })           
  }

  function stay(){
    $(".tcard").toggleClass('is-flipped');

    $(".tcard").bind("transitionend",function(){
      if(dealerscore<17)
      {
        fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=1")
        .then(response => response.json())
        .then((data)=>{
          dealercards.push(data.cards[0].value);
          $("#dealercards").append(`<img src="${data.cards[0].image}">`);
        })
        .then(()=>{
          dealerscoreresultfinal();          
        })       
      }else{
        dealerscoreresultfinal();
      }
    })  
  }

  function cardvalue(cardinhand)
  {
    if(cardinhand == "JACK" || cardinhand == "QUEEN" || cardinhand == "KING")
    {          
      return 10;           
    }
    else if(cardinhand == "ACE")
    {         
      return 11;          
    }
    else if(cardinhand == "A")
    {         
      return 1;          
    }
    else
    {         
      return parseInt(cardinhand,10);
    }
  }
  function dealerscoreresultfinal()
  {
    dealerscore = calculatescore(dealercards);

    if(dealerscore>21 && dealercards.includes("ACE"))
    {
      dealerscore-=10;
      dealercards[dealercards.indexOf("ACE")] = "A";
    }

    $("#dealer_score").toggleClass("popIn popOut");
    $("#animationdealercard").toggleClass("popIn");  
  }

  function dealerscoreresult()
  {
    dealerscore = calculatescore(dealercards);

    if(dealerscore>21 && dealercards.includes("ACE"))
    {
      dealerscore-=10;
      dealercards[dealercards.indexOf("ACE")] = "A";
    }

    $("#dealer_score").toggleClass("popIn");
    $("#dealer_score").text(dealerscore-cardvalue(dealercards[1]));    
  }

  function playerscoreresult()
  {
    console.log("playerscoreresult");
    playerscore = calculatescore(playercards);

    if(playerscore>21 && playercards.includes("ACE"))
    {
      playerscore-=10;
      playercards[playercards.indexOf("ACE")] = "A";
    }

    $("#player_score").toggleClass("popIn");
    $("#animation").toggleClass("popIn");
    $("#player_score").text(playerscore);
  }

  // function playerscoreresult()
  // {
  //   console.log("playerscoreresult");
  //   playerscore = calculatescore(playercards);

  //   if(playerscore>21 && playercards.includes("ACE"))
  //   {
  //     playerscore-=10;
  //     playercards[playercards.indexOf("ACE")] = "A";
  //   }

  //   $("#player_score").toggleClass("popIn");
  //   $("#animation").toggleClass("popIn");
  //   $("#player_score").text(playerscore);
  // }

  function calculatescore(cardset){
    let score = 0;
    for(var i=0 ; i<cardset.length; i++)
    {
      score = score+cardvalue(cardset[i]);
    }
    return score;
  }
})
  