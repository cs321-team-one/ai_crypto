// Basic route to home page
FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('HomeLayout');
    }
});

// Basic route to main layout with separate template (in this case the "main" template being rendered inside of the test
// template.
// This is how we will be able to have a header, sidebar, charts, etc all be rendered dynamically by Meteor
FlowRouter.route('/news', {
    name: 'news',
    action() {
        BlazeLayout.render('MainLayout',{main:'Test'});
    }
});

FlowRouter.route('/resources', {
    name: 'resources',
    action() {
        BlazeLayout.render('MainLayout',{main:'Test'});
    }
});