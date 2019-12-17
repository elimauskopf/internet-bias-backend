const express = require('express')
const bodyParser = require('body-parser')
const Twitter = require('twitter')
const app = express()
var router = express.Router()
var cors = require('cors')
require('dotenv').config({path: '.env'})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}



var jsonParser = bodyParser.json()



var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    bearer_token: process.env.BEARER_TOKEN
})


router.get('/:term', (req, res) => {
  
    let classTerms = ["Feminism", "Transgender", "Intersectionality", "Women", "Gender"]
    let classTerm = classTerms[Math.floor(Math.random() * Math.floor(5))]
    let tweetsFound = { classTermTweets: [], userTermTweets: [], classTerm: classTerm}

    client.get('search/tweets', {q: classTerm, lang: "en", result_type: "mixed", count: 5, include_entities: false, tweet_mode: 'extended' }, function(error, tweets) {
        if(error) {
            throw(error)
        }
        tweets = tweets.statuses.forEach(element => {
            tweetsFound.classTermTweets.push(element.full_text)
        });
        client.get('search/tweets', {q: req.params.term, lang: "en",result_type: "mixed", count: 5, include_entities: false, tweet_mode: 'extended'}, function(error, tweets) {
            if(error) {
                throw(error)
            }
            tweets = tweets.statuses.forEach(element => {
                tweetsFound.userTermTweets.push(element.full_text)
            });
            res.send(tweetsFound)
        })
        
    });
   
  
   
})

app.use(cors())
app.use(jsonParser)
app.use('/api', router)
app.listen(port, () => console.log(`app listening on port ${port}`))


