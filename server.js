const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/api/quotes/random', (req, res, next) => {
    const randomQuote = getRandomElement(quotes);
    res.status(200).send({ quote: randomQuote });
});


app.get('/api/quotes', (req, res, next) => {
    const { person } = req.query;

    if (person) {
        const filteredQuotes = quotes.filter(quote => quote.person === person);
        res.status(200).send({ quotes: filteredQuotes });
    } else {
        res.status(200).send({ quotes: quotes });
    }

});


app.post('/api/quotes', (req, res, next) => {
    const { quote, person } = req.query;
    if(!quote || !person) {
        res.sendStatus(400);
    } 

    const newQuote = { quote, person };
    quotes.push(newQuote);
    res.status(201).send({ quote: newQuote });
    
});


app.put('/api/quotes/:id', (req, res, next) => {
    const { id } = req.params;
    const { quote, person } = req.body;

    if(!quote || !person) {
        res.sendStatus(400);
    } else {
        const index = quotes.findIndex(quote => quote.id === id);
        quotes[index] = { id, quote, person };
        res.status(200).send({ quote: quotes[index] });
    }
});





app.listen(PORT, () => {
    console.log(`Server is Alive on ${PORT}`);
})