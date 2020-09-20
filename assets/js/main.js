$(window).on('load', function() {

    $('.level-bar-inner').each(function() {
    
        var itemWidth = $(this).data('level');
        
        $(this).animate({
            width: itemWidth
        }, 800);
        
    });

});

function Projecttool(){
    $('.otherproject > .item').each(function(index){
        $(this).children('br').css("display","none");        
        if($(this).children('h3').children('.float-right').position().top +10 > $(this).children('.summary').position().top){        
            $(this).children('br').css("display","block");
        }
    });
}

function experienceyear(){
    $('.experiencedetail > .item').each(function(index){  
        $(this).children('br').css("display","none");   
        if($(this).children('h3').height() > 60){
            $(this).children('h3').children('.year').css("margin-top","0px");
        }else{
            $(this).children('h3').children('.year').css("margin-top","6px");
        }
        if($(this).children('h3').children('.year').length>0){
            if($(this).children('h3').children('.year').position().top +20 > $(this).children('p').position().top){                           
                $(this).children('br').css("display","block");
                $(this).children('h3').children('.year').css("margin-top","0px");
            }   
        }          
    });
}

function eduyear(){
    $('.edulist > .item').each(function(index){
        if($(this).children('.university').position().top == $(this).children('.university').children('.year').position().top){
            $(this).children('.university').children('.year').css("margin-top","11px");
        }else{
            $(this).children('.university').children('.year').css("margin-top","0px");
        }
    });
}

var forprojecttool;
var forexperienceyear;
var foreduyear;

$(window).resize(function() {
    setbasicinfo();

    clearTimeout(forprojecttool);
    forprojecttool = setTimeout(Projecttool, 500);    

    clearTimeout(forexperienceyear);
    forexperienceyear = setTimeout(experienceyear, 500);
    
    clearTimeout(foreduyear);
    foreduyear = setTimeout(eduyear, 500);
});

function setskillicons(){        
    $(".level-title:contains('C ')").prepend('<img class="langlogo" src="assets/images/languages/c.png"/>');
    $(".level-title:contains('C++')").prepend('<img class="langlogo" src="assets/images/languages/c++.png"/>');
    $(".level-title:contains('C#')").prepend('<img class="langlogo" src="assets/images/languages/cs.png"/>');
    $(".level-title:contains('Java ')").prepend('<img class="langlogo" src="assets/images/languages/java.png"/>');
    $(".level-title:contains('Python')").prepend('<img class="langlogo" src="assets/images/languages/python.jpg"/>');
    $(".level-title:contains('HTML')").prepend('<img class="langlogo" src="assets/images/languages/html.png"/>');
    $(".level-title:contains('CSS ')").prepend('<img class="langlogo" src="assets/images/languages/css.png"/>');
    $(".level-title:contains('JavaScript')").prepend('<img class="langlogo" src="assets/images/languages/javascript.png"/>');
    $(".level-title:contains('PHP')").prepend('<img class="langlogo" src="assets/images/languages/php.png"/>');
    $(".level-title:contains('Android')").prepend('<img class="langlogo" src="assets/images/languages/android.png"/>');
    $(".level-title:contains('SQL')").prepend('<img class="langlogo" src="assets/images/languages/sql.png"/>');
    $(".level-title:contains('GitHub')").prepend('<img class="langlogo" src="assets/images/languages/octocat.png"/>');
    $(".level-title:contains('Linux/Unix')").prepend('<img class="langlogo" src="assets/images/languages/linux.png"/>');
    $(".level-title:contains('Hibernate')").prepend('<img class="langlogo" src="assets/images/languages/hibernate.png"/>');
    $(".level-title:contains('UWP')").prepend('<img class="langlogo" src="assets/images/languages/uwp.png"/>');
    $(".level-title:contains('SASS & SCSS')").prepend('<img class="langlogo" src="assets/images/languages/sass.png"/>');
    $(".level-title:contains('Trello')").prepend('<img class="langlogo" src="assets/images/languages/trello.png"/>');
    $(".level-title:contains('MS Project')").prepend('<img class="langlogo" src="assets/images/languages/msproject.png"/>');       
}

function setbasicinfo(){
    var viewportsize = $(window).width();
    var info = $(".info");
    $(".info").detach();
    if (viewportsize<=991){
        $(".secondary").append(info);
    }else{
        $(".secondary").prepend(info);
    }
}

jQuery(document).ready(function($) {

    Projecttool();
    experienceyear();
    eduyear();
    setskillicons();
    setbasicinfo();

    $(".otherproject > .item").each(function(){
        let a = this;
        $(this).children('.viewclick').click(function(){
            if($(a).children('.otherprojectgif').css("display") == "none"){
                if($(a).children('.title').text().includes("Sort Algorithm Performance Test")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/sort.gif"/><br>')
                }else if($(a).children('.title').text().includes("Post-comment")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/postcomment.gif"/><br>')
                }else if($(a).children('.title').text().includes("Calculator")){
                    $(a).children('.otherprojectgif').html('<img class="mobile" src="assets/images/projects/calculator.gif"/><br>')
                }else if($(a).children('.title').text().includes("Pic Selec")){
                    $(a).children('.otherprojectgif').html('<img class="mobile" src="assets/images/projects/picselect.gif"/><br>')
                }else if($(a).children('.title').text().includes("Movie Trailer App")){
                    $(a).children('.otherprojectgif').html('<img class="mobile" src="assets/images/projects/movietrailer.gif"/><br>')
                }else if($(a).children('.title').text().includes("Quiz App")){
                    $(a).children('.otherprojectgif').html('<img class="mobile" src="assets/images/projects/quiz.gif"/><br>')
                }else if($(a).children('.title').text().includes("Tic Tac Toe")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/tictactoe.gif"/><br>')
                }else if($(a).children('.title').text().includes("Human Vs Zombie")){
                    $(a).children('.otherprojectgif').html('<img class="mobile" src="assets/images/projects/simulation.gif"/><br>')
                }else if($(a).children('.title').text().includes("Chatnow")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/chatnow.gif"/><br>')
                }else if($(a).children('.title').text().includes("Asteroids")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/asteroids.gif"/><br>')
                }else if($(a).children('.title').text().includes("Mirror")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/mirror.gif"/><br>')
                }else if($(a).children('.title').text().includes("Animal Tracking App")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/ata.gif"/><br>')
                }else if($(a).children('.title').text().includes("Dungeons And Dragons")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/dnd.gif"/><br>')
                }else if($(a).children('.title').text().includes("Battleship")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/bs.gif"/><br>')
                }else if($(a).children('.title').text().includes("Countries Of The World")){
                    $(a).children('.otherprojectgif').html('<img src="assets/images/projects/ctw.gif"/>')
                }
                $(a).children('.otherprojectgif').css("display","block");
                $(this).html($(this).html().replace("View","Hide"));
            }else{
                $(a).children('.otherprojectgif').css("display","none");
                $(this).html($(this).html().replace("Hide","View"));
                $(a).children('.otherprojectgif').empty();
            }            
        })
    })
   

    $(".experiencedetail > .item").each(function(){
        let a = this;
        if($(a).children('.relatedimage').length>0){
            $(a).children('.viewimages').click(function(){
                if($(a).children('.relatedimage').css("display") == "none"){
                    if($(a).children('.title').text().includes("International Student Ambassador")){
                        $(a).children('.relatedimage').html(
                            `<img class="img-fluid activity-image" src="assets/images/activities/nsccisa (7).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (9).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (4).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (1).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (8).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (2).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (3).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (5).jpg" />
                            <img class="img-fluid activity-image" src="assets/images/activities/nsccisa (6).jpg" />`
                        );
                    }else if($(a).children('.title').text().includes("Junior Software Developer (Co-op)")){
                        $(a).children('.relatedimage').html(`<img class="img-fluid activity-image" src="assets/images/activities/bbcertificate.jpg"/>`);
                    }else if($(a).children('.title').text().includes("Senior Analyst")){
                        $(a).children('.relatedimage').html(`<img class="img-fluid activity-image" src="assets/images/activities/kaziit.jpg"/>`);
                    }else if($(a).children('.title').text().includes("Class Representative")){
                        $(a).children('.relatedimage').html(`<img class="img-fluid activity-image" src="assets/images/activities/sa.jpg"/>
                                                            <img class="img-fluid activity-image" src="assets/images/activities/sa-2.png"/>`);
                    }else if($(a).children('.title').text().includes("NSCC 2019 Blockchain Hackathon")){
                        $(a).children('.relatedimage').html(`<img class="img-fluid activity-image" src="assets/images/blockchainhackathon.jpg"/>`);
                    }else if($(a).children('.title').text().includes("Dalhousie University 2020 Banking and Insurance Hackathon")){
                        $(a).children('.relatedimage').html(`<img class="img-fluid activity-image" src="assets/images/bankinghackathon.jpg"/>`);
                    }
                    $(a).children('.relatedimage').css("display","block");
                    $(this).html($(this).html().replace("View","Hide"));
                }else{
                    $(a).children('.relatedimage').css("display","none");
                    $(this).html($(this).html().replace("Hide","View"));
                }            
            })
        }        
    })


    /*======= Skillset *=======*/    
    $('.level-bar-inner').css('width', '0'); 
    
    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    
    
    /* Github Calendar - https://github.com/IonicaBizau/github-calendar */
    GitHubCalendar(".calendar", "EmonMajumder", { responsive: true, tooltips: true});
    
    
    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "emonmajumder", selector: "#feed" });
});