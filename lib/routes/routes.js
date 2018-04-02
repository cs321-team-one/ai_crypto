Router.configure({
    layoutTemplate: 'main_layout'
});

Router.route('/', function () {
    this.render('homepage');
});

// Router.map(function(){
//     // Home
//     this.route('home', {
//         path: '/',
//         template: 'homepage'
//     });
//     // News
//     this.route('news', {
//         path: '/news',
//         template: 'news'
//     });
// });