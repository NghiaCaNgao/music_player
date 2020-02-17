var user = {
    a: "ascasca",
    b: "asasxas",
    c: "ascascasx"
}

var encode = JSON.stringify(user);

$.ajax({
    url: "http://localhost/a/upload.php",
    type: "post",
    data: { data: encode },
    success: function(response) {
        console.log(response);

    }
});