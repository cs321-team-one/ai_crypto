import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { News } from '../lib/collections.js';

const NEWS_API = 'https://min-api.cryptocompare.com/data/news/?lang=EN';
const NEWS_REFRESH_RATE = 60000 * 5;


Meteor.methods({
    'getNewsData'(){
        const result = HTTP.call('GET', NEWS_API);
        return result.data;
    }
});

Meteor.startup(() => {
});

Meteor.call('getNewsData', function(error, data){
    if(error)
        console.log(error);

    Meteor.setInterval(function(){
        try{
            data.forEach((datum)=>{
               News.update(datum, datum, { upsert: true });
            });
        } catch(e){
            console.log(e);
        }
    }, NEWS_REFRESH_RATE);

});
