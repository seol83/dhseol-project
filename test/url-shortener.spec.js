const assert = require('assert');
const urlShortener = require('../modules/url-shortener');

var testData = [
  { oUrl:"http://www.daum.net", sUrl:"9hjcy5K3"},
  { oUrl:"https://hyunseob.github.io/2016/05/09/assert-nodejs-test-module/", sUrl:"2kracUmD"},
  { oUrl:"https://www.google.com/search?newwindow=1&safe=off&rlz=1C1SQJL_koKR814KR815&ei=5sdMXfOeKcGymAW--ZjIDw&q=nodejs+assert&oq=nodejs+assert&gs_l=psy-ab.3..0j0i203l3j0j0i203l5.1473990.1476526..1477346...0.0..0.155.1261.1j10......0....1..gws-wiz.......0i67j0i10j35i39j0i20i263j0i131j0i10i203.-0kr0nYQezU&ved=&uact=5"
  , sUrl:"C7z9yg4U"}
];

describe("url-shortener.getShortUrl test", function(){
  it("getShortUrl test-00 short url", function(){
    assert.equal(urlShortener.getShortUrl(testData[0].oUrl), testData[0].sUrl);
  });

  it("getShortUrl test-01 long url", function(){
    assert.equal(urlShortener.getShortUrl(testData[1].oUrl), testData[1].sUrl);
  });

  let test_02_result = urlShortener.getShortUrl(testData[2].oUrl);
  it("getShortUrl test-02 very long url", function(){
    assert.equal(test_02_result, testData[2].sUrl);
  });

  it("getShortUrl test-03 same url same short url", function(){
    assert.equal(urlShortener.getShortUrl(testData[2].oUrl), test_02_result);
  });

  it("getShortUrl test-04 abcd != dcba", function(){
    assert.notEqual(urlShortener.getShortUrl('abcd'), urlShortener.getShortUrl('dcba'));
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
});
