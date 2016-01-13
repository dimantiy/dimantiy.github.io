var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');

metalsmith(__dirname)
	.source('./_source')
	.destination('.')
	.clean(false)
	.use(markdown())
	.use(function (files) {
		for (var f in files) {
            var sep = f.split("\\");
            var arr = [];
            arr.length = sep.length;
            var root = arr.join("../");
			files[f].root = root;
		}
	})
	.use(layouts({
		engine: 'handlebars',
        directory: '_layouts',
		partials: '_partials'
	}))
	.use(function (files) {
		for (var f in files) {
			console.log(f);
		}
	})
	.build(function (err) {
		if (err) throw err;
	});