import crossroads from 'crossroads';
import hasher from 'hasher';

const routing = {
    init(routes, handler) {
        if (!routes || !routes.length) {
            throw new Error('Could not create router with empty routes');
        }

        routes.forEach((route) => {
            crossroads.addRoute(route);
        });

        crossroads.routed.add(function(request, data){
            handler(request, data);
        });

        hasher.initialized.add(this._parseHash);
        hasher.changed.add(this._parseHash);
        hasher.init();
    },

    _parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    },

    goTo(hash) {
        hasher.setHash(hash);
    }
};

export default routing;
