import { Meteor } from 'meteor/meteor';
import { Pricing, PricePredictions, News, CurrentPrices, Terms } from "./collections";
import { expect, assert } from 'chai';
import { insertPredictionData, insertNewsData } from '../server/main.js';


if (Meteor.isServer) {

    Factory.define('PricingData', Pricing,{
        time: "1525015260",
        close: "9312.5",
        high: "9315.78",
        low: "9311.01",
        open: "9315.57",
        volumefrom: "54.87",
        volumeto: "510466.89"
    });

    describe('Pricing', () => {
        it('can add pricing information', () => {
            Factory.create("PricingData");
            let found = false;
            Pricing.find().forEach(function(price) {
                if(price.open === "9315.57") {
                    found = true;
                }
            });
            assert.equal(found, true);
            Pricing.remove({time:"1525015260"})
        });
    });

    describe('PricePredictions', () => {
        const predictionMockData = [
            9332.5537109375,
            9307.37109375,
            9289.1162109375,
            9343.279296875,
            9350.9140625,
            9307.62890625,
            9308.07421875,
            9355.71484375,
            9334.080078125,
            9241.880859375,
            9302.337890625,
            9354.97265625,
            9284.3505859375,
            9341.1787109375,
            9298.94140625,
            9264.8056640625
        ];

        beforeEach(function() {
            PricePredictions.remove({});
            insertPredictionData(predictionMockData, 'BTC');
        });

        it('_id is correct', () => {


            PricePredictions.find().forEach((prediction, i)=>{
               expect(prediction._id).to.equal(`BTC_${i+1}`);
            });

        });

        it('price is correct', () => {


            PricePredictions.find().forEach((prediction, i)=>{
                expect(prediction.price).to.equal(predictionMockData[i]);
            });

        });

        it('ticker is correct', () => {


            PricePredictions.find().forEach((prediction, i)=>{
                expect(prediction.ticker).to.equal("BTC");
            });

        });

        it('time is a Date object', () => {


            PricePredictions.find().forEach((prediction, i)=>{
                assert.instanceOf(prediction.time, Date, 'prediction time is not a Date object.');
            });

        });


    });

    describe('News', () => {

        const fakeNews = [
            {
                id: "135162",
                guid: "http://bitcoinist.com/?p=65305",
                published_on: 1524958238,
                imageurl: "https://images.cryptocompare.com/news/bitcoinist/80000200010.jpeg",
                title: "Start Your Own Online Casino in Less Than 5 Minutes – We Show You How!",
                url: "https://bitcoinist.com/start-online-casino-less-5-minutes-show/",
                source: "bitcoinist",
                body: "You may be quite surprised to learn that starting your very own online casino could take as little as 5 minutes and, getting the ball rolling is a lot easier than you may think. Online casinos are enormously popular with all demographics and internet users. In fact, online casino gambling is the leading form of Internet-based gaming, according to many experts. So, how hard is it to start your own online casino? According to industryRead MoreThe post Start Your Own Online Casino in Less Than 5 Minutes – We Show You How! appeared first on Bitcoinist.com.",
                tags: "Altcoin News|Blockchain Technology|Casinos|News|News teaser|Sponsored Article|blockchain technology|ICOs|online casino|Zero Edge|zerocoin",
                categories: "ICO",
                lang: "EN",
                source_info: {
                    name: "Bitcoinist",
                    lang: "EN",
                    img: "https://images.cryptocompare.com/news/default/bitcoinist.png",
                },
            },
            {
                id: "135161",
                guid: "https://www.ccn.com/?p=135654",
                published_on: 1524955619,
                imageurl: "https://images.cryptocompare.com/news/ccn/c4Qb323zg36.jpeg",
                title: "Litecoin Payments are Quietly Starting to Catch On",
                url: "https://www.ccn.com/litecoin-payments-quietly-start-catching-on/",
                source: "ccn",
                body: "One of the main critiques about Bitcoin is the digital currency’s troubles offering timely and cost-effective payments. Charlie Lee, the founder of Litecoin, foresaw Bitcoin’s future payment issues, and took action by designing a more payments-friendly blockchain.  After earning the nickname, &#8216;SatoshiLite&#8217;, Mr. Lee earned a job at Coinbase, the large San Francisco-based crypto-exchange. Mr. &#8230; ContinuedThe post Litecoin Payments are Quietly Starting to Catch On appeared first on CCN",
                tags: "Altcoin News|Litecoin News|News|blockchain|Crypto|litecoin",
                categories: "LTC|BTC|ICO|Blockchain",
                lang: "EN",
                source_info: {
                    name: "CCN",
                    lang: "EN",
                    img: "https://images.cryptocompare.com/news/default/ccn.png",
                },
            },
            {
                id: "135158",
                guid: "https://news.bitcoin.com/?p=152777",
                published_on: 1524953444,
                imageurl: "https://images.cryptocompare.com/news/bitcoin.com/921pI9u0a00.png",
                title: "Chilean Minister Supports Cryptocurrencies After Court Sided With Exchanges Against Banks",
                url: "https://news.bitcoin.com/chilean-minister-supports-cryptocurrencies-after-court-sided-with-exchanges-against-banks/",
                source: "bitcoin.com",
                body: "The Chilean Minister of Economy has voiced his support for cryptocurrencies after the country&#8217;s anti-monopoly court ordered major banks to re-open the accounts of crypto operators. Three banks out of the 10 sued by local cryptocurrency exchange Buda have been ordered to re-open crypto exchange accounts. Also read: Yahoo! Japan Confirms Entrance Into the Crypto Space [&#8230;]The post Chilean Minister Supports Cryptocurrencies After Court Sided With Exchanges Against Banks appeared first on Bitcoin News.",
                tags: "Finance|bancoestado|bank accounts|banks|bci|Bitcoin|BTC|Buda|Chile|chilean|Court|court order|crypto|Cryptocurrencies|Cryptocurrency|Cryptomkt|Innovation|itau|José Ramón Valente|minister of economy|N-Economy|scotiabank|SurBTC|TDLC",
                categories: "BTC|Exchange|Asia",
                lang: "EN",
                source_info: {
                    name: "Bitcoin.com",
                    lang: "EN",
                    img: "https://images.cryptocompare.com/news/default/bitcoincom.png",
                },
            },
            {
                id: "135157",
                guid: "https://themerkle.com/?p=55769",
                published_on: 1524952827,
                imageurl: "https://images.cryptocompare.com/news/themerkle/dc4xa1i0M10.jpeg",
                title: "IBM Partners with Top Jewelry Companies on Blockchain Project",
                url: "https://themerkle.com/ibm-partners-with-top-jewelry-companies-on-blockchain-project/",
                source: "themerkle",
                body: "IBM has partnered with some of the top companies in the gold and diamond industries on a cross-industry blockchain initiative meant to trace the origin of finished jewelry. The initiative, which was announced via a blog post by the New York-based tech giant, is intended to introduce transparency to an industry that has witnessed an increase in counterfeit jewelry, and brings together five of the most prominent names in the industry. The initiative will track the precious metals as they move through every stage of the supply chain until they become finished pieces of jewelry. TrustChain Initiative TrustChain Initiative will be",
                tags: "News|IBM|Supply Chain",
                categories: "Blockchain|Technology|Fiat",
                lang: "EN",
                source_info: {
                    name: "TheMerkle",
                    lang: "EN",
                    img: "https://images.cryptocompare.com/news/default/themerkle.png",
                },
            },
            {
                id: "135155",
                guid: "https://news.bitcoin.com/?p=153067",
                published_on: 1524951051,
                imageurl: "https://images.cryptocompare.com/news/bitcoin.com/8Cwy202w000.png",
                title: "PR: Brock Pierce and 25+ Crypto Whales in the Most Expected Coinsbank Event of the Year",
                url: "https://news.bitcoin.com/pr-brock-pierce-and-25-crypto-whales-in-the-most-expected-coinsbank-event-of-the-year/",
                source: "bitcoin.com",
                body: "Did you know that the flying cars from The Fifth Element and Blade Runner films have already become reality? Or that using a VR helmet allows you to sit in an office meeting with the world’s leading experts and investors without the traveling hassle? Probably not. Well, here’s a chance.The post PR: Brock Pierce and 25+ Crypto Whales in the Most Expected Coinsbank Event of the Year appeared first on Bitcoin News.",
                tags: "Press release|artificial general intelligence|bitcoin foundation|blockchain Capital|Brock Pierce|Coinsbank|DataDash|Dinis Guarda|Dubai|Evercoin Exchange|Federico Pistono|Miko Matsumura|Nicholas Merten",
                categories: "BTC|Business|Sponsored",
                lang: "EN",
                source_info: {
                    name: "Bitcoin.com",
                    lang: "EN",
                    img: "https://images.cryptocompare.com/news/default/bitcoincom.png",
                },
            }];

        const fakeNewsPredictionData = [1,0,1,0,1];

        beforeEach(function(){
           News.remove({});
           insertNewsData(fakeNews, fakeNewsPredictionData);
        });

        it('can add news articles', () => {
            console.log(News.findOne());
        });

        it('has a body', () => {
           News.find().forEach((article) => {
              expect(article).to.have.property('body');
           });
        });
    });

    Factory.define('CurrPricingData', CurrentPrices, {
        USD: "9287.42"
    });

    describe('CurrentPrices', () => {
        it('can add current prices', () => {
            Factory.create('CurrPricingData');
            let found = false;
            let price = CurrentPrices.find();

            price.forEach(function(currPrice) {
                if(currPrice.USD === "9287.42") {
                    found = true;
                }
            });
            assert.equal(found, true);
            CurrentPrices.remove({USD: "9287.42"})
        });
    });
}




// Created test to see if insertion and retreival into database is working properly
Factory.define('Resources', Terms, {
  _id: "213626",
  text: 'Random Word',
  url: "https://www.investopedia.com/terms/b/block-reward.asp",
  description: "Small Description....."
});

  describe('Resources Collection Test #1', function() {
    it('Should return the value I inserted: Random Word', function() {
      Factory.create("Resources");
        let found = false;
        let terms = Terms.find()

        terms.forEach(function(term) {
          if(term.text === "Random Word") {
              found = true
          }
      } );
      assert.equal(found, true);
      Terms.remove({_id: "213626"})
    });
  });

  // This tests whether the proper number of docs are in the collection
  describe('Resources Collection Test #2', function() {
    it('Should return the count of docs in the collection: 1', function() {
      Factory.create("Resources");
      let terms = Terms.find();
      assert.equal(1, terms.count());
      Terms.remove({_id: "213626"})
    });
  });


  // Tests for webscraper
  // This website only has the text "Hello World"
  const fakeResourcesURL = "http://mason.gmu.edu/~sgangele/"
  describe('Webscraper Test', function() {
    it('The scraped text should be: Hello World!', function() {
      const websiteData = Scrape.website(fakeResourcesURL);
      assert.equal(websiteData.text, "Hello World!")
    });
  });
