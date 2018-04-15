FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('HomeLayout',{main:'Pricing'});
    }
});

FlowRouter.route('/news', {
    name: 'news',
    action() {
        BlazeLayout.render('HomeLayout',{main:'News'});
    }
});

FlowRouter.route('/resources', {
    name: 'resources',
    action() {
        BlazeLayout.render('HomeLayout',{main:'Resources'});
    }
});

