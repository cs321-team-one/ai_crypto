import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { News } from '../lib/collections.js';
import { Pricing } from '../lib/collections.js';

const NEWS_API = 'https://min-api.cryptocompare.com/data/news/?lang=EN';
const NEWS_REFRESH_RATE = 60000 * 5;

const PRICING_API = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,XRP,BCH,EOS,ADA,XLM,NEO,MIOTA&tsyms=USD,EUR';
const PRICING_REFRESH_RATE = 60000 * 5;

Meteor.methods({
    'getNewsData'(){
        const result = HTTP.call('GET', NEWS_API);
        console.log(result.data);
        return result.data
    },

    'getPricingData'(){
        const result = HTTP.call('GET', PRICING_API);
        return result.data;
    }
});

Meteor.startup(() => {

});

Meteor.setInterval(function() {
    Meteor.call('getNewsData', function(error, data) {
        if(error){
            console.error(error);
        } else {
            try{
                data.forEach((datum)=>{
                    News.update(datum, datum, { upsert: true });
                });
            } catch(e){
                console.log(e);
            }
        }
    });
}, NEWS_REFRESH_RATE);

