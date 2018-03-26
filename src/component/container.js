import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
  },
});

const Container = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

Container.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default Container;
