const express          = require('express');
const app              = express();
const mongoose         = require('mongoose');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const expressSanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost:27017/runner_proj',  {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(bodyParser.json());
mongoose.set('useFindAndModify', false);

const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);


app.get('/', (req, res) => {
	res.redirect('/blog');
});

app.get('/blog', (req, res) => {
	Blog.find({}, (err, blog) => {
		if(err){
			console.log(err);
		} else {
			res.render('index', {blog: blog});
		}
	});
	
});

app.get('/blog/new', (req, res) => {
	res.render('new');
});

app.post('/blog', (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render('new');
		} else {
			res.redirect('/blog');
		}
	});
});

app.get('/blog/:id', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect('blog');
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
	
});

app.get('/blog/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			console.log(err);
		} else {
			res.render('edit', {blog: foundBlog});
		}
	});
	
});

app.put('/blog/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog/' + req.params.id);
		}
	});
});

app.delete('/blog/:id', (req, res) => {
	Blog.findByIdAndDelete(req.params.id,  (err) => {
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog')
		}
	});
});















app.listen(8080, () => {
	console.log('Server has started');
});

