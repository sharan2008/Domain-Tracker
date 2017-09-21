const express = require('express');

const app = express();

app.use(express.static('public'))
app.set('view engine', 'pug')
app.set('views', 'views')

let domains = {};

let getHighesCountDomains = function(total) {
  let sortDomains = [];
  for (let domain in domains) {
	sortDomains.push([domain, domains[domain]]);
  }
  sortDomains.sort(function(a, b) {
    return b[1] - a[1];
  });
  let highesCountDomains = [];
  for(let i = 0; i<sortDomains.length; i++) {
	highesCountDomains.push({
		domain: sortDomains[i][0],
		count: sortDomains[i][1]
	});
	if(i === total-1) {
	  break;
	}
  }
  return highesCountDomains;
}

app.get('/', function(req, res) {
  let domains = getHighesCountDomains(3);
  res.render('index', { title: 'Domain Tracker', domains: domains })
});
app.get('/add', function(req, res) {
  if(req.query.domain) {
    if(domains[req.query.domain]) {
	  ++domains[req.query.domain];
    } else {
	  domains[req.query.domain] = 1;
    }
  }
  res.redirect('/');
});

app.get('/api/v1/track', function(req, res) {
  
  if(domains[req.query.domain]) {
	++domains[req.query.domain];
  } else {
	  domains[req.query.domain] = 1;
  }
  var result = {
	status: 'success',
	domain: req.query.domain,
	count: domains[req.query.domain]
  };
  res.json(result);
});

app.get('/api/v1/domains', function(req, res) {
  
  let domains = getHighesCountDomains(3);
  let result = {
	result: 'success',
	domains: highesCountDomains
  }
  res.json(result);
});

app.listen(3000);


