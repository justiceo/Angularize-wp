import angular from 'angular';
import RecentPosts from './recent-posts';
import AuthorPopover from './author-popover';
import BookFlight from './book-flight';
import LikeDirective from './like';
import MyPosts from './my-posts';

let angularizeWidgets = angular.module("angularizeWidgets", []);

angularizeWidgets
    .component('recentPosts', RecentPosts)
    .component('authorPopover', AuthorPopover)
    .component('bookFlight', BookFlight)
    .component('myPosts', MyPosts)
    .directive('like', LikeDirective);

angularizeWidgets
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

export default angularizeWidgets.name;