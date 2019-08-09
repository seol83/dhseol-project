const assert = require('assert');
const urlShortener = require('../modules/url-shortener');

var testData = [
  { oUrl:"http://www.daum.net", sUrl:"bD"},
  { oUrl:"https://hyunseob.github.io/2016/05/09/assert-nodejs-test-module/", sUrl:"lEb"},
  { oUrl:"https://www.google.com/search?newwindow=1&safe=off&rlz=1C1SQJL_koKR814KR815&ei=5sdMXfOeKcGymAW--ZjIDw&q=nodejs+assert&oq=nodejs+assert&gs_l=psy-ab.3..0j0i203l3j0j0i203l5.1473990.1476526..1477346...0.0..0.155.1261.1j10......0....1..gws-wiz.......0i67j0i10j35i39j0i20i263j0i131j0i10i203.-0kr0nYQezU&ved=&uact=5"
  , sUrl:"Jhg"},
  { oUrl:"https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=%EA%B0%80%EB%82%98%EB%8B%A4%EB%9D%BC"
  , sUrl:"Rxc"}
];

describe("url-shortener.getShortUrl test", function(){
  it("getShortUrl test-00 short url", function(){
    assert.equal(urlShortener.getShortUrl(testData[0].oUrl), testData[0].sUrl);
  });

  it("getShortUrl test-01 long url", function(){
    assert.equal(urlShortener.getShortUrl(testData[1].oUrl), testData[1].sUrl);
  });

  it("getShortUrl test-02 very long url", function(){
    assert.equal(urlShortener.getShortUrl(testData[2].oUrl), testData[2].sUrl);
  });

  it("getShortUrl test-03 url with param", function(){
    assert.equal(urlShortener.getShortUrl(testData[3].oUrl), testData[3].sUrl);
  });

  it("getShortUrl test-04 same url same short url", function(){
    assert.equal(urlShortener.getShortUrl(testData[3].oUrl), testData[3].sUrl);
  });
});


describe("url-shortener.getOriginUrl test", function(){
  it("getOriginUrl test-00 short url", function(){
    assert.equal(urlShortener.getOriginUrl(testData[0].sUrl), testData[0].oUrl);
  });

  it("getOriginUrl test-01 long url", function(){
    assert.equal(urlShortener.getOriginUrl(testData[1].sUrl), testData[1].oUrl);
  });

  it("getOriginUrl test-02 very long url", function(){
    assert.equal(urlShortener.getOriginUrl(testData[2].sUrl), testData[2].oUrl);
  });

  it("getOriginUrl test-03 url with param", function(){
    assert.equal(urlShortener.getOriginUrl(testData[3].sUrl), testData[3].oUrl);
  });
});
