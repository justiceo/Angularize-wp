import angular from 'angular';
import RecentPosts from './recent-posts/';
import AuthorPopover from './author-popover';
import BookFlight from './book-flight';
import LikeDirective from './like';
import EditPostDirective from './edit-button';

let widgetsModules = angular.module("angularize.widgets", []);

widgetsModules
    .component('recentPost', RecentPosts)
    .component('authorPopover', AuthorPopover)
    .component('bookFlight', BookFlight)
    .component('editPost', EditPostDirective)
    .directive('like', LikeDirective);

export default widgetsModules;