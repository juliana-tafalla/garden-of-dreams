/* ==========================================================================
   GLOBAL VARIABLES
   ========================================================================== */
let isTyping = false;
let textTimer = null;

/* ==========================================================================
   MAIN (DOCUMENT READY FUNCTION)
   ========================================================================== */
$(document).ready(function () {
    
    setupAndRun();

});

function main() {
    const assignedGuide = getSSItem("assignedGuide");
    const workExperiences = getSSItem("workExperiences");
    const interests = getSSItem("interests");

    loadDetails();
    loadStart(assignedGuide);

    loadExperiencesList(workExperiences);
    loadReadMore(workExperiences);

    loadInterests(interests);
}

/* ==========================================================================
   HOME FUNCTIONS 
   ========================================================================== */
/*
function runHome() {
    const assignedGuide = getSSItem("assignedGuide");

    loadDetails();
    loadStart(assignedGuide);
}
*/

function loadDetails() {
    // open the hidden section when users click [details]
    $("#details-btn").click(function() {
        $("#main-menu").fadeOut("slow", function() {
            $("#details").fadeIn("slow");
            $(".overflow-y-auto").scrollTop(0);
        });
    });

    // close the section when users click the close button
    $("#details #close-btn").click(function() {
         $("#details").fadeOut("slow", function() {
            $("#main-menu").fadeIn("slow");
        });

    });
}

function loadStart(whichGuide) {
    // open the hidden section when users click [start]
    $("#start-btn").click(function() {
        $("#main-menu").fadeOut("slow", function() {
            $("#start").fadeIn("slow");

            const targetSprite = getSSItem("guideSprites").find(sp => sp.guide == whichGuide);
            const targetScript = getSSItem("guideScripts").find(sc => sc.guide == whichGuide && sc.script == "introScript");
            
            $("#start #projection-dialogue img#guide").attr({
                "id": `guide-${targetSprite.guide}`,
                "src": `${targetSprite.sprites[0]}`,
                "alt": `Guide ${targetSprite.guide}, here to guide you!`,
                "class": `${targetSprite.twClass[0]}`
            });
            
            progressDialogue(whichGuide, targetScript, "#start #projection-dialogue");
        });
    });
}

/* ==========================================================================
   EXPERIENCES FUNCTIONS 
   ========================================================================== */
/*
function runExperiences() {
    const workExperiences = getSSItem("workExperiences");
    loadExperiencesList(workExperiences);
    loadReadMore(workExperiences);
}
*/

function loadExperiencesList(workExperiences) {
    // const workExperiences = getSSItem("workExperiences");

    for (let i = 0; i < workExperiences.length; i++) {
        // projection (background) for each item
        const projectionItem = $("<div></div>")
            .attr({
                "id": "projection",
                "class": "w-full lg:w-[750px]"
            });

        // logo
        const logoLink = $("<a></a>").attr("href", workExperiences[i].link);
        const logo = $("<img />").attr({
            "id": "company-logo",
            "src": workExperiences[i].logo,
            "alt": `${workExperiences[i].company}'s logo`,
            "class": "w-4/5 m-auto md:w-auto md:m-0"
        });
        logoLink.append(logo);

        // content
        const content = $("<div></div>");
        const role = $("<p id='role'></p>").text(workExperiences[i].role);
        const duration = $("<p id='duration' class='md:float-right'></p>")
            .text(workExperiences[i].duration)
        const company = $("<p id='company'></p>").text(workExperiences[i].company);
        const intro = $("<p id='intro'></p>").text(workExperiences[i].contributionsDesc);
        const readMore = $(`<button id='${workExperiences[i].id}'></button>`).text("read more");
        content.append(role, duration, company, intro, readMore);

        projectionItem.append(logoLink, content);

        $("#experiences-list").append(projectionItem);
    }    
}

function loadReadMore(workExperiences) {
    // const workExperiences = getSSItem("workExperiences");

    // open the hidden section when users click [read more]
    $("#experiences-list button").click(function () {
        $("#experiences-list").hide();
        $("#read-more").toggleClass("hidden");

        const targetExperience = workExperiences.find(experience => experience.id == $(this).attr("id"));

        // overview
        $("#overview a").attr("href", targetExperience.link);
        $("#overview img#company-logo").attr({
            "src": targetExperience.logo,
            "alt": `${targetExperience.company}'s logo`,
            "class": "w-4/5 m-auto md:w-auto md:m-0"
        });

        $("#overview #role").text(targetExperience.role);
        $("#overview #duration").text(targetExperience.duration);
        $("#overview #company").text(targetExperience.company);
        $("#overview #about").text(targetExperience.about);

        // contributions and achievements
        $("#contributions #contributions-desc").text(targetExperience.contributionsDesc);
        $("#contributions #contributions-list ul#list").text("");

        for (let i = 0; i < targetExperience.contributionsList.length; i++) {
            const listItem = $("<li></li>").text(targetExperience.contributionsList[i]);
            $("#contributions-list ul#list").append(listItem);
        }

        // skills
        $("#skills #skills-list ul#list").text("");
        for (let i = 0; i < targetExperience.skillsList.length; i++) {
            const listItem = $("<li></li>")
                .html(`<span class="font-bold">${targetExperience.skillsList[i][0]}: </span><span>${targetExperience.skillsList[i][1]}</span>`);

            $("#skills-list ul#list").append(listItem);
        }

        $(".overflow-y-auto").scrollTop(0);
    });

    // close the section when users click the close button
    $("#read-more #close-btn").click(function() {
        $("#experiences-list").show();
        $("#read-more").toggleClass("hidden");
    });
}

/* ==========================================================================
   ABOUT ME FUNCTIONS 
   ========================================================================== */
function loadInterests(interests) {
    // open the hidden section when users click one of the [interests]
    $("#diary #interests button").click(function() {
        $("#main-left-projection").toggleClass("hidden");
        $("#main-right-projection").toggleClass("hidden");

        $("#sub-left-projection").toggleClass("hidden");
        $("#sub-right-projection").toggleClass("hidden");

        const targetInterest = interests.find(interest => interest.id == $(this).attr("id"));
        let index = 0;

        // fill in content for the left projection
        $("#sub-left-projection #interest").text(targetInterest.title);
        // default image and description loaded
        $("#sub-left-projection #interest-imgs").attr("src", targetInterest.images[index].source)
        $("#sub-left-projection #interest-desc").text(targetInterest.images[index].imgDescription);
    
        $("#sub-left-projection #interest-imgs").off("click").click(function() {
            index++;
            if (index == targetInterest.images.length) {
                index = 0;
            }
            
            $("#sub-left-projection #interest-imgs").fadeOut(120, function() {
                $("#sub-left-projection #interest-imgs").attr("src", targetInterest.images[index].source);
                $("#sub-left-projection #interest-imgs").fadeIn();
            });

            $("#sub-left-projection #interest-desc").fadeOut(120, function() {
                $("#sub-left-projection #interest-desc").text(targetInterest.images[index].imgDescription);
                $("#sub-left-projection #interest-desc").fadeIn();
            });
            
        });

        // fill in content for the right projection
        $("#sub-right-projection #description").text(targetInterest.description);
        
        $(".overflow-y-auto").scrollTop(0);

    });

    // close the section when users click the close button
    $("#sub-right-projection button").click(function() {
        $("#main-left-projection").toggleClass("hidden");
        $("#main-right-projection").toggleClass("hidden");

        $("#sub-left-projection").toggleClass("hidden");
        $("#sub-right-projection").toggleClass("hidden");
        
        $(".overflow-y-auto").scrollTop(0);
    });
}


/* ==========================================================================
   DIALOGUE FUNCTIONS 
   ========================================================================== */
function insertDialogue(whichGuide, whichScript, whichProjectionDialogue) {
    const currIndex = whichScript.currLine;
    const currLine = whichScript.lines[currIndex];

    $(`${whichProjectionDialogue} #guide-name`).text(`Guide ${whichGuide}`);
    
    $(`${whichProjectionDialogue} #guide-dialogue span`).text("");
    // $(`${projectionDialogue} #guide-dialogue span`).text(currLine);

    typeWriterEffect(currLine, `${whichProjectionDialogue} #guide-dialogue span`);
}

function progressDialogue(whichGuide, whichScript, whichProjectionDialogue) {
    insertDialogue(whichGuide, whichScript, whichProjectionDialogue);

    $(`${whichProjectionDialogue} #dialogue`).off("click").click(function() {
        if (isTyping) {
            endTyping(whichScript.lines[whichScript.currLine], `${whichProjectionDialogue} #guide-dialogue span`)
        }
        else {
            whichScript.currLine++;

            if (whichScript.currLine < whichScript.lines.length) {
                insertDialogue(whichGuide, whichScript, whichProjectionDialogue);
            }
            else {
                switch (whichScript.type) {
                    case "choices": 
                        console.log("show choices here!");
                        handleChoices(whichGuide, whichScript, whichProjectionDialogue);
                        break;

                    case "redirect": 
                        console.log("handle page redirects here!");
                        handlePageRedirects(whichScript);
                        break;

                    default:
                        console.log("hide dialogue here!");
                }
            }
        }
    });
}

function handleChoices(whichGuide, whichScript, whichProjectionDialogue) {
    showChoices(whichProjectionDialogue);
    
    $(`#choices button`).off("click").click(function () {
        const targetChoice = whichScript.choices.find(c => c.btnRef == $(this).attr("id"));
        
        // const nextScript = scripts.find(s => s.script == choice.nextScript);
        const targetNextScript =
            getSSItem("guideScripts").find(sc => sc.guide == whichGuide && sc.script == targetChoice.nextScript);

        hideChoices(whichProjectionDialogue);
        whichScript.currLine = 0;

        progressDialogue(whichGuide, targetNextScript, whichProjectionDialogue);
    });
}

function showChoices(whichProjectionDialogue) {
    $(`${whichProjectionDialogue} #choices button`).removeClass("hidden");

    $(`${whichProjectionDialogue} #dark-overlay`).removeClass("hidden");    
}

function hideChoices(whichProjectionDialogue) {
    $(`${whichProjectionDialogue} #choices button`).addClass("hidden");

    $(`${whichProjectionDialogue} #dark-overlay`).addClass("hidden");    
}

function handlePageRedirects(whichScript) {
    $("body").fadeOut("slow", function() {
        whichScript.currLine = 0;
        location.href = whichScript.redirect;
        $("body").fadeIn("slow");
    });
}

function typeWriterEffect(whichText, whichGuideDialogue) {
    clearInterval(textTimer);
    isTyping = true;

    let i = 0;
    textTimer = setInterval(function() {
        if (i < whichText.length) {
            $(whichGuideDialogue).append(whichText[i++]);
        }
        else {
            endTyping(whichText, whichGuideDialogue);
        }
    }, 30);
}

function endTyping(whichText, whichGuideDialogue) {
    clearInterval(textTimer);
    $(whichGuideDialogue).text(whichText);
    isTyping = false;
}



/* ==========================================================================
   MISCELLANEOUS FUNCTIONS 
   ========================================================================== */
function randomizeGuides() {
    const guides = [111, 222];
    const randIndex = Math.floor(Math.random() * guides.length);
    
    return guides[randIndex];
}

async function setupAndRun() {
    setSSItem("assignedGuide", randomizeGuides());
    setSSItem("totalClicks", 0);
    //
    try {
        // ensure that the fetches only happen if one of the json files aren't in the session storage
        if (getSSItem("guideSprites") == null) {
            const spritesPromise = fetchJSONData("./json-data/guide-sprites.json");
            const scriptsPromise = fetchJSONData("./json-data/guide-scripts.json");
            const workExperiencesPromise = fetchJSONData("./json-data/work-experiences.json");
            const interestsPromise = fetchJSONData("./json-data/interests.json");

            const [guideSprites, guideScripts, workExperiences, interests] = await Promise.all([
                spritesPromise,
                scriptsPromise,
                workExperiencesPromise,
                interestsPromise
            ]);

            /* [assigned guide's data alone] 
            setSSItem("guideSprites", guideSprites.find(sp => sp.guide == getSSItem("assignedGuide")));
            setSSItem("guideScripts", guideScripts.find(sc => sc.guide == getSSItem("assignedGuide")));
            */

            /* [all guides' data] */
            setSSItem("guideSprites", guideSprites);
            setSSItem("guideScripts", guideScripts);
            setSSItem("workExperiences", workExperiences);
            setSSItem("interests", interests);
        }

        // run all functions after data is stored in the session storage 
        main();

    }
    catch (error) {
        console.error("oh no, an error occured: ", error);
    }
    //
}

async function fetchJSONData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("uh oh, there was a network error!");
        const data = await response.json();

        return data;
    }
    catch (error) {
        console.error("oh no, a fetch error occured: ", error);
    }
}

function setSSItem(key, value) {
    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

function getSSItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

