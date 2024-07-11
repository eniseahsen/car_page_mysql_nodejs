var mysql = require('mysql');
const express = require('express');
const app = express();
var path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "arabalarsql" //veri tabanını eklemeyi unutma
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!!!');
});

app.get('/', (req, res) => {
    let kosul = req.query.kosul || '';
    let sql = "SELECT * FROM otomobil_fiyatlari";
    if (kosul) {
        sql += " WHERE marka LIKE ?";
    }
    con.query(sql, ['%' + kosul + '%'], (err, result) => {
        if (err) throw err;
        res.render("anasayfa", { cars: result, kosul: kosul, page: 'anasayfa' });
    });
});

app.get('/add-car', (req, res) => {
    res.render('add-car');
});

app.post('/add-car', (req, res) => {
    let car = {
        id: req.body.id,
        marka: req.body.marka,
        model: req.body.model,
        donanim: req.body.donanim,
        motor: req.body.motor,
        yakit: req.body.yakit,
        vites: req.body.vites,
        fiyat: req.body.fiyat,
        websitesi: req.body.websitesi
    };

    let sql = 'INSERT INTO otomobil_fiyatlari SET ?';
    con.query(sql, car, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/iletisim', (req, res) => {
    res.render("iletisim");
});

app.post('/iletisim', (req, res) => {
    let nesne = {
        name: req.body.ad || '',
        surname: req.body.soyad || '',
        email: req.body.email || '',
        tel: req.body.telefon || '',
        subject: req.body.mesaj || ''
    };
    console.log(`Ad: ${nesne.name}, Soyad: ${nesne.surname}, Email: ${nesne.email}, Telefon: ${nesne.tel}, Mesaj: ${nesne.subject}`);
    res.send(`<h2>Yanıtınız gönderildi</h2><p><a href="/">Anasayfaya dön</a></p>`);
});

app.get("/izu", (req, res) => {
    res.redirect("https://www.izu.edu.tr");
});

let port = 2006;
app.listen(port, (err) => {
    if (err) throw err;
    console.log("dinleniyor");
});
