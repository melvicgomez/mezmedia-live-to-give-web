/**
 *
 * VideoPlayerModalComponent
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Colors } from 'theme/colors';
import ReactPlayer from 'react-player';

const PopupModal = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 0px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.background};
  }

  .text-input {
    text-align: left;
  }
  > .ant-modal-content {
    box-shadow: 0px;
    .ant-modal-body {
      padding: 0px;
    }
    > .ant-modal-close {
      color: transparent;
      top: 0px;
      right: 0px;
      visibility: hidden;
      display: none;
    }
  }
`;

function VideoPlayerModalComponent(props) {
  return (
    <div>
      <PopupModal
        centered
        destroyOnClose
        className="white-text"
        visible={props.visibility}
        style={{ backgroundColor: Colors.background }}
        footer={null}
        onOk={() => {
          props.onDismiss();
        }}
        onCancel={() => {
          props.onDismiss();
        }}
      >
        <ReactPlayer
          controls
          playing
          loop
          url={props.videoLink}
          width={1080}
          height={610}
        />
      </PopupModal>
    </div>
  );
}

VideoPlayerModalComponent.propTypes = {
  visibility: PropTypes.bool,
  videoLink: PropTypes.string,
};

VideoPlayerModalComponent.defaultProps = {
  visibility: false,
};

export default memo(VideoPlayerModalComponent);
