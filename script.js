$(document).ready(function() { 
    setPageAsPerUsertype();
}); 

// Function to load content from another HTML Page 
async function loadOtherHTML(htmlName) {
    try {
      // Use fetch to get the content of Page 
      const response = await fetch(htmlName);
      
      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Convert the response to text
      const data = await response.text();
      
        // Append the required html content into the primary content opened in browser
        var z = document.createElement('div'); // is a node
        z.innerHTML = data;
        document.body.appendChild(z);
  
      // Return a success signal
      return true; 
  
    } catch (error) {
      console.error("Error loading other Page content:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
}
  
function setHeaderFunctions(){
    const startTime = performance.now();

    const iframe = document.querySelector("#headerFrame");
    iframe.addEventListener("load", () => {        
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const svgAndUser = iframeDocument.getElementById("svgAndUserContainer");
        const logoutBtn = iframeDocument.getElementById("logout");
        
        //make logout button visible on user click
        svgAndUser.addEventListener("click",function(){
            logoutBtn.classList.remove('displayOff');
        });
        //logout
        logoutBtn.addEventListener("click",function(){
            location.replace("./index.html");        
        })
        // hide Logout button if clicking elsewhere than loogout
        $(document).click(function(event){ 
            if (!$(event.target).is(logoutBtn) && !logoutBtn.classList.contains('displayOff')) {               
                logoutBtn.classList.add('displayOff');
            }
        });

        var duration = performance.now() - startTime;
        console.log(`half the setHeaderFunctions took ${duration}ms`);

        //hyperlink to home in title
        var pathNam = "";
        pathNam = window.location.pathname;        
        // console.log(pathNam);
        if (pathNam.includes("Markaz")) {
            iframeDocument.getElementById("appName").addEventListener("click",function(){
                location.replace("./Markaz Admin.html");         
            })
        } else if(pathNam.includes("Masjid")){
            iframeDocument.getElementById("appName").addEventListener("click",function(){
                location.replace("./Masjid Admin.html");  
            })
        }
        duration = performance.now() - startTime;
        console.log(`setHeaderFunctions took ${duration}ms`);
    });


}

function makeUserVisible(user_type){
    const iframe = document.querySelector("#headerFrame");
    console.log('yet to enter makeUserVisible()');
    iframe.addEventListener("load", () => { 

    // iframe.onload = () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const svgAndUser = iframeDocument.getElementById("svgAndUserContainer");
        console.log('entering makeUserVisible()');
     
        //set usertype as Masjid or Markaz
        iframeDocument.getElementById("masjidOrMarkaz").innerHTML = user_type;

        // make it visible
        svgAndUser.classList.remove("hideVisibility");
    });

}

function dateFormatChange(dateInput){
    // Create a Date object from the input value
    const date = new Date(dateInput);

    //get the desired format
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);

    return formattedDate;
}

function hide(e){
    e.forEach(element => {
        document.getElementById(element).classList.add("displayOff"); 
        // console.log(document.getElementById(element));   
    });
}

function show(e){
    e.forEach(element => {
           document.getElementById(element).classList.remove("displayOff");   
    });
}

function login(userType){
    let text="";
    text = userType;
    if (userType=="Markaz Admin") {
        location.replace("./Markaz Admin.html");        
    } else if(text.includes("Masjid")){
        location.replace("./Masjid Admin.html");  
    }
}

function setPageAsPerUsertype(){
    const startTime = performance.now();

    var masjidMarkaz ="";
    masjidMarkaz=window.location.pathname;
    if (masjidMarkaz.includes("Masjid") || masjidMarkaz.includes("Markaz")){
        setHeaderFunctions();
        loadOtherHTML("Monthly Report.html")
        .then(()=>{
            loadOtherHTML("Monthly Form.html")
            .then(()=>{                
                hide(['fullFormMonthly']);
    
                document.getElementById("openMonthlyFormBtn").addEventListener("click",function(){
                    //for Masjid Admin
                    hide(['filter-dashboard-container']);
                    show(['fullFormMonthly']);
                });
    
                //enable multiple languages in monthly Form
                $('input[type="checkbox"]').click(function() { 
                    var inputValue = $(this).attr("value"); 
                    $("." + inputValue).toggle(); 
                }); 
        
                document.getElementById("closeMonthlyForm").addEventListener("click",function(){
                    hide(['fullFormMonthly']);
                    show(['filter-dashboard-container']);
                });
    
                //Set up for Masjid
                if (masjidMarkaz.includes("Masjid")) {

                    makeUserVisible("Masjid");
  
                    document.getElementById("openMonthlyFormBtn").addEventListener("click",function(){
                        hide(['tarteebCard','monthlyReportHeading4Masjid']);//add h3 after assinging id
                    });
                
                    document.getElementById("closeMonthlyForm").addEventListener("click",function(){
                        show(['tarteebCard','monthlyReportHeading4Masjid']);
                    });

                    //hide search by Masjid bar
                    document.getElementById('searchByMasjid').classList.add('displayOff');
                    //edit this code to fetch logged in masjid name and select
                    document.getElementById("masjidDD").selectedIndex = 1;
                    //freeze masjid selection dropdown
                    document.getElementById("masjidDD").disabled = true;
    
                } 
                // Set up for Markaz 
                else if(masjidMarkaz.includes("Markaz")){

                    makeUserVisible("Markaz");

                    hide(['filter-dashboard-container']);
    
                    document.getElementById("monthly-report-tab-title").addEventListener("click",function(){
                        hide(['weekly-filter-report-container']);
                        show(['filter-dashboard-container']);
                        document.getElementById('weekly-report-tab-title').classList.add('dim');
                        document.getElementById('monthly-report-tab-title').classList.remove('dim');
                    })
                
                    document.getElementById("weekly-report-tab-title").addEventListener("click",function(){
                        hide(['filter-dashboard-container']);
                        show(['weekly-filter-report-container']);
                        document.getElementById('weekly-report-tab-title').classList.remove('dim');
                        document.getElementById('monthly-report-tab-title').classList.add('dim');
                    })
                
                    document.getElementById("openWeeklyFormBtn").addEventListener("click",function(){
                        hide(['tabs','weekly-filter-report-container','1-dayRukh2Container','1-dayRukh3Container','3-dayRukh2container','khidmat2container']);
                        show(['weeklyFormMasterContainer','1-dayRukh1svg','3-dayRukh1svg','khidmatSVG']);
                    });
    
                    document.getElementById("1-dayRukh1svg").addEventListener("click",function(){
                        hide(['1-dayRukh1svg']);
                        show(['1-dayRukh2Container','1-dayRukh2svg']);
                    });
    
                    document.getElementById("1-dayRukh2svg").addEventListener("click",function(){
                        hide(['1-dayRukh2svg']);
                        show(['1-dayRukh3Container']);
                    });
    
                    document.getElementById("3-dayRukh1svg").addEventListener("click",function(){
                        hide(['3-dayRukh1svg','khidmat2container']);
                        show(['3-dayRukh2container']);
                    });
    
                    document.getElementById("khidmatSVG").addEventListener("click",function(){
                        hide(['khidmatSVG']);
                        show(['khidmat2container']);
                    });
                
                    document.getElementById("closeWeeklyForm").addEventListener("click",function(){
                        hide(['weeklyFormMasterContainer']);
                        show(['tabs','weekly-filter-report-container']);
                    });

                    onWeeklyFormSubmit();
                
                    document.getElementById("openMonthlyFormBtn").addEventListener("click",function(){
                        hide(['tabs']);
                    });
                
                    document.getElementById("closeMonthlyForm").addEventListener("click",function(){
                        show(['tabs']);
                    });
                }
            });           
        });
        
    } 

    const duration = performance.now() - startTime;
    console.log(`setPageAsPerUsertype took ${duration}ms`);
}

function onWeeklyFormSubmit(){
    document.getElementById("submitWeeklyForm").addEventListener("click",function(){
        document.getElementById('unblurred').classList.remove('displayOff');

        var OneDayRukh1 = document.getElementById('1-dayRukh1').value;
        var OneDayRukh2 = document.getElementById('1-dayRukh2').value;
        var OneDayRukh3 = document.getElementById('1-dayRukh3').value;
        var ThreeDayRukh1 = document.getElementById('3-dayRukh1').value;
        var ThreeDayRukh2 = document.getElementById('3-dayRukh2').value;
        var weeklyDate = dateFormatChange(document.getElementById('weeklyDate').value);
        

        var foo = document.createElement('div');
        foo.innerHTML = weeklyDate;
        document.getElementById('popUpTitle').insertAdjacentElement("afterend",foo);
        foo.style.marginBottom="10px";
        
        
        if(OneDayRukh1!="not selected"){
            var z = document.createElement('li'); // is a node
            z.innerHTML = OneDayRukh1;
            document.getElementById('1-dayRukhsUL').appendChild(z);
        }
        if(OneDayRukh2!="not selected"){
            var z = document.createElement('li'); // is a node
            z.innerHTML = OneDayRukh2;
            document.getElementById('1-dayRukhsUL').appendChild(z);
        }      
        if(OneDayRukh3!="not selected"){
            var z = document.createElement('li'); // is a node
            z.innerHTML = OneDayRukh3;
            document.getElementById('1-dayRukhsUL').appendChild(z);
        }
        if(OneDayRukh1=="not selected" && OneDayRukh2=="not selected" && OneDayRukh3=="not selected"){
            var z = document.createElement('li');
            z.innerHTML = 'None';
            document.getElementById('1-dayRukhsUL').appendChild(z);
        }
        if(ThreeDayRukh1!="not selected"){
            var z = document.createElement('li'); // is a node
            z.innerHTML = ThreeDayRukh1;
            document.getElementById('3-dayRukhsUL').appendChild(z);
        }
        if(ThreeDayRukh2!="not selected"){
            var z = document.createElement('li'); // is a node
            z.innerHTML = ThreeDayRukh2;
            document.getElementById('3-dayRukhsUL').appendChild(z);
        }
        if(ThreeDayRukh1=="not selected" && ThreeDayRukh2=="not selected"){
            var z = document.createElement('li');
            z.innerHTML = 'None';
            document.getElementById('3-dayRukhsUL').appendChild(z);
        }
    });

    setUpWhatsApp();
}

function setUpWhatsApp(){
    document.getElementById("whatsAppYes").addEventListener("click",function(){
    
        const OneDayRukhs = document.querySelectorAll("#\\31-dayRukhsUL li");
        const ThreeDayRukhs = document.querySelectorAll("#\\33-dayRukhsUL li");

        const OneDayRukhsArray = Array.from(OneDayRukhs).map(li => `- ${li.textContent.trim()}`);
        const ThreeDayRukhsArray = Array.from(ThreeDayRukhs).map(li => `- ${li.textContent.trim()}`);

        const OneDayRukhsWLines = OneDayRukhsArray.join("\n");
        const ThreeDayRukhsWLines = ThreeDayRukhsArray.join("\n");

        const encodedOneDayRukhs = encodeURIComponent(OneDayRukhsWLines);
        const encodedThreeDayRukhs = encodeURIComponent(ThreeDayRukhsWLines);

        let whatsAppMsg = `*Latest Jamat Tarteeb!*%0a> `
                +dateFormatChange(document.getElementById('weeklyDate').value)
                +`%0a_1-day Jamaats:_%0a${encodedOneDayRukhs}`                        
                // +document.getElementById('1-dayRukhsUL').textContent
                +`%0a_3-day Jamaats:_%0a${encodedThreeDayRukhs}`
                // +document.getElementById('3-dayRukhsUL').innerText;
        let urlForWA = `https://api.whatsapp.com/send?text=${whatsAppMsg}`;
        // Open the WhatsApp URL to send the message
        window.open(urlForWA, '_blank');
        // document.getElementById('unblurred').classList.add('displayOff');
        // document.getElementById("closeWeeklyForm").click();
        location.reload();
    });

    document.getElementById("whatsAppNo").addEventListener("click",function(){
        // document.getElementById('unblurred').classList.add('displayOff');
        // document.getElementById("closeWeeklyForm").click();
        location.reload();
    });    
}

function play(fileName) {
    var audio = new Audio('./assets/audios/'+fileName+'.mp3');
    audio.play();
}

function sectionChange(openSec) {
    //default clear section bg color 
    var openDiv = document.getElementById('sectionsContainer');                       
    openDiv.classList.remove("bgForSec1","bgForSec2","bgForSec3");            
    //default visibility off
    const sections = ['section1Container','section2Container','section3Container'];
    for (const section of sections) {
        var div = document.getElementById(section);
        div.style.display = 'none';
    }
    //default size of dot 
    var dots = document.getElementsByClassName('sectionDot');
    for (const dot of dots){
        console.log(dot.classList);
        dot.classList.remove("openedSecDot");
    }
    //default size of section number 
    var secNumb = document.getElementsByClassName('secNum');
    for (const secNu of secNumb){
        secNu.classList.remove("openedSecName");
    }    

    if (openSec=='openSec2') {
        //set background color as per opened section
        openDiv.classList.add("bgForSec2");
        //make that section div visible 
        var div = document.getElementById('section2Container');
        //magnify relevant section dot
        document.getElementById('dot2').classList.add("openedSecDot");
        //magnify font size of relevant section number
        document.getElementById('sec2Name').classList.add("openedSecName");
    } else if(openSec=='openSec3'){
        openDiv.classList.add("bgForSec3");
        var div = document.getElementById('section3Container');                
        document.getElementById('dot3').classList.add("openedSecDot");
        document.getElementById('sec3Name').classList.add("openedSecName");
    } else {
        openDiv.classList.add("bgForSec1");
        var div = document.getElementById('section1Container');                
        document.getElementById('dot1').classList.add("openedSecDot");
        document.getElementById('sec1Name').classList.add("openedSecName");
    }
    div.style.display = 'block';
}
