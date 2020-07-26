$(function() {

    var urlprovincelist = 'https://api.covid19tracker.ca/provinces';
    var urlsummary = 'https://api.covid19tracker.ca/summary/';
    var urldetailbydate = "https://api.covid19tracker.ca/reports?fill_dates&stat=&date&after=2020-03-01&before";
    var urldetailbydatebyprovince = `https://api.covid19tracker.ca/reports/province/none?fill_dates&stat=&date&after=2020-03-01&before`;
    var height = 1000;
    var comparedata = [];

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

    $("#caseandrecoverieschange").height(height);
    $("#caseandrecoveriestotal").height(height);
    $("#deathchange").height(height);
    $("#deathtotal").height(height);
    
    loadmap(null); 

    $(".provinces > button").each(function(){
        $(this).click(function(){            
            if($(this).val()=="ca"){
                populategraphwithdata(urldetailbydate);
            }else{
                $('#vmap').empty();
                loadmap($(this).val());
                populategraphwithdata(urldetailbydatebyprovince.replace("none",$(this).val()));
            }
        })            
    })

    populategraphwithdata(urldetailbydate); 

    $("#compare").click(()=>{compare()})    

    function loadmap(prov){
        $('#vmap').vectorMap({
            map: 'canada_en',
            backgroundColor: null,
            borderColor: 'black',
            borderOpacity: .5,
            borderWidth: 1,
            color: '#ee6e73',
            enableZoom: true,
            hoverColor: '#26a69a',
            hoverOpacity: null,
            normalizeFunction: 'linear',
            scaleColors: ['#b6d6ff', '#005ace'],
            selectedColor: '#8b1014',
            selectedRegions: prov,
            showTooltip: true,
            onRegionClick: function(element, code, region)
            {
                populategraphwithdata(urldetailbydatebyprovince.replace("none",code));
            }
        });
    }

    function populatetablewithdata(latestdata){
        $("#date").text(latestdata.date);
        $("#summary").html(
            `<thead>
                <tr>
                    <th>Title</th>
                    <th class="total">Total</th>
                    <th class="new">New</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Cases</td>
                    <td class="total">${latestdata.total_cases}</td>
                    <td class="new">${latestdata.change_cases}</td>            
                </tr>
                <tr>
                    <td>Deaths</td>
                    <td class="total">${latestdata.total_fatalities}</td>
                    <td class="new">${latestdata.change_fatalities}</td>
                </tr>
                <tr>
                    <td>Tests</td>
                    <td class="total">${latestdata.total_tests}</td>
                    <td class="new">${latestdata.change_tests}</td>
                </tr>
                <tr>
                    <td>Hospitalizations</td>
                    <td class="total">${latestdata.total_hospitalizations}</td>
                    <td class="new">${latestdata.change_hospitalizations}</td>
                </tr>
                <tr>
                    <td>Criticals</td>
                    <td class="total">${latestdata.total_criticals}</td>
                    <td class="new">${latestdata.change_criticals}</td>
                </tr>
                <tr>
                    <td>Recoveries</td>
                    <td class="total">${latestdata.total_recoveries}</td>
                    <td class="new">${latestdata.change_recoveries}</td>
                </tr>
            </tbody>`)
    }

    function populategraphwithdata(url){

        $(".graph").css("display","block");

        fetch(url,requestOptions)
        .then(response =>response.json())
        .then(data=>{

            $("#caseandrecoverieschange").empty();
            $("#caseandrecoveriestotal").empty();
            $("#deathchange").empty();
            $("#deathtotal").empty();

            if(data.province == "All"){
                $("#province").text("Canada");
            }else{
                $("button").each(function(){
                    if($(this).val()==data.province){
                        $("#province").text($(this).text());
                    }
                });                
            }

            populatetablewithdata(data.data[data.data.length-1]);

            let left = 0;

            let a = (height-30)/Math.max.apply(Math, data.data.map(function(day){return day.change_cases;}));
            let b = (height-30)/data.data[data.data.length-1].total_cases;
            let c = (height-30)/Math.max.apply(Math, data.data.map(function(day){return day.change_hospitalizations>day.change_fatalities?day.change_hospitalizations:day.change_fatalities;}));
            let d1 = data.data[data.data.length-1].total_fatalities;
            let d2 = Math.max.apply(Math, data.data.map(function(day){return day.total_hospitalizations;}));
            let d = 0;
            if(d1>d2){
                d = (height-30)/d1;
            }else{
                d = (height-30)/d2;
            }
            

            data.data.map(function(day){      
                $("#caseandrecoverieschange").append(`<div class="datecolumn tooltipped" data-position="top" data-tooltip="${day.date}<br>New Cases: ${day.change_cases}" style="left:${left}px; height:${day.change_cases*a}px;"></div>`);
                $("#caseandrecoverieschange").append(`<div class="datecolumn2 tooltipped" data-position="top" data-tooltip="${day.date}<br>New Recoveries: ${day.change_recoveries}" style="left:${left+10}px; height:${day.change_recoveries*a}px;"></div>`); 
            
                $("#caseandrecoveriestotal").append(`<div class="datecolumn tooltipped" data-position="top" data-tooltip="${day.date}<br>Total Cases: ${day.total_cases}" style="left:${left}px; height:${day.total_cases*b}px;"></div>`);
                $("#caseandrecoveriestotal").append(`<div class="datecolumn2 tooltipped" data-position="top" data-tooltip="${day.date}<br>Total Recoveries: ${day.total_recoveries}" style="left:${left+10}px; height:${day.total_recoveries*b}px;"></div>`);

                $("#deathchange").append(`<div class="datecolumn tooltipped" data-position="top" data-tooltip="${day.date}<br>New Hospitalization: ${day.change_hospitalizations}" style="left:${left}px; height:${day.change_hospitalizations*c}px;"></div>`);
                $("#deathchange").append(`<div class="datecolumn2 tooltipped" data-position="top" data-tooltip="${day.date}<br>New Death: ${day.change_fatalities}" style="left:${left+10}px; height:${day.change_fatalities*c}px;"></div>`);

                $("#deathtotal").append(`<div class="datecolumn tooltipped" data-position="top" data-tooltip="${day.date}<br>Total Hospitalization: ${day.total_hospitalizations}" style="left:${left}px; height:${day.total_hospitalizations*d}px;"></div>`);
                $("#deathtotal").append(`<div class="datecolumn2 tooltipped" data-position="top" data-tooltip="${day.date}<br>Total Death: ${day.total_fatalities}" style="left:${left+10}px; height:${day.total_fatalities*d}px;"></div>`);
                left+=20;
            });
        })
        .then(()=>{
            $('.tooltipped').tooltip();
        })
    }

    function compare(){
        fetch(urlprovincelist)
        .then(response => response.json())
        .then(data=>{
            comparedata = data;
            $("thead").html(
                `<tr>
                    <th>Province</th>
                    <th class="column6">Population</th>
                    <th class="column6">Test (% Population)</th>
                    <th class="column6">Case (% Test)</th>
                    <th class="column6">Active cases</th>
                    <th class="column6">Death (% case)</th>                            
                </tr>`)
            $('tbody').empty();        
        })
        .then(()=>{
            let canadatotalpopulation = 0;
            fetch(urlsummary+'split')
            .then(response => response.json())
            .then(data=>{
                let eachprovince;
                comparedata.map((each)=>{ 
                    if(each.code != "_RC"){
                        eachprovince = data.data.filter((prov)=>prov.province == each.code); 
                        canadatotalpopulation+=each.population;                 
                        $('tbody').append(
                            `<tr>
                                <td>${each.name}</td>
                                <td class="column6">${each.population}</td>
                                <td class="column6">${eachprovince[0].total_tests} (${Math.round((parseInt(eachprovince[0].total_tests)*100)/parseInt(each.population) * 100) / 100}%)</td>
                                <td class="column6">${eachprovince[0].total_cases} (${Math.round((parseInt(eachprovince[0].total_cases)*100)/parseInt(eachprovince[0].total_tests)* 100) / 100}%)</td>
                                <td class="column6">${parseInt(eachprovince[0].total_cases)-parseInt(eachprovince[0].total_recoveries)-parseInt(eachprovince[0].total_fatalities)}</td>
                                <td class="column6">${eachprovince[0].total_fatalities} (${Math.round((parseInt(eachprovince[0].total_fatalities)*100)/parseInt((eachprovince[0].total_cases == 0)?1:eachprovince[0].total_cases)* 100) / 100}%)</td>                 
                            </tr>`)
                    }
                })
            })
            .then(()=>{
                fetch(urlsummary)
                .then(response => response.json())
                .then(data=>{
                    console.log(data.data[0])
                    $('tbody').prepend(
                        `<tr>
                            <td>Canada</td>
                            <td class="column6">${canadatotalpopulation}</td>
                            <td class="column6">${data.data[0].total_tests} (${Math.round((parseInt(data.data[0].total_tests)*100)/parseInt(canadatotalpopulation) * 100) / 100}%)</td>
                            <td class="column6">${data.data[0].total_cases} (${Math.round((parseInt(data.data[0].total_cases)*100)/parseInt(data.data[0].total_tests)* 100) / 100}%)</td>
                            <td class="column6">${parseInt(data.data[0].total_cases)-parseInt(data.data[0].total_recoveries)-parseInt(data.data[0].total_fatalities)}</td>
                            <td class="column6">${data.data[0].total_fatalities} (${Math.round((parseInt(data.data[0].total_fatalities)*100)/parseInt(data.data[0].total_cases)* 100) / 100}%)</td>                 
                        </tr>`)
                })
            })
            $(".graph").css("display","none");
        })
    }
})
