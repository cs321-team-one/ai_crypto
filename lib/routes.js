
//Each route functions as a page
//The HomeLayout will contain the header, sidenav, and footer coding. The main:Pricing/News/Resources are the templates
//that we will be calling to feed in the necessary information. This is where the individual codes need to be placed

//To visit a page simply type "/resources or /prices or / after localhost or oleg-aws.com

// Basic route to home page. Default page is pricing. May change if time allows
FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('HomeLayout',{main:'Pricing'});
    }
});

// Basic route to main layout with separate template (in this case the "main" template being rendered inside of the test
// template.
// This is how we will be able to have a header, sidebar, charts, etc all be rendered dynamically by Meteor
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

