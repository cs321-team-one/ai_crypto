import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

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
    $(".button-collapse-sidenav").sideNav();
    $('input.autocomplete').autocomplete({
        data: supportedCryptocurrencies,
        onAutocomplete: function(txt){
            Session.set('cryptocurrecySelection', txt);
            $('#autocomplete-input').val('');
        }
    });

    // Search bar config

    // let trig = 1;
    // const searchBar = $('.expandable-search');
    // searchBar.addClass('searchbarfix');
    // //animate searchbar width increase to  +150%
    // searchBar.click(function(e) {
    //     //handle other nav elements visibility here to avoid push down
    //     $('.search-hide').addClass('hide');
    //     if (trig === 1){
    //         $('#navfix2').animate({
    //             width: '+=150',
    //             marginRight: 0
    //         }, 400);
    //
    //         trig ++;
    //     }
    //
    // });
    //
    // // if user leaves the form the width will go back to original state
    //
    // searchBar.focusout(function() {
    //
    //     $('#navfix2').animate({
    //         width: '-=150'
    //     }, 400);
    //     trig = trig - 1;
    //     //handle other nav elements visibility first to avoid push down
    //     $('.search-hide').removeClass('hide');
    // });

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
    'submit #navbarsearch': function() {
        event.preventDefault();
        console.log(event.target.text.value);
        const formVal = event.target.text.value;
        if(formVal in supportedCryptocurrencies){
            Session.set('cryptocurrecySelection', formVal);
        }
    }
});