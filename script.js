var twitterHandleInput = document.getElementById("twitterhandle")
var analyzeButton = document.getElementById("analyzebutton")
var returnText = document.getElementById("returntext")
var twitterLink = document.getElementById("twitterlink")
var polarityText = document.getElementById("polaritytext")
var polarityNote = document.getElementById("polaritynote")
var subjectivityText = document.getElementById("subjectivitytext")
var subjectivityNote = document.getElementById("subjectivitynote")

var analyzingExtension = "";
var shouldAnimateAnalyzing = false;

var lastEnteredText = "";

var animateIntervalID = window.setInterval(function(){
    if (shouldAnimateAnalyzing) {
        analyzingExtension += ".";
        if (analyzingExtension.length > 3) {
            analyzingExtension = "";
        }
        returnText.innerHTML = "Analyzing" + analyzingExtension;
    }
}, 500);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        twitterHandleInput.disabled = false;
        analyzeButton.disabled = false;
        shouldAnimateAnalyzing = false;
        returnText.innerHTML = "";
        if (this.status == 200 && this.responseText !== "invalid") {
            var arr = this.responseText.split(' ');
            var polarity = parseFloat(arr[0]);
            var subjectivity = parseFloat(arr[1]);
            var polarityRating = "";
            if (polarity < -0.75) {
                polarityRating = "Overwhelmingly negative";
            } else if (polarity < -0.40) {
                polarityRating = "Very negative";
            } else if (polarity < -0.05) {
                polarityRating = "Slightly negative";
            } else if (polarity < 0.05) {
                polarityRating = "Fairly neutral";
            } else if (polarity < 0.40) {
                polarityRating = "Slightly positive";
            } else if (polarity < 0.75) {
                polarityRating = "Very positive";
            } else {
                polarityRating = "Overwhelmingly positive";
            }
            var subjectivityRating = "";
            if (subjectivity < 0.1) {
                subjectivityRating = "Overwhelmingly objective";
            } else if (subjectivity < 0.2) {
                subjectivityRating = "Very objective";
            } else if (subjectivity < 0.35) {
                subjectivityRating = "Slightly objective";
            } else if (subjectivity < 0.5) {
                subjectivityRating = "Sometimes objective";
            } else if (subjectivity < 0.65) {
                subjectivityRating = "Slightly biased";
            } else if (subjectivity < 0.8) {
                subjectivityRating = "Very biased";
            } else {
                subjectivityRating = "Overwhelmingly biased";
            }
            twitterLink.innerHTML = "@" + lastEnteredText;
            twitterLink.href = "https://www.twitter.com/" + lastEnteredText;
            polarityText.innerHTML = "Polarity: " + polarity.toFixed(3) + " - " + polarityRating;
            polarityNote.innerHTML = "Ranges from -1 (very negative) to +1 (very positive)";
            subjectivityText.innerHTML = "Subjectivity: " + subjectivity.toFixed(3) + " - " + subjectivityRating;
            subjectivityNote.innerHTML = "Ranges from 0 (very objective) to 1 (very biased)";
        } else if (this.responseText === "invalid" && lastEnteredText !== "") {
            returnText.innerHTML = "Invalid username!";
        }
    }
};

twitterHandleInput.addEventListener("keydown", function(event) {
    var code;
    if (event.key !== undefined) {
      code = event.key;
    }
    if (code == "Enter") {
        document.getElementById("analyzebutton").click();
    }
});

analyzeButton.addEventListener("click", function(event) {
    if (twitterHandleInput.value !== "") {
        twitterHandleInput.disabled = true;
        analyzeButton.disabled = true;
        shouldAnimateAnalyzing = true;
        animateIntervalID = window.setInterval(function(){
            if (analyzingExtension === "") {
                analyzingExtension = ".";
            } else if (analyzingExtension === ".") {
                analyzingExtension = "..";
            } else if (analyzingExtension === "..") {
                analyzingExtension = "...";
            } else {
                analyzingExtension = "";
            }
        }, 1000);

        polarityText.innerHTML = "";
        polarityNote.innerHTML = "";
        subjectivityText.innerHTML = "";
        subjectivityNote.innerHTML = "";

        var twitterhandle = twitterHandleInput.value.replace('@', '');
        lastEnteredText = twitterhandle;
        console.log(twitterhandle);
        
        xhttp.open("GET", "http://3.16.90.237:49802/" + twitterhandle, true);
        xhttp.send();

        document.getElementById("twitterhandle").value = "";
    }
});
