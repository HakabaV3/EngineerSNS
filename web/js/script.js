/**
 *	Libs
 */

// no libs !

/**
 *	Main source
 */
//@include module/service/app.js

//@include module/view/baseview.js
//@include module/view/progressbarview.js
//@include module/view/toolbarview.js

//@include module/view/signinpageview.js

//@include module/view/signuppageview.js

//@include module/view/userpageview.js
//@include module/view/userview.js
//@include module/view/userinlineview.js

//@include module/view/projectpageview.js
//@include module/view/projectlistview.js
//@include module/view/projectlistitemview.js

//@include module/view/commentlistview.js
//@include module/view/commentlistitemview.js

//@include module/view/error404pageview.js

/**
 *	bootstrap
 */
app = new Application();

window.onload = function() {
    app.init();
};
