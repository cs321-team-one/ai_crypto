Router.configure({
    layoutTemplate: 'main_layout'
});

Router.map(function(){
    // Home
    this.route('home', {
        path: '/',
        template: 'home'
    });
    // News
    this.route('news', {
        path: '/news',
        template: 'news'
    });
});