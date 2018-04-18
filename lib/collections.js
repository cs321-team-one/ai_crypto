import { Mongo } from 'meteor/mongo';

export const News = new Mongo.Collection('news');
export const Terms = new Mongo.Collection('TechnicalTerms');
export const Pricing =  new Mongo.Collection('Pricing');
export const PricePredictions = new Mongo.Collection('PricePredictions');