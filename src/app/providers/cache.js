angular.module('app')
    .factory('Cache', ['localStorageService', function(localStorageService) {
        var cache = {};  
        toMilliseconds = function(days) {
            //            hr   min  sec  millisec
            return days * 24 * 60 * 60 * 1000;
        } 

        cache.get = function(key, anytime = false) {
            let val = localStorageService.get(key);
            if(anytime || val.expiresIn > Date.now) 
                return val.value;
            return null;
        }
        
        cache.set = function(key, value, timeInDays = 1) {
            let val = {
                "value": value,
                "expiresIn": Date.now + toMilliseconds(timeInDays)
            }
            localStorageService.set(key, val);
        }

        cache.remove = function(key) {
            localStorageService.remove(key);
        }

        cache.clearAll = function() {
            localStorageService.clearAll();
        }

        return cache;
    }])