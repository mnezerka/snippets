var normalize = require('normalizr').normalize;
var Schema = require('normalizr').Schema;
var arrayOf =  require('normalizr').arrayOf;

// definition of schemas
const article = new Schema('articles');
const user = new Schema('users');
const collection = new Schema('collections');

article.define({
    author: user,
    collections: arrayOf(collection)
});

collection.define({
    curator: user
});


// raw data
data = [{
    id: 1,
    title: 'Some Article',
    author: {
        id: 1,
        name: 'Dan'
    }
}, {
    id: 2,
    title: 'Other Article',
    author: {
        id: 1,
        name: 'Dan'
    }
}]

// processing of data
var data = normalize({articles: data}, {
    articles: arrayOf(article)
});

// nice dump
console.log('data', JSON.stringify(data, null, 4));
