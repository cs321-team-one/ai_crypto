FlowRouter.route('/', {
    name:'home',
    action(){
        BlazeLayout.render('HomeLayout');
    }
});

FlowRouter.route('/test', {
    name:'home',
    action(){
        BlazeLayout.render('MainLayout', {main: 'Test'});
    }
});