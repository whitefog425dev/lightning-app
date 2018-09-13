import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { Header } from '../component/header';
import { Button, BackButton, GlasButton } from '../component/button';
import { InputField } from '../component/field';
import Card from '../component/card';
import { FormSubText, FormStretcher } from '../component/form';

//
// Restore Wallet Password View
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    maxHeight: 350,
    maxWidth: 680,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 50,
  },
});

const RestorePasswordView = ({ store, wallet, nav }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => nav.goSelectSeed()} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>Restore wallet</H1Text>
      </View>
      <Card style={styles.card}>
        <FormSubText>Please enter your password.</FormSubText>
        <FormStretcher>
          <InputField
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            autoFocus={true}
            value={store.wallet.password}
            onChangeText={password => wallet.setPassword({ password })}
            onSubmitEditing={() => wallet.restoreWallet()}
          />
        </FormStretcher>
      </Card>
      <GlasButton onPress={() => wallet.restoreWallet()}>Restore</GlasButton>
    </MainContent>
  </Background>
);

RestorePasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(RestorePasswordView);
