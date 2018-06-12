import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header } from '../component/header';
import { H1Text, Text } from '../component/text';
import { Button, BackButton, GlasButton } from '../component/button';
import { InputField } from '../component/field';
import Card from '../component/card';
import { FormSubText } from '../component/form';
import { color, font } from '../component/style';
import { formatOrdinal } from '../helper';

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
  card: {
    maxHeight: 350,
    maxWidth: 680,
    paddingBottom: 50,
  },
});

const SeedVerifyView = ({ store }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => {}} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>{"Let's double check"}</H1Text>
      </View>
      <Card style={styles.card}>
        <CopySection seedCheck={store.seedCheck} />
        {store.seedCheck.map((seedIndex, i) => (
          <SeedEntry seedIndex={seedIndex} key={i} />
        ))}
      </Card>
      <GlasButton onPress={() => {}}>Next</GlasButton>
    </MainContent>
  </Background>
);

SeedVerifyView.propTypes = {
  store: PropTypes.object.isRequired,
};

//
// Copy Section
//

const CopySection = ({ seedCheck }) => (
  <FormSubText>
    Type the {formatOrdinal(seedCheck[0])}, {formatOrdinal(seedCheck[1])}, and{' '}
    {formatOrdinal(seedCheck[2])} words of your seed.
  </FormSubText>
);

CopySection.propTypes = {
  seedCheck: PropTypes.array,
};

//
// Seed Entry
//

const entryStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    borderBottomColor: color.greyText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  index: {
    color: color.greyText,
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM,
    width: 35,
  },
  input: {
    flex: 1,
    textAlign: 'left',
    borderBottomWidth: 0,
  },
});

const SeedEntry = ({ seedIndex }) => (
  <View style={entryStyles.wrapper}>
    <Text style={entryStyles.index}>{seedIndex}.</Text>
    <InputField style={entryStyles.input} onChangeText={() => {}} />
  </View>
);

SeedEntry.propTypes = {
  seedIndex: PropTypes.number,
};

export default observer(SeedVerifyView);
