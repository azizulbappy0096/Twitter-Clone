const axios = require('axios');

class Twitter {
    get(query, count, maxId) {
        const url = "https://api.twitter.com/1.1/search/tweets.json";
    
        return axios.get(url, {
            params: {
                q: query,
                count: count,
                tweet_mode: "extended",
                max_id: maxId
            },
            headers: {
                "Authorization": process.env.TWITTER_API_TOKEN
            }
        });
    }
}

module.exports = Twitter;