import { computed, extendObservable } from 'mobx';

const ComputedChannels = store => {
  extendObservable(store, {
    computedChannels: computed(() => {
      const { channelsResponse, pendingChannelsResponse } = store
      const c = channelsResponse ? channelsResponse.slice() : [];
      const p = pendingChannelsResponse ? pendingChannelsResponse.slice() : [];
      const all = [].concat(c, p);
      all.sort((a, b) => (a.status > b.status) ? 1 : (a.status < b.status) ? -1 : 0);
      all.sort((a, b) => (a.active === b.active) ? 0 : a.active ? -1 : 1);
      return all
    })
  })
};

export default ComputedChannels;
