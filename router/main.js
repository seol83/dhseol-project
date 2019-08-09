module.exports = function(app, urlShortener)
{
  app.get('/', function(req,res){
    res.render('index');
  });

  app.get('/urlShortener/:orignUrl', function(req, res){
    var originUrl = req.params.orignUrl;
    var shortUrl = urlShortener.getShortUrl(originUrl);

    res.json({shortUrl:shortUrl});
  });

  app.get('/:shortUrl', function(req, res){
    let shortUrl = req.params.shortUrl;
    let originUrl = urlShortener.getOriginUrl(shortUrl);

    res.redirect(301, originUrl);
  });
}
