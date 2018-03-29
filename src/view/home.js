import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { LabelBalance } from '../component/label';
import { Header, Title } from '../component/header';
import store from '../store';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const Home = () => {
  const { settings, computedChannelsBalance } = store;
  return (
    <Background image="purple-gradient-bg">
      <Header separator>
        <Title title="Wallet" />
      </Header>
      <MainContent style={styles.content}>
        <LabelBalance unit={settings.unit}>
          {computedChannelsBalance}
        </LabelBalance>
      </MainContent>
    </Background>
  );
};

export default observer(Home);
