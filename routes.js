var routes = function(apps){
  apps.get('/',function(req, res){
    res.send('index.html');
  });
};


module.exports = routes;
