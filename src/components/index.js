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
import BookFlight from './book-flight';
import Reaction from './reaction';
import MyPosts from './my-posts';
import Toolbar from './toolbar';
import Editorial from './editorial';
import PostStatus from './post-status';

let requires = [ngSanitize, ngAnimate, 'ui.bootstrap', 'toaster', ngFileUpload];
let angularizeComponents = angular.module('angularizeComponents', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
angularizeComponents
    .component('toolbar', Toolbar)
    .component('postStatus', PostStatus)
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .directive('simpleEditor', SimpleEditor)
    .component('fullEditor', FullEditor)
    .component('chips', Chips)
    .component('recentPosts', RecentPosts)
    .component('authorPopover', AuthorPopover)
    .component('bookFlight', BookFlight)
    .component('myPosts', MyPosts)
    .component('editorial', Editorial)
    .component('reaction', Reaction)
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

export default angularizeComponents.name;