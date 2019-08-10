/**
 * url-shortener.js
 * @module urlShortener
 */

const BASE_CODE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BASE_LEN  = BASE_CODE.length;
const ERROR_NOT_REGISTERED = "ERROR_NOT_REGISTERED";

let _urlList = {};

/**
 * URL의 고유한 id를 62진법으로 변환하여 해당하는 문자를 리턴한다.
 * @method encId
 * @param {Number} id URL에 대한 고유값
 * @returns {string} 62진법으로 변환한 문자열
 */
const encId = function(id){
  let value = Math.floor(id/BASE_LEN);
  let rest  = Math.floor(id%BASE_LEN);

  if(value == 0){
    return BASE_CODE.charAt(rest);
  }else{
    return BASE_CODE.charAt(rest) + encId(value);
  }
}

/**
 * 62진법 문자열을 10진법으로 변환하여 리턴한다.
 * @method decId
 * @param {string} str 62진법 문자열
 * @returns {Number} 62진법 문자열을 10진법으로 변환한 값
 */
const decId = function(str){
  let result = 0;
  for(let i=0; i<str.length; i++){
    result += BASE_CODE.indexOf(str.charAt(i)) * Math.pow(BASE_LEN, i);
  }
  return result;
}

/**
 * URL ID를 Key로 하고 원본 URL과 짧은 URL을 Value로 가지고 있는 json data를 리턴한다.
 * @method getUrlData
 * @returns {Number} URL json data
 */
const getUrlData = function(){
  return _urlList;
}

/**
 * URL id, 원본 URL, 짧은 URL 정보를 json data에 저장한다.
 * @method setUrlData
 * @param {Number} id URL의 고유한 ID
 * @param {string} oUrl 원본 URL
 * @param {string} sUrl 짧은 URL
 */
const setUrlData = function(id, oUrl, sUrl){
  _urlList[id] = {oUrl : oUrl, sUrl : sUrl};
  
  console.debug("Set URL DATA>", id, {oUrl : oUrl, sUrl : sUrl});
}

/**
 * URL을 해쉬하여 고유한 ID 값을 구해낸다.
 * @method hash
 * @returns {Number} URL json data
 */
const hash = function(url){

  let mul = 1;
  let x   = 0;
  //짧은 주소 최대 문자수 8자리 제한을 위해 62^8한 값보다 작은 수 중 가장 큰 소수 사용.
  const MOD = 218340105584893; 

  for (let i = 0; i < url.length; i++) {
      
      x = ((url.charCodeAt(i) * mul) + x) % MOD;
      mul = (mul * 3) % MOD;
  }
  
  return x%MOD;

};

let urlShortener = {};

/**
 * URL을 받아 해당하는 짧은 URL을 리턴한다.
 * @namespace urlShortener
 * @method getShortUrl
 * @param {String} originUrl 원본 URL
 * @returns {String} 짧은 URL
 */
urlShortener.getShortUrl = function(originUrl){
  let index   = hash(originUrl);
  let urlList = getUrlData();
  
  if(urlList.hasOwnProperty(index)){
    return urlList[index].sUrl;
  }else{
    let shortUrl = encId(index);

    setUrlData(index, originUrl, shortUrl);

    return shortUrl;
  }
}

/**
 * 짧은 URL을 받아 원본 URL을 리턴한다.
 * @namespace urlShortener
 * @method getOriginUrl
 * @param {String} shortUrl 짧은 URL
 * @returns {String} 원본 URL
 */
urlShortener.getOriginUrl = function(shortUrl){
  let index = decId(shortUrl).toString();
  let urlList = getUrlData();
  
  if(urlList[index] != undefined){      
    console.log("Get URL DATA >", index, urlList[index]);
    return urlList[index].oUrl;
  }else{
    console.log("URL not registered", shortUrl);  
    return ERROR_NOT_REGISTERED;
  }
}

module.exports = urlShortener;
