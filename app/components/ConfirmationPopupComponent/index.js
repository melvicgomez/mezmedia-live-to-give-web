/**
 *
 * ConfirmationPopupComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Modal } from 'antd';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import styled from 'styled-components';
import { Colors } from 'theme/colors';

const Popup = styled(Modal)`
  background-color: ${Colors.pureWhite} !important;
  border-radius: 16px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.pureWhite};
  }

  > .ant-modal-content {
    box-shadow: 0px !important;
    padding: 25px 10px 10px;
    width: 400px;

    > div > div {
      margin-bottom: 15px;
      text-align: center;
    }
    > button {
      top: -5px;
    }
  }
`;

function ConfirmationPopupComponent({
  visibility,
  dismissModal,
  title,
  message,
  note,
  actionRequire,
  leftAction,
  leftLabel,
  rightAction,
  rightLabel,
}) {
  return (
    <Popup
      className="darkGrey-text"
      centered
      visible={visibility}
      onCancel={dismissModal}
      footer={null}
    >
      <Row justify="center" className="h3">
        {title}
      </Row>
      <Row justify="center" className="body" style={{ textAlign: 'center' }}>
        {message}
      </Row>
      {!!note && (
        <Row justify="center" className="body" style={{ textAlign: 'center' }}>
          {note}
        </Row>
      )}
      {actionRequire && (
        <Row justify="center">
          <PrimaryButtonComponent
            style={{
              margin: '10px 20px 0px',
              width: '126px',
              display: 'flex',
              justifyContent: 'center',
            }}
            label={leftLabel}
            onClick={leftAction}
            iconRight={false}
          />
          <PrimaryButtonComponent
            style={{
              margin: '10px 20px 0px',
              width: '126px',
              display: 'flex',
              justifyContent: 'center',
            }}
            label={rightLabel}
            onClick={rightAction}
            iconRight={false}
          />
        </Row>
      )}
    </Popup>
  );
}

ConfirmationPopupComponent.propTypes = {
  visibility: PropTypes.bool,
  dismissModal: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  note: PropTypes.string,
  actionRequire: PropTypes.bool,
  leftAction: PropTypes.func,
  leftLabel: PropTypes.string,
  rightAction: PropTypes.func,
  rightLabel: PropTypes.string,
};

ConfirmationPopupComponent.defaultProps = {
  actionRequire: true,
  note: '',
  leftLabel: 'Yes',
  rightLabel: 'No',
};

export default ConfirmationPopupComponent;
