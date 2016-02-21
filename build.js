var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');

metalsmith(__dirname)
	.source('./_source')
	.destination('.')
	.clean(false)
	.use(function (files) {
		for (var f in files) {
            var sep = f.split("\\");
            var arr = [];
            arr.length = sep.length;
            var root = arr.join("../");
			files[f].root = root;
		}
	})
    .use(collections({
        routes: {
            sortBy: 'date',
            reverse: true
        }
    }))
	.use(markdown())
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