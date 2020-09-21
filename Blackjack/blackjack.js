$(function() {
  let dealercards= [];
  let playercards= [];
  let playercards2=[];
  let playercards2image="";
  let playercards1image="";
  let dealerscore=0;
  let playerscore=0;
  let playerscore2=0;
  let deckid = 0;
  let result = "";
  let result2 = "";
  let round = 0;
  let totalcoin = 1000;
  let totalcoinbase = 1000;
  let bet = 100;
  let bet2 = 100;
  let betbase = 100;
  let remaining = 52;
  let playercardcount = 2;
  let playercardcount2 = 2;
  let dealercardcount = 2;
  let turn = 0;
  let cansplit = 0;
  let righthandonstay = 0;
  let lefthandonstay = 0;
  let hand = "left";
  let double = 0;
  let candouble = 0;
  let doubled = 0;
  const deck="https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  
  //----------------------------------------------------------------------------Hiding elements------------------------------------------------------------------------
  $("#btnmodalclose").css("display","none");
  $("#btnHit").css("display","none");
  $("#btnStay").css("display","none");
  $("#btnNext").css("display","none");
  $("#btnSplit").css("display","none");
  $("#btnDouble").css("display","none");

  //----------------------------------------------------------------------------Modals---------------------------------------------------------------------------------
  $("#modalbet").modal();
  $("#modalroundresult").modal();


  //--------------------------------------------------------------------------Modal Buttons----------------------------------------------------------------------------
  $("#btnmodalStartGame").click(()=>{
    $("#btnPlay").text("Restart");
    $("#coverphoto").css("display","none");
    $("#roundandcoin").css("visibility","visible");
    $(".hide").removeClass("hide");
    $("#modalbet").modal("close");
    startnewgame();
  });

  $("#btnmodalclose").click(()=>{
    $("#modalroundresult").modal("close");
  });

  $("#btnmodalnextround").click(()=>{
    $("#modalroundresult").modal("close");
    if(remaining<10){
      getnewdeck(nextround);
    }else{
      nextround();
    }    
  });

  $("#btnmodalrestart").click(()=>{
    $("#modalroundresult").modal("close");
    $("#btnPlay").trigger("click");
  });  

  //----------------------------------------------------------------------------Change bet----------------------------------------------------------------------------
  $("#btnmodalchangebet").click(()=>{
    if(doubled == 1){
      bet/=2;
      doubled = 0;
    }
    $("#betamount").html(setcoininplaceof0(bet));
    $("#totalcoinown").html(setcoininplaceof0(totalcoin));
    $("#modalroundresult").modal("close");
  });  

  $("#betup").click(()=>{
    if(bet < totalcoin)
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

  function setcoininplaceof0(value){
    return value.toString(10).replace(/0/g,`<img src="coin.png">`);
  }

  //----------------------------------------------------------------------------Buttons---------------------------------------------------------------------------------
  $("#btnPlay").click(()=>{
    bet = betbase;
    totalcoin = totalcoinbase;
    round = 0;
    $("#betamount").html(setcoininplaceof0(bet));
    $("#totalcoinown").html(setcoininplaceof0(totalcoin));         
  });  

  $("#btnHit").click(()=>{
    if(hand == "left"){
      hit();
    }else if(hand == "right"){
      hit2();
    }    
  });

  $("#btnStay").click(()=>{
    if(hand == "left"){
      stay();
    }else if(hand == "right"){
      stay2();
    }    
  });

  $("#btnDouble").click(()=>{
    doubledown();
  });

  $("#btnNext").click(()=>{
    if(remaining<10){
      getnewdeck(nextround);
    }else{
      nextround();
    }   
  });

  $("#btnSplit").click(()=>{
    split();
  });

//---------------------------------------------------------------------------Bind Animation-----------------------------------------------------------------------------
  $("#animationdealercard").bind("animationend",function(){
    $("#animationdealercard").toggleClass("popIn");
    $("#dealer_score").toggleClass("popOut popIn");
    $("#dealer_score").text(dealerscore);  
    $("#animationdealercard2").toggleClass("popIn");
  })

  $("#animationdealercard2").bind("animationend",function(){
    $("#animationdealercard2").toggleClass("popIn");
    if(dealerscore<17 && (dealerscore<=playerscore || dealerscore<=playerscore2)){      
      getcardfordealer();       
    }
    else{
      winorlose();
    }    
    $("#dealer_score").removeClass("popIn");
  })

  $("#animation").bind("animationend",function(){
    $("#animation").toggleClass("popIn");
    $("#player_score").removeClass("popIn");
    if(playercardcount == 2){
      isitblackjack();
    }
    else{
      didplayerlose();
    }  
  })

  $("#animation2").bind("animationend",function(){
    $("#animation2").toggleClass("popIn");
    $("#player_score").removeClass("popOut");
    playerscoreresult();
  })

  $("#animationdealercard3").bind("animationend",function(){
    $("#animationdealercard3").removeClass("popIn");
    $("#dealer_score").removeClass("popIn");
  })

//----------------------------------------------------------------------------Functions---------------------------------------------------------------------------------
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

  function isitblackjack(){
    if(playerscore == 21){
      result = "BlackJack";
      totalcoin+=bet*3;
    }
    showorhidebutton();
  }

  function didplayerlose(){
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
    }
    else if(21-dealerscore > 21-playerscore)
    {
      result = "You Won";
      totalcoin+=bet*2;
    }
    else if(21-dealerscore < 21-playerscore){
      result = "You Lose";
    }
    else{
      result = "Draw";
      totalcoin+=bet;
    }

    if(righthandonstay==1){
      if(dealerscore>21 && playerscore2<=21)
      {
        result2 = "You Won";
        totalcoin+=bet2*2;
      }
      else if(21-dealerscore > 21-playerscore2)
      {
        result2 = "You Won";
        totalcoin+=bet2*2;
      }
      else if(21-dealerscore < 21-playerscore2){
        result2 = "You Lose";
      }
      else{
        result2 = "Draw";
        totalcoin+=bet2;
      }
    }

    $("#totalcoinown").html(setcoininplaceof0(totalcoin));

    if(turn==0){
      showorhidebutton(); 
    }else{
      if(lefthandonstay==0 && righthandonstay==1){
        showorhidebutton2();
      }else{
        showorhidebutton();
      }
    }     
  };

  function showorhidebutton(){
    if(result=="Draw" || result=="You Won" || result=="You Lose" || result=="BlackJack")
    { 
      $("#coin").text(totalcoin);
      $("#coinafter").text(totalcoin); 

      if(turn == 0){
        $("#roundresult").text(result);        
      }else{        
        $("#roundresult").text("Left Hand: "+result);    
      }

      if(righthandonstay == 0 || (righthandonstay == 1 && lefthandonstay == 1)){
        if(lefthandonstay == 1 && righthandonstay == 1){
          $("#roundresult").append("<br>Right Hand: "+result2);
        }
        $("#btnmodalclose").css("display","none");
        $("#btnmodalrestart").css("display","inline");

        if(bet>=totalcoin)
        {
          bet=totalcoin;
          $("#btnmodalchangebet").css("display","none");
        }else{
          $("#btnmodalchangebet").css("display","inline");
        }

        if(bet<betbase)
        {
          $("#btnmodalnextround").css("display","none");
          $("#btnNext").css("display","none");
        }else{
          $("#btnmodalnextround").css("display","inline");
          $("#btnNext").css("display","inline");
        }
      }else{        
        $("#btnmodalclose").css("display","inline");
        $("#btnmodalrestart").css("display","none");
        $("#btnmodalchangebet").css("display","none");
        $("#btnmodalnextround").css("display","none");
        $("#btnNext").css("display","none");
        extrasetclicked();
      }

      if(righthandonstay==0){
        $("#btnHit").css("display","none");
        $("#btnStay").css("display","none"); 
      }       
      $("#modalroundresult").modal("open");                
    }
    else{
      if(double == 0){
        $("#btnHit").css("display","inline");
        $("#btnStay").css("display","inline");
        if(candouble == 0 && bet<=totalcoin){
          $("#btnDouble").css("display","inline");
          candouble = 1;
        } 
        if(cansplit==1){
          $("#btnSplit").css("display","inline");
        }      
        $("#btnNext").css("display","none");
      }else{
        double = 0;
        doubled = 1;
        stay();
      }      
    }
  }

  function nextround(){
    dealercards= [];
    playercards= [];
    dealerscore= 0;
    playerscore= 0;
    playercards2= [];
    playerscore2= 0;    
    round++;
    result = "";
    result2 = "";
    turn = 0;
    playercardcount = 2;
    lefthandonstay = 0;
    righthandonstay = 0;

    if(doubled==1){
      doubled = 0;
      bet/=2;
    }

    totalcoin-=bet;
    double = 0;
    candouble = 0;
    hand = "left";

    $("#coin").text(totalcoin);
    $("#round").text(round);    
    $("#betting").text(bet);

    $("#btnNext").css("display","none");
    $("#btnSplit").css("display","none");  

    $("#btnmodalchangebet").css("display","inline");
    $("#btnmodalnextround").css("display","inline");

    $("#dealercards").empty();
    $("#playercards").empty();

    $("#extraset").empty();
    $("#extraset").removeClass("selected");
    $(".split").removeClass("s6");
    $(".split").addClass("s12");

    $("#dealer_score").text("");
    $("#player_score").text("");

    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=4")
      .then(response => response.json())
      .then(data => 
      {
        remaining = data.remaining;

        $("#playercards").append(`&nbsp;<img class="cardgiven" id="playercard1" src="${data.cards[0].image}">&nbsp;`)
        playercards1image = data.cards[0].image;
        playercards.push(data.cards[0].value);

        $("#dealercards").append(`&nbsp;<img class="cardgiven" id="dealercard1" src="${data.cards[1].image}">&nbsp;`)
        dealercards.push(data.cards[1].value);

        $("#playercards").append(`&nbsp;<img class="cardgiven" id="playercard2" src="${data.cards[2].image}">&nbsp;`)
        playercards2image = data.cards[2].image;
        playercards.push(data.cards[2].value);

        $("#dealercards").append(
          `&nbsp;<div class="scene cardgiven" id="dealercard2">
            <div class="tcard">
              <img class="card__face card__face--front" src="cardback.png">
              <img class="card__face card__face--back" src="${data.cards[3].image}">
            </div>
          </div>&nbsp;`)
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
          if((playercards[0] == playercards[1]) || (playercards[0] == "A" && playercards[1]== "ACE")){
            if(bet <= totalcoin){
              cansplit = 1;              
            }else{
              alert("You don't have enough coin to split");
            }            
          }

          if(bet > totalcoin){
            candouble = 1;  
            alert("You don't have enough coin to double down.");          
          }  
        })       
      })
      .catch(err => {
        alert("Network error!!!");
      })
  }

  function hit(){
    $("#btnSplit").css("display","none");
    $("#btnDouble").css("display","none");
    cansplit = 0;
    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=1")
      .then(response => response.json())
      .then(data =>
      {
        if(data.success){
          playercardcount++;
          playercards.push(data.cards[0].value);

          $("#playercards").append(`&nbsp;<img class="cardgiven" id="playercards${playercardcount}" src="${data.cards[0].image}">&nbsp;`);

          $(`#playercards${playercardcount}`).toggleClass("driveInTop"); 
          $(`#playercards${playercardcount}`).bind("animationend",function(){
            $("#player_score").toggleClass("popIn popOut");
            $("#animation2").toggleClass("popIn");                      
          })          
        }
      })           
  }

  function getcardfordealer(){
    dealercardcount++;
    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=1")
      .then(response => response.json())
      .then((data)=>{
        dealercards.push(data.cards[0].value);
        $("#dealercards").append(`&nbsp;<img class="cardgiven" id="dealercard${dealercardcount}" src="${data.cards[0].image}">&nbsp;`);
        $(`#dealercard${dealercardcount}`).toggleClass("driveInTop"); 
        $(`#dealercard${dealercardcount}`).bind("animationend",function(){
          dealerscoreresultfinal();
        })                      
      })  
  }

  function stay(){
    $("#modalroundresult").modal({
      onCloseEnd: function(){}
    });
    $("#btnDouble").css("display","none");
    if(turn==0){
      $("#btnSplit").css("display","none");
      cansplit = 0;
    }    
    if(righthandonstay == 0){
      $(".tcard").toggleClass('is-flipped');
      $(".tcard").bind("transitionend",function(){
          dealerscoreresultfinal();
        });
    }else{
      lefthandonstay = 1;
      extrasetclicked();      
    }
  }

  function doubledown(){
    double = 1;
    totalcoin-=bet;
    bet*=2;
    $("#coin").text(totalcoin);
    $("#betting").text(bet);
    hit();
  }

  function cardvalue(cardinhand){
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

  function dealerscoreresultfinal(){
    dealerscore = calculatescore(dealercards);

    if(dealerscore>21 && dealercards.includes("ACE"))
    {
      dealerscore-=10;
      dealercards[dealercards.indexOf("ACE")] = "A";
    }

    $("#dealer_score").toggleClass("popIn popOut");
    $("#animationdealercard").toggleClass("popIn");  
  }

  function dealerscoreresult(){
    dealerscore = calculatescore(dealercards);

    if(dealerscore>21 && dealercards.includes("ACE"))
    {
      dealerscore-=10;
      dealercards[dealercards.indexOf("ACE")] = "A";
    }

    $("#dealer_score").toggleClass("popIn");
    $("#animationdealercard3").toggleClass("popIn");
    $("#dealer_score").text(dealerscore-cardvalue(dealercards[1]));    
  }

  function playerscoreresult(){

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

  function calculatescore(cardset){
    let score = 0;
    for(var i=0 ; i<cardset.length; i++)
    {
      score = score+cardvalue(cardset[i]);
    }
    return score;
  }

//---------------------------------------------------------------------------------------------Player2ndhand---------------------------------------------------------------------------
  function extrasetclicked(){
    hand = "right";
    $("#extraset").addClass("selected");
    $("#firstset").removeClass("selected");
  }

  function split(){
    turn = 1;
    righthandonstay = 1;    
    bet2 = bet;
    totalcoin -= bet2; 

    $("#coin").text(totalcoin);
    $("#betting").text(bet+bet2);

    if(playercards[0] == "A"){
      playercards[0] = "ACE";
    }

    playercards2.push(playercards[1]);
    playerscore2 = cardvalue(playercards2[0]);
    playerscore = playerscore2; 
    $("#player_score").text(playerscore);
    playercards.pop();  
    $(".split").toggleClass("s12 s6");
    $("#btnSplit").css("display","none");
    $("#btnDouble").css("display","none");
    $("#playercards").html(`&nbsp;<img id="playercard1" src="${playercards1image}">&nbsp;`)
    $("#extraset").html(
      `<div class="center-wrapper cardshown">
        <div>You&nbsp;</div><div id="player2_score">${playerscore2}</div>
      </div>
      <div class="cardshown" id="playercards2">&nbsp;<img id="playercards21" src="${playercards2image}">&nbsp;</div>`
      );
    $("#firstset").addClass("selected");
  }

  $("#animation3").bind("animationend",function(){
    $("#animation3").toggleClass("popIn");
    $("#player2_score").removeClass("popIn");
    didplayerlose2();    
  })

  $("#animation4").bind("animationend",function(){
    $("#animation4").toggleClass("popIn");
    $("#player2_score").removeClass("popOut");
    playerscoreresult2();
  })

  function didplayerlose2()
  {
    if(playerscore2>21)
    {
      result2 = "You Lose";    
    }
    showorhidebutton2();
  }

  function hit2(){
    fetch("https://deckofcardsapi.com/api/deck/"+deckid+"/draw/?count=1")
      .then(response => response.json())
      .then(data =>
      {
        if(data.success){
          playercardcount2++;
          playercards2.push(data.cards[0].value);

          $("#playercards2").append(`&nbsp;<img class="cardgiven" id="playercards2${playercardcount2}" src="${data.cards[0].image}">&nbsp;`);

          $(`#playercards2${playercardcount2}`).toggleClass("driveInTop");

          $(`#playercards2${playercardcount2}`).bind("animationend",function(){
            $("#player2_score").toggleClass("popIn popOut");
            $("#animation4").toggleClass("popIn");                      
          })          
        }
      })           
  }

  function stay2(){
    $("#btnHit").css("display","none");
    $("#btnStay").css("display","none");
    $(".tcard").toggleClass('is-flipped');
    $(".tcard").bind("transitionend",function(){
      dealerscoreresultfinal();
    });
  }

  function playerscoreresult2(){

    playerscore2 = calculatescore(playercards2);

    if(playerscore2>21 && playercards2.includes("ACE"))
    {
      playerscore2-=10;
      playercards2[playercards2.indexOf("ACE")] = "A";
    }

    $("#player2_score").toggleClass("popIn");
    $("#animation3").toggleClass("popIn");
    $("#player2_score").text(playerscore2);
  }

  function showorhidebutton2(){
    if(result2=="Draw" || result2=="You Won" || result2=="You Lose" || result2=="BlackJack")
    { 
      righthandonstay = 0;
      $("#coin").text(totalcoin);
      $("#coinafter").text(totalcoin);
      $("#roundresult").text("Right hand: "+result2);

      if(lefthandonstay == 0){
        $("#btnmodalclose").css("display","none");
        $("#btnmodalrestart").css("display","inline");

        if(bet>=totalcoin)
        {
          bet=totalcoin;
          $("#btnmodalchangebet").css("display","none");
        }else{
          $("#btnmodalchangebet").css("display","inline");
        }

        if(bet<betbase)
        {
          $("#btnmodalnextround").css("display","none");
          $("#btnNext").css("display","none");
        }else{
          $("#btnmodalnextround").css("display","inline");
          $("#btnNext").css("display","inline");
        }
      }else{
        $("#btnmodalclose").css("display","inline");
        $("#btnmodalrestart").css("display","none");
        $("#btnmodalchangebet").css("display","none");
        $("#btnmodalnextround").css("display","none");        
        $("#btnNext").css("display","none");
      }
      $("#btnHit").css("display","none");
      $("#btnStay").css("display","none");
      if(lefthandonstay==1){
        $("#modalroundresult").modal({
          onCloseEnd: function(){
            stay();
          }
        });  
      }    
      $("#modalroundresult").modal("open");          
    }
    else{
      $("#btnHit").css("display","inline");
      $("#btnStay").css("display","inline");
      $("#btnNext").css("display","none");
    }
  }
})

  