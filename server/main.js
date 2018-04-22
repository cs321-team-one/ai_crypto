import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { News, Pricing, PricePredictions, Terms, CurrentPriceSocket} from '../lib/collections.js';
import cryptoSocket from "crypto-socket";


// News related constants
const NEWS_API = 'https://min-api.cryptocompare.com/data/news/?lang=EN';
const NEWS_REFRESH_RATE = 60000 * 8;
const NEWS_PREDICTION_API = 'http://localhost:4444/news'; // THIS NEEDS A POST REQUEST WITH JSON ARRAY DATA


// Price related constants
// const HIST_PRICING_API = 'https://min-api.cryptocompare.com/data/histoday?fsym=BTC,ETC,&tsym=USD&limit=180&toTs=1524081796';
// const PRICING_REFRESH_RATE = 10000;
/**
 * @return {string}
 */
const PRICING_API = function(ticker){
    return `https://min-api.cryptocompare.com/data/histominute?fsym=${ticker}&tsym=GBP&limit=720`;
};
// const PRICING_API = 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=GBP&limit=720';
const PRICE_REFRESH_RATE = 10000;

// Separate API that deals with price prediction. You do not feed this one data. All you do for this one is
// make a post request with the following data:
/*
{
    "ticker": "BTC"
}
 */
// You can change BTC to the cryptocurrency that cryptocompare supports.
const PRICE_PREDICTION_REFRESH_RATE = 60000 * 8; // Price prediction goes 16 minutes into the future
const PRICE_PREDICTION_API = 'http://localhost:4444/price';
const CRYPTOS_TO_PREDICT = [
    "BTC",
    "ETH",
    "LTC"
];

Meteor.methods({
    'getNewsData'(){
        const result = HTTP.call('GET', NEWS_API);
        return result.data
    },
    'getPricingData'(ticker){
        const result = HTTP.call('GET', PRICING_API(ticker));
        return result.data;
    },
    // 'getCurrPricingData'(ticker){
    //     const result = HTTP.call('GET', CURR_PRICING_API);
    //     return result.data;
    // },
    'getPricePredictionData'(ticker){
        const response = HTTP.call('POST', PRICE_PREDICTION_API, {
            data: {
                ticker: ticker
            }
        });
        return response.data;
    }
});

function initPriceSocket() {
    let tickersToSubscribe = [];
    CRYPTOS_TO_PREDICT.forEach((ticker)=>{
        tickersToSubscribe.push(ticker+'USD');
    });
    cryptoSocket.start('bitfinex', tickersToSubscribe);
}

Meteor.startup(() => {
    News.rawCollection().createIndex({ id: 1 }, { unique: true });
    PricePredictions.rawCollection().createIndex({ ticker: 1 }, { unique: false });
    PricePredictions.rawCollection().createIndex({ ticker_minute: 1 }, { unique: true });

    Pricing.rawCollection().createIndex({ticker: 1}, {unique: true});
    CurrentPriceSocket.rawCollection().createIndex({ticker: 1}, {unique: true});

    Terms.find().forEach(function(term) {
        if(!term.description) {
            let websiteData = Scrape.website(term.url);
            Terms.update({text: term.text}, {$set: {"description" : websiteData.text}});
        }
    } );

    initPriceSocket();

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

    const DELAY_BETWEEN_REQUESTING_DIFFERENT_CRYPTOS = 5000;

    CRYPTOS_TO_PREDICT.forEach((current_ticker)=>{
        Meteor.setTimeout(function(){
            Meteor.call('getPricePredictionData', current_ticker, function(error, data){ // Prediction data is simply an array at minute intervals
                if(error) console.error(error);
                else{
                    let current_time = new Date();
                    data.forEach((datum, i)=>{
                        let prediction_time = moment(current_time).add(i+1, 'minutes');
                        let data_to_insert = {
                            ticker_minute: `${current_ticker}_${i+1}`,
                            price: datum,
                            ticker: current_ticker,
                            time: prediction_time.toDate()
                        };
                        PricePredictions.update(data_to_insert.ticker_minute, data_to_insert, { upsert: true });
                    });
                }
            });
        }, DELAY_BETWEEN_REQUESTING_DIFFERENT_CRYPTOS);
    });
}, PRICE_PREDICTION_REFRESH_RATE);

Meteor.setInterval(function () {
    CRYPTOS_TO_PREDICT.forEach((ticker)=>{
        Meteor.call('getPricingData', ticker, function (error,data) {
            if(error) console.error(error);
            else{
                let data_to_add = {
                    ticker: ticker,
                    data: data.Data
                };

                Pricing.update({ticker: ticker}, data_to_add, {upsert: true});
                // data.forEach(datum)=>{
                //     // data.find({})
                // }

            }
        })
    });
},PRICE_REFRESH_RATE);


Meteor.setInterval(()=>{
    let currentPrice = cryptoSocket.Exchanges['bitfinex'];

    if(currentPrice !== undefined){
        for(let key in currentPrice) {
            let currentTicker = key.replace('USD', '');
            let currentPriceToAdd = {
                ticker: currentTicker,
                price: currentPrice[key]
            };

            CurrentPriceSocket.update({ticker: currentTicker}, currentPriceToAdd, {upsert: true});
        }
    }

}, 1000);