var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("returntext").value = this.responseText;
    }
    console.log("recieved: ")
    console.log(this.responseText)
};

document.getElementById("twitterhandle")
    .addEventListener("keydown", function(event) {
        var code;
        if (event.key !== undefined) {
          code = event.key;
        }
        if (code == "Enter") {
            document.getElementById("analyzebutton").click();
        }
});

document.getElementById("analyzebutton")
    .addEventListener("click", function(event) {
    
    var twitterhandle = document.getElementById("twitterhandle").value;
    console.log(twitterhandle);
    
    xhttp.open("GET", "http://127.0.0.1:5000/" + twitterhandle, true);
    xhttp.send();

    document.getElementById("twitterhandle").value = "";
});