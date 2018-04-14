import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Highcharts } from 'highcharts/highcharts'
import { HTTP } from 'meteor/http';

// Data from our NEWS api
import { News } from '../lib/collections.js';
import { Pricing} from '../lib/collections.js';
const MAX_ARTICLES = 20;

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
    "IOTA (MIOTA)": null
};


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

Template.Pricing.helpers({
    cryptocurrencySelection() {
        return Session.get('cryptocurrecySelection');
    }
});

Template.cryptoCard.helpers({
    cryptocurrencySelection() {
        return Session.get('cryptocurrecySelection');
    }
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

function createHigh() {
    // Placeholder chart
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            },
        },
        series: [
            {
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }
        ]
    });
}

Template.Test.onCreated(function() {
});

Template.Test.onRendered(function() {
    this.autorun(() => {
        createHigh();
    });
});

import { Terms } from '../lib/collections.js'
Template.Resources.helpers({
    terms() {
        return Terms.find({});
    }
})
