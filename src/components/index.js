import 'angular-ui-bootstrap';
import 'angularjs-toaster';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import ngFileUpload from 'ng-file-upload';
import NewPost from './new-post';
import SimpleEditor from './simple-medium-editor';
import FullEditor from './full-medium-editor';
import UploadFile from './upload-file';
import Chips from './chips';
import RecentPosts from './recent-posts';
import AuthorPopover from './author-popover';
import Reaction from './reaction';
import MyPosts from './my-posts';
import Toolbar from './toolbar';
import Editorial from './editorial';
import PostStatus from './post-status';
import Tutorial from './tutorial';

let requires = [ngSanitize, ngAnimate, 'ui.bootstrap', 'toaster', ngFileUpload];

let angularizeComponents = angular.module('angularizeComponents', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)

// Load public components
angularizeComponents
    .component('tutorial', Tutorial)
    .component('reaction', Reaction)
    .component('authorPopover', AuthorPopover)
    .component('recentPosts', RecentPosts)
    .component('chips', Chips)
    .filter('timesince', function() {       
        function transform(date) { // date as number
            console.log(date);
            date = new Date(date)
            let x = new Date();
            var seconds = Math.floor((x - date) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hrs";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " mins";
            }
            return Math.floor(seconds) + " secs";
        }

        return transform;
    });


// Load author-level components
if(isUserAtLeast("author"))
angularizeComponents
    .component('toolbar', Toolbar)
    .component('postStatus', PostStatus)
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .component('myPosts', MyPosts)
    .directive('simpleEditor', SimpleEditor)
    .directive('fullEditor', FullEditor);


// Load editor-level components
if(isUserAtLeast("editor"))
angularizeComponents
    .component('editorial', Editorial)

    
/**
 * Returns true if user has current role or a role superior
 * @param {*} role 
 */
function isUserAtLeast(role) {
    if(!role) {
        // TODO: log.warn - no role specified
        return false;
    }
    let roles = getCurrentUserRoles(window);
    // TODO: check for superior roles
    return roles.indexOf(role) >= 0;
}

/**
 * @return string[] roles
 */
function getCurrentUserRoles(window) {
    if (window.angularize_server 
            && window.angularize_server.currentUser
            && window.angularize_server.currentUser.roles) {

        return window.angularize_server.currentUser.roles
    }
    return [];
}

export default angularizeComponents.name;