const URL = "http://localhost:3000/tweets?"

getTwitterData = () => {
    let query = document.getElementById("user-input").value;
    if(!query) {
        return;
    }
    const encodedQuery = encodeURIComponent(query);
    fetch(`${URL}q=${encodedQuery}&count=10`).then(response => {
        if(response.ok) {
            return response.json()
        }
        throw new Error("Request failed!");
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
        displayTwitterData(jsonResponse);
    })
}

eventHandler = (e) => {
    if(e.keyCode === 13) {
        getTwitterData();
    }
}

document.getElementById("search").addEventListener("click", getTwitterData);
document.getElementById("user-input").addEventListener("keyup", eventHandler);

displayTwitterData = (response) => {
    let text = '';
    response["statuses"].map(data => {
        text += `
            <div class="tweets-container">
                    <div class="tweets-user-info">
                        <div class="tweet-user-profile-image">

                        </div>
                        <div class="tweet-user-name-container">
                            <p class="tweet-user-fullName">
                                Azizul Bappy
                            </p>
                            <p class="tweet-user-userName">
                                @bappy_azizul
                            </p>
                        </div>
                    </div>
                    <div class="tweets-contents">

                    </div>
                    <div class="tweets-text">
                        <p>
                            ${data["full_text"]}
                        </p>
                    </div>
                    <div class="tweet-date">
                        <p>20 Jan,2020</p>
                    </div>
            </div>
        `
    });

    document.querySelector(".tweets-list").innerHTML = text;
}