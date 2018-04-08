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
        try{
            const newsResponse = HTTP.call('GET', NEWS_API);
            console.log(newsResponse);
        } catch (e) {
            console.error('Cannot get news from the news api.')
        }

        const MAX_CARDS_PER_ROW = 4;

        dataArr = [
            {
                title: 'News 1',
                url: 'http://news1.com',
                body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                imageurl: "https://images.cryptocompare.com/news/livebitcoinnews/c20cw000800.png"
            },
            {
                title: 'News 2',
                url: 'http://news2.com',
                body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                imageurl: "https://images.cryptocompare.com/news/bitcoinist/aMNqsQogN90.jpeg"
            },
            {
                title: 'News 3',
                url: 'http://news3.com',
                body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                imageurl: "https://images.cryptocompare.com/news/bitcoinist/aMNqsQogN90.jpeg"
            },
            {
                title: 'News 4',
                url: 'http://news4.com',
                body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                imageurl: "https://images.cryptocompare.com/news/bitcoinist/aMNqsQogN90.jpeg"
            }
        ];

        dataArr.forEach((datum, i)=>{
            datum['span'] = `span_${(i%MAX_CARDS_PER_ROW)+1}_of_${MAX_CARDS_PER_ROW}`
        });

        console.log(dataArr);

        return dataArr;
    }
});