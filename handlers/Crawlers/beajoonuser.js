'use strict';

const request = require('request');
const cheerio = require('cheerio');

class BeaJoonUser {
    constructor(user) {
        this.user = "https://www.acmicpc.net/user/" + user
        this.request = request;
    }
    search() {
        try{
        this.request(this.user, function (error, response, html) {
            if (error) {
                throw new Error("이 유저는 없는 유저 입니다 다시 해주시길 바랍니다.");
            };
            const $ = cheerio.load(html)
          console.log($("div.page-header").text());
        });
    }catch {

     }
    }
}


module.exports = BeaJoonUser
