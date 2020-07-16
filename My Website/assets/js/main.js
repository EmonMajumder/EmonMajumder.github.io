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

var forprojecttool;

$(window).resize(function() {
    clearTimeout(forprojecttool);
    forprojecttool = setTimeout(Projecttool, 500);    
});

jQuery(document).ready(function($) {

    Projecttool();

    $(".otherproject > .item").each(function(){
        let a = this;
        $(this).children('.viewclick').click(function(){
            if($(a).children('.otherprojectgif').css("display") == "none"){
                $(a).children('.otherprojectgif').css("display","block");
                $(this).html($(this).html().replace("View","Hide"));
            }else{
                $(a).children('.otherprojectgif').css("display","none");
                $(this).html($(this).html().replace("Hide","View"));
            }            
        })
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