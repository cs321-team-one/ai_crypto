import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Highcharts } from 'highcharts/highcharts'
import { HTTP } from 'meteor/http';

// Data from our NEWS api
import { News, PricePredictions, Terms, CurrentPriceSocket, Pricing} from '../lib/collections.js';
const MAX_ARTICLES = 20;

/*
const supportedCryptocurrencies = {
    "Bitcoin (BTC)": null,
    "Ethereum (ETH)": null,
    "Litecoin (LTC)": null,
    "Ripple (XRP)": null,
    "Bitcoin Cash (BCH)": null,
    "EOS (EOS)": null,
    "Cardano (ADA)": null,
    "Stellar (XLM)": null,
    "NEO (NEO)": null,
    "IOTA (MIOTA)": oull
};
*/

const supportedCryptocurrencies = {
    "Bitcoin (BTC)": null,
    "Ethereum (ETH)": null,
    "Litecoin (LTC)": null,
};


/*
    UNIVERSAL (HOME) HELPERS
 */

Template.HomeLayout.rendered = function() {
    $(".button-collapse-sidenav").sideNav({
        closeOnClick: true
    });
    $('input.autocomplete').autocomplete({
        data: supportedCryptocurrencies,
        onAutocomplete: function(txt){
            Session.set('cryptocurrecySelection', txt);
            $('#autocomplete-input').val('');
        }
    });

};

Template.HomeLayout.onCreated(function () {
    Session.set('cryptocurrecySelection', 'Bitcoin (BTC)');
});

Template.HomeLayout.events({
    'submit #navbarsearch': function() {
        event.preventDefault();
        console.log(event.target.text.value);
        const formVal = event.target.text.value;
        if(formVal in supportedCryptocurrencies){
            Session.set('cryptocurrecySelection', formVal);
        }
    }
});

/*
    PRICE HELPERS
 */

// Template.Pricing.onRendered(function() {
//     this.autorun(() => {
//         $('#container').highcharts({
//             chart: {
//                 type: 'line'
//             },
//             title: {
//                 text: 'Fruit Consumption'
//             },
//             xAxis: {
//                 categories: ['Apples', 'Bananas', 'Oranges']
//             },
//             yAxis: {
//                 title: {
//                     text: 'Fruit eaten'
//                 },
//             },
//             series: [
//                 {
//                     name: 'Jane',
//                     data: [1, 0, 4]
//                 }, {
//                     name: 'John',
//                     data: [5, 7, 3]
//                 }
//             ]
//         });
//     });
// });


Template.Pricing.helpers({
    cryptocurrencySelection() {
        return Session.get('cryptocurrecySelection');
    },
    pricePrediction(){
        let currentCryptocurrencySelection = Session.get('cryptocurrecySelection');
        let ticker = currentCryptocurrencySelection.substring(
            currentCryptocurrencySelection.indexOf('(') + 1,
            currentCryptocurrencySelection.indexOf(')')
        );
        return PricePredictions.find({ ticker: ticker })
    },
    currentPrice(){
        let currentCryptocurrencySelection = Session.get('cryptocurrecySelection');
        let ticker = currentCryptocurrencySelection.substring(
            currentCryptocurrencySelection.indexOf('(') + 1,
            currentCryptocurrencySelection.indexOf(')')
        );
        let currentData = CurrentPriceSocket.findOne({ticker: ticker});

        return currentData.price.toFixed(2);
    }
});

Template.Pricing.onRendered(function(){
   this.autorun(()=>{
       let currentCryptocurrencySelection = Session.get('cryptocurrecySelection');
       let ticker = currentCryptocurrencySelection.substring(
           currentCryptocurrencySelection.indexOf('(') + 1,
           currentCryptocurrencySelection.indexOf(')')
       );

       let PricingQuery = Pricing.find({ticker: ticker});

       PricingQuery.forEach((query, i)=>{
          if(i === 0){
              let OHLC = [];
              let timeArray = [];
              query.data.forEach((priceDatum,i)=>{
                  OHLC.push(priceDatum.close);
                  timeArray.push(priceDatum.time);
                  //priceDatum.time,priceDatum.open, priceDatum.high, priceDatum.low,
              });
              let startDate = moment(timeArray[0]*1000).utc().valueOf();

              $('#pricing-chart').highcharts({
                  chart: {
                      type: 'line'
                  },
                  title: {
                      text: 'Closing Price'
                  },

                  yAxis: [{
                      title: {
                          text: 'Price'
                      },
                  }],
                  xAxis: {
                      type: 'datetime',
                      title: {
                          text: 'Time'
                      }
                  },
                  plotOptions:{
                      series: {
                          pointStart: startDate
                      }
                  },
                  series: [{
                      type: 'line',
                      name: currentCryptocurrencySelection,
                      data: OHLC,
                      pointInterval: 1000 * 60
                  }]

              });
          }

       });


   });
});


Template.PricePrediction.onRendered(function() {
    this.autorun(() => {
        let currentCryptocurrencySelection = Session.get('cryptocurrecySelection');
        let ticker = currentCryptocurrencySelection.substring(
            currentCryptocurrencySelection.indexOf('(') + 1,
            currentCryptocurrencySelection.indexOf(')')
        );
        let data = PricePredictions.find({ ticker: ticker });

        let priceArray = [];
        let timesArray = [];

        data.forEach((datum)=>{
            priceArray.push(datum.price);
            timesArray.push(datum.time);
        });

        let startDate = moment(timesArray[0]).utc().valueOf();

        $('#prediction-chart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Price Prediction'
            },
            xAxis: {
                type: 'datetime'

            },
            yAxis: {
                title: {
                    text: 'Price'
                },
            },
            plotOptions:{
                series: {
                    pointStart: startDate
                }
            },
            series: [
                {
                    name: Session.get('cryptocurrecySelection'),
                    data: priceArray,
                    pointInterval: 1000 * 60 // one minute
                }
            ]
        });
    });
});


/*
    NEWS HELPERS
 */
Template.News.helpers({
    newsArticles : function(){
        const articles = News.find({}, {
            sort: { published_on: -1 },
            limit: MAX_ARTICLES
        });

        let retArt = [];

        articles.forEach((article)=>{
            article['published_on'] = moment(article['published_on'] * 1000).format('MMMM Do YYYY, h:mm').toString();
            retArt.push(article);
        });

        return retArt
    }
});


Template.articleContent.helpers({
    isBuy: function() {
        return this.newsArticle.prediction === "BUY";
    }
});

/*
    RESOURCES HELPERS
 */

Template.Resources.helpers({
  terms() {
    return Terms.find({});
  }
});


