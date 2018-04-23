

import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import Highcharts from 'highcharts/highstock'


// Data from our NEWS api
import { News, PricePredictions, Terms, CurrentPriceSocket, Pricing} from '../lib/collections.js';
const MAX_ARTICLES = 20;

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

Template.PricingChart.onRendered(function(){
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
               query.data.forEach((priceDatum)=>{
                   OHLC.push([
                       priceDatum.time * 1000,
                       priceDatum.open,
                       priceDatum.high,
                       priceDatum.low,
                       priceDatum.close
                   ]);
               });

               Highcharts.stockChart('pricing-chart', {
                   rangeSelector: {
                       buttons: [{
                           type: 'hour',
                           count: 1,
                           text: '1h'
                       }, {
                           type: 'day',
                           count: 1,
                           text: '1D'
                       }, {
                           type: 'all',
                           count: 1,
                           text: 'All'
                       }],
                       selected: 0,
                       inputEnabled: false
                   },

                   title: {
                       text: currentCryptocurrencySelection
                   },

                   series: [{
                       type: 'candlestick',
                       name: currentCryptocurrencySelection,
                       data: OHLC
                   }]
               });
           }

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


Highcharts.theme = {
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 0 },
            stops: [
                [0, '#37474f']
            ]
        },
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
    },
    title: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '20px'
        }
    },
    subtitle: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
        }
    },
    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: '#A0A0A3'

            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
