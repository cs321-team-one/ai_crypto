import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { News, Pricing, PricePredictions, Terms } from '../lib/collections.js';


// News related constants
const NEWS_API = 'https://min-api.cryptocompare.com/data/news/?lang=EN';
const NEWS_REFRESH_RATE = 60000 * 5;
const NEWS_PREDICTION_API = 'http://localhost:4444/news'; // THIS NEEDS A POST REQUEST WITH JSON ARRAY DATA


// Price related constants
const PRICING_API = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,XRP,BCH,EOS,ADA,XLM,NEO,MIOTA&tsyms=USD,EUR';
const PRICING_REFRESH_RATE = 60000 * 5;


// Separate API that deals with price prediction. You do not feed this one data. All you do for this one is
// make a post request with the following data:
/*
{
    "ticker": "BTC"
}
 */
// You can change BTC to the cryptocurrency that cryptocompare supports.
const PRICE_PREDICTION_REFRESH_RATE = 60000 * 16; // Price prediction goes 16 minutes into the future
const PRICE_PREDICTION_API = 'http://localhost:4444/price';
const CRYPTOS_TO_PREDICT = ['BTC'];


Meteor.methods({
    'getNewsData'(){
        const result = HTTP.call('GET', NEWS_API);
        return result.data
    },
    'getPricingData'(){
        const result = HTTP.call('GET', PRICING_API);
        return result.data;
    },
    'getPricePredictionData'(ticker){
        const response = HTTP.call('POST', {
            ticker: ticker
        });
        return response.data;
    }
});

Meteor.startup(() => {
    News.rawCollection().createIndex({ id: 1 }, { unique: true });
    PricePredictions.rawCollection().createIndex({ id: 1 }, { unique: true });


    Terms.find().forEach(function(term) {
      if(!term.description) {
        let websiteData = Scrape.website(term.url);
        Terms.update({text: term.text}, {$set: {"description" : websiteData.text}});
      }
    } );
});


// Creates a never-ending loop that keeps calling Meteor's 'getNewsData' method and upserts the response data to the
// News collection
Meteor.setInterval(function() {
    Meteor.call('getNewsData', function(error, data) {
        if(error){
            console.error(error);
        } else {
            const to_predict = [];
            let prediction = [];

            try{
                data.forEach((datum)=>{
                    to_predict.push(datum['body'])
                });

                const response = HTTP.call('POST', NEWS_PREDICTION_API, {
                    data: to_predict
                });

                prediction = response.data;

            } catch (e) {
                console.error('Could not predict news');
                console.error(e);
            }

            data.forEach((datum, i)=>{
                if(prediction.length === data.length){
                    datum['prediction'] = prediction[i] === 1 ? 'BUY': 'SELL';
                }

                try{
                    News.update(datum['id'], datum, { upsert: true });
                } catch (e) {}

            });

        }
    });
}, NEWS_REFRESH_RATE);


Meteor.setInterval(function(){
    let current_ticker = 'BTC';
    Meteor.call('getPricePredictionData', current_ticker, function(error, data){ // Prediction data is simply an array at minute intervals
       if(error) console.error(error);
       else{
            let current_time = new Date();
            data.forEach((datum, i)=>{
                let prediction_time = moment(current_time).add(i, 'minutes');
                let data_to_insert = {
                    id: `${current_ticker}_${i}`,
                    price: datum,
                    time: prediction_time.toDate()
                };
                PricePredictions.update(data_to_insert.id, data_to_insert, { upsert: true });
            });
       }
    });
}, PRICE_PREDICTION_REFRESH_RATE);


/*
Meteor.setInterval(function() {
    Meteor.call('getNewsData', function(error, data) {
        if(error){
            console.error(error);
        } else {
            const to_predict = [];
            let prediction = [];

            try{
                data.forEach((datum)=>{
                    to_predict.push(datum['body'])
                });

                const response = HTTP.call('POST', NEWS_PREDICTION_API, {
                    data: to_predict
                });

                prediction = response.data;

            } catch (e) {
                console.error('Could not predict news');
                console.error(e);
            }

            data.forEach((datum, i)=>{
                if(prediction.length === data.length){
                    datum['prediction'] = prediction[i] === 1 ? 'BUY': 'SELL';
                }

                try{
                    News.update(datum, datum, { upsert: true });
                } catch (e) {
                    console.error('Could not upsert a new article.');
                }

            });

        }
    });
}, PRICING_REFRESH_RATE);

*/
