import { Meteor } from 'meteor/meteor';
import { Pricing, PricePredictions, News, CurrentPrices, Terms } from "./collections";
import { expect, assert } from 'chai';
import { insertPredictionData } from '../server/main.js';


if (Meteor.isServer) {

    describe('Pricing', () => {
        it('can add pricing information', () => {
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
        it('can add news articles', () => {
        });
    });

    describe('CurrentPrices', () => {
        it('can add current prices', () => {
        });
    });

    describe('Terms', () => {
        it('can add terms', () => {
        });
    });
}