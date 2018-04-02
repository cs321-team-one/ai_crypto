Router.configure({
    layoutTemplate: 'main_layout'
});

Router.map(function(){
    // News
    this.route('news', {
        path: '/news',
        template: 'news'
    });
});