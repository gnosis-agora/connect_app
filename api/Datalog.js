import { Mongo } from 'meteor/mongo';

export const Datalog = new Mongo.Collection('Datalog');

// database to store details of user data collected