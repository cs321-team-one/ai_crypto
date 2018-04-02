// Router.configure({
//     layoutTemplate: 'main_layout'
// });
//
// Router.route('/', function () {
//     this.render('homepage');
// });
//
// Router.route('/News', function () {
//     this.render('news');
// });
//
// Router.route('/Resources', function () {
//     this.render('resources');
// });

Router.map(function(){
    // Home
    this.route('home', {
        path: '/',
        template: 'homepage'
    });
    // News
    this.route('news', {
        path: '/news',
        template: 'news'
    });
});