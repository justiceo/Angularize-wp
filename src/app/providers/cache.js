import localStorageService from 'angular-local-storage';

export default class Cache {
    constructor(localStorageService) {
        this.storage = localStorageService;
    }

    get(key, anytime = false) {
        let val = this.storage.get(key);
        if(anytime || val.expiresIn > Date.now) 
            return val.value;
        return null;
    }
    
    set(key, value, timeInDays = 1) {
        let val = {
            "value": value,
            "expiresIn": Date.now + this.toMilliseconds(timeInDays)
        }
        this.storage.set(key, val);
    }

    remove(key) {
        this.storage.remove(key);
    }

    clearAll() {
        this.storage.clearAll();
    }

    toMilliseconds(days) {
        //            hr   min  sec  millisec
        return days * 24 * 60 * 60 * 1000;
    } 
}
