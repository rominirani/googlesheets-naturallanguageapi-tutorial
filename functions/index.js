'use strict';
const Language = require('@google-cloud/language');

// Instantiates a client
const language = new Language.LanguageServiceClient();

exports.analyzeSentiment =  (req, res) => {
  
    if (req.body.review_text == undefined) {
      res.status(400).send("No review text provided");
      return;
    }
  
    const document = {
      content: req.body.review_text,
      type: 'PLAIN_TEXT',
    };

    language
        .analyzeSentiment({
            document: document
        })
        .then(results => {
            const sentiment = results[0].documentSentiment;
            console.log(`Document sentiment:`);
            console.log(`  Score: ${sentiment.score}`);
            console.log(`  Magnitude: ${sentiment.magnitude}`);
      
            res.setHeader('Content-Type', 'application/json');
            var resultObj = {};
            resultObj.score = sentiment.score;
            resultObj.magnitude = sentiment.magnitude;
            res.status(200).send(JSON.stringify(resultObj));

            /*const sentences = results[0].sentences;
            sentences.forEach(sentence => {
                console.log(`Sentence: ${sentence.text.content}`);
                console.log(`  Score: ${sentence.sentiment.score}`);
                console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
            });*/
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.status(400).send("Error in invoking the Natural Language API. Reason : " + err.toString());
        });
}
