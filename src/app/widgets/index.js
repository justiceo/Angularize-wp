import angular from 'angular';
import RecentPosts from './recent-posts';
import AuthorPopover from './author-popover';
import BookFlight from './book-flight';
import LikeDirective from './like';
import MyPosts from './my-posts';

let angularizeWidgets = angular.module("angularizeWidgets", []);

angularizeWidgets
    .component('recentPost', RecentPosts)
    .component('authorPopover', AuthorPopover)
    .component('bookFlight', BookFlight)
    .component('myPosts', MyPosts)
    .directive('like', LikeDirective);

export default angularizeWidgets.name;