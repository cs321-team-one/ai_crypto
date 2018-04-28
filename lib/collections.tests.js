import { Meteor } from 'meteor/meteor';
import { Pricing, PricePredictions, News, CurrentPrices, Terms } from "./collections";
import { expect, assert } from 'chai';

if (Meteor.isServer) {

    describe('Test', () => {
       it('should be a string', () => {
          const str = 'my string';
          expect(str).to.be.a('string');
       });
    });

    describe('Pricing', () => {
        it('can add pricing information', () => {
        });
    });

    describe('PricePredictions', () => {
        it('it can add price predictions', () => {
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