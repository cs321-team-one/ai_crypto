import { Mongo } from 'meteor/mongo';

export const News = new Mongo.Collection('news');
export const Terms = new Mongo.Collection('TechnicalTerms');
