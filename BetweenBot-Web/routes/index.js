const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '사이봇' });
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'login' });
});

router.post('/login', function(req, res, next){
  const tokenmodule = require('../../token');
  console.log(tokenmodule.list);
  const tag = req.body.tag;
  const token = req.body.token;
  if (tokenmodule.doCheckPublicToken(tag, token)) { // TODO!!!
    console.log(tag, "님이 인증에 성공했습니다.");
  } else {
    console.log(tag, "님이 인증에 실패했습니다.");
  }
  res.redirect('/');
});


module.exports = router;
