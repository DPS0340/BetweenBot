const express = require('express');
const router = express.Router();
const tokenmodule = require('../../token');


function guildJSONParse() {
  let guildList;
  try {
    delete require.cache[require.resolve('./data/users.json')];
  } catch (e) {

  }
  try {
    guildList = new Map(require('./data/users.json'));
  } catch (e) {
    guildList = new Map();
  }
  const innerJSONtoMap = (JSONStr) => new Map(JSON.parse(JSONStr));
  const mapToMap = (map, func) => {
    let result = new Map();
    for (let [key, value] of map.entries()) {
      result.set(key, func(value));
    }
    return result;
  };
  return mapToMap(guildList, innerJSONtoMap);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.token) {
    if (tokenmodule.doCheckPublicToken(req.cookies.tag, req.cookies.token)) {
      res.render('index', { title: '사이봇' , validation: true, tag: req.cookies.tag}); // 프론트엔드로 넘겨주기
    } else {
      res.render('index', { title: '사이봇' , validation: false, tag: undefined});
    }
  } else {
    res.render('index', { title: '사이봇' , validation: false, tag: undefined});
  }
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'login' });
});

router.get('/logout', function(req, res, next){
  const tag = req.cookies.tag;
  if(tag) {
    console.log("리보크:", tokenmodule.revoke(tag));
  }
  res.redirect('/');
});

router.post('/login', function(req, res, next){
  const tag = req.body.tag;
  const token = req.body.token;
  if (tokenmodule.doCheckPublicToken(tag, token)) { // TODO!!!
    console.log(tag, "님이 인증에 성공했습니다.");
  } else {
    console.log(tag, "님이 인증에 실패했습니다.");
  }
  res.cookie('tag', tag);
  res.cookie('token', token);
  res.redirect('/');
});


module.exports = router;
