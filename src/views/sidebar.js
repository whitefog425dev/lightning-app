import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { actionsNav, actionsInfo } from '../actions';
import ComponentIcon from '../components/icon';
import Text from '../components/text';
import { colors } from '../styles';
import { View, TouchableOpacity } from 'react-native';
import store from '../store';

let interval;

class Sidebar extends Component {
  componentDidMount() {
    interval = setInterval(() => {
      actionsInfo.getInfo();
      if (actionsInfo._store.syncedToChain) clearInterval(interval);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  renderRow(name, icon, onPress) {
    const { route } = store;
    const color = route === name ? colors.blue : colors.gray;

    return (
      <TouchableOpacity
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          paddingLeft: 12,
        }}
        onPress={() => onPress()}
      >
        <ComponentIcon icon={icon} style={{ width: 24, height: 24, color }} />
        <Text style={{ marginLeft: 6, color }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { computedBalance, pubKey, syncedToChain, blockHeight } = store;
    return (
      <View style={{ width: 170, backgroundColor: colors.sidebar }}>
        {this.renderRow('Pay', 'coin', () => actionsNav.goPay())}
        {this.renderRow('Request', 'coin', () => actionsNav.goRequest())}
        {this.renderRow('Channels', 'wallet', () => actionsNav.goChannels())}
        {this.renderRow('Transactions', 'swap-horizontal', () =>
          actionsNav.goTransactions()
        )}
        {this.renderRow('Settings', 'settings', () => actionsNav.goSettings())}

        <View style={{ flex: 1 }} />

        <Text style={{ marginLeft: 14, color: colors.gray }}>
          SAT <Text style={{ color: 'white' }}>{computedBalance}</Text>
        </Text>

        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingLeft: 12,
          }}
          onPress={() => actionsNav.goChannels()}
        >
          <ComponentIcon
            icon="account-circle"
            style={{ width: 24, height: 24, color: 'gray' }}
          />
          <Text
            numberOfLines={1}
            style={{ flex: 1, marginLeft: 6, color: 'gray' }}
          >
            {pubKey}
          </Text>
        </TouchableOpacity>
        {syncedToChain ? null : (
          <div
            style={{
              padding: 10,
              paddingBottom: 12,
              textAlign: 'center',
              backgroundColor: colors.blue,
            }}
            className="syncing"
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                 .syncing {
                   animation: pulse 1.5s 100ms ease-in-out infinite alternate;
                 }
                 @keyframes pulse {
                   0% { opacity: 1 }
                   50% { opacity: 0.8 }
                   100% { opacity: 1 }
                 }`,
              }}
            />
            Syncing to Chain
            <span
              style={{
                fontSize: 8,
                position: 'absolute',
                bottom: '2px',
                right: '2px',
              }}
            >
              {`Block Height: ${blockHeight}`}
            </span>
          </div>
        )}
      </View>
    );
  }
}

export default observer(Sidebar);
