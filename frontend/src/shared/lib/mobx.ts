import { configure } from 'mobx';

export function initializeMobx() {
    configure({
        enforceActions: 'always',
    });
}