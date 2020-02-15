var btn_copy = document.getElementById("btn-copy");
var num = document.getElementById("num");

var data = {
    num_songs: 0
}

function showResult() {
    if (data.num_songs == 0) btn_copy.innerHTML = `Không có bài hát nào`
    else btn_copy.innerHTML = `<span id = "num">${data.num_songs}</span> bài hát được chọn`;
}

function xly(dataObject) {
    data = {
        num_songs: dataObject.queueSongIdsOrigin.length,
        queueSongMap: dataObject.queueSongMap,
        recommendSongs: dataObject.recommendSongs,
        streamings: dataObject.streamings,
        lyric: dataObject.lyric
    }
    console.log(data);
    showResult();
}

function loadData() {
    chrome.tabs.query({ active: true, currentWindow: true, url: ["https://zingmp3.vn/*"] }, function(tabs) {
        if (tabs.length != 0) {
            chrome.tabs.executeScript(
                tabs[0].id, { code: 'chrome.runtime.sendMessage(window.localStorage.zmp3_mini_player);' });
        } else {
            btn_copy.innerHTML = "Sai địa chỉ";
            btn_copy.style.background = "pink";
            btn_copy.addEventListener("mouseenter", function() {
                this.innerHTML = "Không có dữ liệu đâu mà. Đừng click!!";
            });
            btn_copy.addEventListener("mouseleave", function() {
                this.innerHTML = "Ừ, phải rồi. Đừng rê chuột vào làm gì!!";
            });
            btn_copy.addEventListener("click", function() {
                window.navigator.clipboard.writeText("Đã bảo không có gì đâu mà sao vẫn click!?")
            });
        }
    });


    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            xly(JSON.parse(request));
        });
}

if (btn_copy.innerHTML != "Sai địa chỉ") {
    btn_copy.addEventListener("mouseenter", function() {
        this.innerHTML = "Click để copy dữ liệu";
    });

    btn_copy.addEventListener("mouseleave", function() {
        showResult();
    });

    btn_copy.addEventListener("click", function() {
        navigator.clipboard.writeText(JSON.stringify(data));
    });
}

loadData();