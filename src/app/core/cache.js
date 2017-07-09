// todo: test again as schema is being rebuilt each time indicating nothing is being stored successfully
export default class Cache {
    constructor($window) {
        this.storage = $window.localStorage;
    }

    get(key, anytime = false) {
        let val = JSON.parse(this.storage.getItem(key));
        if(val && (anytime || val.expiresIn > Date.now)) 
            return val.value;
        return null;
    }
    
    set(key, value, timeInDays = 1) {
        let val = {
            "value": value,
            "expiresIn": Date.now + this.toMilliseconds(timeInDays)
        }
        this.storage.setItem(key, JSON.stringify(val));
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clearAll() {
        this.storage.clear();
    }

    toMilliseconds(days) {
        //            hr   min  sec  millisec
        return days * 24 * 60 * 60 * 1000;
    } 
}
