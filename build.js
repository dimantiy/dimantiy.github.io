var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');

metalsmith(__dirname)
	// .ignore('node_modules')
	// .ignore('.*')
	// .ignore('*.saz')
	// .ignore('build.*')
	// .ignore('package.json')
	// .ignore('README')
	.source('./source')
	.destination('.')
	.clean(false)
	.use(markdown())
	.use(layouts('handlebars'))
	.use(function (files) {
		for (var f in files) {
			console.log(f);
		}
	})
	.build(function (err) {
		if (err) throw err;
	});