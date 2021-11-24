/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * SearchPopupComponent
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { push } from 'connected-react-router';
import qs from 'query-string';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { Row, Modal } from 'antd';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';

const SearchDiv = styled.div`
  display: flex;
  align-items: center;
`;

const ClearIcon = styled(CloseOutlined)`
  font-size: 16px;
  margin-left: 5px;
  color: ${props => (props.type === 'user' ? Colors.bodyText : Colors.white)};
`;

const PopupModal = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 16px;
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

    > .ant-modal-close {
      color: ${Colors.pureWhite};
      top: -5px;
      right: 0px;
    }

    .ant-modal-body {
      padding: 50px;
    }
  }
`;

const KeywordPlaceholder = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${props =>
    props.type === 'user'
      ? css`
          max-width: ${p => (props.width ? `${p.width}px` : '90px')};
        `
      : css`
          max-width: 330px;
        `}
`;

function SearchPopupComponent(props) {
  const qsParams = qs.parse(props.location.search);
  const currentSearch = qsParams.search || '';
  const myInterests = qsParams.my_interest;
  const [searchKeywords, setSearchKeywords] = useState(currentSearch);
  const [modalVisibility, setModalVisibility] = useState(false);
  const hasTabState = props.location.state ? props.location.state.tab : '';
  const hasTabUrlParam = qsParams.tab || '';
  const dismissModal = () => {
    setModalVisibility(false);
  };

  useEffect(() => {
    setSearchKeywords(currentSearch);
  }, [currentSearch]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PopupModal
        className="white-text"
        centered
        visible={modalVisibility}
        onOk={() => {
          dismissModal();
        }}
        onCancel={() => {
          dismissModal();
        }}
        style={{ backgroundColor: Colors.background }}
        footer={null}
      >
        <div style={{ width: 375 }}>
          <TextInputComponent
            defaultValue={searchKeywords}
            value={searchKeywords}
            placeholder="Search by Keyword"
            onChange={value => {
              setSearchKeywords(value);
            }}
          />
        </div>

        <Row justify="center">
          <PrimaryButtonComponent
            style={{
              padding: '0px 30px',
              marginTop: '10px',
              width: '50%',
              display: 'flex',
              justifyContent: 'center',
            }}
            label="Search"
            onClick={() => {
              dismissModal();
              props.dispatch(
                push(
                  `${props.location.pathname}?${
                    hasTabUrlParam ? `tab=${parseInt(hasTabUrlParam, 10)}&` : ''
                  }search=${searchKeywords}${
                    myInterests ? `&my_interest=${myInterests}` : ''
                  }`,
                  hasTabState === 'library'
                    ? {
                        tab: 'library',
                      }
                    : null,
                ),
              );
            }}
          />
        </Row>
      </PopupModal>
      <SearchDiv>
        <Icon
          onClick={() => {
            setModalVisibility(true);
          }}
          component={() => (
            <img
              src={
                props.type === 'user' ? Images.searchIconAlt : Images.searchIcon
              }
              style={{ height: '20px', width: '20px' }}
              alt="search"
            />
          )}
          style={{ marginRight: 10 }}
        />
        <KeywordPlaceholder
          type={props.type}
          width={props.width || 0}
          className={` ${
            currentSearch && props.type === 'user'
              ? 'body darkGrey-text'
              : 'body mediumGray-text'
          }`}
          onClick={() => {
            setModalVisibility(true);
          }}
        >
          {currentSearch || 'Search'}
        </KeywordPlaceholder>
        {currentSearch ? (
          <ClearIcon
            type={props.type}
            onClick={() => {
              props.dispatch(
                push(
                  `${props.location.pathname}?${
                    hasTabUrlParam ? `tab=${parseInt(hasTabUrlParam, 10)}&` : ''
                  }search=${myInterests ? `&my_interest=${myInterests}` : ''}`,
                  hasTabState === 'library'
                    ? {
                        tab: 'library',
                      }
                    : null,
                ),
              );
            }}
          />
        ) : null}
      </SearchDiv>
    </div>
  );
}

SearchPopupComponent.propTypes = {};

export default memo(SearchPopupComponent);
