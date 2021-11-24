/**
 *
 * BackToTopComponent
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Images } from 'images/index';

const ScrollToTop = styled.img`
  height: 40px;
  width: 40px;
  position: sticky;
  bottom: 5px;
  float: right;
  margin-right: 10px;
  cursor: pointer;
`;

function BackToTopComponent() {
  return (
    <ScrollToTop
      src={Images.scrollTopIcon}
      onClick={e => {
        e.stopPropagation();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }}
    />
  );
}

BackToTopComponent.propTypes = {};

export default BackToTopComponent;
