import Container from './sam/container';

import intents from './sam/intents';
import state from './sam/state';
import action from './sam/action';
import model from './sam/model';
import view from './theme/view';

import * as restService from './service/rest';
import * as storage from './service/storage';

import router from './service/routing';

import * as renderer from './theme/hyperhtml';

view.init(renderer);

Container.init({
    state,
    action,
    model,
    view,
    intents,
    restService,
    storage,
    router
});
