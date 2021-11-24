/**
 *
 * AppBarComponent
 *
 */

import React, { memo } from 'react';
import { Col, Layout, Row } from 'antd';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reactLocalStorage } from 'reactjs-localstorage';

const { Header } = Layout;

const HeaderBar = styled(Header)`
  z-index: 9999;
  background: ${process.env.ENVIRONMENT === 'PRODUCTION'
    ? Colors.header
    : Colors.headerStaging};
  height: 68px;
  align-items: center;
  padding-left: 25px;
  position: fixed;
  top: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
`;

const Logo = styled.img`
  height: 29px;
  width: 203px;
  cursor: pointer;
`;

function AppBarComponent({ dispatch }) {
  return (
    <HeaderBar>
      <div
        style={{
          maxWidth: 1336,
          width: '100%',
          margin: 'auto',
        }}
      >
        <Row>
          <Col span={24}>
            <Logo
              src={Images.headerLogo}
              alt="headerLogo"
              onClick={() => {
                // add this on pages that must not be accessible login
                const token = reactLocalStorage.getObject('token').access_token;
                if (token) {
                  dispatch(push('/activity-feed'));
                }
              }}
            />
          </Col>
        </Row>
      </div>
    </HeaderBar>
  );
}

AppBarComponent.propTypes = {};

const mapStateToProps = () => ({});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AppBarComponent);
