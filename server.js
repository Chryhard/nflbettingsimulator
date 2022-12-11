const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.use('/', (req, res) => {
    res.render('index');
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});