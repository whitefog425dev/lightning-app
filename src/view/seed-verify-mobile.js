import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import SeedEntry from '../component/seed-entry';
import { Button, BackButton, GlasButton } from '../component/button';
import { FormSubText } from '../component/form';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText } from '../component/text';
import { Header } from '../component/header';
import Card from '../component/card';

//
// Seed Verify View
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

class SeedVerifyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: 0,
    };
  }

  render() {
    const { store, nav, wallet } = this.props;
    return (
      <Background image="purple-gradient-bg">
        <Header>
          <BackButton onPress={() => nav.goSeed()} />
          <Button disabled onPress={() => {}} />
        </Header>
        <MainContent style={styles.content}>
          <View>
            <CopyOnboardText style={styles.title}>
              {"Let's double check"}
            </CopyOnboardText>
          </View>
          <Card>
            <FormSubText>{store.seedVerifyCopy}</FormSubText>
            {store.seedVerifyIndexes.map((seedIndex, i) => (
              <SeedEntry
                seedIndex={seedIndex}
                value={store.wallet.seedVerify[i]}
                onChangeText={word => wallet.setSeedVerify({ word, index: i })}
                key={i}
                autoFocus={i === this.state.focusedInput}
                onSubmitEditing={() =>
                  i === 2
                    ? wallet.checkSeed()
                    : this.setState({ focusedInput: i + 1 })
                }
                onClick={() => this.setState({ focusedInput: i })}
              />
            ))}
          </Card>
          <GlasButton onPress={() => wallet.checkSeed()}>Next</GlasButton>
        </MainContent>
      </Background>
    );
  }
}

SeedVerifyView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(SeedVerifyView);
