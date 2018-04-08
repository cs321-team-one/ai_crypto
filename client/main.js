import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

const supportedCryptocurrencies = {
    "Bitcoin (BTC)": null,
    "Ethereum (ETH)": null,
    "Litecoin (LTC)": null
};

Template.HomeLayout.rendered = function() {
    $(".button-collapse-sidenav").sideNav();
    $('input.autocomplete').autocomplete({
        data: supportedCryptocurrencies,
    });
};

Template.HomeLayout.onCreated(function helloOnCreated() {
    Session.set('cryptocurrecySelection', 'Bitcoin (BTC)');
});

Template.Pricing.helpers({
    cryptocurrencySelection() {
        return Session.get('cryptocurrecySelection');
    }
});

Template.HomeLayout.events({
    'submit #crypto-select-form': function() {
        event.preventDefault();
        const formVal = event.target.text.value;
        if(formVal in supportedCryptocurrencies){
            Session.set('cryptocurrecySelection', formVal);
        }
    }
});