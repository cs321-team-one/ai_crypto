import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

// Data from our NEWS api
import { News } from '../lib/collections.js';


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
        return News.find({});
    }
});

Template.News.onRendered(function(){

    $('.modal').modal();

});