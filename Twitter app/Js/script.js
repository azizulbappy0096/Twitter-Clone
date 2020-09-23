const URL = "http://localhost:3000/tweets?";
let nextPageUrl = null;
let nextPage = false;

getTwitterData = (nextPage) => {
    let query = document.getElementById("user-input").value;
    if(!query) {
        return;
    }
    
    const encodedQuery = encodeURIComponent(query);
    let fullURL = `${URL}q=${encodedQuery}&count=10`;
    if(nextPageUrl) {
        fullURL = nextPageUrl;
        nextPage = true;
    }

    fetch(fullURL).then(response => {
        if(response.ok) {
            return response.json()
        }
        throw new Error("Request failed!");
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
        displayTwitterData(jsonResponse, nextPage);
        saveNextPage(jsonResponse.search_metadata);
    })
}

eventHandlerKey = (e) => {
    if(e.keyCode === 13) {
        nextPage = false;
        nextPageUrl = null;
        getTwitterData();
    }
};

eventHandlerclick = () => {
    nextPage = false;
    nextPageUrl = null;
    getTwitterData();
}

document.getElementById("search").addEventListener("click", eventHandlerclick);
document.getElementById("nextPage").addEventListener("click", getTwitterData);
document.getElementById("user-input").addEventListener("keyup", eventHandlerKey);

displayTwitterData = (response, nextPage) => {
    let text = '';
    response["statuses"].map(data => {
        let date = new Date(data.created_at).toISOString();
        const createdDate = moment(date).fromNow();
        text += `
            <div class="tweets-container">
                    <div class="tweets-user-info">
                        <div class="tweet-user-profile-image" style="background-image: url(${data.user.profile_image_url_https})">

                        </div>
                        <div class="tweet-user-name-container">
                            <p class="tweet-user-fullName">
                                ${data.user.name}
                            </p>
                            <p class="tweet-user-userName">
                                @${data.user.screen_name}
                            </p>
                        </div>
                    </div>`;

                    if(data["extended_entities"]) {
                        text += `${buildImages(data["extended_entities"]["media"])}`;
                        text += `${buildVideo(data["extended_entities"]["media"])}`
                    }

                    text +=
                    `<div class="tweets-text">
                        <p>
                            ${data["full_text"]}
                        </p>
                    </div>
                    <div class="tweet-date">
                        <p> ${createdDate}</p>
                    </div>
            </div>
        `
    });

    if(nextPage) {
        document.querySelector(".tweets-list").insertAdjacentHTML('beforeend', text);
    }else {
        document.querySelector(".tweets-list").innerHTML = text;
    }
    
}

buildImages = (metaData) => {
    const end = (metaData.length < 4) ? metaData.length:4;
    let img = '<div class="tweets-contents">';
    let imageExists = false;
    for(let i = 0; i < end; i++) {
        if(metaData[i]["type"] === "photo") {
            imageExists = true;
            img += `
            <div class="tweet-image" style="background-image: url(${metaData[i]["media_url_https"]})"></div>
            `
        }
    }
    img += "</div>";
    return imageExists ? img : "";
}

buildVideo = (metaData) => {
    let video = '<div class="tweets-contents">';
    let videoExists = false;
    for(let i = 0; i < 1; i++) {
        if(metaData[i]["type"] === "video") {
            videoExists = true;
            const videoUrl = metaData[i]["video_info"]["variants"].find(video => {
                return video["content_type"] === "video/mp4";
            });
        
                video += `
                <video controls class="tweet-video">
                    <source src=${videoUrl["url"]} type="video/mp4">
                </video>
                `;
        }else if(metaData[i].type === "animated_gif") {
            videoExists = true;
            const videoUrl = metaData[i]["video_info"]["variants"].find(video => {
                return video["content_type"] === "video/mp4";
            });
        
                video += `
                <video class="tweet-video" autoplay loop>
                    <source src=${videoUrl["url"]} type="video/mp4">
                </video>
                `;
        }
    }
    video += "</div>";
    return videoExists ? video : "";
}

selectTrend = (e) => {
    const selectedTrend = e.innerHTML;
    document.getElementById("user-input").value = selectedTrend;
    nextPage = false;
    nextPageUrl = null;
    getTwitterData();
}

saveNextPage = (metaData) => {
    if(metaData.next_results) {
        nextPageUrl = `http://localhost:3000/tweets${metaData.next_results}`;
        document.getElementById("nextPage").style.visibility = 'visible';
    }else {
        document.getElementById("nextPage").style.visibility = 'hidden';
    }
}
