module.exports = function(app, urlShortener)
{
  app.get('/', function(req,res){
    res.render('index');
  });

  //url을 입력받아 줄인 url로 리턴
  app.get('/urlShortener/:orignUrl', function(req, res){
    var originUrl = req.params.orignUrl;
    var shortUrl = urlShortener.getShortUrl(originUrl);

    res.json({shortUrl:shortUrl});
  });

  //줄인 url을 이용해 원본 url을 찾아내 301 리다이렉트
  app.get('/:shortUrl', function(req, res){
    let shortUrl = req.params.shortUrl;
    let originUrl = urlShortener.getOriginUrl(shortUrl);

    res.redirect(301, originUrl);
  });
}
