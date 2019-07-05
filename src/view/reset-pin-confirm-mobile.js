import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { FormStretcher } from '../component/form';
import { PinBubbles, PinKeyboard } from '../component/pin-entry';

//
// Reset Pin: Confirm New View (Mobile)
//

const styles = StyleSheet.create({
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 50,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 250,
  },
});

const ResetPinConfirmView = ({ store, auth }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Re-type pin</CopyOnboardText>
      <Text style={styles.text}>
        {"Type your pin again to make sure it's the correct one."}
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.resetPinVerify} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => auth.pushPinDigit({ digit, param: 'resetPinVerify' })}
        onBackspace={() => auth.popPinDigit({ param: 'resetPinVerify' })}
      />
    </MainContent>
  </Background>
);

ResetPinConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(ResetPinConfirmView);
