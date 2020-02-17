var btn_more = document.getElementById("btn-more-2");
var btn_code_share = document.getElementById("code_share");
var btn_import = document.getElementById("import")
var btn_mode = document.getElementById("mode");
var btn_play = document.getElementById("play");
var btn_pre = document.getElementById("btn_pre");
var btn_next = document.getElementById("btn_next");
var btn_getFromServer = document.getElementById("getFromServer");

var list_music = document.getElementById("list-music");
var im = document.getElementsByClassName("i-m");
var play_track = document.getElementById("play-track");
var box_al = document.getElementById("box-al");
var list = document.getElementById("list");
var bg_page = document.getElementById("bg_page");
var loading = document.getElementById("loading");
var image_song = document.getElementById("album_song_image");
var name_song_playing = document.getElementById("Song_Name_Playing");
var artists_names = document.getElementById("Artist_Playing");
var cur = document.getElementById("cur");
var length = document.getElementById("length");
var selectTime = document.getElementById("selectTime");
var tooltip = document.getElementById("tooltip");
var nowTime = document.getElementById("nowTime");
var trackRange = document.getElementById("track-range");
var inforMes = document.getElementById("infor");

var base_link = "http://localhost/a/";

var curNum;
var playloader;
var firstLoad = true;

var audio = new Audio;
var userData, userPlayNow;


//Save du lieu choi nhac vao localStorage
function saveData() {
    window.localStorage.setItem("playlist", JSON.stringify(userData));
    window.localStorage.setItem("playnow", JSON.stringify(userPlayNow));
}

//Thuc hien luu du lieu vao localStorage sau moi 10s
function autoSave() {
    setInterval(function() {
        // console.log("autosave");
        saveData();
    }, 10000);
}

//Lay du lieu tu Storage
function getData() {
    if (window.localStorage.playlist != undefined) {
        userData = JSON.parse(window.localStorage.playlist);
        userPlayNow = JSON.parse(window.localStorage.playnow);
    } else {

        //Du lieu choi nhac cua ca nhan
        userData = {
            playlistID: "",
            data: {}
        }

        // Du lieu cua danh sach bai hat
        userPlayNow = {
            song: "",
            songUrl: "",
            artist: "",
            image: "",
            lyric: {},
            time: 0,
            curTime: 0,
            isPlaying: false,
            stacticImage: false,
            stacticImageUrl: "",
            defaultImage: "https://i.imgur.com/9wVedUQ.jpg",
            mode: "none",
            visibleSidebar: true,
            listSong: [],
            curSongCount: 0
        }
        log("Khởi tạo giá trị mới", "infor");
    }
}

//Dat hinh anh vua voi the.
function fitImage(element) {
    element.addEventListener("load", function() {
        if (element.clientHeight > element.clientWidth) {
            element.style.width = "100%";
            element.style.height = "auto";
        } else {
            element.style.width = "auto";
            element.style.height = "100%";
        }
    });
}

//Dat hinh nen
function setBackground() {
    if (userPlayNow.stacticImage) {
        bg_page.style.backgroundImage = `url(${userPlayNow.stacticImageUrl})`;
        image_song.src = userPlayNow.stacticImageUrl;
    } else {
        if (userPlayNow.image == "") {
            bg_page.style.backgroundImage = `url(${userPlayNow.defaultImage})`;
            image_song.src = userPlayNow.defaultImage;
        } else {
            bg_page.style.backgroundImage = `url(${userPlayNow.image})`;
            image_song.src = userPlayNow.image;
        }
    }
    fitImage(image_song);
}

//Chuyen thoi gian dang xxxxxxxx -> HH:MM:SS
function timeToText(duration) {
    let ans = '';
    let gio = Math.floor(duration / 3600);
    let phut = Math.floor(duration % 3600 / 60);
    let giay = duration % 3600 % 60;

    if (phut < 10) { phut = "0" + phut.toString() } else phut = phut.toString();
    if (giay < 10) { giay = "0" + giay.toString() } else giay = giay.toString();

    if (gio == 0) {
        ans = phut + ":" + giay;
    } else {
        ans = gio.toString() + ":" + phut + ":" + giay;
    }
    return ans;
}

//Dem thoi gian da phat bai hat
function setCurTime() {
    curNum = setInterval(function() {
        cur.innerHTML = timeToText(Math.floor(audio.currentTime));
        userPlayNow.curTime = Math.floor(audio.currentTime);
        nowTime.style.width = (Math.floor(audio.currentTime / userPlayNow.time * 300)).toString() + "px";
    }, 1000);
}

//Choi nhac
function playMusic(isSample) {
    audio.pause();

    //Neu van la bai hat do thi khong doi src nua
    if (!isSample) {
        audio.src = userPlayNow.songUrl;
        audio.currentTime = userPlayNow.curTime;
    }

    //Hieu ung
    box_al.classList.remove("xoay");
    loading.classList.add("show");

    //Promies lenh play
    playloader = audio.play();
    playloader.then(() => {
            //Khi play xong thi nhet hieu ung vao
            loading.classList.remove("show");
            box_al.classList.add("xoay");
            setCurTime();
        })
        .catch(error => {
            log("Lỗi mất rồi. Bài này đíu thể nghe được. Chuyển bài tiếp theo", "danger");
            console.log(error);
        });
}

//Dat thong tin bai hat ki chon bai hat
function setInfor() {
    name_song_playing.innerHTML = userPlayNow.song;
    artists_names.innerHTML = userPlayNow.artist;
    length.innerHTML = timeToText(userPlayNow.time);
    cur.innerHTML = "00:00";
}

//Play/Pause bai hat
function playPauseAudio(override) {
    setBackground();
    setInfor();

    if (userPlayNow.isPlaying) {
        if (override) {
            //khi ghi de bai hat khac trong khi bai hat hien tai van mo thi chon bai hat ghi de va choi
            playMusic(false);
        } else {
            //khi KHONG ghi de bai hat khac trong khi bai hat hien tai van mo thi pause lai
            btn_play.innerHTML = `<i class="fas fa-play"></i>`;
            play_track.classList.add("remove");
            box_al.classList.remove("xoay");
            loading.classList.remove("show");
            clearInterval(curNum);
            userPlayNow.isPlaying = false;
            saveData();
            audio.pause();
        }
    } else {
        if (override) {
            //khi ghi de bai hat khac trong khi bai hat hien tai bi tam dung thi chon bai hat ghi de va choi
            btn_play.innerHTML = `<i class="fas fa-pause"></i>`;
            play_track.classList.remove("remove");
            playMusic(false);
            userPlayNow.isPlaying = true;
        } else {
            //khi KHONG ghi de bai hat khac trong khi bai hat hien tai bi tam dung thi play
            if (userPlayNow.songUrl != "") {
                btn_play.innerHTML = `<i class="fas fa-pause"></i>`;
                play_track.classList.remove("remove");
                userPlayNow.isPlaying = true;
                loading.classList.add("show");
                //Lan dau mo web thi mac dinh o che do chua phat nhac cung nhu se select lai src
                if (firstLoad) {
                    playMusic(false);
                    firstLoad = false;
                } else {
                    playMusic(true);
                }
            } else {
                log("Không có bài hát nào", "danger");
            }
        }
    }
}
//Sinh ra ma id list khi imort 
function generateID() {
    let id = "";
    for (let i = 0; i < 10; i++) {
        id = id + String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return id;
}


//xu ly du lieu tu chromr extension
function xly(dataInput) {
    return new Promise(function(resolve, reject) {
        dataInput.then(function(dataInputReturn) {
                // console.log(dataInputReturn);
                let obj = JSON.parse(dataInputReturn);
                if (obj.num_songs &&
                    obj.queueSongMap &&
                    obj.recommendSongs &&
                    obj.streamings &&
                    obj.lyric
                ) {
                    log("Load xong rồi", "success");

                    // console.log(obj);
                    resolve(obj);
                } else {
                    log("Load rồi nhưng lỗi dữ liệu", "danger");
                }
            })
            .catch(
                function() {
                    log("Lỗi mất rồi :((", "danger");
                });
    });
}

//Dat cac thong so khi play nhac
function setPlay(id) {
    userPlayNow.song = userData.data.queueSongMap[id].title;
    userPlayNow.songUrl = `http://api.mp3.zing.vn/api/streaming/audio/${userData.data.queueSongMap[id].id}/128`;
    userPlayNow.artist = userData.data.queueSongMap[id].artists_names;
    userPlayNow.image = userData.data.queueSongMap[id].thumbnail_medium;
    userPlayNow.time = userData.data.queueSongMap[id].duration;
    userPlayNow.lyric = userData.data.queueSongMap[id].lyric;
    userPlayNow.curTime = 0;
    playPauseAudio(true);
}

//Tao mot panel hien thi 1 bai hat trong list nhac
function creatList(id, song, artist, image_url) {
    let panel = document.createElement("div");
    panel.classList.add("panel");
    panel.id = `panel_${id}`;
    // panel.innerHTML = '<img class="bg-panel"><div class="layer_text"> <div class="context-title"> <h1></h1> <h3></h3> </div></div><div class="i-m align"> <div class="image-change"><i class="far fa-image"></i></div></div>';
    panel.innerHTML = '<div class="bg-panel"> </div><div class="layer_text"> <div class="context-title"> <h1></h1> <h3></h3> </div></div><div class="i-m align"> <div class="image-change"><i class="far fa-image"></i></div></div>';
    // panel.innerHTML = '<div class="bg-panel" data-loader="loadImage"> </div><div class="layer_text"> <div class="context-title"> <h1></h1> <h3></h3> </div></div><div class="i-m align"> <div class="image-change"><i class="far fa-image"></i></div></div>';
    list.appendChild(panel);

    //Tao gia tri
    document.querySelector(`#panel_${id} .context-title h1`).innerHTML = song;
    document.querySelector(`#panel_${id} .context-title h3`).innerHTML = artist;
    document.querySelector(`#panel_${id} .bg-panel`).setAttribute("data-src", image_url);
    // panel.setAttribute("data-src", image_url);
    document.querySelector(`#panel_${id} .bg-panel`).style.backgroundImage = `url("${image_url}")`;

    //Set event
    //Khi nam vao nut thi anh mac dinh cua bai hat bi thay doi
    document.querySelector(`#panel_${id} .i-m `).addEventListener("click", function() {
        let tmp = prompt(`Nhập link ảnh mới cho bài hát ${userData.data.queueSongMap[id].title}`);
        if (tmp) {
            userData.data.queueSongMap[id].thumbnail_medium = tmp;
            document.querySelector(`#panel_${id} .bg-panel`).style.backgroundImage = `url("${tmp}")`;
        }
    });
    //Set hieu ung di chuot
    panel.addEventListener("mouseenter", function() {
        bg_page.style.backgroundImage = `url("${userData.data.queueSongMap[id].thumbnail_medium}")`;
    });
    panel.addEventListener("mouseleave", function() {
        setBackground();
    });

    //Khi click vao panel thi se chon bai hat tuong ung va choi bai hat do
    panel.addEventListener("click", function() {
        setPlay(id);
    });
}

//Tao tat ca cac panel list
function creatAllList() { // tao tat ca panel tu list
    for (let i in userData.data.queueSongMap) {
        creatList(i, userData.data.queueSongMap[i].title, userData.data.queueSongMap[i].artists_names, userData.data.queueSongMap[i].thumbnail_medium);
    }
}

//Ap dung khoi tao du lieu phat nhac
async function AppplyList() {
    userData.playlistID = generateID(); //Sinh id cho list nhac
    userData.data = await xly(window.navigator.clipboard.readText()); //Lay du lieu tu clipboard
    userPlayNow.curSongCount = 0;
    sort(userPlayNow.mode); //Sap xep du lieu theo che do phat nhac
    saveData(); //Luu lai

    list.innerHTML = "";
    btn_code_share.innerHTML = userData.playlistID;
    creatAllList();
    // console.log(userData);
}

//Ap dung khoi tao du lieu phat nhac khi du lieu dc lay ve tu internet
async function appplyListForInternet(data) {
    userData = data;
    userPlayNow.curSongCount = 0;
    sort(userPlayNow.mode);
    saveData(); //Luu lai
    log("Load thành công", "success");
    list.innerHTML = "";
    btn_code_share.innerHTML = userData.playlistID;
    creatAllList();
    // console.log(userData);
}

//An hien sidebar
function visibleSidebar(event) {
    if (event == "load") { //khi click
        if (userPlayNow.visibleSidebar) {
            list_music.style.right = "0px";
        } else {
            list_music.style.right = "-25vw";
        }
    } else if (event == "click") { //khi load
        if (userPlayNow.visibleSidebar) {
            list_music.style.right = "-25vw";
            userPlayNow.visibleSidebar = false;
        } else {
            list_music.style.right = "0px";
            userPlayNow.visibleSidebar = true;
        }
    }
}

//Sap xep theo che do phat nhac
function sort(type) {
    switch (type) {
        case "shuffle":
            {
                userPlayNow.listSong = [];
                for (let i in userData.data.queueSongMap) {
                    userPlayNow.listSong.push(userData.data.queueSongMap[i].id);
                }
                for (let i = 0; i < userPlayNow.listSong.length; i++) {
                    let z = userPlayNow.listSong[i];
                    let u = Math.floor(Math.random() * userPlayNow.listSong.length);
                    userPlayNow.listSong[i] = userPlayNow.listSong[u];
                    userPlayNow.listSong[u] = z;
                }
                // console.log(userPlayNow.listSong);
                break;
            }
        case "repeat":
            {
                userPlayNow.listSong = [];
                for (let i in userData.data.queueSongMap) {
                    userPlayNow.listSong.push(userData.data.queueSongMap[i].id);
                }
                // console.log(userPlayNow.listSong);
                break;
            }
        case "none":
            {
                userPlayNow.listSong = [];
                for (let i in userData.data.queueSongMap) {
                    userPlayNow.listSong.push(userData.data.queueSongMap[i].id);
                }
                // console.log(userPlayNow.listSong);
                break;
            }
    }
}

//Dieu khien hinh thuc phat nhac
function modePlay(event) {
    if (event == "click") { // khi click
        if (userPlayNow.mode == "repeat") {
            btn_mode.innerHTML = '<i class="fas fa-random"></i>';
            userPlayNow.mode = "shuffle";
        } else if (userPlayNow.mode == "shuffle") {
            btn_mode.innerHTML = '<i class="fas fa-circle-notch"></i>';
            userPlayNow.mode = "none";
        } else if (userPlayNow.mode == "none") {
            btn_mode.innerHTML = '<i class="fas fa-redo"></i>'
            userPlayNow.mode = "repeat";
        }
        sort(userPlayNow.mode);
    } else if (event == "load") { // khi load du lieu
        if (userPlayNow.mode == "repeat") {
            btn_mode.innerHTML = '<i class="fas fa-redo"></i>'
        } else if (userPlayNow.mode == "shuffle") {
            btn_mode.innerHTML = '<i class="fas fa-random"></i>';
        } else if (userPlayNow.mode == "none") {
            btn_mode.innerHTML = '<i class="fas fa-circle-notch"></i>';
        }
    }

}

//Hien thoi gian tuong ung khi tro vao timeline
function showHover(event) {
    let posTime = Math.floor(userPlayNow.time * (event.offsetX / 300));
    selectTime.style.width = event.offsetX.toString() + "px";
    tooltip.classList.add("tooltipShow");
    tooltip.style.left = event.offsetX.toString() + "px";
    tooltip.innerHTML = timeToText(posTime) + "/" + timeToText(userPlayNow.time);
}

//Nahy bai hat toi vi tri chon
function seekTime(event) {
    let posTime = Math.floor(userPlayNow.time * (event.offsetX / 300));
    nowTime.style.width = event.offsetX.toString() + "px";
    audio.currentTime = posTime;
};

// An thoi gian tuong ung khi tro vao timeline
function hidenHover() {
    selectTime.style.width = "0px";
    tooltip.classList.remove("tooltipShow");
}

//Thong bao
var queueMsg = [];

function log(msg, feel) {
    queueMsg.push({ message: msg, color: feel });
    if (inforMes.classList.contains("showInfor") || inforMes.classList.contains("showInfor2")) {
        return;
    } else {
        inforMes.classList.add("showInfor");
        inforMes.innerHTML = queueMsg[0].message;
        console.log();

        inforMes.style.background = `var(--${queueMsg[0].color})`;

        inforMes.addEventListener("animationend", function() {
            let isInfor1 = this.classList.contains("showInfor");
            this.classList.remove("showInfor");
            this.classList.remove("showInfor2");
            queueMsg.splice(0, 1);
            if (queueMsg.length > 0) {
                if (isInfor1) {
                    this.classList.add("showInfor2");
                } else {
                    this.classList.add("showInfor");
                }
                this.innerHTML = queueMsg[0].message;
                this.style.background = `var(--${queueMsg[0].color})`;
            }
        });
    }
}


//Up data len server
function upload() {
    log("Đang tải dữ liệu lên hệ thống", "infor");
    log("Kiểm tra trung lặp", "infor");

    $.ajax({
        url: base_link + `get.php?id=${userData.playlistID}&get=exist`,
        type: "get",
        success: function(response) {
            let data1 = JSON.parse(response);
            if (data1.status.code == 2) {
                log("Kiểm tra trùng lặp thành công", "infor");
                $.ajax({
                    url: base_link + "upload.php",
                    type: "post",
                    data: {
                        data: JSON.stringify(userData),
                        id: userData.playlistID
                    },
                    success: function(response) {
                        let data = JSON.parse(response);
                        if (data.status.code == 0) {
                            log(data.status.msg, "success");
                        }
                    },
                    error: function() {
                        log("Lỗi trong quá trình gửi dữ liệu", "danger");
                    }
                });
            } else if (data1.status.code == 11) {
                log("Đã tồn tại dữ liệu trên hệ thống", "danger");
            }
        },
        error: function() {
            log("Lỗi trong quá trình gửi dữ liệu", "danger");
        }
    });
}

// Event handle--------------------
// Hieu ung nut copy
btn_code_share.addEventListener("mouseenter", function() {
    this.innerHTML = "Copy this code to share";
});
btn_code_share.addEventListener("mouseleave", function() {
    this.innerHTML = userData.playlistID;
});

//Nhap vao nut va thuc hien gui du liru len server
btn_code_share.addEventListener("click", function() {
    window.navigator.clipboard.writeText(userData.playlistID);
    upload();
});

//An hien side bar
btn_more.addEventListener("click", function() {
    visibleSidebar("click");
    saveData();
});

//Che do phat nhac -- Lap lai / Ngau nhien / Khomg lap lai 
btn_mode.addEventListener("click", function() {
    modePlay("click");
    saveData();
});

//Pause hoac play
btn_play.addEventListener("click", function() {
    playPauseAudio(false);
});

// Khi nhap lieu
btn_import.addEventListener("click", function() {
    AppplyList();
});

//Khi het bai chuyen bai khac hoac dung lai
audio.addEventListener("ended", function() {
    if (userPlayNow.mode == "none") {
        playPauseAudio(false);
    } else {
        if (userPlayNow.curSongCount > userPlayNow.listSong.length - 1) {
            curSongCount = -1;
            userPlayNow.curSongCount = 0;
        }
        userPlayNow.curSongCount++;
        setPlay(userPlayNow.listSong[userPlayNow.curSongCount]);
    }
    saveData();
});

//Khi chon bai truoc
btn_next.addEventListener("click", function() {
    if (userPlayNow.curSongCount > userPlayNow.listSong.length - 1) {
        curSongCount = -1;
        userPlayNow.curSongCount = 0;
    }
    userPlayNow.curSongCount++;
    setPlay(userPlayNow.listSong[userPlayNow.curSongCount]);
    saveData();
});
//Khi chon bai sau
btn_pre.addEventListener("click", function() {
    if (userPlayNow.curSongCount < 0) {
        userPlayNow.curSongCount = userPlayNow.listSong.length;
    }
    userPlayNow.curSongCount--;
    setPlay(userPlayNow.listSong[userPlayNow.curSongCount]);
    saveData();
});

//Khi tro chuot chon bai thoi gian
trackRange.addEventListener("mousemove", function(event) {
    showHover(event);
});

//Khi chon 
trackRange.addEventListener("click", function(event) {
    seekTime(event);
});
//Khi bo chuot
trackRange.addEventListener("mouseout", function() {
    hidenHover();
});

//Get from server
function getFromServer(idList) {
    log("Đang truy xuất list " + idList, "infor");
    $.ajax({
        url: base_link + `get.php?id=${idList}&get=id`,
        type: 'get',
        cache: false,
        success: function(response) {
            let data = JSON.parse(response);
            if (data.status.code == 0) {
                $.ajax({
                    url: data.data[0].link,
                    type: "get",
                    success: function(response) {
                        // console.log(response);
                        if (typeof(response) == "String") {
                            response = JSON.parse(response);
                        }
                        appplyListForInternet(response);
                    },
                    error: function() {
                        log("Lỗi trong quá trình tải dữ liệu", "danger");
                    }
                });
            } else {
                log("Lỗi trong quá trình tải dữ liệu", "danger");
            }
            // console.log(data);
        },
        error: function() {
            log("Lỗi trong quá trình tải dữ liệu", "danger");
        }
    });
}

btn_getFromServer.addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        getFromServer(btn_getFromServer.value);
    }
});




//-----------------End event handle-----------






// init
function init() {
    getData();
    autoSave();
    creatAllList();
    setBackground();
    visibleSidebar("load");
    modePlay("load");

    userPlayNow.isPlaying = false;

    if (userPlayNow.isPlaying) {
        play_track.classList.remove("remove");
    } else {
        play_track.classList.add("remove");
    }
    btn_code_share.innerHTML = userData.playlistID;
    play_track.classList.add("remove");
}

init();