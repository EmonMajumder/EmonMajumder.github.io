$(function() {
  
    var spinner = new Spin.Spinner(getspinnerproperty());
    spinner.spin(document.getElementById('spin'));

    var alldata = [];
    var countries =[];
    var countrysearched = "";
    var unisearched="";
    var countryselected = "emon";
    var countryselectedId = "country0";
    var countrywithnumberofuniversity;
    var madeshort = 1;
    var url ="https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

    let screenheight = window.innerHeight;
    $("#countrylist").html(`<div class="col s12" id="countrylistinnerdiv"></div>`);
    $("#unilist").html(`<div class="col s12" id="unilistinnerdiv"></div>`);       
    $("#countrylistinnerdiv").height(screenheight-300);
    $("#unilistinnerdiv").height(screenheight-300);

    fetch(url)
    .then(response =>response.json())
    .then(data=>{
        data.map(currentValue=>{

            alldata.push(currentValue);
            let countryName = currentValue.country;
            
            if(!countries.includes(countryName))
            {
                countries.push(countryName);                                            
            };                             
        })
    
    })
    .then(()=>{
        alldata.sort(function(a,b){return a.name.localeCompare(b.name);})
    })
    .then(()=>{
        countrywithnumberofuniversity = countries.map(currentcountry=>{
            return {
                countryname:currentcountry,
                number:alldata.filter(currentValue=>currentValue.country == currentcountry).length
            }            
        }).sort((a,b) => b.number-a.number);
        $("#top5").append(`<div class="col s1"></div>`)
        for(let i=0;i<5;i++)
        {
            let code = countrycode(countrywithnumberofuniversity[i].countryname).toLowerCase();
            $("#top5").append(`
            <div class="col s2 flagimage">               
                <img src="https://www.countryflags.io/${code}/flat/64.png">
                <br>
                <strong>${countrywithnumberofuniversity[i].number}</strong>                
            </div>`) 
        }
        $("#top5").append(`<div class="col s1"></div>`)     
    })
    .then(()=>{
        showcountries(countries.sort());
        showuniversities(alldata);
    })
    .then(()=>{
        spinner.stop();
    })
    .catch(err=>{
        alert("Network not available. Please try again.");
    })

    
    function showcountries(countrylist){        
        $("#countrylistinnerdiv").empty();
        let count = 0;        
        countrylist.map(countryName=>{
            let thiscountryuninum = countrywithnumberofuniversity.find(currentcountry=>currentcountry.countryname == countryName).number;
            let code = countrycode(countryName).toLowerCase();
            count++;
            $("#countrylistinnerdiv").append(
                `<div class="countryholder">
                    <div class="col s9">
                        <div class="countryName" id="country${count}">${countryName}</div>
                    </div>
                    <div class="col s2 valign-wrapper">
                        <div class="uninumber">${thiscountryuninum}</div>
                    </div>
                </div>`);

            $(`#country${count}`).click(function(){
                if(madeshort == 1){
                    $("#unilistinnerdiv").height(screenheight-370);
                    madeshort = 2;
                }
                
                $("#flag").css("display","block");
                $("#flag").append(`
                    <img src="https://www.countryflags.io/${code}/flat/64.png">
                `);
                if(countryselectedId != $(this).attr('id'))
                {
                    $(`#${countryselectedId}`).toggleClass('countryclicked countryName');  
                    countryselectedId = $(this).attr('id');                  
                }
                else{
                    countryselectedId = "country0";
                }

                $(this).toggleClass('countryName countryclicked');                
                               
                if(countryselected == $(this).text())
                {
                    countryselected = "emon";
                    showuniversities(alldata);
                }
                else{
                    countryselected = $(this).text();
                    let universitylist = getcountryfiltereduniversitylist(countryselected);
                    showuniversities(universitylist);
                }                
            })       
        })
    }


    function showuniversities(universitylist){

        $("#unilistinnerdiv").empty();  
        let unicount = 0;
        $("#number").text(universitylist.length);
        universitylist.map(currentValue=>{
            unicount++;
            let code = countrycode(currentValue.country).toLowerCase();
            $("#unilistinnerdiv").append(
                `<div class="countryholder">
                    <div class="col s1">
                        <div>
                            <img src="https://www.countryflags.io/${code}/flat/24.png">
                        </div>
                    </div>
                    <div class="col s11">
                        <div class="uniName" id="uni${unicount}">${currentValue.name}</div>
                    </div>
                </div>`);

            $(`#uni${unicount}`).click(function(){
                if(currentValue.web_pages.length==1)
                {
                    window.open(`${currentValue.web_pages[0]}`);
                }
                else{
                    handlewebsitelinks(currentValue.web_pages);        
                }
            })
        })
    }

    function handlewebsitelinks(uniWebs){
        let count = 0;
        $("#weblinks").empty();
        uniWebs.map(currentweb=>{
            count++;
            $("#weblinks").append(`<p id="web${count}" class="webLink">${currentweb}</p>`);
            $(`#web${count}`).click(function(){
                window.open(`${currentweb}`);
            })
        })    
        $("#modal1").modal("open");
    }

    function getcountryfiltereduniversitylist(country){
        return alldata.filter(currentValue=>currentValue.country == country);          
    }

    $("#modal1").modal();
    $("#modalclose").click(()=>{
        $("#modal1").modal("close");
    })
    
    $("#searchcountry").keyup(function(){        
        countryselectedId = "country0";
        let userinput = $(this).val();
        if(countrysearched!=userinput)
        {
            countrysearched=userinput;
            let countrylist = getfilteredcountrylist(countrysearched);
            showcountries(countrylist);
            let universitylist = getcountriesfiltereduniversitylist(countrylist);
            showuniversities(universitylist);
        }
      })

      function getcountriesfiltereduniversitylist(countrylist)
      {
        return alldata.filter(currentValue=>countrylist.includes(currentValue.country))
      }

    $("#searchuni").keyup(function(){
        let universitylist;
        let userinput = $(this).val();
        if(unisearched!=userinput)
        {
            unisearched=userinput;
            if(countryselected=="emon")
            {
                universitylist = getfiltereduniversitylist(userinput);                
            }
            else{
                let newuniversitylist = getcountryfiltereduniversitylist(countryselected);
                universitylist = getfiltereduniversitylist(userinput,newuniversitylist);                
            }
            showuniversities(universitylist);            
        }
    })

    function getfiltereduniversitylist(userinput,mainlist)
    {
        if(mainlist === undefined)
        {
            return alldata.filter(currentValue=>currentValue.name.toLowerCase().search(userinput.toLowerCase())!=-1);
        }
        else{
            return mainlist.filter(currentValue=>currentValue.name.toLowerCase().search(userinput.toLowerCase())!=-1);
        }        
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
        currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    function getfilteredcountrylist(userinput){
        return countries.filter(countryName=>countryName.toLowerCase().search(userinput.toLowerCase())!=-1);
    }

    function getspinnerproperty(){
        return {
            lines: 13, // The number of lines to draw
            length: 38, // The length of each line
            width: 17, // The line thickness
            radius: 45, // The radius of the inner circle
            scale: 1, // Scales overall size of the spinner
            corners: 1, // Corner roundness (0..1)
            fadeColor: 'transparent', // CSS color or array of colors
            speed: 1, // Rounds per second
            rotate: 0, // The rotation offset
            animation: 'spinner-line-shrink', // The CSS animation name for the lines
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: "rgb("+56+","+194+","+139+")",
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            //fadeColor: transparent,
            top: '50%', // Top position relative to parent
            left: '50%', // Left position relative to parent
            shadow: '0 0 1px transparent', // Box-shadow for the lines
            position: 'absolute' // Element positioning
          }
    }
})

function countrycode(countrynameforcode){
    let allcode =[
                {"Code": "AF", "Name": "Afghanistan"},
                {"Code": "AL", "Name": "Albania"},
                {"Code": "DZ", "Name": "Algeria"},
                {"Code": "AD", "Name": "Andorra"},
                {"Code": "AO", "Name": "Angola"},
                {"Code": "AG", "Name": "Antigua and Barbuda"},
                {"Code": "AR", "Name": "Argentina"},
                {"Code": "AM", "Name": "Armenia"},
                {"Code": "AU", "Name": "Australia"},
                {"Code": "AT", "Name": "Austria"},
                {"Code": "AZ", "Name": "Azerbaijan"},
                {"Code": "BS", "Name": "Bahamas"},
                {"Code": "BH", "Name": "Bahrain"},
                {"Code": "BD", "Name": "Bangladesh"},
                {"Code": "BB", "Name": "Barbados"},
                {"Code": "BY", "Name": "Belarus"},
                {"Code": "BE", "Name": "Belgium"},
                {"Code": "BZ", "Name": "Belize"},
                {"Code": "BJ", "Name": "Benin"},
                {"Code": "BM", "Name": "Bermuda"},
                {"Code": "BT", "Name": "Bhutan"},
                {"Code": "BO", "Name": "Bolivia, Plurinational State of"},
                {"Code": "BA", "Name": "Bosnia and Herzegovina"},
                {"Code": "BW", "Name": "Botswana"},
                {"Code": "BR", "Name": "Brazil"},
                {"Code": "BN", "Name": "Brunei Darussalam"},
                {"Code": "BG", "Name": "Bulgaria"},
                {"Code": "BF", "Name": "Burkina Faso"},
                {"Code": "BI", "Name": "Burundi"},
                {"Code": "KH", "Name": "Cambodia"},
                {"Code": "CM", "Name": "Cameroon"},
                {"Code": "CA", "Name": "Canada"},
                {"Code": "CV", "Name": "Cape Verde"},
                {"Code": "KY", "Name": "Cayman Islands"},
                {"Code": "CF", "Name": "Central African Republic"},
                {"Code": "TD", "Name": "Chad"},
                {"Code": "CL", "Name": "Chile"},
                {"Code": "CN", "Name": "China"},
                {"Code": "CO", "Name": "Colombia"},
                {"Code": "CG", "Name": "Congo"},
                {"Code": "CD", "Name": "Congo, the Democratic Republic of the"},
                {"Code": "CR", "Name": "Costa Rica"},
                {"Code": "CI", "Name": "Côte d'Ivoire"},
                {"Code": "HR", "Name": "Croatia"},
                {"Code": "CU", "Name": "Cuba"},
                {"Code": "CY", "Name": "Cyprus"},
                {"Code": "CZ", "Name": "Czech Republic"},
                {"Code": "DK", "Name": "Denmark"},
                {"Code": "DJ", "Name": "Djibouti"},
                {"Code": "DM", "Name": "Dominica"},
                {"Code": "DO", "Name": "Dominican Republic"},
                {"Code": "EC", "Name": "Ecuador"},
                {"Code": "EG", "Name": "Egypt"},
                {"Code": "SV", "Name": "El Salvador"},
                {"Code": "GQ", "Name": "Equatorial Guinea"},
                {"Code": "ER", "Name": "Eritrea"},
                {"Code": "EE", "Name": "Estonia"},
                {"Code": "ET", "Name": "Ethiopia"},
                {"Code": "FO", "Name": "Faroe Islands"},
                {"Code": "FJ", "Name": "Fiji"},
                {"Code": "FI", "Name": "Finland"},
                {"Code": "FR", "Name": "France"},
                {"Code": "GF", "Name": "French Guiana"},
                {"Code": "PF", "Name": "French Polynesia"},
                {"Code": "GA", "Name": "Gabon"},
                {"Code": "GM", "Name": "Gambia"},
                {"Code": "GE", "Name": "Georgia"},
                {"Code": "DE", "Name": "Germany"},
                {"Code": "GH", "Name": "Ghana"},
                {"Code": "GR", "Name": "Greece"},
                {"Code": "GL", "Name": "Greenland"},
                {"Code": "GD", "Name": "Grenada"},
                {"Code": "GP", "Name": "Guadeloupe"},
                {"Code": "GU", "Name": "Guam"},
                {"Code": "GT", "Name": "Guatemala"},
                {"Code": "GN", "Name": "Guinea"},
                {"Code": "GY", "Name": "Guyana"},
                {"Code": "HT", "Name": "Haiti"},
                {"Code": "VA", "Name": "Holy See (Vatican City State)"},
                {"Code": "HN", "Name": "Honduras"},
                {"Code": "HK", "Name": "Hong Kong"},
                {"Code": "HU", "Name": "Hungary"},
                {"Code": "IS", "Name": "Iceland"},
                {"Code": "IN", "Name": "India"},
                {"Code": "ID", "Name": "Indonesia"},
                {"Code": "IR", "Name": "Iran"},
                {"Code": "IQ", "Name": "Iraq"},
                {"Code": "IE", "Name": "Ireland"},
                {"Code": "IL", "Name": "Israel"},
                {"Code": "IT", "Name": "Italy"},
                {"Code": "JM", "Name": "Jamaica"},
                {"Code": "JP", "Name": "Japan"},
                {"Code": "JO", "Name": "Jordan"},
                {"Code": "KZ", "Name": "Kazakhstan"},
                {"Code": "KE", "Name": "Kenya"},
                {"Code": "KI", "Name": "Kiribati"},
                {"Code": "KP", "Name": "Korea, Democratic People's Republic of"},
                {"Code": "KR", "Name": "Korea, Republic of"},
                {"Code": "KW", "Name": "Kuwait"},
                {"Code": "KG", "Name": "Kyrgyzstan"},
                {"Code": "LA", "Name": "Lao People's Democratic Republic"},
                {"Code": "LV", "Name": "Latvia"},
                {"Code": "LB", "Name": "Lebanon"},
                {"Code": "LS", "Name": "Lesotho"},
                {"Code": "LR", "Name": "Liberia"},
                {"Code": "LY", "Name": "Libya"},
                {"Code": "LI", "Name": "Liechtenstein"},
                {"Code": "LT", "Name": "Lithuania"},
                {"Code": "LU", "Name": "Luxembourg"},
                {"Code": "MO", "Name": "Macao"},
                {"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},
                {"Code": "MG", "Name": "Madagascar"},
                {"Code": "MW", "Name": "Malawi"},
                {"Code": "MY", "Name": "Malaysia"},
                {"Code": "MV", "Name": "Maldives"},
                {"Code": "ML", "Name": "Mali"},
                {"Code": "MT", "Name": "Malta"},
                {"Code": "MQ", "Name": "Martinique"},
                {"Code": "MR", "Name": "Mauritania"},
                {"Code": "MU", "Name": "Mauritius"},
                {"Code": "MX", "Name": "Mexico"},
                {"Code": "MD", "Name": "Moldova, Republic of"},
                {"Code": "MC", "Name": "Monaco"},
                {"Code": "MN", "Name": "Mongolia"},
                {"Code": "ME", "Name": "Montenegro"},
                {"Code": "MS", "Name": "Montserrat"},
                {"Code": "MA", "Name": "Morocco"},
                {"Code": "MZ", "Name": "Mozambique"},
                {"Code": "MM", "Name": "Myanmar"},
                {"Code": "NA", "Name": "Namibia"},
                {"Code": "NP", "Name": "Nepal"},
                {"Code": "NL", "Name": "Netherlands"},
                {"Code": "NC", "Name": "New Caledonia"},
                {"Code": "NZ", "Name": "New Zealand"},
                {"Code": "NI", "Name": "Nicaragua"},
                {"Code": "NE", "Name": "Niger"},
                {"Code": "NG", "Name": "Nigeria"},
                {"Code": "NU", "Name": "Niue"},
                {"Code": "NO", "Name": "Norway"},
                {"Code": "OM", "Name": "Oman"},
                {"Code": "PK", "Name": "Pakistan"},
                {"Code": "PS", "Name": "Palestine, State of"},
                {"Code": "PA", "Name": "Panama"},
                {"Code": "PG", "Name": "Papua New Guinea"},
                {"Code": "PY", "Name": "Paraguay"},
                {"Code": "PE", "Name": "Peru"},
                {"Code": "PH", "Name": "Philippines"},
                {"Code": "PL", "Name": "Poland"},
                {"Code": "PT", "Name": "Portugal"},
                {"Code": "PR", "Name": "Puerto Rico"},
                {"Code": "QA", "Name": "Qatar"},
                {"Code": "RO", "Name": "Romania"},
                {"Code": "RU", "Name": "Russian Federation"},
                {"Code": "RW", "Name": "Rwanda"},
                {"Code": "RE", "Name": "Réunion"},
                {"Code": "KN", "Name": "Saint Kitts and Nevis"},
                {"Code": "LC", "Name": "Saint Lucia"},
                {"Code": "VC", "Name": "Saint Vincent and the Grenadines"},
                {"Code": "WS", "Name": "Samoa"},
                {"Code": "SM", "Name": "San Marino"},
                {"Code": "SA", "Name": "Saudi Arabia"},
                {"Code": "SN", "Name": "Senegal"},
                {"Code": "RS", "Name": "Serbia"},
                {"Code": "SC", "Name": "Seychelles"},
                {"Code": "SL", "Name": "Sierra Leone"},
                {"Code": "SG", "Name": "Singapore"},
                {"Code": "SK", "Name": "Slovakia"},
                {"Code": "SI", "Name": "Slovenia"},
                {"Code": "SB", "Name": "Solomon Islands"},
                {"Code": "SO", "Name": "Somalia"},
                {"Code": "ZA", "Name": "South Africa"},
                {"Code": "SS", "Name": "South Sudan"},
                {"Code": "ES", "Name": "Spain"},
                {"Code": "LK", "Name": "Sri Lanka"},
                {"Code": "SD", "Name": "Sudan"},
                {"Code": "SR", "Name": "Suriname"},
                {"Code": "SZ", "Name": "Swaziland"},
                {"Code": "SE", "Name": "Sweden"},
                {"Code": "CH", "Name": "Switzerland"},
                {"Code": "SY", "Name": "Syrian Arab Republic"},
                {"Code": "TW", "Name": "Taiwan"},
                {"Code": "TJ", "Name": "Tajikistan"},
                {"Code": "TZ", "Name": "Tanzania, United Republic of"},
                {"Code": "TH", "Name": "Thailand"},
                {"Code": "TG", "Name": "Togo"},
                {"Code": "TO", "Name": "Tonga"},
                {"Code": "TT", "Name": "Trinidad and Tobago"},
                {"Code": "TN", "Name": "Tunisia"},
                {"Code": "TR", "Name": "Turkey"},
                {"Code": "TM", "Name": "Turkmenistan"},
                {"Code": "TC", "Name": "Turks and Caicos Islands"},
                {"Code": "UG", "Name": "Uganda"},
                {"Code": "UA", "Name": "Ukraine"},
                {"Code": "AE", "Name": "United Arab Emirates"},
                {"Code": "GB", "Name": "United Kingdom"},
                {"Code": "US", "Name": "United States"},
                {"Code": "UY", "Name": "Uruguay"},
                {"Code": "UZ", "Name": "Uzbekistan"},
                {"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},
                {"Code": "VN", "Name": "Viet Nam"},
                {"Code": "VG", "Name": "Virgin Islands, British"},
                {"Code": "VI", "Name": "Virgin Islands, U.S."},
                {"Code": "YE", "Name": "Yemen"},
                {"Code": "ZM", "Name": "Zambia"},
                {"Code": "ZW", "Name": "Zimbabwe"}
            ];
            if(countrynameforcode == "Vietnam"){
                countrynameforcode = "Viet Nam";
            }
            else if(countrynameforcode == "Kosovo"){
                return "kosovo";
            }
    return allcode.find(current=>current.Name == countrynameforcode).Code;        
}
