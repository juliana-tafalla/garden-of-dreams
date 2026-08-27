/* ==========================================================================
   GARDEN OF DREAMS - JAVASCRIPT/JQUERY (index.js)
   ========================================================================== 
    "garden of dreams" uses jQuery, a JavaScript library.
    
    The JavaScript file contains the code to fetch data from JSON files and
    run the functionality of the website.

    The file is organized into eigth sections:
    - GLOBAL CONSTANTS AND VARIABLES
    - MAIN (DOCUMENT READY FUNCTION): functions that run the whole program
    - HOME FUNCTIONS: functions for index.html
    - EXPERIENCES FUNCTIONS: functions for experiences.html
    - ABOUT ME FUNCTIONS: functions for about.html
    - DIALOGUE FUNCTIONS: functions related to the visual novel dialogue
        portion of the website
    - GUIDE INTERACTIONS FUNCTIONS: functions related to the visual novel 
        portion of the website
    - MISCELLANEOUS FUNCTIONS: functions related to fetching and storing
        JSON data
*/

/* ==========================================================================
   GLOBAL CONSTANTS AND VARIABLES
   ========================================================================== */
// global constants used for loading guide sprites; indexes associated with sprites and Tailwind classes arrays
const [GREETING, GREETING_SM, IDLE, IDLE_SM] = [0, 1, 2, 3];

// global variables used by typewriterEffect() and its related functions
let isTyping = false;
let textTimer = null;

/* ==========================================================================
   MAIN (DOCUMENT READY FUNCTION)
   ========================================================================== */
$(document).ready(function () {
    
    setupAndRun();

});

// main(): runs the program
function main() {
    const assignedGuide = getSSItem("assignedGuide");
    const workExperiences = getSSItem("workExperiences");
    const interests = getSSItem("interests");
    
    loadDetails();
    loadStart(assignedGuide);

    loadExperiencesList(workExperiences);
    loadReadMore(workExperiences);

    loadInterests(interests);

    loadGuideInteraction(assignedGuide, "experiences");
    loadGuideInteraction(assignedGuide, "about-me");
    loadMysteriousButton(assignedGuide, "experiences");
    loadMysteriousButton(assignedGuide, "about-me");
}

/* ==========================================================================
   HOME FUNCTIONS 
   ========================================================================== */
/* loadDetails(): loads and displays the [details] section on the [HOME] main screen */
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

/* loadStart(): loads and displays the [start] section on the [HOME] main screen 
 * input(s):
        whichGuide: integer; ID of the assigned guide
*/
function loadStart(whichGuide) {
    const targetSprite = getSSItem("guideSprites").find(sp => sp.guide == whichGuide);
    const targetScript = getSSItem("guideScripts").find(sc => sc.guide == whichGuide && sc.script == "introScript");
            
    // open the hidden section when users click [start]
    $("#start-btn").click(function() {
        $("#main-menu").fadeOut("slow", function() {
            // $("#start").fadeIn("slow");

            $("#start #projection-dialogue img#guide").attr({
                "id": `guide-${targetSprite.guide}`,
                "src": `${targetSprite.sprites[GREETING]}`,
                "alt": `Guide ${targetSprite.guide}, here to guide you!`,
                "class": `${targetSprite.twClass[GREETING]}`
            });

            $("#start").fadeIn("slow");
            
            progressDialogue(whichGuide, targetScript, "#start #projection-dialogue");
        });
    });
}

/* ==========================================================================
   EXPERIENCES FUNCTIONS 
   ========================================================================== */
/* loadExperiencesList(): loads and displays the work experiences list on [EXPERIENCES]
 * input(s):
        workExperiences: array of objects; information about my work experiences
*/
function loadExperiencesList(workExperiences) {
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

    // mysterious button
    const mysteriousBtn = 
        $("<button id='mysterious-btn'><img src='images/garden/mysterious-btn-icon.svg' alt='a mysterious button that looks like a moon. hm...' class='w-auto m-auto'></button");
    $("#experiences-list").append(mysteriousBtn);
}

/* loadReadMore(): loads and displays the read more section on [EXPERIENCES] after clicking [read more]
 * input(s):
        workExperiences: array of objects; information about my work experiences
*/
function loadReadMore(workExperiences) {
    // open the hidden section when users click [read more]
    $("#experiences-list #projection button").click(function () {
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
/* loadInterests(): loads and displays an interest section on [ABOUT ME] after clicking one of the [interests]
 * input(s):
        interests: array of objects; information about my interests
*/
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
        // go through other images and descriptions after clicking the image
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
        
        // $(".md:overflow-y-auto").scrollTop(0);
        $("#sub-left-projection").scrollTop(0);
        $("#sub-right-projection").scrollTop(0);

    });

    // close the section when users click the close button
    $("#sub-right-projection button").click(function() {        
        $("#main-left-projection").toggleClass("hidden");
        $("#main-right-projection").toggleClass("hidden");

        $("#sub-left-projection").toggleClass("hidden");
        $("#sub-right-projection").toggleClass("hidden");
        
        // $(".md:overflow-y-auto").scrollTop(0);
        $("#main-left-projection").scrollTop(0);
        $("#main-right-projection").scrollTop(0);
    });
}

/* ==========================================================================
   DIALOGUE FUNCTIONS 
   ========================================================================== */
/* insertDialogue(): inserts a guide's dialogue from a script in the projection dialogue 
 * input(s):
        whichGuide: integer; ID of the assigned guide
        whichScript: object; script associated with the assigned guide; filtered before use
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/ 
function insertDialogue(whichGuide, whichScript, whichProjectionDialogue) {
    const currIndex = whichScript.currLine;
    const currLine = whichScript.lines[currIndex];

    $(`${whichProjectionDialogue} #guide-name`).text(`Guide ${whichGuide}`);
    
    $(`${whichProjectionDialogue} #guide-dialogue span`).text("");

    typewriterEffect(currLine, `${whichProjectionDialogue} #guide-dialogue span`);
}

/* progressDialogue(): handles a guide's dialogue progression
 * input(s):
        whichGuide: integer; ID of the assigned guide
        whichScript: object; script associated with the assigned guide; filtered before use
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/ 
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
                        handleChoices(whichGuide, whichScript, whichProjectionDialogue);
                        break;

                    case "redirect": 
                        handlePageRedirects(whichScript);
                        break;

                    default:
                        hideDialogue(whichScript, whichProjectionDialogue)
                }
            }
        }
    });

    // hide the projection dialogue when users click the [dark overlay]
    if (!whichScript.type == "choices" || whichScript.type == null) {
        $(`${whichProjectionDialogue} #dark-overlay`).off("click").click(function() {
            hideDialogue(whichScript, whichProjectionDialogue);
        });
    }
}

/* showChoices(): displays choices
 * input(s):
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/
function showChoices(whichProjectionDialogue) {
    $(`${whichProjectionDialogue} #choices button`).removeClass("hidden");

    $(`${whichProjectionDialogue} #dark-overlay`).removeClass("hidden");    
}

/* hideChoices(): hides choices
 * input(s):
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/
function hideChoices(whichProjectionDialogue) {
    $(`${whichProjectionDialogue} #choices button`).addClass("hidden");

    $(`${whichProjectionDialogue} #dark-overlay`).addClass("hidden");    
}

/* handleChoices(): handles guide scripts that contain choices for users to select
 * input(s):
        whichGuide: integer; ID of the assigned guide
        whichScript: object; script associated with the assigned guide; filtered before use
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/
function handleChoices(whichGuide, whichScript, whichProjectionDialogue) {
    showChoices(whichProjectionDialogue);
    
    $(`#choices button`).off("click").click(function () {
        const targetChoice = whichScript.choices.find(c => c.btnRef == $(this).attr("id"));
        const targetNextScript =
            getSSItem("guideScripts").find(sc => sc.guide == whichGuide && sc.script == targetChoice.nextScript);

        hideChoices(whichProjectionDialogue);
        whichScript.currLine = 0;

        progressDialogue(whichGuide, targetNextScript, whichProjectionDialogue);
    });
}

/* handlePageRedirects(): handles guide scripts that contain page redirects; redirects users to the specified page
 * input(s):
        whichScript: object; script associated with the assigned guide; filtered before use
*/
function handlePageRedirects(whichScript) {
    $("body").fadeOut("slow", function() {
        whichScript.currLine = 0;
        location.href = whichScript.redirect;
        $("body").fadeIn("slow");
    });
}

/* hideDialogue(): hides and resets guide dialogues
 * input(s):
        whichScript: object; script associated with the assigned guide; filtered before use
        whichProjectionDialogue: selector/HTML element; element that holds the guide's dialogue;
            format: #(outermost element) #projection-dialogue
*/
function hideDialogue(whichScript, whichProjectionDialogue) {
    $(`${whichProjectionDialogue}`).toggleClass("hidden");
    whichScript.currLine = 0;
}

/* typewriterEffect(): creates a typewriter effect for guide dialogues
 * input(s):
        whichText: string; text to insert
        whichGuideDialogue: selector/HTML element; span that holds the guide's dialogue;
            format: #(projection dialogue) #guide-dialogue span
*/
function typewriterEffect(whichText, whichGuideDialogue) {
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

/* endTyping(): inserts the full text to end the typewriter effect
 * input(s):
        whichText: string; text to insert
        whichGuideDialogue: selector/HTML element; span that holds the guide's dialogue;
            format: #(projection dialogue) #guide-dialogue span
*/
function endTyping(whichText, whichGuideDialogue) {
    clearInterval(textTimer);
    $(whichGuideDialogue).text(whichText);
    isTyping = false;
}

/* ==========================================================================
   GUIDE INTERACTIONS FUNCTIONS 
   ========================================================================== */
/* loadGuideInteraction(): handles guide interactions in [EXPERIENCES] and [ABOUT ME]
 * input(s):
        whichGuide: integer; ID of the assigned guide
        whichSection: selector/HTML element; element that holds the dialogue's projection;
            format: (experiences | about-me)
*/
function loadGuideInteraction(whichGuide, whichSection) {
    const whichScript = whichSection == "experiences" ? "experiencesScript" : "aboutScript";
    const targetSprite = getSSItem("guideSprites").find(sp => sp.guide == whichGuide);
    const targetScript = getSSItem("guideScripts").find(sc => sc.guide == whichGuide && sc.script == whichScript);

    $(`#${whichSection} #guide-interaction-btn`).off("click").click(function() {
        $(`#${whichSection} #guide-interaction-btn img`).addClass("clicked");
        
        const posesIndexes = [GREETING_SM, IDLE_SM];
        let randPose = posesIndexes[(Math.floor(Math.random() * posesIndexes.length))];

        $(`#${whichSection} #small-projection-dialogue img`).attr({
            "id": `guide-${targetSprite.guide}`,
            "src": `${targetSprite.sprites[randPose]}`,
            "alt": `Guide ${targetSprite.id}, here to guide you!`,
            "class": `${targetSprite.twClass[randPose]}`
        });

        $(`#${whichSection} #small-projection-dialogue`).toggleClass("hidden");

        progressDialogue(targetSprite.guide, targetScript, `#${whichSection} #small-projection-dialogue`);

    });

    $(`#${whichSection} #guide-interaction-btn img`).on("animationend", function () {
        $(`#${whichSection} #guide-interaction-btn img`).removeClass("clicked");
    });
}

/* loadMysteriousButton(): handles special guide interactions in [EXPERIENCES] and [ABOUT ME]
 * input(s):
        whichGuide: integer; ID of the assigned guide
        whichSection: selector/HTML element; element that holds the dialogue's projection;
            format: (experiences | about-me)
*/
function loadMysteriousButton(whichGuide, whichSection) {
    const targetSprite = getSSItem("guideSprites").find(sp => sp.guide == whichGuide);
    const targetScripts = getSSItem("guideScripts").filter(sc => sc.guide == whichGuide && sc.script == "mysteriousButtonScript");
    const cooldown = 1000; // 1 sec

    let [currClicks, currTotalClicks, targetClicks, lastClick] = [0, 0, Math.floor((Math.random() * 9) + 1), 0];

    $(`#${whichSection} #mysterious-btn`).off("click").click(function() {
        // cooldown for the button clicks to avoid spamming
        // guided by: https://stackoverflow.com/questions/54204302/is-there-a-way-to-make-a-cooldown-to-your-function
        if (lastClick >= Date.now() - cooldown) {
            return; // skip counting this click
        }
        lastClick = Date.now();

        $(`#${whichSection} #mysterious-btn img`).addClass("clicked");

        currClicks++;
        currTotalClicks = parseInt(getSSItem("totalClicks"), 10) + 1;
        sessionStorage.setItem("totalClicks", currTotalClicks);

        if (currClicks == targetClicks) {
            const posesIndexes = [GREETING, IDLE];
            let randPose = posesIndexes[(Math.floor(Math.random() * posesIndexes.length))];
            
            let randomScript = targetScripts[Math.floor(Math.random() * targetScripts.length)];
            let randScriptIndex = randomScript.lines.findIndex(l => l.match(/\[(\d+)]/));
            if (randScriptIndex != -1) {
                randomScript.lines[randScriptIndex] = (randomScript.lines[randScriptIndex]).replace(/\[(\d+)]/, `[${getSSItem("totalClicks")}]`);
            }

            $(`#${whichSection} #projection-dialogue img`).attr({
                "id": `guide-${targetSprite.guide}`,
                "src": `${targetSprite.sprites[randPose]}`,
                "alt": `Guide ${targetSprite.guide}, here to guide you!`,
                "class": `${targetSprite.twClass[randPose]}`
            });

            $(`#${whichSection} #projection-dialogue`).toggleClass("hidden");

            progressDialogue(targetSprite.guide, randomScript, `#${whichSection} #projection-dialogue`);
            
            currClicks = 0;
            targetClicks = Math.floor((Math.random() * 9) + 1);
        }
    });

    $(`#${whichSection} #mysterious-btn img`).on("animationend", function() {
        $(`#${whichSection} #mysterious-btn img`).removeClass("clicked");
    });

}

/* ==========================================================================
   MISCELLANEOUS FUNCTIONS 
   ========================================================================== */
/* randomizeGuides(): returns the ID of a random assigned guide; 
   as of 8/26/2026, there are two guides added (111, 222)
 * outputs(s):
        guides[randIndex]: integer; ID of the assigned guide
*/
function randomizeGuides() {
    const guides = [111, 222];
    const randIndex = Math.floor(Math.random() * guides.length);
    
    return guides[randIndex];
}

/* setupAndRun(): sets up the session storage by fetching and storing all JSON data and runs the main() function */
async function setupAndRun() {
    setSSItem("assignedGuide", randomizeGuides());
    setSSItem("totalClicks", 0);
    
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
}

/* fetchJSONData(): fetches a JSON file and returns the data 
 * input(s):
        url: string; path to the JSON file
    output(s): 
        data: Promise; response after fetching the JSON file
*/
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

/* setSSItem(): stores a key-value pair to the session storage if it doesn't exist 
   input(s):
        key: string; name of the item
        value: any; value of the item
*/
function setSSItem(key, value) {
    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

/* setSSItem(): retrieves a key-value pair from the session storage if it exists 
   input(s):
        key: string; name of the item
*/
function getSSItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
}