import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { News } from '../lib/collections.js';
import { Pricing } from '../lib/collections.js';
import { Terms } from '../lib/collections.js'

const NEWS_API = 'https://min-api.cryptocompare.com/data/news/?lang=EN';
const NEWS_REFRESH_RATE = 60000 * 5;

const PRICING_API = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,XRP,BCH,EOS,ADA,XLM,NEO,MIOTA&tsyms=USD,EUR';
const PRICING_REFRESH_RATE = 60000 * 5;

const NEWS_PREDICTION_API = 'http://localhost:4444/news'; // THIS NEEDS A POST REQUEST WITH JSON ARRAY DATA


Meteor.methods({
    'getNewsData'(){
        const result = HTTP.call('GET', NEWS_API);
        return result.data
    },

    'getPricingData'(){
        const result = HTTP.call('GET', PRICING_API);
        return result.data;
    }
});

Meteor.startup(() => {
    News.rawCollection().createIndex({ id: 1 }, { unique: true });
    Terms.find().forEach(function(term) {
      if(!term.description) {
        var websiteData = Scrape.website(term.url);
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
                    News.update(datum, datum, { upsert: true });
                } catch (e) {

                    // console.error('Could not upsert a new article.');
                }

            });

        }
    });
}, NEWS_REFRESH_RATE);

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
